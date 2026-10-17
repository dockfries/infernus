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
  INF_LOCK_NAME,
} from "./config";
import type { AddDepsOptions, LocalConfig, LockFileContent, PawnJsonResources } from "../types";
import { validRange } from "./semver";
import { isIncludeAsset, isPluginAsset } from "./asset";
import { satisfiesSpec, saveSpecFor } from "./release";
import {
  describeCache,
  planDependency,
  planCache,
  type CachePlan,
  type DependencyPlan,
  type ResolveMode,
} from "./plan";
import { DependencyInstaller } from "./installer";
import { removeOpenMp } from "./omp";
import { getPawnJson, getIncludePath, getPlugOrCompPath } from "./pawn";
import { ompRepository, isWindows } from "../constants";

export { planCache };
export type { CachePlan };

/** the shape a dependency name has to have: `owner/repo` */
const DEPENDENCY_NAME = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/;

/**
 * Where a dependency's cache directory is, refusing anything that is not a
 * dependency name.
 *
 * These names come from the command line and end up as path segments under the
 * cache, so `../..` would resolve to the user's home directory and a name
 * without an owner would resolve to `undefined`. Both are rejected here rather
 * than trusted, because the caller may then delete what it finds.
 *
 * @throws {Error} when the name is not `owner/repo` inside the cache
 */
function dependencyCachePath(owner?: string, repo?: string) {
  const name = owner && repo ? `${owner}/${repo}` : (owner ?? "");

  if (!owner || !repo || !DEPENDENCY_NAME.test(name)) {
    throw new Error(`invalid dependency name: ${JSON.stringify(name)}, expected owner/repo`);
  }

  const target = path.resolve(GLOBAL_DEPS_PATH, owner, repo);
  const relative = path.relative(GLOBAL_DEPS_PATH, target);

  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`dependency name escapes the cache: ${JSON.stringify(name)}`);
  }

  return target;
}

async function hasGlobalDepTemp(depVersionPath: string): Promise<boolean> {
  if (!fs.existsSync(depVersionPath)) return false;

  // The cache directory holds both builds and the archives downloaded beside
  // them, so an entry is not necessarily a directory. Reading a file as one
  // throws ENOTDIR, which would abort the cleanup that this check exists to
  // decide, and with it the whole command.
  if (!fs.statSync(depVersionPath).isDirectory()) return false;

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

    let depPath: string;
    try {
      depPath = dependencyCachePath(owner, repo);
    } catch (error: any) {
      console.log(chalk.yellow(`  warn: ${error.message}, skipping`));
      continue;
    }

    const isExist = fs.existsSync(depPath);

    if (!isExist) continue;

    const allVersions = await fs.readdir(depPath);

    // A declaration accepts every cached release it matches, so a range clears
    // all of them: cleaning is a request to free the cache, and leaving the
    // older builds of the same range behind answers half of it. `*` keeps
    // clearing the whole directory, stray archives included, since those are not
    // releases at all.
    const matched =
      version === "*"
        ? allVersions
        : allVersions.filter((cached) => satisfiesSpec(cached, version));

    for (const cached of matched) {
      const depVersionPath = path.resolve(depPath, cached);
      const hasTmp = await hasGlobalDepTemp(depVersionPath);
      if (!onlyTmp || hasTmp) waitCleanFolders.push(depVersionPath);
    }
  }
  await Promise.all(waitCleanFolders.map((folder) => fs.remove(folder)));
  const depCount = waitCleanFolders.length;
  if (depCount) {
    console.log(`cleared ${depCount} global dependency caches`);
  }
  return depCount;
}

/**
 * Resolve every dependency, then place what is not already in place.
 *
 * A dependency whose release is changing has its previous files removed before
 * the new ones go in. Everything else is left alone when its files are already
 * there, so an install that finds the project up to date writes nothing: files
 * the project edited survive, and a repeated install does not churn mtimes.
 *
 * Being up to date is decided by checking the files, not by the lockfile alone:
 * a fresh clone carries a committed lockfile and no `plugins/`, and that project
 * has to be filled in.
 *
 * The plans are returned so the caller can record what the manifest should
 * declare, which is only known once resolution has happened.
 */
async function installDeps(
  args: AddDepsOptions,
  mode: ResolveMode,
  isInstallAll: boolean,
  declared: string[],
): Promise<DependencyPlan[]> {
  const start = Date.now();
  // todo: dev_dependencies & dependencies without resources

  if (!args.dependencies) return [];

  // A dry run is a request to see what would happen, so it prints the lookups
  // that lead to the answer rather than refusing to run without --verbose.
  const dryRun = !!args.dryRun;
  const verbose = !!args.verbose || dryRun;

  const installer = await DependencyInstaller.create({
    verbose,
    isProd: args.production,
    isComponent: args.component,
    frozen: mode === "frozen",
    declared,
  });

  // The server is installed before the plugins that run inside it, and the copy
  // step needs its files in place to tell its own files from the project's.
  const deps = moveDependency(args.dependencies, ompRepository, "first");

  // a dry run must not even delete stale temp folders from the cache
  if (!dryRun) await cleanGlobalDeps(deps);

  // The lockfile answers for what the manifest declares. A dependency named on
  // the command line is an explicit request to resolve, exactly like
  // `npm install pkg@^2`, and an update is a request to move: neither consults it.
  const useLock = isInstallAll && mode !== "update";

  // Resolve everything before placing anything: a dependency that cannot be
  // resolved then fails the command without having written a partial install.
  const plans: DependencyPlan[] = [];

  for (const dep of deps) {
    const name = dep.split("@")[0];

    if (verbose) {
      const label = mode === "update" ? " (update)" : mode === "frozen" ? " (frozen)" : "";
      console.log(
        chalk.gray(`\n[${name}] requested version "${dep.split("@")[1] ?? "*"}"${label}`),
      );
    }

    const previousVersion = installer.previousVersion(name);
    const plan = await planDependency(dep, {
      verbose,
      mode,
      component: installer.isComponent(name),
      previousVersion,
      lockedVersion: useLock ? previousVersion : undefined,
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
        // A drop that names the build being installed is not a replacement: the
        // cache already holds exactly that build, and downloading it again would
        // discard the install manifest kept beside it, which an upgrade needs to
        // tell an untouched file from an edited one.
        action: plan.cachedTag
          ? "reuse cache"
          : plan.cache.dropTag === plan.finalVersion
            ? "reuse cache (already installed)"
            : plan.cache.dropTag
              ? `re-download (replacing ${plan.cache.dropTag})`
              : "download",
        cached: !!plan.cachedTag,
      })),
      mode === "update",
    );
    return plans;
  }

  // Only a dependency that has something installed under a different release has
  // files to tear down. `--component` moves where a dependency's files belong,
  // so it asks for the same teardown whatever the release says.
  const changing = plans.filter(
    (plan) =>
      plan.previousVersion && (!!args.component || plan.finalVersion !== plan.previousVersion),
  );

  if (changing.length) {
    // The files go now, but the manifest and the lockfile are left to the install
    // below, so a failure part way through cannot leave them describing an
    // install that never happened. The install reports this in its own summary.
    const removal = await removeDeps(
      changing.map((plan) => plan.name),
      { keep: deps.map((dep) => dep.split("@")[0]), record: false, quiet: true },
    );

    // The installer loaded the plugin list before the teardown, and that list
    // still names the plugins whose files just went: a release that renamed its
    // binary would leave the server loading a file that no longer exists.
    if (removal) installer.replacePlugins(removal.legacyPlugins);
  }

  const includePath = await getIncludePath();
  const skipped = new Set<string>();

  for (const plan of plans) {
    const upToDate = plan.finalVersion === plan.previousVersion && !args.component;

    // A plugin is skipped when it is already where it belongs, but its name is
    // still recorded: the server config lists what to load, and skipping the
    // placement must not empty that list. The server's own copy always runs,
    // because it compares each file and records what it made of it, so it
    // reports whether it wrote anything instead.
    if (plan.name !== ompRepository && upToDate) {
      const state = await placedState(plan, { includePath, isProd: !!args.production });

      if (state.placed) {
        if (verbose) {
          console.log(chalk.gray(`  up to date: ${plan.name} ${plan.finalVersion}`));
        }
        installer.register(plan, state.plugins);
        skipped.add(plan.name);
        continue;
      }
    }

    if (!(await installer.materialize(plan))) skipped.add(plan.name);
  }

  await installer.record();
  printInstallSummary(plans, skipped, start);
  return plans;
}

/**
 * What an install did.
 *
 * A run that finds every dependency in place now writes nothing at all, and it
 * used to report a duration alone, which reads the same as a failure. The moves
 * are listed because they are the reason an update is run.
 */
function printInstallSummary(plans: DependencyPlan[], skipped: Set<string>, start: number) {
  for (const plan of plans) {
    if (plan.previousVersion && plan.finalVersion !== plan.previousVersion) {
      console.log(
        `  ${plan.name}: ${chalk.yellow(plan.previousVersion)} -> ${chalk.green(plan.finalVersion)}`,
      );
    }
  }

  const installed = plans.length - skipped.size;
  const plural = (count: number) => (count === 1 ? "dependency" : "dependencies");

  if (!installed) {
    console.log(
      chalk.gray(
        `nothing to do, ${plans.length} ${plural(plans.length)} up to date in ${elapsed(start)}s`,
      ),
    );
    return;
  }

  const upToDate = skipped.size ? `, ${skipped.size} up to date` : "";
  console.log(
    chalk.gray(`installed ${installed} ${plural(installed)}${upToDate} in ${elapsed(start)}s`),
  );
}

/**
 * What a dependency's build would place, and whether it is already there.
 *
 * The files are enumerated from the build's own `pawn.json`, which an earlier
 * install cached, so this asks nothing of the network and matches what a
 * placement would copy — including the loose assets that never had an archive.
 * A dependency with no readable declaration, no file of the current platform, or
 * an unusable one answers "not placed", which sends it down the normal install
 * path where those problems are reported properly.
 *
 * The names of the plugins come back with the answer because the server config
 * lists them: a dependency that is skipped still has to be loaded, and a fresh
 * clone that committed `plugins/` but not `config.json` would otherwise come out
 * with an empty list and a server that loads nothing.
 */
async function placedState(
  plan: DependencyPlan,
  context: { includePath: string; isProd: boolean },
): Promise<{ placed: boolean; plugins: string[] }> {
  const notPlaced = { placed: false, plugins: [] };

  const [owner, repo] = plan.name.split("/");
  const pawnJson = await getPawnJson(owner, repo, plan.finalVersion).catch(() => null);

  if (!pawnJson?.resources?.length) return notPlaced;

  const resources = pawnJson.resources.filter((resource) =>
    isWindows ? resource.platform === "windows" : resource.platform === "linux",
  );
  if (!resources.length) return notPlaced;

  const pluginFolder = getPlugOrCompPath(plan.component);
  const expected: string[] = [];
  const plugins: string[] = [];

  for (const resource of resources) {
    let found;
    try {
      found = await projectFilesOf(resource, {
        includePath: context.includePath,
        pluginFolder,
        versionPath: plan.versionPath,
      });
    } catch {
      // a declaration that cannot be used fails during the placement, where the
      // error names it, rather than here where it would look like a missing file
      return notPlaced;
    }

    for (const file of found) {
      if (file.isPlugin) {
        plugins.push(path.basename(file.path, path.extname(file.path)));
      }

      // a production install deliberately leaves the include files out, so their
      // absence must not make the dependency look incomplete
      if (context.isProd && !file.isPlugin) continue;
      expected.push(file.path);
    }
  }

  if (!expected.length) return notPlaced;

  const present = await Promise.all(expected.map((file) => fs.pathExists(file)));

  return { placed: present.every(Boolean), plugins };
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

/**
 * Refuse a frozen install whose lockfile no longer describes the manifest.
 *
 * `--frozen` is `npm ci`: the lockfile is the install plan, so a manifest asking
 * for something the lock does not record is reported rather than quietly
 * resolved. Every offending dependency is named, because the first one fixed
 * would otherwise hide the next on the following run.
 *
 * @throws {Error} when a declared dependency is missing from the lockfile or is
 * pinned to a release the declaration no longer accepts
 */
function assertLockInSync(config: LocalConfig, lockFile: LockFileContent | null) {
  // A lockfile from a newer format may mean something this CLI cannot honour,
  // and reproducing it byte for byte is exactly what a frozen install promises,
  // so it is refused rather than half understood.
  if (lockFile?.lockfileVersion !== undefined && lockFile.lockfileVersion !== 1) {
    throw new Error(
      `${INF_LOCK_NAME} has lockfileVersion ${lockFile.lockfileVersion}, this CLI writes 1; ` +
        `run \`infernus install\` to rewrite it`,
    );
  }

  const problems: string[] = [];

  for (const [name, spec] of Object.entries(config.dependencies ?? {})) {
    const locked = lockFile?.dependencies?.[name]?.version;

    if (!locked) problems.push(`  ${name}@${spec}: not in the lockfile`);
    else if (!satisfiesSpec(locked, spec)) problems.push(`  ${name}@${spec}: locked to ${locked}`);
  }

  if (!problems.length) return;

  throw new Error(
    `${INF_LOCK_NAME} is out of sync with ${INF_CONFIG_NAME}:\n${problems.join("\n")}\n` +
      `run \`infernus install\` without \`--frozen\` to resolve them, or \`infernus update <deps>\` to move within the declared range`,
  );
}

export async function addDeps(args: AddDepsOptions, mode: ResolveMode = "install") {
  let _deps = args.dependencies;

  const isInstallAll = !_deps || !_deps.length;

  // `--frozen` installs the lockfile as it is, so a dependency argument has
  // nothing to mean: resolving one would have to write the lockfile it forbids
  if (mode === "frozen" && !isInstallAll) {
    throw new Error(
      `\`--frozen\` installs exactly what ${INF_LOCK_NAME} records, so it takes no dependencies`,
    );
  }

  const config = (await readLocalConfig()) || ({} as LocalConfig);

  config.dependencies = config.dependencies || {};

  /** the specs named on the command line, saved as written */
  const typed = new Map<string, string>();
  /** dependencies named without a version, which already say what they want */
  const kept = new Set<string>();

  if (isInstallAll) {
    _deps = Object.entries(config.dependencies).map(([depName, depVersion = "*"]) => {
      if (!validRange(depVersion))
        throw new Error(`invalid deps version: ${depName}@${depVersion}`);
      return `${depName}@${depVersion}`;
    });

    if (!_deps.length) {
      throw new Error(`no deps found, pls check ${INF_CONFIG_NAME}`);
    }
  } else {
    if (!_deps) return;

    _deps = _deps.map((dep) => {
      const [depName, given, ...extra] = dep.split("@");

      if (extra.length) {
        throw new Error(
          `invalid dependency spec: ${JSON.stringify(dep)}, expected owner/repo@version`,
        );
      }

      const version = given || "*";
      const declared = config.dependencies![depName];

      // A dependency named without a version keeps the spec the manifest already
      // declares: `add pkg` on `^2.6.1` must not widen what the project asked for,
      // and `update pkg` has always read this way. `--save-exact` is an explicit
      // request for a narrower declaration, so it resolves the same way and then
      // writes the tag.
      if (!given && declared && !args.saveExact) {
        if (!validRange(declared)) throw new Error(`invalid deps version: ${depName}@${declared}`);
        kept.add(depName);
        return `${depName}@${declared}`;
      }

      if (!validRange(version)) throw new Error(`invalid deps version: ${dep}`);

      // `pkg@*` is not the same request as `pkg`: the first asks for anything and
      // says so, the second leaves the declaration to the resolved range below
      if (given) typed.set(depName, version);

      return `${depName}@${given ? version : (declared ?? version)}`;
    });
  }

  if (!_deps.length) return;

  // Refused before anything is deleted or written, so an out of sync project is
  // left exactly as it was found.
  if (mode === "frozen") assertLockInSync(config, await readLockFile());

  // what the lockfile may describe: the manifest plus whatever this run names
  const declared = [
    ...new Set([
      ...Object.keys(config.dependencies ?? {}),
      ..._deps.map((dep) => dep.split("@")[0]),
    ]),
  ];

  const plans = await installDeps({ ...args, dependencies: _deps }, mode, isInstallAll, declared);

  if (isInstallAll || args.dryRun) return;

  // npm's save-prefix: a dependency that was named without a version is declared
  // with the range that resolved it, and `--save-exact` declares the tag itself.
  // Written only once the install above has succeeded, so a failure cannot leave
  // the manifest describing a dependency that was never installed.
  for (const plan of plans) {
    if (kept.has(plan.name)) continue;

    config.dependencies![plan.name] =
      typed.get(plan.name) ?? saveSpecFor(plan.finalVersion, args.saveExact);
  }

  await writeLocalConfig(config);
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

  // A lockfile can be missing in a fresh clone or after an install that failed
  // before writing one. The dependencies are still declared in the manifest, so
  // removing them has to update it; there is simply nothing on disk to clean up.
  const lockFile = await readLockFile();
  const installed = lockFile?.dependencies ?? {};

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

    const version = installed[name]?.version;
    if (!version) continue;

    const versionPath = path.resolve(GLOBAL_DEPS_PATH, name, version);

    if (name === ompRepository) {
      // A kept server is not torn down: its files are replaced one by one by the
      // install that follows, which consults the install manifest and keeps the
      // ones this project edited. Deleting them here would destroy those edits
      // before that decision is ever made.
      if (!keep.includes(name)) plan.openMp.push(versionPath);
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

    const pluginFolder = getPlugOrCompPath(!!installed[name]?.component);

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
 * Refuse a declaration value that would resolve outside the project.
 *
 * These values come from a dependency's `pawn.json` and become delete targets
 * during removal and copy targets during install, so a `..` in one of them could
 * reach any file the user can write.
 *
 * @throws {Error} when the value resolves outside the project directory
 */
function assertInsideProject(value: string, what: string) {
  const root = process.cwd();
  const target = path.resolve(root, value);
  const relative = path.relative(root, target);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(
      `refusing to use ${what} ${JSON.stringify(value)}: it resolves outside ${root}`,
    );
  }

  return target;
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
    // A loose asset is named after the file itself and lands beside its kind.
    // The name comes from a dependency's declaration and is used as a delete
    // target, so a `..` in it has to be refused rather than acted on.
    assertInsideProject(resource.name, "loose asset name");

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

  // A `files` entry names a pattern to find in the build and the destination it
  // was copied to, so the removal has to read the same pair. Globbing the
  // destinations instead would leave the file behind and, when the build happens
  // to contain a path that equals a destination, delete an unrelated file.
  for (const [pattern, destination] of Object.entries(resource.files ?? {})) {
    const matches = await fg.glob(pattern, { absolute: true, cwd: context.versionPath });

    for (const match of matches) {
      const target = path.resolve(process.cwd(), destination);
      const isDirectory = await fs.stat(target).then(
        (stats) => stats.isDirectory(),
        () => false,
      );

      found.push({
        path: isDirectory ? path.resolve(target, path.basename(match)) : target,
        isPlugin: false,
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
  /**
   * Whether to stay silent about the work done.
   *
   * An install tears down the dependencies it is about to replace, and reports
   * that in its own summary; the caller that runs it should not read like a
   * second command ran on its behalf.
   */
  quiet?: boolean;
}

/**
 * Remove dependencies from a project.
 *
 * The files are deleted first and the records updated afterwards, so a failure
 * while deleting cannot leave the manifest claiming a dependency that is still
 * on disk in full.
 *
 * The plan is returned so a caller that installs afterwards can start from the
 * state the removal left: the plugin list it computed is the one the server
 * should be given, and a plugin renamed between releases would otherwise stay
 * listed while its file is gone.
 */
export async function removeDeps(
  deps?: string[],
  options: RemovalOptions = {},
): Promise<RemovalPlan | null> {
  if (!deps?.length) return null;

  const start = Date.now();
  const { keep = [], record = true, quiet = false } = options;

  const plan = await planRemoval(deps, { keep });
  if (!plan) return null;

  await applyRemoval(plan, record);

  if (!quiet) {
    const plural = deps.length === 1 ? "dependency" : "dependencies";
    console.log(`removed ${deps.length} ${plural} in ${elapsed(start)}s`);
  }

  return plan;
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
 *
 * open.mp is the server the others run inside, so it is installed first and
 * removed last; the rest keep the order the user gave.
 *
 * Only the name decides which entry is meant: an install list carries
 * `owner/repo@^1.6.7` while a removal list carries the bare `owner/repo`, and
 * comparing whole entries matched neither. The version suffix is carried along
 * with the entry rather than rebuilt, so nothing has to know its shape.
 */
export function moveDependency(deps: string[], name: string, where: "first" | "last") {
  const next = deps.slice();
  const index = next.findIndex((dep) => dep.split("@")[0] === name);
  if (index === -1) return next;

  const [entry] = next.splice(index, 1);
  if (where === "first") next.unshift(entry);
  else next.push(entry);

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
