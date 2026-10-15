import path from "node:path";
import fs from "fs-extra";
import fg from "fast-glob";
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
import type { AddDepsOptions, LocalConfig, LockFileContent } from "../types";
import { validRange } from "./semver";
import { isIncludeAsset, isPluginAsset } from "./asset";
import { isSameReleaseTag, matchByRange, parseTag } from "./release";
import {
  describeCache,
  planDependency,
  planCache,
  isPinnedRequest,
  type CachePlan,
  type DependencyPlan,
} from "./plan";
import { DependencyInstaller } from "./installer";
import { removeOpenMp } from "./omp";
import { getPawnJson, getIncludePath, getPlugOrCompPath } from "./pawn";
import { ompRepository, isWindows } from "../constants";

export { planCache, isPinnedRequest };
export type { CachePlan };

async function hasGlobalDepTemp(depVersionPath: string): Promise<boolean> {
  if (!fs.existsSync(depVersionPath)) return false;
  const files = await fs.readdir(depVersionPath);
  return (
    !files.length ||
    (files.length === 1 && files[0] === "pawn.json") ||
    files.some((file) => file.endsWith(".tmp"))
  );
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

  if (!args.dependencies) return;

  const verbose = !!args.verbose;
  const dryRun = !!args.dryRun;

  if (dryRun && !verbose) {
    throw new Error("--dry-run needs --verbose, otherwise it would print nothing");
  }

  const installer = await DependencyInstaller.create({
    verbose,
    isProd: args.production,
    isComponent: args.component,
  });

  // the server is installed before the plugins that run inside it, and the copy
  // step needs its files in place to tell its own files from the project's
  const deps = moveDependency(args.dependencies, ompRepository, "first");

  // a dry run must not even delete stale temp folders from the cache
  if (!dryRun) await cleanGlobalDeps(deps);

  // Resolve everything before placing anything: a dependency that cannot be
  // resolved then fails the command without having written a partial install.
  const plans: DependencyPlan[] = [];

  for (const dep of deps) {
    const name = dep.split("@")[0];

    if (verbose) {
      console.log(
        chalk.gray(
          `\n[${name}] requested version "${dep.split("@")[1] ?? "*"}"${isUpdate ? " (update)" : ""}`,
        ),
      );
    }

    const plan = await planDependency(dep, {
      verbose,
      isUpdate,
      component: installer.isComponent(name),
      previousVersion: installer.previousVersion(name),
    });

    if (verbose) describeCache(plan);
    plans.push(plan);
  }

  if (dryRun) {
    printInstallPlan(
      plans.map((plan) => ({
        dep: `${plan.name}@${plan.requested}`,
        from: plan.previousVersion ?? null,
        to: plan.finalVersion,
        action: plan.cachedTag
          ? "reuse cache"
          : plan.cache.dropTag
            ? `re-download (replacing ${plan.cache.dropTag})`
            : "download",
        cached: !!plan.cachedTag,
      })),
      isUpdate,
    );
    return;
  }

  for (const plan of plans) {
    await installer.materialize(plan);
  }

  await installer.record();
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

    // written only once the install below has succeeded, so a failure cannot
    // leave the manifest declaring a dependency that was never installed
    config.dependencies = { ...config.dependencies, ...reduceDeps };
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

  if (!isInstallAll && !args.dryRun) await writeLocalConfig(config);
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
            // the paths are relative to the dependency, like every other glob here
            const files = await fg.glob(Object.values(resource.files), {
              absolute: true,
              cwd: globalVersionPath,
            });
            await Promise.all(files.map((file) => fs.remove(file)));
          }
        } else {
          const assetPath = path.resolve(process.cwd(), resource.name);

          if (isIncludeAsset(resource.name)) {
            await fs.remove(path.resolve(localIncPath, resource.name));
          } else if (isPluginAsset(resource.name)) {
            await fs.remove(path.resolve(pluginFolderPath, resource.name));

            if (hasLegacyPlugins) {
              waitRemovePlugins.add(path.basename(assetPath, path.extname(assetPath)));
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
