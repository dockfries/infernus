import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import fs from "fs-extra";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { removeDeps } from "../src/utils/dep";

/**
 * Removing a dependency is a local operation: the files to delete are already in
 * the project and the cache. A repository that cannot be read must therefore
 * still remove it from `infernus.json` and `infernus-lock.json`, otherwise the
 * manifest keeps listing something the user asked to drop and no retry can help.
 */
describe("removeDeps with an unreadable repository", () => {
  const cwd = process.cwd();
  let server: http.Server;
  const tempDirs: string[] = [];

  before(async () => {
    // every request answers 404, standing in for offline or rate limited
    server = http.createServer((_req, res) => {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Not Found" }));
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));

    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;
    process.env.INFERNUS_GITHUB_API = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    process.chdir(cwd);
    delete process.env.INFERNUS_GITHUB_API;
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await Promise.all(tempDirs.map((dir) => fs.remove(dir)));
  });

  it("still drops it from the manifest and the lockfile", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-remove-"));
    tempDirs.push(dir);

    await fs.writeJson(
      path.resolve(dir, "infernus.json"),
      { dependencies: { "nobody/unreachable": "^1.0.0", "dockfries/samp-node": "^2.6.1" } },
      { spaces: 2 },
    );
    await fs.writeJson(
      path.resolve(dir, "infernus-lock.json"),
      {
        lockfileVersion: 1,
        dependencies: {
          "nobody/unreachable": { version: "1.0.0", component: false },
          "dockfries/samp-node": { version: "2.6.1", component: false },
        },
      },
      { spaces: 2 },
    );

    process.chdir(dir);
    await removeDeps(["nobody/unreachable"]);

    const manifest = await fs.readJson(path.resolve(dir, "infernus.json"));
    const lockfile = await fs.readJson(path.resolve(dir, "infernus-lock.json"));

    assert.equal(
      "nobody/unreachable" in manifest.dependencies,
      false,
      "the manifest must no longer declare it",
    );
    assert.equal(
      "nobody/unreachable" in lockfile.dependencies,
      false,
      "the lockfile must no longer record it",
    );
    // the untouched dependency keeps its entry
    assert.equal(manifest.dependencies["dockfries/samp-node"], "^2.6.1");
    assert.equal(lockfile.dependencies["dockfries/samp-node"].version, "2.6.1");
  });
});
