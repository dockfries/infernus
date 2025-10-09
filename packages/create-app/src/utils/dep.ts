import path from "node:path";
import decompress from "decompress";
import fs from "fs-extra";
import fg from "fast-glob";
import { select } from "@inquirer/prompts";
import {
  readLocalConfig,
  readLockFile,
  readOmpConfig,
  writeLocalConfig,
  writeLockFile,
  writeOmpConfig,
  GLOBAL_DEPS_PATH,
  INF_CONFIG_NAME,
} from "./config.js";
import { downloadFile, getRepoRelease, getTimeDiff } from "./api.js";
import type {
  AddDepsOptions,
  LocalConfig,
  LockFileContent,
  PawnJson,
} from "../types/index.js";
import { minSatisfying, validRange } from "./semver.js";
import { addOpenMp, removeOpenMp } from "./omp.js";
import { getPawnJson, getIncludePath, getPlugOrCompPath } from "./pawn.js";
import { ompRepository, isWindows } from "../constants/index.js";

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
      const minVersion = minSatisfying(allVersions, version);
      if (minVersion) {
        const depVersionPath = path.resolve(depPath, minVersion);
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

  const deps = args.dependencies.slice();

  const ompIdx = deps.findIndex((dep) => dep === ompRepository);
  if (ompIdx > 0) {
    deps.splice(ompIdx, 1);
    deps.unshift(ompRepository);
  }

  await cleanGlobalDeps(deps);

  const lockFile: LockFileContent = (await readLockFile()) || {
    lockfileVersion: 1.0,
  };
  let dependencies = {};
  const ompConfig = (await readOmpConfig()) || {};

  ompConfig.pawn = { ...(ompConfig.pawn || {}) };
  ompConfig.pawn.legacy_plugins = [...(ompConfig.pawn.legacy_plugins || [])];

  const legacyPluginsSet = new Set([...ompConfig.pawn.legacy_plugins]);

  for (const dep of deps) {
    const [name, version = "*"] = dep.split("@");

    if (!validRange(version)) throw new Error(`invalid deps version: ${name}`);

    const isComponent =
      args.component === true || !!lockFile.dependencies?.[name]?.component;
    const pluginFolderPath = getPlugOrCompPath(isComponent);

    const [owner, repo] = name.split("/");

    let localCacheFolder = null;
    let localCacheVersion = null;

    const depAllVersionPath = path.resolve(GLOBAL_DEPS_PATH, name);
    const isExistDepAllVersion = fs.existsSync(depAllVersionPath);
    if (isExistDepAllVersion) {
      const files = await fs.readdir(depAllVersionPath);
      const satisfyVersion = minSatisfying(files, version);
      if (satisfyVersion) {
        const satisfyPath = path.resolve(depAllVersionPath, satisfyVersion);
        if (isUpdate) {
          await fs.remove(satisfyPath);
        } else {
          localCacheFolder = satisfyPath;
          localCacheVersion = satisfyVersion;
        }
      }
    }

    let matchedRelease: any = null;
    let pawnJson: null | PawnJson = null;

    if (!localCacheFolder) {
      matchedRelease = await getRepoRelease(owner, repo, version);
      if (!matchedRelease)
        throw new Error(`not found satisfactory deps: ${name}`);

      if (isUpdate) {
        const cacheFolder = path.resolve(
          GLOBAL_DEPS_PATH,
          name,
          matchedRelease.tag_name,
        );
        if (fs.existsSync(cacheFolder)) {
          await fs.remove(cacheFolder);
        }
      }

      if (name === ompRepository) {
        dependencies = {
          ...dependencies,
          [name]: {
            version: localCacheVersion
              ? localCacheVersion
              : matchedRelease.tag_name,
          },
        };
        await addOpenMp(matchedRelease, true);
        continue;
      }

      pawnJson = await getPawnJson(owner, repo, matchedRelease.tag_name);
    } else {
      console.log(`local cache found: ${name} ${localCacheVersion}`);
      if (name === ompRepository) {
        dependencies = {
          ...dependencies,
          [name]: {
            version: localCacheVersion
              ? localCacheVersion
              : matchedRelease.tag_name,
          },
        };
        await addOpenMp(localCacheVersion!, false);
        continue;
      }

      pawnJson = await getPawnJson(owner, repo, localCacheVersion!);
    }

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

    const archiveResources = platformResources.filter(
      (resource) => resource.archive,
    );

    const notArchiveResources = platformResources.filter(
      (resource) => !resource.archive,
    );

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
        console.log(
          `download dep: ${archiveAsset.name} ${matchedRelease.tag_name}`,
        );
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
          const pluginFileNameNoExt = path.basename(
            pluginFileName,
            path.extname(pluginFileName),
          );
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
            await fs.copy(
              includeFolder,
              path.resolve(localIncPath, path.basename(includeFolder)),
            );
          }
        } else {
          const includeFiles = await fg.glob("*.inc", {
            absolute: true,
            cwd: depVersionPath,
          });
          for (const includeFolder of includeFiles) {
            await fs.copy(
              includeFolder,
              path.resolve(localIncPath, path.basename(includeFolder)),
            );
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
          const to = path.resolve(
            process.cwd(),
            archiveResource.files[globPattern],
          );
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
  lockFile.dependencies = {
    ...(lockFile.dependencies || {}),
    ...dependencies,
  };
  await Promise.all([writeOmpConfig(ompConfig), writeLockFile(lockFile)]);
  const end = Date.now();
  const diff = getTimeDiff(start, end);
  console.log(`Done in ${diff}s`);
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
        if (!validRange(version))
          throw new Error(`invalid deps version: ${dep}`);
        acc[depName] = version;
        return acc;
      },
      {} as Record<string, string>,
    );

    config.dependencies = { ...config.dependencies, ...reduceDeps };
    await writeLocalConfig(config);
  }

  if (!Object.keys(reduceDeps).length) return;

  const lockFile = await readLockFile();

  if (lockFile && lockFile.dependencies) {
    let waitRemoveDeps;

    if (isInstallAll) {
      waitRemoveDeps = Object.keys(config.dependencies);
    } else {
      waitRemoveDeps = Object.keys(config.dependencies).filter(
        (installedDep) => {
          return installedDep in reduceDeps;
        },
      );
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

  const deps_ = deps.slice();

  const ompIdx = deps.findIndex((dep) => dep === ompRepository);
  if (ompIdx > -1 && ompIdx !== deps.length - 1) {
    deps_.splice(ompIdx, 1);
    deps_.push(ompRepository);
  }

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

      const globalVersionPath = path.resolve(
        GLOBAL_DEPS_PATH,
        depName,
        version,
      );

      if (depName === ompRepository) {
        await removeOpenMp(globalVersionPath);
        continue;
      }

      const [owner, repo] = depName.split("/");

      const pawnJson = await getPawnJson(owner, repo, version);

      if (!pawnJson.resources) continue;

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
    const legacyPlugins = (ompConfig.pawn.legacy_plugins as string[]).filter(
      (plugin) => {
        return !waitRemovePlugins.has(plugin);
      },
    );
    movePluginToLast(legacyPlugins, "samp-node");
    ompConfig.pawn.legacy_plugins = legacyPlugins;
  }

  cleanInvalidLockDeps(config, lockFile);

  await Promise.all([
    writeOmpConfig(ompConfig),
    writeLocalConfig(config),
    writeLockFile(lockFile),
  ]);

  const end = Date.now();
  const diff = getTimeDiff(start, end);
  console.log(`Done in ${diff}s`);
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

function movePluginToLast(arr: string[], targetItem: string) {
  const targetIndex = arr.findIndex((item) => item === targetItem);
  if (targetIndex !== -1) {
    arr.splice(targetIndex, 1);
    arr.push(targetItem);
  }
  return arr;
}
