import path from "node:path";
// @ts-expect-error no types package
import decompress from "@xhmikosr/decompress";
import fs from "fs-extra";
import fg from "fast-glob";
import { select } from "@inquirer/prompts";
import { assetMatchesPattern, isIncludeAsset, isPluginAsset } from "./asset";
import { downloadFile } from "./api";
import {
  GLOBAL_DEPS_PATH,
  readLockFile,
  readOmpConfig,
  writeLockFile,
  writeOmpConfig,
} from "./config";
import { addOpenMp } from "./omp";
import { getIncludePath, getPawnJson, getPlugOrCompPath } from "./pawn";
import { ompRepository, isWindows } from "../constants";
import type { DependencyPlan } from "./plan";
import type { LockFileContent, PawnJsonResources } from "../types";

export interface InstallOptions {
  /** keep only what the server needs to run, so include files are skipped */
  isProd?: boolean;
  /** install into components/ instead of plugins/ */
  isComponent?: boolean;
  /** reproduce the lockfile instead of updating it */
  frozen?: boolean;
  /** print every cache and release decision */
  verbose?: boolean;
}

/**
 * Put resolved dependencies into the project.
 *
 * The lockfile and the server config are written once, at the end, from what was
 * actually placed, so nothing is recorded for a dependency whose files did not
 * arrive. The legacy plugin list is likewise assembled in full before it is
 * written, rather than being left in whatever state the last dependency produced.
 */
export class DependencyInstaller {
  private readonly verbose: boolean;
  private readonly isProd: boolean;
  private readonly forceComponent: boolean;
  private readonly frozen: boolean;

  private lockFile!: LockFileContent;
  private ompConfig!: any;
  private includePath!: string;

  /** what this run installed, merged into the lockfile at the end */
  private readonly installed: Record<string, { version: string; component: boolean }> = {};
  private readonly legacyPlugins = new Set<string>();

  constructor(options: InstallOptions = {}) {
    this.verbose = !!options.verbose;
    this.isProd = !!options.isProd;
    this.forceComponent = !!options.isComponent;
    this.frozen = !!options.frozen;
  }

  static async create(options: InstallOptions = {}) {
    const installer = new DependencyInstaller(options);
    await installer.load();
    return installer;
  }

  /** read the state this install is applied on top of */
  private async load() {
    this.lockFile = (await readLockFile()) ?? { lockfileVersion: 1.0 };
    this.ompConfig = (await readOmpConfig()) ?? {};

    this.ompConfig.pawn = { ...(this.ompConfig.pawn ?? {}) };
    const existing: string[] = this.ompConfig.pawn.legacy_plugins ?? [];
    this.ompConfig.pawn.legacy_plugins = [...existing];

    for (const plugin of existing) this.legacyPlugins.add(plugin);

    this.includePath = await getIncludePath();
  }

  /** the version a previous run left behind */
  previousVersion(name: string) {
    return this.lockFile.dependencies?.[name]?.version;
  }

  /**
   * Whether a dependency installs as a component.
   *
   * Asking for `--component` installs everything that way, and a dependency
   * already recorded as one stays one, so its files keep going to the folder
   * they were first placed in.
   */
  isComponent(name: string) {
    return this.forceComponent || !!this.lockFile.dependencies?.[name]?.component;
  }

  /**
   * Place one resolved dependency and everything it declares.
   *
   * @throws {Error} when the dependency declares no resources, or an asset its
   * release does not publish
   */
  async materialize(plan: DependencyPlan) {
    if (plan.name === ompRepository) {
      await this.materializeOpenMp(plan);
      return;
    }

    await this.materializeDependency(plan);
  }

  private async materializeOpenMp(plan: DependencyPlan) {
    this.installed[plan.name] = { version: plan.finalVersion, component: false };

    if (plan.cachedTag) {
      console.log(`local cache found: ${plan.name} ${plan.cachedTag}`);
      await addOpenMp(plan.cachedTag, false, this.previousVersion(plan.name) ?? null, this.verbose);
      return;
    }

    // An update of a version that is already installed drops that build so the
    // release is fetched again, which is what the dry run promises. It has to go
    // before the install: addOpenMp would otherwise find it unpacked, skip the
    // download, and the removal afterwards would delete the build that was just
    // recorded in the lockfile. Only its own build is ever dropped.
    const replaceable =
      plan.cache.dropTag && plan.cache.dropTag !== plan.finalVersion
        ? path.resolve(GLOBAL_DEPS_PATH, plan.name, plan.cache.dropTag)
        : null;

    if (replaceable) await fs.remove(replaceable);

    // the previous build is the reference telling an upgraded server file apart
    // from one the project modified, so it is dropped only after its manifest
    // has been used
    await addOpenMp(
      plan.matchedRelease,
      true,
      this.previousVersion(plan.name) ?? null,
      this.verbose,
    );
  }

  private async materializeDependency(plan: DependencyPlan) {
    const [owner, repo] = plan.name.split("/");

    if (plan.cachedTag) console.log(`local cache found: ${plan.name} ${plan.cachedTag}`);

    const pawnJson = await getPawnJson(owner, repo, plan.cachedTag ?? plan.matchedRelease.tag_name);

    if (!pawnJson?.resources?.length) {
      throw new Error(`not found resources in pawn.json: ${plan.name}`);
    }

    // the declaration is cached beside the build, so a later install reads it
    // from disk instead of asking the repository again
    await fs.outputJson(path.resolve(plan.versionPath, "pawn.json"), pawnJson, { spaces: 2 });

    const resources = pawnJson.resources.filter((resource) =>
      isWindows ? resource.platform === "windows" : resource.platform === "linux",
    );

    // Recording a dependency whose resources are all for another platform would
    // claim an install that placed nothing, and the server would silently lack
    // the plugin it was told about.
    if (!resources.length) {
      const platforms = [...new Set(pawnJson.resources.map((resource) => resource.platform))];
      throw new Error(
        `${plan.name}@${plan.finalVersion} has no ${isWindows ? "windows" : "linux"} resource; ` +
          `it only declares: ${platforms.join(", ") || "none"}`,
      );
    }

    const pluginFolder = getPlugOrCompPath(plan.component);

    await this.placeArchive(plan, resources, pluginFolder);
    await this.placeLooseAssets(plan, resources, pluginFolder);

    this.installed[plan.name] = { version: plan.finalVersion, component: plan.component };
  }

  /** an archive carries the plugins, includes and extra files it declares */
  private async placeArchive(
    plan: DependencyPlan,
    resources: PawnJsonResources[],
    pluginFolder: string,
  ) {
    const archives = resources.filter((resource) => resource.archive);
    if (!archives.length) return;

    const resource = await this.selectArchive(plan, archives);

    if (!plan.cachedTag) {
      await this.downloadArchive(plan, resource);
    }

    if (resource.plugins) {
      // resolved before the folder is created, so a refused pattern cannot leave
      // an empty plugins/ directory behind
      const plugins = await globInside(plan.versionPath, resource.plugins);

      if (plugins.length) {
        await fs.ensureDir(pluginFolder);

        for (const plugin of plugins) {
          await fs.copy(plugin, path.resolve(pluginFolder, path.basename(plugin)));

          if (!plan.component) {
            this.legacyPlugins.add(path.basename(plugin, path.extname(plugin)));
          }
        }
      }
    }

    if (!this.isProd) await this.placeIncludes(plan, resource);
    if (resource.files) await this.placeExtraFiles(plan, resource);
  }

  /** the user chooses when one platform offers several archives */
  private async selectArchive(plan: DependencyPlan, archives: PawnJsonResources[]) {
    if (plan.cachedTag || archives.length === 1) return archives[0];

    const selected = await select<number>({
      message: "Multiple archive resources found, please select one",
      choices: archives.map((resource, idx) => ({
        name: resource.name,
        short: resource.version || "default",
        value: idx,
      })),
      default: 0,
    });

    return archives[selected];
  }

  private async downloadArchive(plan: DependencyPlan, resource: PawnJsonResources) {
    const assets = plan.matchedRelease.assets.filter((asset: any) =>
      assetMatchesPattern(resource.name, asset.name),
    );

    if (!assets.length) {
      throw new Error(
        `Unable to match asset ${resource.name} in dependency ${plan.name}@${plan.requested} \n` +
          ` — available assets: \n` +
          `${plan.matchedRelease.assets.map((asset: any) => asset.name).join("\n")}`,
      );
    }

    // the index addresses the assets that were offered, not the resources
    const asset =
      assets.length > 1
        ? assets[
            await select<number>({
              message: "Multiple assets found, please select one",
              choices: assets.map((item: any, idx: number) => ({ name: item.name, value: idx })),
              default: 0,
            })
          ]
        : assets[0];

    console.log(`download dep: ${asset.name} ${plan.matchedRelease.tag_name}`);

    // A marker while the archive is being fetched and unpacked. A version
    // directory that holds a pawn.json and an un-unpacked archive otherwise
    // looks like a finished build, so the next run would reuse it, place nothing
    // and still report success. Left behind on failure, removed on success —
    // `cleanGlobalDeps` keys on it to discard an incomplete cache.
    const marker = path.resolve(plan.versionPath, "empty.tmp");
    await fs.ensureFile(marker);

    const archivePath = await downloadFile(
      asset.browser_download_url,
      path.resolve(plan.versionPath, asset.name),
      0,
      { digest: asset.digest, expectedSize: asset.size },
    );

    await decompress(archivePath, plan.versionPath);
    await fs.remove(archivePath);
    await fs.remove(marker);
  }

  private async placeIncludes(plan: DependencyPlan, resource: PawnJsonResources) {
    const patterns = resource.includes?.length
      ? resource.includes.map((include) => (path.extname(include) ? include : `${include}/*.inc`))
      : ["*.inc"];

    const includes = await globInside(plan.versionPath, patterns);
    if (!includes.length) return;

    await fs.ensureDir(this.includePath);

    for (const include of includes) {
      await fs.copy(include, path.resolve(this.includePath, path.basename(include)));
    }
  }

  private async placeExtraFiles(plan: DependencyPlan, resource: PawnJsonResources) {
    for (const [pattern, destination] of Object.entries(resource.files)) {
      const target = assertInside(process.cwd(), destination, "file destination");
      const matches = await globInside(plan.versionPath, pattern);
      if (!matches.length) continue;

      // A pattern may name several files. The destination is a directory when it
      // already is one, and otherwise a file only when a single match has to
      // land there; anything else would drop matches without saying so.
      const isDirectory =
        matches.length > 1 ||
        (await fs.stat(target).then(
          (stats) => stats.isDirectory(),
          () => false,
        ));

      for (const match of matches) {
        const to = isDirectory ? path.resolve(target, path.basename(match)) : target;
        await fs.ensureDir(path.dirname(to));
        await fs.copy(match, to, { overwrite: true });
      }
    }
  }

  /** a resource without an archive publishes its files as loose release assets */
  private async placeLooseAssets(
    plan: DependencyPlan,
    resources: PawnJsonResources[],
    pluginFolder: string,
  ) {
    const loose = resources.filter((resource) => !resource.archive);
    if (!loose.length) return;

    if (plan.cachedTag) {
      // The assets live in the dependency's cache directory, so that is where
      // they are read from. Searching the project instead finds either nothing on
      // a first install, or the copies already placed there, which would then be
      // copied onto themselves.
      const cached = await globInside(
        plan.versionPath,
        loose.map((resource) => resource.name),
      );

      for (const asset of cached) {
        await this.placeAsset(asset, pluginFolder, plan.component);
      }
      return;
    }

    const names = loose.map((resource) => resource.name);
    const assets = plan.matchedRelease.assets.filter((asset: any) => names.includes(asset.name));
    if (!assets.length) return;

    // A marker left behind only when the transfer failed, so the next install
    // recognises the directory as an incomplete cache and fetches it again
    // instead of placing the assets that happen to be there. It must outlive a
    // failure, so it is removed after the loop rather than in a `finally`.
    const marker = path.resolve(plan.versionPath, "empty.tmp");
    await fs.ensureFile(marker);

    for (const asset of assets) {
      console.log(`download dep: ${asset.name} ${plan.matchedRelease.tag_name}`);

      const assetPath = await downloadFile(
        asset.browser_download_url,
        path.resolve(plan.versionPath, asset.name),
        0,
        { digest: asset.digest, expectedSize: asset.size },
      );

      await this.placeAsset(assetPath, pluginFolder, plan.component);
    }

    await fs.remove(marker);
  }

  private async placeAsset(assetPath: string, pluginFolder: string, isComponent: boolean) {
    const name = path.basename(assetPath);

    if (isIncludeAsset(name)) {
      if (this.isProd) return;

      await fs.ensureDir(this.includePath);
      await fs.copy(assetPath, path.resolve(this.includePath, name));
      return;
    }

    if (isPluginAsset(name)) {
      await fs.ensureDir(pluginFolder);
      await fs.copy(assetPath, path.resolve(pluginFolder, name));

      // a component is loaded by the script that asked for it, so listing it as
      // a legacy plugin would have the server look for it under plugins/ too
      if (!isComponent) {
        this.legacyPlugins.add(path.basename(name, path.extname(name)));
      }
    }
  }

  /** write the lockfile and the server config, once, after everything landed */
  async record() {
    // the server loads last, whatever order the dependencies were installed in
    this.ompConfig.pawn.legacy_plugins = moveToLast([...this.legacyPlugins], "samp-node");

    this.lockFile.dependencies = { ...(this.lockFile.dependencies ?? {}), ...this.installed };

    // A frozen install reproduces the lockfile rather than producing it, so the
    // file must come out byte for byte as it went in: rewriting it would change
    // a file the caller asked not to be changed (and would add the schema
    // reference to a lockfile that was written by hand).
    await writeOmpConfig(this.ompConfig);
    if (!this.frozen) await writeLockFile(this.lockFile);
  }
}

/**
 * Glob inside `root`, refusing patterns that reach outside it.
 *
 * Every pattern here comes from a dependency's `pawn.json`, so none of them are
 * trusted to stay in their own build directory.
 *
 * @throws {Error} when a pattern resolves outside `root`
 */
async function globInside(root: string, patterns: string | string[]) {
  for (const pattern of [patterns].flat()) {
    assertInside(root, pattern, "glob pattern");
  }

  return fg.glob(patterns, { absolute: true, cwd: root });
}

/** put `name` at the end of a list, keeping the rest in order */
function moveToLast(items: string[], name: string) {
  const index = items.indexOf(name);
  if (index === -1) return items;

  items.splice(index, 1);
  items.push(name);
  return items;
}

/**
 * Refuse a declaration that would reach outside the directory it belongs to.
 *
 * A `pawn.json` comes from someone else's repository, and its values are used as
 * glob patterns and as a destination to write to. An absolute pattern, a `..`
 * segment or an absolute destination would let a dependency read files from
 * anywhere on the machine and write anywhere the user can, so each is rejected
 * before it is used. `path.resolve` is what makes the check meaningful: it
 * collapses `..` first, and the result is then compared against the root.
 *
 * @throws {Error} when the value resolves outside `root`
 */
function assertInside(root: string, value: string, what: string) {
  const target = path.resolve(root, value);
  const relative = path.relative(root, target);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(
      `refusing to use ${what} ${JSON.stringify(value)}: it resolves outside ${root}`,
    );
  }

  return target;
}
