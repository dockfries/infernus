import path from "node:path";
// @ts-expect-error no types package
import decompress from "@xhmikosr/decompress";
import fs from "fs-extra";
import fg from "fast-glob";
import { select } from "@inquirer/prompts";
import chalk from "chalk";
import {
  readLocalConfig,
  readLockFile,
  readOmpConfig,
  writeLocalConfig,
  writeLockFile,
  writeOmpConfig,
  GLOBAL_DEPS_PATH,
  INF_CONFIG_NAME,
} from "./config";
import { downloadFile, getRepoRelease } from "./api";
import type { AddDepsOptions, LocalConfig, LockFileContent } from "../types";
import { validRange } from "./semver";
import { isSameReleaseTag, matchByRange, parseTag } from "./release";
import { addOpenMp, removeOpenMp } from "./omp";
import { getPawnJson, getIncludePath, getPlugOrCompPath } from "./pawn";
import { ompRepository, isWindows } from "../constants";

async function hasGlobalDepTemp(depVersionPath: string): Promise<boolean> {
  if (!fs.existsSync(depVersionPath)) return false;
  const files = await fs.readdir(depVersionPath);
  return (
    !files.length ||
    (files.length === 1 && files[0] === "pawn.json") ||
    files.some((file) => file.endsWith(".tmp"))
  );
}

export interface CachePlan {
  /** the cached tag this spec resolves to, when the cache can answer it */
  cachedTag: string | null;
  /** whether the dependency has to be downloaded and unpacked again */
  needsDownload: boolean;
  /** the cached version that must be dropped before downloading */
  dropTag: string | null;
}

/**
 * Decide what the cache can answer for a requested spec, without touching disk.
 *
 * Shared by the real install and by `--dry-run` so a preview cannot drift from
 * what an install would do. Only a request that names a release can be answered
 * by the cache, and it is compared by tag, so `v1.6.7.3217` never passes for
 * `v1.6.7.3218`. A range has to be resolved against the repository first,
 * because the newest matching release may not be the newest *cached* one.
 */
export function planCache(options: {
  cachedVersions: string[] | null;
  requested: string;
  previousVersion?: string;
  isUpdate: boolean;
}): CachePlan {
  const { cachedVersions, requested, previousVersion, isUpdate } = options;

  const miss: CachePlan = { cachedTag: null, needsDownload: true, dropTag: null };

  const requestedTag = parseTag(requested);
  if (!requestedTag || !cachedVersions) return miss;

  const cached = cachedVersions.map(parseTag).find((parsed) => parsed?.tag === requestedTag.tag);
  if (!cached) return miss;

  // The release is already installed when the lockfile pins it, so an update is
  // the user asking for it again: download it afresh. Any other cached release
  // satisfies the pin and is reused.
  const alreadyInstalled = isSameReleaseTag(previousVersion, cached.tag);
  return alreadyInstalled && isUpdate
    ? { cachedTag: null, needsDownload: true, dropTag: cached.tag }
    : { cachedTag: cached.tag, needsDownload: false, dropTag: null };
}

/**
 * Whether a request pins one release, in which case the cache can answer it
 * without asking the repository.
 */
export function isPinnedRequest(requested: string) {
  return parseTag(requested) !== null;
}

export async function cleanAllGlobalDeps() {
  try {
    const files = await fs.readdir(GLOBAL_DEPS_PATH);

    const depCount = files.filter((file) => {
      const fileOrDirPath = path.join(GLOBAL_DEPS_PATH, file);
      const stats = fs.statSync(fileOrDirPath);
      return stats.isDirectory();
    }).length;

    await fs.emptyDir(GLOBAL_DEPS_PATH);

    console.log(`cleared ${depCount} global dependency caches`);
    return depCount;
  } catch {
    return 0;
  }
}

export async function cleanGlobalDeps(deps?: string[], onlyTmp = true) {
  if (!deps) return 0;

  const waitCleanFolders = [];
  for (const dep of deps) {
    const [name, version = "*"] = dep.split("@");
    const [owner, repo] = name.split("/");

    const depPath = path.resolve(GLOBAL_DEPS_PATH, owner, repo);

    const isExist = fs.existsSync(depPath);

    if (!isExist) continue;

    const allVersions = await fs.readdir(depPath);

    if (version === "*") {
      for (const v of allVersions) {
        const depVersionPath = path.resolve(depPath, v);
        const hasTmp = await hasGlobalDepTemp(depVersionPath);
        if (!onlyTmp || hasTmp) waitCleanFolders.push(depVersionPath);
      }
    } else {
      const requestedTag = parseTag(version);
      const matched = requestedTag
        ? (allVersions.find((cached) => isSameReleaseTag(cached, requestedTag.tag)) ?? null)
        : matchByRange(
            allVersions.map(parseTag).filter((parsed) => parsed !== null),
            version,
          )?.tag;

      if (matched) {
        const depVersionPath = path.resolve(depPath, matched);
        const hasTmp = await hasGlobalDepTemp(depVersionPath);
        if (!onlyTmp || hasTmp) waitCleanFolders.push(depVersionPath);
      }
    }
  }
  await Promise.all(waitCleanFolders.map((folder) => fs.remove(folder)));
  const depCount = waitCleanFolders.length;
  if (depCount) {
    console.log(`cleared ${depCount} global dependency caches`);
  }
  return depCount;
}

async function installDeps(args: AddDepsOptions, isUpdate = false) {
  const start = Date.now();
  // todo: dev_dependencies & dependencies without resources

  const isProd = args.production;

  if (!args.dependencies) return;

  const verbose = !!args.verbose;
  const dryRun = !!args.dryRun;

  if (dryRun && !verbose) {
    throw new Error("--dry-run needs --verbose, otherwise it would print nothing");
  }

  // the server is installed before the plugins that run inside it, and the copy
  // step needs its files in place to tell its own files from the project's
  const deps = moveDependency(args.dependencies, ompRepository, "first");

  // a dry run must not even delete stale temp folders from the cache
  if (!dryRun) await cleanGlobalDeps(deps);

  const lockFile: LockFileContent = (await readLockFile()) || {
    lockfileVersion: 1.0,
  };
  let dependencies = {};
  const ompConfig = (await readOmpConfig()) || {};

  ompConfig.pawn = { ...(ompConfig.pawn || {}) };
  ompConfig.pawn.legacy_plugins = [...(ompConfig.pawn.legacy_plugins || [])];

  const legacyPluginsSet = new Set([...ompConfig.pawn.legacy_plugins]);

  interface InstallPlan {
    dep: string;
    from: string | null;
    to: string | null;
    action: string;
    cached: boolean;
  }
  const plans: InstallPlan[] = [];

  for (const dep of deps) {
    const [name, version = "*"] = dep.split("@");

    if (!validRange(version)) throw new Error(`invalid deps version: ${name}`);

    if (verbose) {
      console.log(
        chalk.gray(`\n[${name}] requested version "${version}"${isUpdate ? " (update)" : ""}`),
      );
    }

    const previousDepInfo = lockFile.dependencies?.[name];
    const previousComp = !!previousDepInfo?.component;
    const previousVersion = previousDepInfo?.version;

    const isComponent = !!args.component || previousComp;
    const pluginFolderPath = getPlugOrCompPath(isComponent);

    const [owner, repo] = name.split("/");

    let localCacheFolder = null;
    let localCacheVersion = null;

    const depAnyVersionPath = path.resolve(GLOBAL_DEPS_PATH, name);
    const isExistDepAnyVersion = fs.existsSync(depAnyVersionPath);

    const plan = planCache({
      cachedVersions: isExistDepAnyVersion ? await fs.readdir(depAnyVersionPath) : null,
      requested: version,
      previousVersion,
      isUpdate,
    });

    const isForceRedownload = plan.needsDownload;

    if (plan.dropTag) {
      await fs.remove(path.resolve(depAnyVersionPath, plan.dropTag));
    }

    if (plan.cachedTag) {
      localCacheFolder = path.resolve(depAnyVersionPath, plan.cachedTag);
      localCacheVersion = plan.cachedTag;
    }

    if (verbose) {
      if (!isExistDepAnyVersion) {
        console.log(chalk.gray(`  cache: ${depAnyVersionPath} does not exist`));
      } else if (localCacheFolder) {
        console.log(chalk.gray(`  cache hit: ${localCacheVersion} -> ${localCacheFolder}`));
      } else if (plan.dropTag) {
        console.log(chalk.gray(`  cache: dropping ${plan.dropTag} and downloading it again`));
      } else {
        console.log(chalk.gray(`  cache: no cached version satisfies "${version}"`));
      }
    }

    let matchedRelease: any = null;

    if (!localCacheFolder) {
      matchedRelease = await getRepoRelease(owner, repo, version, verbose);
      if (!matchedRelease) throw new Error(`not found satisfactory deps: ${dep}`);

      if (verbose) {
        console.log(chalk.gray(`  matched release: ${matchedRelease.tag_name}`));
      }

      // A range is resolved against the repository, but the release it lands on
      // may already be unpacked in the cache, in which case only the project
      // files are refreshed.
      const cachedFolder = path.resolve(GLOBAL_DEPS_PATH, name, matchedRelease.tag_name);
      if (isForceRedownload && !isPinnedRequest(version) && fs.existsSync(cachedFolder)) {
        localCacheFolder = cachedFolder;
        localCacheVersion = matchedRelease.tag_name;
      }
    }

    if (dryRun) {
      // Report exactly what an install would do, then move on: nothing is
      // downloaded, unpacked, copied or written.
      const target = localCacheVersion ?? matchedRelease?.tag_name ?? null;

      if (!target) {
        console.log(chalk.red(`  no release matches "${version}"`));
        plans.push({
          dep,
          from: previousVersion ?? null,
          to: null,
          action: "missing",
          cached: false,
        });
        continue;
      }

      const cached = !!localCacheVersion;
      const action = cached
        ? "reuse cache"
        : plan.dropTag
          ? `re-download (replacing ${plan.dropTag})`
          : "download";

      console.log(
        `  ${action}: ${target}${previousVersion ? ` (lockfile had ${previousVersion})` : ""}`,
      );

      plans.push({ dep, from: previousVersion ?? null, to: target, action, cached });
      continue;
    }

    if (name === ompRepository) {
      dependencies = {
        ...dependencies,
        [name]: {
          version: localCacheVersion ? localCacheVersion : matchedRelease.tag_name,
        },
      };

      if (localCacheVersion) {
        console.log(`local cache found: ${name} ${localCacheVersion}`);
        await addOpenMp(localCacheVersion, false, previousVersion ?? null, verbose);
      } else {
        // The previous build is the reference telling an upgraded server file
        // apart from one the project modified, so it is dropped only after its
        // manifest has been used.
        await addOpenMp(matchedRelease, true, previousVersion ?? null, verbose);
        if (plan.dropTag) {
          await fs.remove(path.resolve(depAnyVersionPath, plan.dropTag));
        }
      }
      continue;
    }

    if (localCacheVersion) {
      console.log(`local cache found: ${name} ${localCacheVersion}`);
    }

    const pawnJson = await getPawnJson(owner, repo, localCacheVersion ?? matchedRelease.tag_name);

    if (!pawnJson || !pawnJson.resources || !pawnJson.resources.length)
      throw new Error(`not found resources in pawn.json: ${name}`);

    const finalVersion = localCacheVersion || matchedRelease!.tag_name;

    const depVersionPath = path.resolve(GLOBAL_DEPS_PATH, name, finalVersion);

    const pawnJsonPath = path.resolve(depVersionPath, "pawn.json");
    await fs.ensureFile(pawnJsonPath);
    await fs.writeJson(pawnJsonPath, pawnJson, { spaces: 2 });

    const platformResources = pawnJson.resources.filter((resource) => {
      if (isWindows) return resource.platform === "windows";
      return resource.platform === "linux";
    });

    const archiveResources = platformResources.filter((resource) => resource.archive);

    const notArchiveResources = platformResources.filter((resource) => !resource.archive);

    const localIncPath = await getIncludePath();
    await fs.ensureDir(localIncPath);

    if (archiveResources.length) {
      let archiveResource = archiveResources[0];

      if (!localCacheVersion) {
        if (archiveResources.length > 1) {
          const choices = archiveResources.map((resource, idx) => {
            return {
              name: resource.name,
              short: resource.version || "default",
              value: idx,
            };
          });
          const selectResource = await select({
            message: "Multiple archive resources found, please select one",
            choices,
            default: 0,
          });
          archiveResource = archiveResources[selectResource];
        }

        const archiveAssetReg = new RegExp(archiveResource.name);

        const archiveAssets = matchedRelease.assets.filter((asset: any) => {
          return archiveAssetReg.test(asset.name);
        });

        if (!archiveAssets.length) {
          throw new Error(
            `Unable to match asset ${archiveResource.name} in dependency ${dep} \n` +
              ` — available assets: \n` +
              `${matchedRelease.assets.map((asset: any) => asset.name).join("\n")}`,
          );
        }

        const archiveAsset = archiveAssets[0];
        if (archiveAssets.length > 1) {
          const choices = archiveAssets.map((asset: any, idx: number) => {
            return {
              name: asset.name,
              value: idx,
            };
          });
          const selectAsset = await select<number>({
            message: "Multiple assets found, please select one",
            choices,
            default: 0,
          });
          archiveResource = archiveResources[selectAsset];
        }
        console.log(`download dep: ${archiveAsset.name} ${matchedRelease.tag_name}`);
        const assetPath = await downloadFile(
          archiveAsset.browser_download_url,
          path.resolve(depVersionPath, archiveAsset.name),
        );

        await decompress(assetPath, depVersionPath);
        await fs.remove(assetPath);
      }

      if (archiveResource.plugins) {
        await fs.ensureDir(pluginFolderPath);

        const pluginPaths = await fg.glob(archiveResource.plugins, {
          absolute: true,
          cwd: depVersionPath,
        });

        for (const plugin of pluginPaths) {
          const pluginFileName = path.basename(plugin);
          const pluginFileNameNoExt = path.basename(pluginFileName, path.extname(pluginFileName));
          await fs.copy(plugin, path.resolve(pluginFolderPath, pluginFileName));
          if (!isComponent) legacyPluginsSet.add(pluginFileNameNoExt);
        }
      }

      if (!isProd) {
        if (archiveResource.includes) {
          const globIncPath = archiveResource.includes.map((inc) => {
            return path.extname(inc) ? inc : inc + "/*.inc";
          });
          const includeFiles = await fg.glob(globIncPath, {
            absolute: true,
            cwd: depVersionPath,
          });
          for (const includeFolder of includeFiles) {
            await fs.copy(includeFolder, path.resolve(localIncPath, path.basename(includeFolder)));
          }
        } else {
          const includeFiles = await fg.glob("*.inc", {
            absolute: true,
            cwd: depVersionPath,
          });
          for (const includeFolder of includeFiles) {
            await fs.copy(includeFolder, path.resolve(localIncPath, path.basename(includeFolder)));
          }
        }
      }

      if (archiveResource.files) {
        for (const globPattern of Object.keys(archiveResource.files)) {
          const files = await fg.glob(globPattern, {
            absolute: true,
            cwd: depVersionPath,
          });
          if (!files[0]) continue;
          const to = path.resolve(process.cwd(), archiveResource.files[globPattern]);
          await fs.copy(files[0], to);
        }
      }
    }

    if (notArchiveResources.length) {
      const assetNames = notArchiveResources.map((r) => r.name);

      if (!localCacheVersion) {
        const assets = matchedRelease.assets.filter((asset: any) => {
          return assetNames.includes(asset.name);
        });

        const emptyTmp = path.resolve(depVersionPath, "empty.tmp");

        await fs.ensureFile(emptyTmp);

        for (const asset of assets) {
          console.log(`download dep: ${asset.name} ${matchedRelease.tag_name}`);
          const assetPath = await downloadFile(
            asset.browser_download_url,
            path.resolve(depVersionPath, asset.name),
          );

          const assetExt = path.extname(asset.name);

          if (assetExt === "inc") {
            if (!isProd) {
              await fs.copy(assetPath, localIncPath);
            }
          } else if (["dll", "so"].includes(assetExt)) {
            await fs.copy(assetPath, pluginFolderPath);
            legacyPluginsSet.add(path.basename(assetPath, assetExt));
          }
        }

        await fs.remove(emptyTmp);
      } else {
        const assets = await fg.glob(assetNames, { absolute: true });
        for (const assetPath of assets) {
          const assetName = path.basename(assetPath);
          const assetExt = path.extname(assetPath);
          if (assetExt === "inc") {
            if (!isProd) {
              await fs.copy(assetPath, path.resolve(localIncPath, assetName));
            }
          } else if (["dll", "so"].includes(assetExt)) {
            await fs.copy(assetPath, path.resolve(pluginFolderPath, assetName));
            legacyPluginsSet.add(path.basename(assetName, assetExt));
          }
        }
      }
    }

    const legacy_plugins = movePluginToLast([...legacyPluginsSet], "samp-node");
    ompConfig.pawn.legacy_plugins = legacy_plugins;

    dependencies = {
      ...dependencies,
      [name]: {
        version: finalVersion,
        component: isComponent,
      },
    };
  }
  if (dryRun) {
    printInstallPlan(plans, isUpdate);
    return;
  }

  lockFile.dependencies = {
    ...(lockFile.dependencies || {}),
    ...dependencies,
  };
  await Promise.all([writeOmpConfig(ompConfig), writeLockFile(lockFile)]);
  console.log(`installDeps Done in ${elapsed(start)}s`);
}

function printInstallPlan(
  plans: { dep: string; from: string | null; to: string | null; action: string; cached: boolean }[],
  isUpdate: boolean,
) {
  console.log(chalk.bold(`\ndry run, nothing was downloaded or written:`));

  for (const plan of plans) {
    if (!plan.to) {
      console.log(`  ${plan.dep}  ${chalk.red("no release satisfies the requested version")}`);
      continue;
    }

    const change =
      plan.from === plan.to
        ? chalk.gray(`stays ${plan.to}`)
        : plan.from
          ? `${chalk.yellow(plan.from)} -> ${chalk.green(plan.to)}`
          : chalk.green(plan.to);

    console.log(`  ${plan.dep}  ${change}  ${chalk.gray(`(${plan.action})`)}`);
  }

  const downloads = plans.filter((plan) => plan.to && !plan.cached).length;
  console.log(
    chalk.gray(
      `\nwould ${isUpdate ? "update" : "install"} ${plans.filter((plan) => plan.to).length} dependencies, ${downloads} of them by downloading`,
    ),
  );
}

export async function addDeps(args: AddDepsOptions, isUpdate = false) {
  let _deps = args.dependencies;

  const isInstallAll = !_deps || !_deps.length;

  const config = (await readLocalConfig()) || ({} as LocalConfig);

  config.dependencies = config.dependencies || {};

  let reduceDeps;

  if (isInstallAll) {
    reduceDeps = config.dependencies;

    _deps = Object.entries(config.dependencies).map((dep) => {
      const [depName, depVersion = "*"] = dep;
      if (!validRange(depVersion))
        throw new Error(`invalid deps version: ${depName}@${depVersion}`);
      return `${depName}@${depVersion}`;
    });

    if (!_deps || !_deps.length) {
      throw new Error(`no deps found, pls check ${INF_CONFIG_NAME}`);
    }
  } else {
    if (!_deps) return;

    reduceDeps = _deps.reduce(
      (acc, dep) => {
        const arr = dep.split("@");
        const depName = arr[0];
        let version = arr[1] || "*";
        if (isUpdate && version === "*" && config.dependencies![depName]) {
          version = config.dependencies![depName];
        }
        if (!validRange(version)) throw new Error(`invalid deps version: ${dep}`);
        acc[depName] = version;
        return acc;
      },
      {} as Record<string, string>,
    );

    config.dependencies = { ...config.dependencies, ...reduceDeps };
    if (!args.dryRun) await writeLocalConfig(config);
  }

  if (!Object.keys(reduceDeps).length) return;

  const lockFile = await readLockFile();

  if (lockFile && lockFile.dependencies && !args.dryRun) {
    let waitRemoveDeps;

    if (isInstallAll) {
      waitRemoveDeps = Object.keys(config.dependencies);
    } else {
      waitRemoveDeps = Object.keys(config.dependencies).filter((installedDep) => {
        return installedDep in reduceDeps;
      });
    }

    await removeDeps(
      waitRemoveDeps,
      _deps.map((dep) => dep.split("@")[0]),
    );
  }

  await installDeps(
    {
      ...args,
      dependencies: _deps,
    },
    isUpdate,
  );
}

export async function removeDeps(deps?: string[], preInsDeps?: string[]) {
  if (!deps || !deps.length) return;

  const config = await readLocalConfig();
  if (!config || !config.dependencies) return;

  const lockFile = await readLockFile();
  if (!lockFile || !lockFile.dependencies) return;

  const start = Date.now();

  const localIncPath = await getIncludePath();

  const ompConfig = (await readOmpConfig()) || {};

  const hasLegacyPlugins = ompConfig.pawn && ompConfig.pawn.legacy_plugins;

  const waitRemovePlugins = new Set();

  // the server is torn down after the plugins installed inside it
  const deps_ = moveDependency(deps, ompRepository, "last");

  for (const dep of deps_) {
    const [depName] = dep.split("@");

    if (!preInsDeps) {
      if (depName in config.dependencies) {
        delete config.dependencies[depName];
      }
    }

    if (depName in lockFile.dependencies) {
      const version = lockFile.dependencies[depName].version;
      if (!version) continue;

      const globalVersionPath = path.resolve(GLOBAL_DEPS_PATH, depName, version);

      if (depName === ompRepository) {
        await removeOpenMp(globalVersionPath);
        continue;
      }

      const [owner, repo] = depName.split("/");

      // The files to delete are already on disk, so a repository that cannot be
      // read (offline, rate limited, deleted upstream) must not block the
      // removal itself: the manifest and the lockfile are updated either way,
      // and only the file cleanup is skipped.
      const pawnJson = await getPawnJson(owner, repo, version).catch((error: any) => {
        console.log(
          chalk.yellow(
            `  warn: cannot read pawn.json of ${depName}@${version} (${error?.message ?? error}), ` +
              `removing it from the manifest only`,
          ),
        );
        return null;
      });

      if (!pawnJson?.resources) continue;

      const platformResources = pawnJson.resources.filter((resource) => {
        if (isWindows) return resource.platform === "windows";
        return resource.platform === "linux";
      });

      for (const resource of platformResources) {
        const isComponent = !!lockFile.dependencies?.[depName]?.component;
        const pluginFolderPath = getPlugOrCompPath(isComponent);

        if (resource.archive) {
          if (resource.includes) {
            const globIncPath = resource.includes.map((inc) => {
              return path.extname(inc) ? inc : inc + "/*.inc";
            });
            let files = await fg.glob(globIncPath, {
              cwd: globalVersionPath,
              absolute: true,
            });

            files = files.map((file) => {
              return path.resolve(localIncPath, path.basename(file));
            });

            await Promise.all(files.map((file) => fs.remove(file)));
          } else {
            let files = await fg.glob("*.inc", {
              cwd: globalVersionPath,
            });

            files = files.map((file) => {
              return path.resolve(localIncPath, file);
            });

            await Promise.all(files.map((file) => fs.remove(file)));
          }
          if (resource.plugins) {
            let files = await fg.glob(resource.plugins, {
              cwd: globalVersionPath,
              absolute: true,
            });

            files = files.map((file) => {
              return path.resolve(pluginFolderPath, path.basename(file));
            });

            await Promise.all(files.map((file) => fs.remove(file)));

            if (hasLegacyPlugins) {
              files.forEach((file) => {
                waitRemovePlugins.add(path.basename(file, path.extname(file)));
              });
            }
          }
          if (resource.files) {
            const files = await fg.glob(Object.values(resource.files), {
              absolute: true,
            });
            await Promise.all(files.map((file) => fs.remove(file)));
          }
        } else {
          const assetPath = path.resolve(process.cwd(), resource.name);
          const assetExt = path.extname(assetPath);
          if (assetExt === "inc") {
            await fs.remove(path.resolve(localIncPath, resource.name));
          } else if (["dll", "so"].includes(assetExt)) {
            await fs.remove(path.resolve(pluginFolderPath, resource.name));

            if (hasLegacyPlugins) {
              waitRemovePlugins.add(path.basename(assetPath, assetExt));
            }
          }
        }
      }

      if (!preInsDeps || !preInsDeps.includes(depName)) {
        delete lockFile.dependencies[depName];
      }
    }
  }

  if (hasLegacyPlugins) {
    const legacyPlugins = (ompConfig.pawn.legacy_plugins as string[]).filter((plugin) => {
      return !waitRemovePlugins.has(plugin);
    });
    movePluginToLast(legacyPlugins, "samp-node");
    ompConfig.pawn.legacy_plugins = legacyPlugins;
  }

  cleanInvalidLockDeps(config, lockFile);

  await Promise.all([writeOmpConfig(ompConfig), writeLocalConfig(config), writeLockFile(lockFile)]);

  console.log(`removeDeps Done in ${elapsed(start)}s`);
}

function cleanInvalidLockDeps(config: LocalConfig, lockFile: LockFileContent) {
  if (!config.dependencies || !lockFile || !lockFile.dependencies) return 0;

  const maybeInvalidDeps = Object.keys(lockFile.dependencies);

  let count = 0;
  for (const dep of maybeInvalidDeps) {
    if (dep in config.dependencies) continue;

    delete lockFile.dependencies[dep];
    count++;
  }
  return count;
}

/**
 * Move a dependency to the front or the back of a dependency list.
 * open.mp is the server the others run inside, so it is installed first and
 * removed last; the rest keep the order the user gave.
 */
function moveDependency(deps: string[], name: string, where: "first" | "last") {
  const next = deps.slice();
  const index = next.indexOf(name);
  if (index === -1) return next;

  next.splice(index, 1);
  if (where === "first") next.unshift(name);
  else next.push(name);

  return next;
}

/** the same, for the legacy plugin list the server loads in order */
function movePluginToLast(arr: string[], targetItem: string) {
  const targetIndex = arr.findIndex((item) => item === targetItem);
  if (targetIndex !== -1) {
    arr.splice(targetIndex, 1);
    arr.push(targetItem);
  }
  return arr;
}

function elapsed(start: number) {
  return ((Date.now() - start) / 1000).toFixed(1);
}
