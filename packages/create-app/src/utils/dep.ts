import path from "node:path";
import decompress from "decompress";
import semver from "semver";
import fs from "fs-extra";
import fg from "fast-glob";
import inquirer from "inquirer";
import {
  readLocalConfig,
  readLockFile,
  readOmpConfig,
  writeLocalConfig,
  writeLockFile,
  writeOmpConfig,
  depsPath,
} from "./config.js";
import { downloadFile, getOctoKit, isWindows, ompRepository } from "./index.js";
import type { LocalConfig, LockFileContent, PawnJson } from "../types/index.js";

async function hasGlobalDepTemp(depVersionPath: string) {
  if (!fs.existsSync(depVersionPath)) return;
  const files = await fs.readdir(depVersionPath);
  return (
    !files.length ||
    (files.length === 1 && files[0] === "pawn.json") ||
    files.some((file) => file.endsWith(".tmp"))
  );
}

export async function cleanAllGlobalDeps() {
  try {
    const files = await fs.readdir(depsPath);

    const depCount = files.filter((file) => {
      const fileOrDirPath = path.join(depsPath, file);
      const stats = fs.statSync(fileOrDirPath);
      return stats.isDirectory();
    }).length;

    await fs.emptyDir(depsPath);

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

    const depPath = path.resolve(depsPath, owner, repo);

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

async function installDeps(deps: string[], isUpdate = false, isProd = false) {
  const start = Date.now();
  // todo: dev_dependencies & dependencies without resources

  if (!deps) return;

  await cleanGlobalDeps(deps);

  const lockFile: LockFileContent = (await readLockFile()) || {
    lockfileVersion: 1.0,
  };
  let dependencies = {};
  const ompConfig = (await readOmpConfig()) || {};

  ompConfig.pawn = { ...(ompConfig.pawn || {}) };
  ompConfig.pawn.legacy_plugins = [...(ompConfig.pawn.legacy_plugins || [])];

  const legacyPluginsSet = new Set([...ompConfig.pawn.legacy_plugins]);

  const localIncPath = await getIncludePath();
  const octokit = await getOctoKit();

  for (const dep of deps) {
    const [name, version = "*"] = dep.split("@");

    if (!validRange(version)) throw new Error(`invalid deps version: ${name}`);

    const [owner, repo] = name.split("/");

    let localCacheFolder = null;
    let localCacheVersion = null;

    const depAllVersionPath = path.resolve(depsPath, name);
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
      const isFixedVersion = /^\d+\.\d+\.\d+(-[a-z]?)?$/.test(version);
      const getReleaseRoute = "GET /repos/{owner}/{repo}/releases/tags/{tag}";
      const isStartsWithV = version.startsWith("v");

      if (isFixedVersion) {
        try {
          matchedRelease = (
            await octokit.request(getReleaseRoute, {
              owner,
              repo,
              tag: isStartsWithV ? version : `v${version}`,
            })
          ).data;
        } catch (err: any) {
          if (err.status === 404 && !isStartsWithV) {
            matchedRelease = (
              await octokit.request(getReleaseRoute, {
                owner,
                repo,
                tag: version,
              })
            ).data;
          }
        }
      } else {
        let hasNext = true;

        let releaseUrl = `/repos/${owner}/${repo}/releases`;

        while (!matchedRelease && hasNext) {
          const rawResponse = await getPaginatedData(releaseUrl);
          const releases = rawResponse.response.data;

          releaseUrl = rawResponse.url;
          hasNext = rawResponse.hasNext;

          const versions = releases.map((release: any) => release.tag_name);

          if (!versions.length) {
            hasNext = false;
            break;
          }

          if (!version || version === "*") {
            matchedRelease = releases[0];
            break;
          } else {
            const matchedVersion = minSatisfying(versions, version);
            if (matchedVersion) {
              const idx = versions.indexOf(matchedVersion);
              matchedRelease = releases[idx];
            }
          }
        }
      }
      if (!matchedRelease)
        throw new Error(`not found satisfactory deps: ${name}`);

      if (isUpdate) {
        const cacheFolder = path.resolve(
          depsPath,
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

    const depVersionPath = path.resolve(
      depsPath,
      name,
      localCacheVersion ? localCacheVersion : matchedRelease!.tag_name,
    );

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
          const { selectResource } = await inquirer.prompt({
            type: "list",
            name: "selectResource",
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
          const { selectAsset } = await inquirer.prompt({
            type: "list",
            name: "selectAsset",
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
        const isOmpPlugin = getIsOmpComponent(version);
        const pluginFolderPath = getPluginOrComponentPath(version);

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
          if (!isOmpPlugin) legacyPluginsSet.add(pluginFileNameNoExt);
        }
      }

      await fs.ensureDir(localIncPath);

      if (!isProd) {
        if (archiveResource.includes) {
          const includeFiles = await fg.glob(archiveResource.includes, {
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
          await fs.copy(depVersionPath, localIncPath, {
            filter: (src) => path.extname(src) === "inc",
          });
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
      const pluginFolderPath = getPluginOrComponentPath(version);

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
        version: localCacheVersion
          ? localCacheVersion
          : matchedRelease.tag_name,
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

export async function addDeps(
  deps?: string[],
  isUpdate = false,
  isProd = false,
) {
  let _deps = deps;

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
  } else {
    if (!_deps) return;

    reduceDeps = _deps.reduce(
      (acc, dep) => {
        const [depName, version = "*"] = dep.split("@");
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

    await removeDeps(waitRemoveDeps, true);
  }

  await installDeps(_deps, isUpdate, isProd);
}

export async function removeDeps(deps?: string[], onlyLockFile = false) {
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

  for (const dep of deps) {
    const [depName] = dep.split("@");

    if (!onlyLockFile) {
      if (depName in config.dependencies) {
        delete config.dependencies[depName];
      }
    }

    if (depName in lockFile.dependencies) {
      const version = lockFile.dependencies[depName].version;

      const pluginFolderPath = getPluginOrComponentPath(version);

      const globalVersionPath = path.resolve(depsPath, depName, version);

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
        if (resource.archive) {
          if (resource.includes) {
            let files = await fg.glob(resource.includes, {
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

      delete lockFile.dependencies[depName];
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

async function getPawnJson(owner: string, repo: string, ref: string) {
  const localPawnJsonPath = path.resolve(
    depsPath,
    owner,
    repo,
    ref,
    "pawn.json",
  );

  try {
    return (await fs.readJson(localPawnJsonPath)) as PawnJson;
  } catch {
    /* empty */
  }

  const octokit = await getOctoKit();

  const getContentRoute = "GET /repos/{owner}/{repo}/contents/{path}";

  const options = {
    owner,
    repo,
    path: "pawn.json",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };

  let response: any;
  try {
    response = await octokit.request(getContentRoute, { ...options, ref });
  } catch (err: any) {
    if (err.status === 404) {
      response = await octokit.request(getContentRoute, options);
    }
  }

  if (response.status !== 200 && response.status !== 302)
    throw `Failed to get ${owner}/${repo} ${ref} pawn.json`;

  const pawnJsonStr = Buffer.from(response.data.content, "base64").toString();
  const pawnJson: PawnJson = JSON.parse(pawnJsonStr);
  return pawnJson;
}

function parsePaginatedData(data: any) {
  if (Array.isArray(data)) return data;
  if (!data) return [];
  delete data.incomplete_results;
  delete data.repository_selection;
  delete data.total_count;
  const namespaceKey = Object.keys(data)[0];
  data = data[namespaceKey];
  return data;
}

async function getPaginatedData(url: string) {
  const octokit = await getOctoKit();
  const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
  const response = await octokit.request(`GET ${url}`, {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  response.data = parsePaginatedData(response.data);
  const linkHeader = response.headers.link;
  let hasNext = false;
  if (linkHeader) {
    hasNext = linkHeader.includes(`rel="next"`);
    if (hasNext) url = linkHeader.match(nextPattern)![0];
  }
  return { response, url, hasNext };
}

export async function getIncludePath() {
  const cwd = process.cwd();

  const include = path.resolve(cwd, "include");
  const pawno = path.resolve(cwd, "qawno/include");
  const qawno = path.resolve(cwd, "qawno/include");

  const hasQawno = fs.existsSync(qawno);
  if (hasQawno) return qawno;

  const hasPawno = fs.existsSync(pawno);
  if (hasPawno) return pawno;

  return include;
}

function getIsOmpComponent(version: string) {
  return version.includes("-omp");
}

function getPluginOrComponentPath(version: string) {
  return path.resolve(
    process.cwd(),
    getIsOmpComponent(version) ? "components" : "plugins",
  );
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

async function addOpenMp(versionOrRelease: any, isRemote: boolean) {
  let globalOmpPath: string;

  if (isRemote) {
    const release = versionOrRelease;
    const version = release.tag_name;
    globalOmpPath = path.resolve(depsPath, ompRepository, version);

    await fs.ensureDir(globalOmpPath);

    const assets = release.assets
      .filter((asset: any) => !["dynssl", "debug"].includes(asset.name))
      .map((asset: any) => {
        return {
          name: asset.name,
          browser_download_url: asset.browser_download_url,
        };
      });

    const downloadAssetByEnv = assets.find((asset: any) => {
      return asset.name.endsWith(isWindows ? "zip" : "tar.gz");
    });

    const downloadOmpPath =
      globalOmpPath + "." + path.extname(downloadAssetByEnv.name);

    console.log(`download dep: ${ompRepository} ${version}`);
    const ompTmpPath = await downloadFile(
      downloadAssetByEnv.browser_download_url,
      downloadOmpPath,
    );
    await decompress(ompTmpPath, globalOmpPath, { strip: 1 });
    await fs.remove(ompTmpPath);
  } else {
    const version = versionOrRelease;
    globalOmpPath = path.resolve(depsPath, ompRepository, version);
  }
  await fs.copy(globalOmpPath, process.cwd(), { overwrite: false });
}

async function removeOpenMp(globalPath: string) {
  if (!globalPath.includes(depsPath)) {
    throw new Error(
      "Due to security policy, your path may be redirected to a non-cached path!",
    );
  }
  const files = await fg("**", {
    cwd: globalPath,
    ignore: ["config.json", "bans.json", "gamemodes/**"],
  });
  return Promise.all(
    files.map((file) => {
      return fs.remove(path.resolve(process.cwd(), file));
    }),
  );
}

function minSatisfying(versions: string[], range: string) {
  if (range === "*") {
    const allVersion = versions.map((version) => {
      const coerceVersion = semver.coerce(version);
      return coerceVersion ? version : null;
    });
    const filterAllVersion = allVersion.filter((s) => Boolean(s)) as string[];
    const descVersions = semver.rsort(filterAllVersion);
    return descVersions[0] || null;
  }

  const satisfy = semver.minSatisfying(versions, range);
  if (satisfy) return satisfy;
  const coerceRange = semver.coerce(range);
  if (!coerceRange) return null;
  return versions.find((version) => {
    const coerceVersion = semver.coerce(version);
    if (!coerceVersion) return;
    return semver.minSatisfying([coerceVersion], coerceRange.version);
  });
}

function validRange(range: string) {
  if (range === "*") return true;
  const coerceRange = semver.coerce(range);
  if (!coerceRange) return false;
  return semver.validRange(coerceRange.version);
}

function movePluginToLast(arr: string[], targetItem: string) {
  const targetIndex = arr.findIndex((item) => item === targetItem);
  if (targetIndex !== -1) {
    arr.splice(targetIndex, 1);
    arr.push(targetItem);
  }
  return arr;
}

function getTimeDiff(start: number, end: number) {
  const timeDiff = end - start;
  const seconds = (timeDiff / 1000).toFixed(1);
  return seconds;
}
