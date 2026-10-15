import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { addDeps, removeDeps } from "../src/utils/dep";
import { planDependency } from "../src/utils/plan";
import { OMP_REPO, startReleaseServer } from "./fixtures/sandbox";

/**
 * Whether a planned install reuses a build that is already unpacked.
 *
 * A range can never name a cached tag itself, so it reaches the cache only
 * through the release the repository resolves it to. Getting this wrong makes
 * every `infernus install` re-download and re-unpack the whole release, which is
 * the normal case for a manifest that declares `^1.2.3`.
 */
describe("cache reuse when planning", () => {
  const cacheRoot = path.resolve(os.homedir(), ".infernus", "dependencies");
  const owner = "planner";
  const repo = "plugin";
  const cachePath = path.resolve(cacheRoot, owner, repo);

  after(async () => {
    await fs.remove(cachePath);
  });

  /** a cached build, and a release list that resolves to it */
  async function seed(...tags: string[]) {
    await fs.remove(cachePath);
    for (const tag of tags) {
      await fs.ensureDir(path.resolve(cachePath, tag));
      await fs.writeJson(path.resolve(cachePath, tag, "pawn.json"), { resources: [] });
    }
  }

  it("reuses a cached build for a range through the fixture server", async () => {
    const server = await startReleaseServer([
      { name: `${owner}/${repo}`, tags: ["v2.0.0.100", "v1.0.0.50"], layout: "pawn" } as any,
    ]);
    const previous = process.env.INFERNUS_GITHUB_API;
    process.env.INFERNUS_GITHUB_API = server.baseUrl;

    try {
      await seed("v2.0.0.100");

      for (const spec of ["^2.0.0", "2.x", "*", "v2.0.0.100"]) {
        const plan = await planDependency(`${owner}/${repo}@${spec}`);

        assert.equal(
          plan.cachedTag,
          "v2.0.0.100",
          `"${spec}" should reuse the build already in the cache`,
        );
        assert.equal(plan.finalVersion, "v2.0.0.100");
      }
    } finally {
      if (previous === undefined) delete process.env.INFERNUS_GITHUB_API;
      else process.env.INFERNUS_GITHUB_API = previous;
      await server.close();
    }
  });
});

/**
 * Installing a dependency that is already unpacked in the cache must still put
 * its files into the project.
 *
 * The assets live in the dependency's cache directory, so that is where they
 * have to be read from; looking in the project instead finds nothing on a first
 * install and finds the copies themselves on a second one.
 */
describe("installing from the cache", () => {
  const cwd = process.cwd();
  const tempDirs: string[] = [];
  const cacheRoot = path.resolve(os.homedir(), ".infernus", "dependencies");
  let server: Awaited<ReturnType<typeof startReleaseServer>>;

  const PLUGIN_CACHE = path.resolve(cacheRoot, "dockfries", "plugin-fixture", "2.6.1");

  before(async () => {
    server = await startReleaseServer([OMP_REPO]);

    // a plugin whose loose assets are already unpacked in the cache, the way a
    // previous install leaves them
    await fs.ensureDir(path.resolve(PLUGIN_CACHE, "pawno", "include"));
    await fs.writeJson(
      path.resolve(PLUGIN_CACHE, "pawn.json"),
      {
        resources: [
          {
            name: "plugin-fixture.dll",
            platform: "windows",
            version: "0.3.7",
            archive: false,
          },
          {
            name: "plugin-fixture.so",
            platform: "linux",
            version: "0.3.7",
            archive: false,
          },
        ],
      },
      { spaces: 2 },
    );
    await fs.writeFile(path.resolve(PLUGIN_CACHE, "plugin-fixture.dll"), "the windows plugin");
    await fs.writeFile(path.resolve(PLUGIN_CACHE, "plugin-fixture.so"), "the linux plugin");
  });

  after(async () => {
    process.chdir(cwd);
    delete process.env.INFERNUS_GITHUB_API;
    await server.close();
    await fs.remove(path.resolve(cacheRoot, "dockfries", "plugin-fixture"));
    await Promise.all(tempDirs.map((dir) => fs.remove(dir)));
  });

  async function project() {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-cache-"));
    tempDirs.push(dir);
    await fs.writeJson(path.resolve(dir, "infernus.json"), { dependencies: {} }, { spaces: 2 });
    process.chdir(dir);
    return dir;
  }

  it("copies the cached plugin into the project", async () => {
    process.env.INFERNUS_GITHUB_API = server.baseUrl;
    const dir = await project();

    await addDeps({ dependencies: ["dockfries/plugin-fixture@2.6.1"] });

    const plugin = path.resolve(dir, "plugins", "plugin-fixture.dll");
    assert.equal(
      await fs.pathExists(plugin),
      true,
      "the plugin from the cache must land in plugins/",
    );
    assert.equal(await fs.readFile(plugin, "utf8"), "the windows plugin");
  });

  it("is repeatable: a second install keeps the files", async () => {
    process.env.INFERNUS_GITHUB_API = server.baseUrl;
    const dir = await project();

    await addDeps({ dependencies: ["dockfries/plugin-fixture@2.6.1"] });
    await addDeps({ dependencies: ["dockfries/plugin-fixture@2.6.1"] });

    const plugin = path.resolve(dir, "plugins", "plugin-fixture.dll");
    assert.equal(await fs.pathExists(plugin), true);
    assert.equal(
      await fs.readFile(plugin, "utf8"),
      "the windows plugin",
      "a repeated install must not corrupt the plugin",
    );
  });

  it("places loose assets that had to be downloaded", async () => {
    // the same shape, but nothing cached, so the assets come over the wire
    const fresh = {
      name: "dockfries/plugin-fixture",
      tags: ["2.6.1"],
      layout: "pawn" as const,
    };
    const downloadServer = await startReleaseServer([OMP_REPO, fresh]);
    process.env.INFERNUS_GITHUB_API = downloadServer.baseUrl;
    await fs.remove(path.resolve(cacheRoot, "dockfries", "plugin-fixture"));

    try {
      const dir = await project();
      await addDeps({ dependencies: ["dockfries/plugin-fixture@2.6.1"] });

      const plugin = path.resolve(dir, "plugins", "plugin-fixture.dll");
      assert.equal(
        await fs.pathExists(plugin),
        true,
        "a downloaded plugin must be placed in plugins/",
      );
    } finally {
      await downloadServer.close();
    }
  });

  it("takes the plugin back out again on remove", async () => {
    const repo = { name: "dockfries/plugin-fixture", tags: ["2.6.1"], layout: "pawn" as const };
    const removeServer = await startReleaseServer([OMP_REPO, repo]);
    process.env.INFERNUS_GITHUB_API = removeServer.baseUrl;
    await fs.remove(path.resolve(cacheRoot, "dockfries", "plugin-fixture"));

    try {
      const dir = await project();
      await addDeps({ dependencies: ["dockfries/plugin-fixture@2.6.1"] });
      const plugin = path.resolve(dir, "plugins", "plugin-fixture.dll");
      assert.equal(await fs.pathExists(plugin), true, "precondition: the plugin is installed");

      await removeDeps(["dockfries/plugin-fixture"]);

      assert.equal(
        await fs.pathExists(plugin),
        false,
        "removing a dependency must delete the plugin it placed",
      );

      const configPath = path.resolve(dir, "config.json");
      // the config only ever held this plugin's name, so it is removed rather
      // than left behind as an empty shell claiming a server
      const config = (await fs.pathExists(configPath))
        ? await fs.readJson(configPath)
        : { pawn: { legacy_plugins: [] } };

      assert.equal(
        (config.pawn?.legacy_plugins ?? []).includes("plugin-fixture"),
        false,
        "and must not leave it listed for the server to load",
      );
    } finally {
      await removeServer.close();
    }
  });
});
