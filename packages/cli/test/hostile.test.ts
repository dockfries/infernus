import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { addDeps, cleanGlobalDeps, removeDeps } from "../src/utils/dep";
import { createZip } from "./fixtures/zip";

/**
 * A dependency's `pawn.json` is someone else's content, and its values become
 * paths: glob patterns to find files, destinations to write them to, and delete
 * targets during removal. None of it may reach outside the project, and an
 * install that cannot place anything must say so rather than report success.
 */
describe("hostile or broken dependency declarations", () => {
  const cwd = process.cwd();
  const workspace = path.resolve(os.tmpdir(), "infernus-hostile");
  const cacheRoot = path.resolve(os.homedir(), ".infernus", "dependencies");
  let server: http.Server;
  let baseUrl: string;

  /** what the fixture server answers with, per test */
  let declaration: any = null;
  let archiveEntries: { name: string; content: string }[] = [];

  before(async () => {
    server = http.createServer((req, res) => {
      const url = req.url ?? "/";

      if (url.includes("/releases")) {
        const body = createZip(
          archiveEntries.map((entry) => ({
            name: entry.name,
            content: Buffer.from(entry.content),
          })),
        );
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify([
            {
              tag_name: "1.0.0",
              name: "1.0.0",
              draft: false,
              prerelease: false,
              assets: [
                {
                  name: "plugin.zip",
                  size: body.length,
                  browser_download_url: `${baseUrl}/downloads/plugin.zip`,
                },
              ],
            },
          ]),
        );
        return;
      }

      if (url === "/downloads/plugin.zip") {
        const body = createZip(
          archiveEntries.map((entry) => ({
            name: entry.name,
            content: Buffer.from(entry.content),
          })),
        );
        res.writeHead(200, { "content-type": "application/zip" });
        res.end(body);
        return;
      }

      if (url.includes("/contents/")) {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            type: "file",
            name: "pawn.json",
            path: "pawn.json",
            encoding: "base64",
            content: Buffer.from(JSON.stringify(declaration)).toString("base64"),
          }),
        );
        return;
      }

      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Not Found" }));
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    baseUrl = `http://127.0.0.1:${(server.address() as any).port}`;
    process.env.INFERNUS_GITHUB_API = baseUrl;
  });

  after(async () => {
    process.chdir(cwd);
    delete process.env.INFERNUS_GITHUB_API;
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await fs.remove(workspace);
    await fs.remove(path.resolve(cacheRoot, "hostile"));
  });

  /** a project with a manifest, and a dependency name no other test uses */
  async function project(dependency = "hostile/plugin@1.0.0") {
    const root = path.resolve(
      workspace,
      `run-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    );
    await fs.ensureDir(root);
    await fs.writeJson(path.resolve(root, "infernus.json"), { dependencies: {} }, { spaces: 2 });
    process.chdir(root);
    await fs.remove(path.resolve(cacheRoot, "hostile", "plugin"));
    return { root, dependency };
  }

  it("refuses a file destination outside the project", async () => {
    declaration = {
      resources: [
        {
          name: "plugin.zip",
          platform: "windows",
          version: "0.3.7",
          archive: true,
          files: { "payload.txt": "../../escaped.txt" },
        },
      ],
    };
    archiveEntries = [{ name: "payload.txt", content: "payload" }];

    const { dependency } = await project();
    await assert.rejects(() => addDeps({ dependencies: [dependency] }), /resolves outside/);

    assert.equal(
      await fs.pathExists(path.resolve(workspace, "escaped.txt")),
      false,
      "nothing was written outside the project",
    );
  });

  it("refuses a glob that reaches outside the unpacked build", async () => {
    declaration = {
      resources: [
        {
          name: "plugin.zip",
          platform: "windows",
          version: "0.3.7",
          archive: true,
          plugins: ["../../*.dll"],
        },
      ],
    };
    archiveEntries = [{ name: "plugin.dll", content: "the plugin" }];

    const { dependency, root } = await project();
    await assert.rejects(() => addDeps({ dependencies: [dependency] }), /resolves outside/);
    assert.equal(await fs.pathExists(path.resolve(root, "plugins")), false);
  });

  it("fails clearly when nothing matches the platform", async () => {
    declaration = {
      resources: [{ name: "plugin.so", platform: "linux", version: "0.3.7", archive: false }],
    };
    archiveEntries = [];

    const { dependency, root } = await project();
    const wanted = process.platform === "win32" ? /no windows resource/ : /no linux resource/;

    await assert.rejects(() => addDeps({ dependencies: [dependency] }), wanted);

    const lockfile = await fs.readJson(path.resolve(root, "infernus-lock.json")).catch(() => null);
    assert.equal(
      lockfile?.dependencies?.["hostile/plugin"],
      undefined,
      "a dependency that placed nothing is not recorded as installed",
    );
  });

  it("treats a version directory holding an un-unpacked archive as incomplete", async () => {
    // a zip that cannot be extracted, so the archive stays beside the pawn.json
    declaration = {
      resources: [{ name: "plugin.zip", platform: "windows", version: "0.3.7", archive: true }],
    };
    archiveEntries = [{ name: "../escape.txt", content: "refused by the extractor" }];

    const { dependency } = await project();
    await assert.rejects(() => addDeps({ dependencies: [dependency] }));

    const versionPath = path.resolve(cacheRoot, "hostile", "plugin", "1.0.0");
    assert.equal(await fs.pathExists(versionPath), true, "the download was cached");
    assert.equal(
      await fs.pathExists(path.resolve(versionPath, "empty.tmp")),
      true,
      "an incomplete cache is marked, so it is not mistaken for a build",
    );
  });

  it("does not delete a file outside the project on removal", async () => {
    // a cached declaration that names a loose asset with a traversal in it
    const versionPath = path.resolve(cacheRoot, "hostile", "plugin", "2.0.0");
    await fs.ensureDir(versionPath);
    await fs.writeJson(
      path.resolve(versionPath, "pawn.json"),
      {
        resources: [
          {
            name: "../../victim.dll",
            platform: "windows",
            version: "0.3.7",
            archive: false,
          },
        ],
      },
      { spaces: 2 },
    );

    const victim = path.resolve(workspace, "victim.dll");
    await fs.writeFile(victim, "an unrelated file");

    const root = path.resolve(workspace, "removal");
    await fs.ensureDir(root);
    await fs.writeJson(
      path.resolve(root, "infernus.json"),
      { dependencies: { "hostile/plugin": "2.0.0" } },
      { spaces: 2 },
    );
    await fs.writeJson(
      path.resolve(root, "infernus-lock.json"),
      {
        lockfileVersion: 1,
        dependencies: { "hostile/plugin": { version: "2.0.0", component: false } },
      },
      { spaces: 2 },
    );
    process.chdir(root);

    await assert.rejects(() => removeDeps(["hostile/plugin"]), /resolves outside/);

    assert.equal(
      await fs.pathExists(victim),
      true,
      "a file outside the project must survive a removal",
    );
  });
});

/**
 * The cache is shared between runs, so what one run leaves behind decides what
 * the next one believes. A stray file used to abort every later command.
 */
describe("a cache holding archives as well as builds", () => {
  const cwd = process.cwd();
  const cacheRoot = path.resolve(os.homedir(), ".infernus", "dependencies");
  const owner = "strayfile";

  after(async () => {
    process.chdir(cwd);
    await fs.remove(path.resolve(cacheRoot, owner));
    delete process.env.INFERNUS_GITHUB_API;
  });

  it("does not choke on a downloaded archive left beside a build", async () => {
    // an interrupted download leaves `<tag>.zip` next to the build directory
    await fs.ensureDir(path.resolve(cacheRoot, owner, "repo", "1.0.0"));
    await fs.writeFile(path.resolve(cacheRoot, owner, "repo", "1.0.0.zip"), "an archive");
    await fs.writeFile(path.resolve(cacheRoot, owner, "repo", "1.0.0.zip.tmp"), "partial");

    const removed = await cleanGlobalDeps([`${owner}/repo`], false);
    assert.equal(typeof removed, "number", "cleanup completes instead of throwing ENOTDIR");
  });
});

/**
 * A lockfile is generated but still hand-editable, and a version from it becomes
 * a path segment. A malformed entry has to be ignored rather than reach a path.
 */
describe("a malformed lockfile", () => {
  const cwd = process.cwd();
  const dirs: string[] = [];

  after(async () => {
    process.chdir(cwd);
    await Promise.all(dirs.map((dir) => fs.remove(dir)));
  });

  async function project(lockfile: unknown) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-lockfile-"));
    dirs.push(dir);
    await fs.writeJson(
      path.resolve(dir, "infernus.json"),
      { dependencies: { "a/b": "*" } },
      { spaces: 2 },
    );
    await fs.writeJson(path.resolve(dir, "infernus-lock.json"), lockfile, { spaces: 2 });
    process.chdir(dir);
    return dir;
  }

  it("ignores a version that is not a string instead of failing deep inside", async () => {
    await project({ lockfileVersion: 1, dependencies: { "a/b": { version: 42 } } });

    // no throw, and the unusable entry is not acted on
    await removeDeps(["a/b"]);

    const manifest = await fs.readJson(path.resolve(process.cwd(), "infernus.json"));
    assert.equal(manifest.dependencies["a/b"], undefined, "the manifest entry was still removed");
  });

  it("survives a dependencies field that is not an object", async () => {
    await project({ lockfileVersion: 1, dependencies: "a/b" });

    await removeDeps(["a/b"]);

    const manifest = await fs.readJson(path.resolve(process.cwd(), "infernus.json"));
    assert.equal(manifest.dependencies["a/b"], undefined);
  });
});
