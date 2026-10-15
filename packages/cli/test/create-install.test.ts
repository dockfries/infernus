import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { installProjectDependencies } from "../src/utils/project";
import { OMP_REPO, SAMP_NODE_REPO, startReleaseServer } from "./fixtures/sandbox";

/**
 * After a project is generated from the starter, its declared dependencies are
 * installed in the same process. The generated manifest is what drives that, so
 * the install has to follow it and leave the project usable.
 */
describe("installProjectDependencies", () => {
  const cwd = process.cwd();
  const tempDirs: string[] = [];
  let server: Awaited<ReturnType<typeof startReleaseServer>>;

  /** the same resolution and download path a generated project would take */
  before(async () => {
    server = await startReleaseServer([SAMP_NODE_REPO, OMP_REPO]);
    process.env.INFERNUS_GITHUB_API = server.baseUrl;
  });

  after(async () => {
    process.chdir(cwd);
    delete process.env.INFERNUS_GITHUB_API;
    await server.close();
    await Promise.all(tempDirs.map((dir) => fs.remove(dir)));
  });

  async function project(dependencies: Record<string, string> | null) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-create-"));
    tempDirs.push(dir);

    if (dependencies) {
      await fs.writeJson(path.resolve(dir, "infernus.json"), { dependencies }, { spaces: 2 });
    }
    return dir;
  }

  it("installs what the generated manifest declares", async () => {
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

    try {
      const dir = await project({ "dockfries/samp-node": "2.6.1" });

      await installProjectDependencies(dir);

      const lockfile = await fs.readJson(path.resolve(dir, "infernus-lock.json"));
      assert.equal(
        lockfile.dependencies["dockfries/samp-node"].version,
        "2.6.1",
        "the declared dependency was installed",
      );
    } finally {
      if (seeded) await fs.remove(buildDir);
    }
  });

  it("does nothing when the project declares no dependencies", async () => {
    const dir = await project({});

    await installProjectDependencies(dir);

    assert.equal(
      await fs.pathExists(path.resolve(dir, "infernus-lock.json")),
      false,
      "an empty project is not given a lockfile",
    );
  });

  it("does nothing when there is no manifest to read", async () => {
    const dir = await project(null);

    await installProjectDependencies(dir);

    assert.deepEqual(await fs.readdir(dir), [], "nothing was written");
  });

  it("returns to the directory it was called from", async () => {
    const dir = await project({});
    const before = process.cwd();

    await installProjectDependencies(dir);

    assert.equal(process.cwd(), before, "the caller's working directory is restored");
  });

  it("restores the working directory even when the install fails", async () => {
    const before = process.cwd();
    const dir = await project({ "nobody/unreachable": "^1.0.0" });

    await assert.rejects(() => installProjectDependencies(dir));

    assert.equal(process.cwd(), before, "a failure must not leave the process elsewhere");
  });
});
