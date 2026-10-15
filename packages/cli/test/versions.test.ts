import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { listVersions } from "../src/utils/versions";
import { SAMP_NODE_REPO, startReleaseServer } from "./fixtures/sandbox";

/**
 * `versions` is what a user runs to answer "which versions can I install, and
 * which of them does my manifest accept", for any dependency and not just
 * open.mp, so it is driven here against a fixture GitHub.
 */
describe("listVersions", () => {
  const cwd = process.cwd();
  let server: Awaited<ReturnType<typeof startReleaseServer>>;
  const tempDirs: string[] = [];

  before(async () => {
    server = await startReleaseServer([SAMP_NODE_REPO]);
    process.env.INFERNUS_GITHUB_API = server.baseUrl;
    // several cases below make a lookup fail on purpose, and the failure is
    // reported to the console for the CLI user
    console.error = () => {};
  });

  after(async () => {
    process.chdir(cwd);
    delete process.env.INFERNUS_GITHUB_API;
    await server.close();
    await Promise.all(tempDirs.map((dir) => fs.remove(dir)));
  });

  async function inProject(manifest: Record<string, string>, lock: Record<string, string> = {}) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-versions-"));
    tempDirs.push(dir);

    await fs.writeJson(
      path.resolve(dir, "infernus.json"),
      { dependencies: manifest },
      { spaces: 2 },
    );
    await fs.writeJson(
      path.resolve(dir, "infernus-lock.json"),
      {
        lockfileVersion: 1,
        dependencies: Object.fromEntries(
          Object.entries(lock).map(([name, version]) => [name, { version }]),
        ),
      },
      { spaces: 2 },
    );

    process.chdir(dir);
    return dir;
  }

  it("lists the releases of a dependency that is not open.mp", async () => {
    await inProject({ "dockfries/samp-node": "^2.6.1" }, { "dockfries/samp-node": "2.6.1" });

    const [report] = await listVersions({ dependencies: [], json: true });

    assert.equal(report.name, "dockfries/samp-node");
    assert.equal(report.spec, "^2.6.1");
    assert.equal(report.installed, "2.6.1");
    assert.deepEqual(report.tags, ["2.8.1", "2.7.1", "2.6.1"]);
    assert.deepEqual([...report.compatible], ["2.8.1", "2.7.1", "2.6.1"]);
  });

  it("marks a pin as accepting only itself", async () => {
    await inProject({ "dockfries/samp-node": "2.6.1" });

    const [report] = await listVersions({ dependencies: [], json: true });

    assert.deepEqual([...report.compatible], ["2.6.1"]);
  });

  it("keeps going when one repository cannot be read", async () => {
    await inProject({
      "dockfries/samp-node": "^2.6.1",
      "nobody/does-not-exist": "^1.0.0",
    });

    const reports = await listVersions({ dependencies: [], json: true });

    // the readable dependency is still reported, the other is not fatal
    assert.deepEqual(
      reports.map((report) => report.name),
      ["dockfries/samp-node"],
    );
  });

  it("fails when nothing could be read, and says why", async () => {
    await inProject({ "nobody/does-not-exist": "^1.0.0" });

    await assert.rejects(
      () => listVersions({ dependencies: [], json: true }),
      /nobody\/does-not-exist/,
    );
  });

  it("rejects a malformed dependency name", async () => {
    await inProject({ "dockfries/samp-node": "^2.6.1" });

    await assert.rejects(
      () => listVersions({ dependencies: ["owner/repo/extra"], json: true }),
      /invalid dependency name/,
    );
    await assert.rejects(
      () => listVersions({ dependencies: ["just-a-name"], json: true }),
      /invalid dependency name/,
    );
  });
});
