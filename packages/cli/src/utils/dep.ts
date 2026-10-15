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
import type { AddDepsOptions, LocalConfig, LockFileContent, PawnJsonResources } from "../types";
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

  // A dry run is a request to see what would happen, so it prints the lookups
  // that lead to the answer rather than refusing to run without --verbose.
  const dryRun = !!args.dryRun;
  const verbose = !!args.verbose || dryRun;

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

    // The old files go now, but the manifest is left alone: the install below
    // writes it once, from what it actually placed, so a failure part way
    // through cannot leave it describing an install that never happened.
    await removeDeps(waitRemoveDeps, {
      keep: _deps.map((dep) => dep.split("@")[0]),
      record: false,
    });
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

/** what a removal will do, worked out before anything is deleted */
interface RemovalPlan {
  /** files to delete from the project */
  files: string[];
  /** cached server builds to tear down with their own routine */
  openMp: string[];
  /** dependencies to drop from the manifest */
  manifestDeps: string[];
  /** dependencies to drop from the lockfile */
  lockDeps: string[];
  /** plugins to drop from the server's load list */
  legacyPlugins: string[];
}

/**
 * Work out what removing these dependencies entails, without changing anything.
 *
 * `keep` names dependencies that are about to be reinstalled, so they stay in the
 * manifest and the lockfile while their old files still go.
 */
async function planRemoval(
  deps: string[],
  { keep = [] }: { keep?: string[] } = {},
): Promise<RemovalPlan | null> {
  const config = await readLocalConfig();
  if (!config?.dependencies) return null;

  const lockFile = await readLockFile();
  if (!lockFile?.dependencies) return null;

  const includePath = await getIncludePath();
  const ompConfig = await readOmpConfig();
  const legacyPlugins: string[] = ompConfig?.pawn?.legacy_plugins ?? [];

  const plan: RemovalPlan = {
    files: [],
    openMp: [],
    manifestDeps: [],
    lockDeps: [],
    legacyPlugins: [],
  };

  const dropPlugins = new Set<string>();

  // the server is torn down after the plugins installed inside it
  for (const dep of moveDependency(deps, ompRepository, "last")) {
    const [name] = dep.split("@");

    if (!keep.length && name in config.dependencies) plan.manifestDeps.push(name);

    // the lockfile entry goes whether or not there is a build to clean up
    if (!keep.includes(name)) plan.lockDeps.push(name);

    const version = lockFile.dependencies[name]?.version;
    if (!version) continue;

    const versionPath = path.resolve(GLOBAL_DEPS_PATH, name, version);

    if (name === ompRepository) {
      plan.openMp.push(versionPath);
      continue;
    }

    const [owner, repo] = name.split("/");

    // The files to delete are already on disk, so a repository that cannot be
    // read (offline, rate limited, deleted upstream) must not block the removal:
    // the manifest and the lockfile are updated either way, and only the file
    // cleanup is skipped.
    const pawnJson = await getPawnJson(owner, repo, version).catch((error: any) => {
      console.log(
        chalk.yellow(
          `  warn: cannot read pawn.json of ${name}@${version} (${error?.message ?? error}), ` +
            `removing it from the manifest only`,
        ),
      );
      return null;
    });

    if (!pawnJson?.resources) continue;

    const pluginFolder = getPlugOrCompPath(!!lockFile.dependencies[name]?.component);

    for (const resource of pawnJson.resources) {
      if (isWindows ? resource.platform !== "windows" : resource.platform !== "linux") continue;

      for (const target of await projectFilesOf(resource, {
        includePath,
        pluginFolder,
        versionPath,
      })) {
        plan.files.push(target.path);

        if (target.isPlugin) {
          dropPlugins.add(path.basename(target.path, path.extname(target.path)));
        }
      }
    }
  }

  plan.legacyPlugins = legacyPlugins.filter((plugin) => !dropPlugins.has(plugin));

  return plan;
}

/**
 * Where each of a resource's files currently lives in the project.
 *
 * An archive carries its files, so they are found inside the unpacked build and
 * then addressed in the project; a resource without an archive names them
 * directly.
 */
async function projectFilesOf(
  resource: PawnJsonResources,
  context: { includePath: string; pluginFolder: string; versionPath: string },
) {
  const found: { path: string; isPlugin: boolean }[] = [];

  if (!resource.archive) {
    // a loose asset is named after the file itself and lands beside its kind
    if (isIncludeAsset(resource.name)) {
      found.push({ path: path.resolve(context.includePath, resource.name), isPlugin: false });
    } else if (isPluginAsset(resource.name)) {
      found.push({ path: path.resolve(context.pluginFolder, resource.name), isPlugin: true });
    }

    return found;
  }

  const includes = resource.includes?.length
    ? resource.includes.map((include) => (path.extname(include) ? include : `${include}/*.inc`))
    : ["*.inc"];

  const groups = [
    { patterns: includes, destination: context.includePath, isPlugin: false },
    { patterns: resource.plugins ?? [], destination: context.pluginFolder, isPlugin: true },
    {
      patterns: Object.values(resource.files ?? {}),
      destination: process.cwd(),
      isPlugin: false,
    },
  ];

  for (const group of groups) {
    if (!group.patterns.length) continue;

    const matches = await fg.glob(group.patterns, { absolute: true, cwd: context.versionPath });

    for (const match of matches) {
      found.push({
        path: path.resolve(group.destination, path.basename(match)),
        isPlugin: group.isPlugin,
      });
    }
  }

  return found;
}

/** Delete what a removal plan lists, then record it. */
async function applyRemoval(plan: RemovalPlan, record: boolean) {
  const config = await readLocalConfig();
  const lockFile = await readLockFile();
  const ompConfig = (await readOmpConfig()) || {};

  if (config?.dependencies) {
    for (const name of plan.manifestDeps) delete config.dependencies[name];
  }

  if (lockFile?.dependencies) {
    for (const name of plan.lockDeps) delete lockFile.dependencies[name];
  }

  if (ompConfig.pawn?.legacy_plugins) {
    const remaining = [...plan.legacyPlugins];
    movePluginToLast(remaining, "samp-node");
    ompConfig.pawn.legacy_plugins = remaining;
  }

  if (config && lockFile) cleanInvalidLockDeps(config, lockFile);

  // the server has its own teardown, and its files are not project files
  await Promise.all(plan.openMp.map((versionPath) => removeOpenMp(versionPath)));
  await Promise.all(plan.files.map((file) => fs.remove(file)));

  if (!record || !config || !lockFile) return;

  await Promise.all([writeOmpConfig(ompConfig), writeLocalConfig(config), writeLockFile(lockFile)]);
}

export interface RemovalOptions {
  /**
   * Dependencies about to be reinstalled: their files still go, but they stay in
   * the manifest and the lockfile.
   */
  keep?: string[];
  /**
   * Whether to update the manifest and the lockfile.
   *
   * A caller that installs afterwards passes false, so the files go now and the
   * manifest is written once, at the end, from what the install actually placed.
   */
  record?: boolean;
}

/**
 * Remove dependencies from a project.
 *
 * The files are deleted first and the records updated afterwards, so a failure
 * while deleting cannot leave the manifest claiming a dependency that is still
 * on disk in full.
 */
export async function removeDeps(deps?: string[], options: RemovalOptions = {}) {
  if (!deps?.length) return;

  const start = Date.now();
  const { keep = [], record = true } = options;

  const plan = await planRemoval(deps, { keep });
  if (!plan) return;

  await applyRemoval(plan, record);

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
