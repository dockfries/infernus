import path from "node:path";
import { createHash } from "node:crypto";
import { select } from "@inquirer/prompts";
// @ts-expect-error no types package
import decompress from "@xhmikosr/decompress";
import fs from "fs-extra";
import fg from "fast-glob";
import { downloadFile } from "./api";
import { GLOBAL_DEPS_PATH } from "./config";
import { ompRepository, isWindows } from "../constants";

/** the file that has to exist after unpacking, per platform */
const SERVER_BINARY = isWindows ? "omp-server.exe" : "omp-server";

/** records what the last install put into the project, kept beside the build */
const OMP_MANIFEST_NAME = "infernus-install.json";

/** project files an open.mp install must never touch, whatever else changes */
const OMP_USER_FILE_PATTERNS = ["config.json", "bans.json", "gamemodes/**"];

/**
 * The asset to unpack for this platform.
 *
 * A tag can carry several assets, so the ending decides rather than
 * `path.extname`, which reports `.gz` for the linux `.tar.gz` archives.
 */
function pickAssets(release: any) {
  return release.assets.filter((asset: any) =>
    isWindows ? asset.name.endsWith(".zip") : asset.name.endsWith(".tar.gz"),
  );
}

function assetSuffix(name: string) {
  if (name.endsWith(".tar.gz")) return ".tar.gz";
  return path.extname(name);
}

/**
 * Unpack the downloaded server and make sure it actually holds a server.
 *
 * Without the check a changed archive layout leaves an empty cache directory
 * that every later install happily copies nothing out of.
 */
async function unpackServer(archivePath: string, targetPath: string) {
  const stripped = path.resolve(targetPath, "..", `${path.basename(targetPath)}.tmp-strip`);
  const plain = path.resolve(targetPath, "..", `${path.basename(targetPath)}.tmp-plain`);

  // Some releases wrap everything in a single top level directory and some do
  // not, so both layouts are tried instead of hardcoding `strip: 1`.
  for (const [dir, options] of [
    [stripped, { strip: 1 }],
    [plain, {}],
  ] as const) {
    await fs.remove(dir);
    await fs.ensureDir(dir);
    await decompress(archivePath, dir, options);

    if (fs.existsSync(path.resolve(dir, SERVER_BINARY))) {
      await fs.remove(targetPath);
      await fs.move(dir, targetPath);
      await fs.remove(dir === stripped ? plain : stripped);
      return;
    }
    await fs.remove(dir);
  }

  throw new Error(
    `the downloaded archive does not contain ${SERVER_BINARY}, so it was not installed; ` +
      `please report this at https://github.com/dockfries/infernus/issues`,
  );
}

async function hashFile(file: string) {
  return createHash("sha256")
    .update(await fs.readFile(file))
    .digest("hex");
}

export interface InstallManifest {
  tag: string;
  files: Record<string, { size: number; sha256: string }>;
}

/** where the record of the last install of a build lives, beside the build */
function manifestPathFor(buildDir: string) {
  return path.resolve(buildDir, OMP_MANIFEST_NAME);
}

/**
 * Manifests read during this run.
 *
 * An upgrade has to know what the last install put into the project *before* it
 * unpacks the build it is installing, and unpacking replaces that directory, so
 * the value is held here rather than read from disk a second time.
 */
const manifestCache = new Map<string, InstallManifest>();

async function readInstallManifest(buildDir: string): Promise<InstallManifest | null> {
  const cached = manifestCache.get(buildDir);
  if (cached) return cached;

  try {
    const manifest = (await fs.readJson(manifestPathFor(buildDir))) as InstallManifest;
    // a manifest describing a different build cannot say anything about this one
    if (!manifest?.files || manifest.tag !== path.basename(buildDir)) return null;

    manifestCache.set(buildDir, manifest);
    return manifest;
  } catch {
    return null;
  }
}

async function writeInstallManifest(buildDir: string, manifest: InstallManifest) {
  manifestCache.set(buildDir, manifest);
  await fs.writeJson(manifestPathFor(buildDir), manifest, { spaces: 2 });
}

/**
 * Every file the build ships, with the hash of its content.
 *
 * The manifest is what lets a later upgrade tell "this file is ours, from an
 * older build" apart from "the project edited this file" without guessing from
 * sizes.
 */
async function listShippedFiles(root: string) {
  const files = await fg("**", { cwd: root, dot: true, onlyFiles: true });
  const entries = await Promise.all(
    files
      .filter((file) => file !== OMP_MANIFEST_NAME)
      .map(async (file) => {
        const absolute = path.resolve(root, file);
        return [
          file,
          { size: (await fs.stat(absolute)).size, sha256: await hashFile(absolute) },
        ] as const;
      }),
  );

  return new Map(entries);
}

export interface CopyServerOptions {
  /** directory holding the freshly unpacked server */
  source: string;
  /** where the server is installed, usually the project root */
  target: string;
  /** the previously installed build, whose manifest records what it had shipped */
  previousPath?: string | null;
  /** the build being installed, where the new manifest is recorded */
  buildDir?: string | null;
  verbose?: boolean;
}

export interface CopyServerResult {
  written: string[];
  kept: string[];
  unchanged: string[];
}

export type FileAction = "install" | "overwrite" | "keep" | "current";

/**
 * Decide what to do with one shipped file.
 *
 * The decision is pure so it can be tested on its own: a missing file is
 * installed, a file the project owns is kept, a file whose content already
 * matches is current, and a file the project edited is kept rather than
 * replaced. Whether the project edited it is answered with the manifest of the
 * last install, falling back to the content of the build that was installed
 * before. With neither reference there is no way to tell an edit from an older
 * build, and a server only replaces what it can prove it owns.
 */
export function decideFileAction(input: {
  /** the file is one of the ones a running server owns */
  isUserFile: boolean;
  /** what is in the project now, or null when the file is not installed */
  installed: { size: number; sha256: string } | null;
  /** what the shipped build has */
  shipped: { size: number; sha256: string };
  /** the content the last install, or the previous build, recorded for this file */
  previouslyInstalled?: { size: number; sha256: string };
}): FileAction {
  const { isUserFile, installed, shipped, previouslyInstalled } = input;

  if (!installed) return "install";
  if (isUserFile) return "keep";

  // Byte equality decides first: when the project already holds exactly what is
  // being installed there is nothing to write, whatever the history says.
  if (installed.sha256 === shipped.sha256) return "current";

  if (!previouslyInstalled) return "keep";

  return installed.sha256 === previouslyInstalled.sha256 ? "overwrite" : "keep";
}

/**
 * Copy an unpacked server into a project.
 *
 * A missing file is installed, a file already identical is left alone, and a
 * file the project edited is kept. Whether a file was edited is answered by the
 * manifest of the last install, or by the content of the build installed before
 * that. With neither reference a file is kept rather than replaced: a server
 * only overwrites what it can prove it owns, and the files of a running server
 * are never touched at all.
 */
export async function copyServer(options: CopyServerOptions): Promise<CopyServerResult> {
  const {
    source,
    target: targetRoot,
    previousPath = null,
    buildDir = null,
    verbose = false,
  } = options;

  const shipped = await listShippedFiles(source);
  const manifest = previousPath ? await readInstallManifest(previousPath) : null;
  // the build installed before is the reference until a manifest exists, and its
  // content answers the same question the manifest does
  const previous =
    previousPath && fs.existsSync(previousPath) ? await listShippedFiles(previousPath) : null;
  const userFiles = new Set(await fg(OMP_USER_FILE_PATTERNS, { cwd: source, dot: true }));

  const written: string[] = [];
  const kept: string[] = [];
  const unchanged: string[] = [];
  const installed: InstallManifest["files"] = {};

  for (const [file, shippedFile] of shipped) {
    const from = path.resolve(source, file);
    const to = path.resolve(targetRoot, file);

    // The manifest is the primary reference, the previous build the fallback.
    const reference = manifest?.files[file] ?? previous?.get(file);

    const installedFile = fs.existsSync(to)
      ? { size: (await fs.stat(to)).size, sha256: await hashFile(to) }
      : null;

    const action = decideFileAction({
      isUserFile: userFiles.has(file),
      installed: installedFile,
      shipped: shippedFile,
      previouslyInstalled: reference,
    });

    if (action === "install") {
      await fs.ensureDir(path.dirname(to));
      await fs.copy(from, to);
      written.push(file);
      installed[file] = shippedFile;
    } else if (action === "overwrite") {
      await fs.copy(from, to, { overwrite: true });
      written.push(file);
      installed[file] = shippedFile;
    } else if (action === "current") {
      unchanged.push(file);
      installed[file] = shippedFile;
    } else {
      kept.push(file);
      // describe the file as the project has it, so the next upgrade recognises
      // it as edited again rather than falling back to guessing
      installed[file] = installedFile ?? shippedFile;
    }
  }

  const summary = [`${written.length} written`];
  if (unchanged.length) summary.push(`${unchanged.length} already current`);
  if (kept.length) summary.push(`${kept.length} kept (modified by this project)`);
  console.log(`open.mp files: ${summary.join(", ")}`);

  if (verbose) {
    if (written.length) console.log(`  written:   ${written.join(", ")}`);
    if (unchanged.length) console.log(`  current:   ${unchanged.join(", ")}`);
    if (kept.length) console.log(`  kept:      ${kept.join(", ")}`);
  }

  if (buildDir) {
    await writeInstallManifest(buildDir, { tag: path.basename(buildDir), files: installed });
  }

  return { written, kept, unchanged };
}

export async function addOpenMp(
  versionOrRelease: any,
  isRemote: boolean,
  previousTag: string | null = null,
  verbose = false,
) {
  let globalOmpPath: string;

  if (isRemote) {
    const release = versionOrRelease;
    const version = release.tag_name;
    globalOmpPath = path.resolve(GLOBAL_DEPS_PATH, ompRepository, version);

    // The cache answers before the network does: a build that is already
    // unpacked only needs its files copied into the project. Downloading again
    // would also throw away the install manifest kept beside it, which is what
    // an upgrade uses to tell an untouched file from an edited one.
    const alreadyUnpacked = fs.existsSync(path.resolve(globalOmpPath, SERVER_BINARY));

    if (!alreadyUnpacked) {
      await fs.ensureDir(globalOmpPath);

      const assetsByEnv = pickAssets(release);

      const choices = assetsByEnv.map((asset: any, idx: number) => {
        return {
          name: asset.name,
          short: asset.version || "default",
          value: idx,
        };
      });

      if (!choices.length) {
        throw new Error(
          `${ompRepository} ${version} has no ${isWindows ? ".zip" : ".tar.gz"} asset for this platform; ` +
            `available assets: ${release.assets.map((asset: any) => asset.name).join(", ") || "none"}`,
        );
      }

      const selectedAssetIdx =
        assetsByEnv.length > 1
          ? ((await select({
              message: "Please select one open.mp asset",
              choices,
              default: 0,
            })) as number)
          : 0;

      const assetByEnv = assetsByEnv[selectedAssetIdx];

      const downloadOmpPath = globalOmpPath + assetSuffix(assetByEnv.name);

      console.log(`download dep: ${ompRepository} ${version}`);
      const ompTmpPath = await downloadFile(assetByEnv.browser_download_url, downloadOmpPath, 0, {
        digest: assetByEnv.digest,
        expectedSize: assetByEnv.size,
      });
      await unpackServer(ompTmpPath, globalOmpPath);
      await fs.remove(ompTmpPath);
    } else {
      console.log(`unpacked open.mp ${version} found in the cache`);
    }
  } else {
    const version = versionOrRelease;
    globalOmpPath = path.resolve(GLOBAL_DEPS_PATH, ompRepository, version);
  }

  if (!fs.existsSync(globalOmpPath)) {
    throw new Error(`the open.mp cache for ${path.basename(globalOmpPath)} does not exist`);
  }

  // a cache entry without the server binary is worse than no cache entry: every
  // later install would copy nothing and still call itself a success
  if (!fs.existsSync(path.resolve(globalOmpPath, SERVER_BINARY))) {
    throw new Error(
      `the cached open.mp build ${path.basename(globalOmpPath)} has no ${SERVER_BINARY}; ` +
        `run \`infernus clean openmultiplayer/open.mp\` and install it again`,
    );
  }

  const previousPath = previousTag
    ? path.resolve(GLOBAL_DEPS_PATH, ompRepository, previousTag)
    : null;

  // read before anything is unpacked, since unpacking replaces the directory
  if (previousPath) await readInstallManifest(previousPath);

  await copyServer({
    source: globalOmpPath,
    target: process.cwd(),
    previousPath,
    buildDir: globalOmpPath,
    verbose,
  });
}

export async function removeOpenMp(globalPath: string) {
  if (!globalPath.includes(GLOBAL_DEPS_PATH)) {
    throw new Error("Due to security policy, your path may be redirected to a non-cached path!");
  }
  const files = await fg("**", {
    cwd: globalPath,
    ignore: [...OMP_USER_FILE_PATTERNS, OMP_MANIFEST_NAME],
  });
  return Promise.all(
    files.map((file) => {
      return fs.remove(path.resolve(process.cwd(), file));
    }),
  );
}
