import fs from "fs-extra";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createZip } from "./zip";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const cacheRoot = path.resolve(os.homedir(), ".infernus", "dependencies");

/** the full tag list openmultiplayer/open.mp publishes, newest first */
export const OMP_TAGS = [
  "v1.6.7.3218",
  "v1.6.7.3217",
  "v1.5.8.3079",
  "v1.4.0.2779",
  "v1.1.0.2612",
  "v1-RC2",
];

/** the build the sandbox project starts from */
export const OLD_TAG = "v1.5.8.3079";
/** the build an update to `^1.6.7` has to arrive at */
export const NEW_TAG = "v1.6.7.3218";
/** the build sitting in the cache to prove it is not mistaken for the new one */
export const OTHER_TAG = "v1.6.7.3217";

export function writeJson(file: string, value: unknown) {
  fs.ensureDirSync(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

/** fill a directory with files, keyed by path relative to it */
export function writeFiles(root: string, files: Record<string, string>) {
  for (const [name, content] of Object.entries(files)) {
    const target = path.resolve(root, name);
    fs.ensureDirSync(path.dirname(target));
    fs.writeFileSync(target, content);
  }
}

export interface FixtureRepo {
  /** owner/repo */
  name: string;
  tags: string[];
  /**
   * How a release archive is laid out. open.mp ships one top level directory and
   * a server binary; a plugin repository ships a flat archive with a pawn.json.
   */
  layout: "openmp" | "pawn";
}

export const OMP_REPO: FixtureRepo = {
  name: "openmultiplayer/open.mp",
  tags: OMP_TAGS,
  layout: "openmp",
};

/** the tags dockfries/samp-node really publishes: three segments, no `v` */
export const SAMP_NODE_REPO: FixtureRepo = {
  name: "dockfries/samp-node",
  tags: ["2.8.1", "2.7.1", "2.6.1"],
  layout: "pawn",
};

function archiveFor(repo: FixtureRepo, tag: string) {
  if (repo.layout === "openmp") {
    // one top level directory, the layout open.mp uses and the reason the
    // unpacking code has to strip it
    return createZip([
      { name: "open.mp-win-x86/omp-server.exe", content: Buffer.from(`server ${tag}`) },
      { name: "open.mp-win-x86/libnode.dll", content: Buffer.from(`lib ${tag}`) },
      { name: "open.mp-win-x86/config.json", content: Buffer.from("default config") },
      { name: "open.mp-win-x86/bans.json", content: Buffer.from("[]") },
    ]);
  }

  const pawnJson = {
    resources: [
      {
        name: "samp-node.so",
        platform: "linux",
        version: "0.3.7",
        archive: false,
      },
      {
        name: "samp-node.dll",
        platform: "windows",
        version: "0.3.7",
        archive: false,
      },
    ],
  };

  return createZip([
    { name: "pawn.json", content: Buffer.from(JSON.stringify(pawnJson, null, 2)) },
    { name: "samp-node.dll", content: Buffer.from(`dll ${tag}`) },
    { name: "samp-node.so", content: Buffer.from(`so ${tag}`) },
    { name: `samp-node-${tag}.inc`, content: Buffer.from(`inc ${tag}`) },
  ]);
}

/**
 * A GitHub API stand in that serves tags as releases with real (stored) zip
 * assets, so the whole download and unpack path can run without network access.
 */
export async function startReleaseServer(repos: FixtureRepo[] = [OMP_REPO]) {
  const assets = new Map<string, Buffer>();
  for (const repo of repos) {
    for (const tag of repo.tags) {
      assets.set(`${repo.name}@${tag}`, archiveFor(repo, tag));
    }
  }

  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const releasesMatch = /^\/repos\/([^/]+\/[^/]+)\/releases$/.exec(url.pathname);

    if (releasesMatch) {
      const repo = repos.find((item) => item.name === releasesMatch[1]);
      if (!repo) {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Not Found" }));
        return;
      }

      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify(
          repo.tags.map((tag) => ({
            tag_name: tag,
            name: tag,
            draft: false,
            prerelease: false,
            assets: [
              {
                name: `${repo.name.split("/")[1]}-${tag}.zip`,
                size: assets.get(`${repo.name}@${tag}`)!.length,
                browser_download_url: `${baseUrl}/downloads/${repo.name}@${tag}.zip`,
              },
            ],
          })),
        ),
      );
      return;
    }

    if (url.pathname.startsWith("/downloads/")) {
      const body = assets.get(url.pathname.slice("/downloads/".length).replace(/\.zip$/, ""));
      if (!body) {
        res.writeHead(404).end("no such asset");
        return;
      }
      res.writeHead(200, { "content-type": "application/zip" });
      res.end(body);
      return;
    }

    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  const baseUrl = `http://127.0.0.1:${port}`;

  return {
    baseUrl,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

export interface SandboxOptions {
  /** versions of open.mp to preload into the shared dependency cache */
  cachedTags?: string[];
  /** the version the lockfile pins and the project files were installed from */
  installedTag?: string;
  /**
   * The version whose cache counts as the previous install, which is the
   * reference an upgrade uses to tell an untouched file from an edited one. A
   * real project always has it, since installing a build fills the cache.
   */
  referenceTag?: string | null;
  /** files the project itself edited, to prove an upgrade keeps them */
  projectOverrides?: Record<string, string>;
}

/**
 * A throwaway project plus a warm open.mp cache, so the CLI can be exercised
 * without network access.
 *
 * The cache is shared with the real CLI on purpose: `addOpenMp` resolves it
 * through `GLOBAL_DEPS_PATH`. Every version this writes is removed again by
 * `cleanupSandbox`.
 */
export function createSandbox(options: SandboxOptions = {}) {
  const {
    cachedTags = [OLD_TAG, OTHER_TAG],
    installedTag = OLD_TAG,
    referenceTag = installedTag,
    projectOverrides = {},
  } = options;

  const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), "infernus-sandbox-"));
  const cacheDir = path.resolve(cacheRoot, "openmultiplayer", "open.mp");
  const createdCaches: string[] = [];

  /** what a build of this tag ships, the same content the fixture server serves */
  const buildFiles = (tag: string) => ({
    "omp-server.exe": `server ${tag}`,
    "libnode.dll": `lib ${tag}`,
    "config.json": "default config",
    "bans.json": "[]",
  });

  for (const tag of cachedTags) {
    const dir = path.resolve(cacheDir, tag);
    if (fs.existsSync(dir)) continue;
    writeFiles(dir, buildFiles(tag));
    createdCaches.push(dir);
  }

  // what the previous install left in the project
  writeFiles(projectDir, {
    ...buildFiles(referenceTag ?? installedTag),
    ...projectOverrides,
  });

  if (!projectOverrides["config.json"]) {
    writeJson(path.resolve(projectDir, "config.json"), {
      name: "my server",
      max_players: 50,
      pawn: { legacy_plugins: [] },
    });
  }

  writeJson(path.resolve(projectDir, "infernus.json"), {
    dependencies: { "openmultiplayer/open.mp": "^1.5.8" },
  });
  writeJson(path.resolve(projectDir, "infernus-lock.json"), {
    lockfileVersion: 1,
    dependencies: { "openmultiplayer/open.mp": { version: installedTag } },
  });

  return {
    projectDir,
    cacheDir,
    entry: path.resolve(packageRoot, "dist", "bundle.js"),
    read(name: string) {
      return fs.readFileSync(path.resolve(projectDir, name), "utf8");
    },
    readJson(name: string) {
      return fs.readJsonSync(path.resolve(projectDir, name));
    },
    cachedTagDirs() {
      return fs.existsSync(cacheDir) ? fs.readdirSync(cacheDir).sort() : [];
    },
    cleanup() {
      fs.removeSync(projectDir);
      for (const dir of createdCaches) fs.removeSync(dir);
    },
  };
}

/** run the built CLI inside a sandbox project and capture what it printed */
export async function runCli(
  projectDir: string,
  args: string[],
  entry: string,
  env: Record<string, string> = {},
): Promise<{ code: number; output: string }> {
  const { execa } = await import("execa");

  try {
    const result = await execa("node", [entry, ...args], {
      cwd: projectDir,
      env: {
        NO_COLOR: "1",
        INFERNUS_QUIET_PROGRESS: "1",
        PATH: process.env.PATH,
        ...env,
      },
      reject: false,
    });
    return { code: result.exitCode ?? 0, output: `${result.stdout}\n${result.stderr}` };
  } catch (error: any) {
    return { code: 1, output: `${error.stdout ?? ""}\n${error.stderr ?? ""}\n${error.message}` };
  }
}
