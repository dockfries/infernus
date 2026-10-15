import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import fs from "fs-extra";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { addDeps } from "../src/utils/dep";
import { OMP_REPO, SAMP_NODE_REPO, startReleaseServer } from "./fixtures/sandbox";

/**
 * `add` has to be all or nothing.
 *
 * Writing the manifest before the install means a failure leaves it declaring a
 * dependency that was never installed, which nothing in the error tells the user
 * and a retry of the same command does not clean up.
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

  async function project(manifest: Record<string, string> = {}) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-add-"));
    tempDirs.push(dir);
    await fs.writeJson(
      path.resolve(dir, "infernus.json"),
      { dependencies: manifest },
      { spaces: 2 },
    );
    process.chdir(dir);
    return dir;
  }

  it("leaves the manifest untouched when the install fails", async () => {
    process.env.INFERNUS_GITHUB_API = `http://127.0.0.1:${(failing.address() as any).port}`;

    const dir = await project({ "dockfries/samp-node": "^2.6.1" });
    const before = await fs.readFile(path.resolve(dir, "infernus.json"), "utf8");

    await assert.rejects(() => addDeps({ dependencies: ["nobody/unreachable@^1.0.0"] }));

    assert.equal(
      await fs.readFile(path.resolve(dir, "infernus.json"), "utf8"),
      before,
      "a failed add must not touch the manifest",
    );
  });

  it("writes the manifest when the install succeeds", async () => {
    // the install also pulls a default open.mp server, so both repositories are
    // served. A build is pre-seeded so the install is answered from the cache and
    // the assertion does not depend on how loose plugin assets are handled.
    const buildDir = path.resolve(
      os.homedir(),
      ".infernus",
      "dependencies",
      "dockfries",
      "samp-node",
      "2.6.1",
    );
    const seeded = !(await fs.pathExists(buildDir));
    if (seeded) {
      await fs.ensureDir(buildDir);
      await fs.writeJson(path.resolve(buildDir, "pawn.json"), { resources: [] }, { spaces: 2 });
    }

    const server = await startReleaseServer([SAMP_NODE_REPO, OMP_REPO]);
    process.env.INFERNUS_GITHUB_API = server.baseUrl;

    try {
      const dir = await project();
      await addDeps({ dependencies: ["dockfries/samp-node@2.6.1"] });

      const manifest = await fs.readJson(path.resolve(dir, "infernus.json"));
      const lockfile = await fs.readJson(path.resolve(dir, "infernus-lock.json"));

      assert.equal(
        manifest.dependencies["dockfries/samp-node"],
        "2.6.1",
        "a successful install records the dependency",
      );
      assert.equal(lockfile.dependencies["dockfries/samp-node"].version, "2.6.1");
    } finally {
      await server.close();
      if (seeded) await fs.remove(buildDir);
    }
  });
});
