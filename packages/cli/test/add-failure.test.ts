import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import fs from "fs-extra";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { addDeps, removeDeps } from "../src/utils/dep";
import { OMP_REPO, SAMP_NODE_REPO, startReleaseServer } from "./fixtures/sandbox";

/**
 * `add` has to be all or nothing.
 *
 * It cleans up previous versions before installing, and that cleanup used to
 * write the manifest on its own, before the install had done anything. A
 * dependency that then failed to resolve left the manifest describing an install
 * that never happened. Files may be removed as the install proceeds, but the
 * records are written once, at the end, from what was actually placed.
 */
describe("addDeps and the manifest", () => {
  const cwd = process.cwd();
  const tempDirs: string[] = [];
  let failing: http.Server;

  /** answer every request with a failure, so resolution cannot succeed */
  before(async () => {
    failing = http.createServer((_req, res) => {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "boom" }));
    });
    await new Promise<void>((resolve) => failing.listen(0, "127.0.0.1", resolve));
  });

  after(async () => {
    process.chdir(cwd);
    delete process.env.INFERNUS_GITHUB_API;
    await new Promise<void>((resolve) => failing.close(() => resolve()));
    await Promise.all(tempDirs.map((dir) => fs.remove(dir)));
  });

  async function project(
    manifest: Record<string, string> = {},
    installed?: Record<string, string>,
  ) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-add-"));
    tempDirs.push(dir);

    await fs.writeJson(
      path.resolve(dir, "infernus.json"),
      { dependencies: manifest },
      { spaces: 2 },
    );

    if (installed) {
      await fs.writeJson(
        path.resolve(dir, "infernus-lock.json"),
        {
          lockfileVersion: 1,
          dependencies: Object.fromEntries(
            Object.entries(installed).map(([name, version]) => [name, { version }]),
          ),
        },
        { spaces: 2 },
      );
    }

    process.chdir(dir);
    return dir;
  }

  /** seed the shared cache so an install can be answered without downloading */
  async function seedCache(version: string) {
    const buildDir = path.resolve(
      os.homedir(),
      ".infernus",
      "dependencies",
      "dockfries",
      "samp-node",
      version,
    );
    const seeded = !(await fs.pathExists(buildDir));
    if (seeded) {
      await fs.ensureDir(buildDir);
      await fs.writeJson(path.resolve(buildDir, "pawn.json"), { resources: [] }, { spaces: 2 });
    }
    return { buildDir, seeded };
  }

  it("leaves both records alone when the install fails", async () => {
    process.env.INFERNUS_GITHUB_API = `http://127.0.0.1:${(failing.address() as any).port}`;

    // a lockfile with an installed dependency is what routes add through the
    // removal step, which is where the manifest used to be written early
    const dir = await project(
      { "dockfries/samp-node": "^2.6.1" },
      { "dockfries/samp-node": "2.6.1" },
    );

    const manifestBefore = await fs.readFile(path.resolve(dir, "infernus.json"), "utf8");
    const lockBefore = await fs.readFile(path.resolve(dir, "infernus-lock.json"), "utf8");

    await assert.rejects(() => addDeps({ dependencies: ["dockfries/samp-node@^9.9.9"] }));

    assert.equal(
      await fs.readFile(path.resolve(dir, "infernus.json"), "utf8"),
      manifestBefore,
      "a failed add must not touch the manifest",
    );
    assert.equal(
      await fs.readFile(path.resolve(dir, "infernus-lock.json"), "utf8"),
      lockBefore,
      "a failed add must not touch the lockfile",
    );
  });

  it("leaves the manifest alone when there is no lockfile yet", async () => {
    process.env.INFERNUS_GITHUB_API = `http://127.0.0.1:${(failing.address() as any).port}`;

    const dir = await project({ "dockfries/samp-node": "^2.6.1" });
    const before = await fs.readFile(path.resolve(dir, "infernus.json"), "utf8");

    await assert.rejects(() => addDeps({ dependencies: ["nobody/unreachable@^1.0.0"] }));

    assert.equal(await fs.readFile(path.resolve(dir, "infernus.json"), "utf8"), before);
  });

  it("upgrades an installed dependency in place", async () => {
    const { buildDir, seeded } = await seedCache("2.8.1");
    const server = await startReleaseServer([SAMP_NODE_REPO, OMP_REPO]);
    process.env.INFERNUS_GITHUB_API = server.baseUrl;

    try {
      const dir = await project(
        { "dockfries/samp-node": "2.6.1" },
        { "dockfries/samp-node": "2.6.1" },
      );

      await addDeps({ dependencies: ["dockfries/samp-node@2.8.1"] });

      const manifest = await fs.readJson(path.resolve(dir, "infernus.json"));
      const lockfile = await fs.readJson(path.resolve(dir, "infernus-lock.json"));

      assert.equal(
        manifest.dependencies["dockfries/samp-node"],
        "2.8.1",
        "the manifest follows the upgrade",
      );
      assert.equal(lockfile.dependencies["dockfries/samp-node"].version, "2.8.1");
    } finally {
      await server.close();
      if (seeded) await fs.remove(buildDir);
    }
  });

  it("removes a dependency and its record", async () => {
    const dir = await project(
      { "dockfries/samp-node": "2.6.1" },
      { "dockfries/samp-node": "2.6.1" },
    );

    await removeDeps(["dockfries/samp-node"]);

    const manifest = await fs.readJson(path.resolve(dir, "infernus.json"));
    const lockfile = await fs.readJson(path.resolve(dir, "infernus-lock.json"));

    assert.deepEqual(manifest.dependencies, {});
    assert.deepEqual(lockfile.dependencies, {});
  });

  it("can remove the files while leaving the records for a reinstall", async () => {
    const dir = await project(
      { "dockfries/samp-node": "2.6.1" },
      { "dockfries/samp-node": "2.6.1" },
    );

    await removeDeps(["dockfries/samp-node"], { keep: ["dockfries/samp-node"], record: false });

    const manifest = await fs.readJson(path.resolve(dir, "infernus.json"));
    const lockfile = await fs.readJson(path.resolve(dir, "infernus-lock.json"));

    assert.equal(
      manifest.dependencies["dockfries/samp-node"],
      "2.6.1",
      "a kept dependency stays in the manifest",
    );
    assert.equal(
      lockfile.dependencies["dockfries/samp-node"].version,
      "2.6.1",
      "and in the lockfile",
    );
  });
});
