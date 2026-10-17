import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { readLocalConfig, writeLocalConfig, writeLockFile } from "../src/utils/config";

/**
 * The manifest records the version spec the user chose, exactly as written.
 *
 * Users ask "why is one dependency pinned to 2.6.1 while another says ^2.9.6".
 * The answer is that the CLI never rewrites a spec: `2.6.1` is a pin that stays
 * on that release, `^2.9.6` is a range that walks forward. These tests keep that
 * guarantee, since silently normalising specs would change what an update does.
 */
describe("the manifest keeps the version spec verbatim", () => {
  const cwd = process.cwd();
  const tempDirs: string[] = [];

  async function inTempDir<T>(run: () => Promise<T>): Promise<T> {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-manifest-"));
    tempDirs.push(dir);
    process.chdir(dir);
    try {
      return await run();
    } finally {
      process.chdir(cwd);
    }
  }

  it("writes a pin as a pin and a range as a range", async () => {
    for (const [written, expected] of [
      ["2.6.1", "2.6.1"],
      ["^2.6.1", "^2.6.1"],
      ["~2.6.1", "~2.6.1"],
      ["*", "*"],
      ["v1.6.7.3218", "v1.6.7.3218"],
    ] as const) {
      await inTempDir(async () => {
        await writeLocalConfig({ dependencies: { "dockfries/samp-node": written } });
        const config = await readLocalConfig();
        assert.equal(
          config?.dependencies?.["dockfries/samp-node"],
          expected,
          `${written} must survive a write and read`,
        );
      });
    }
  });

  it("adds the schema reference without disturbing the specs", async () => {
    await inTempDir(async () => {
      await writeLocalConfig({ dependencies: { "dockfries/samp-node": "2.6.1" } });
      const config = await readLocalConfig();

      assert.match(String(config?.$schema), /infernus\.schema\.json$/);
      assert.equal(config?.dependencies?.["dockfries/samp-node"], "2.6.1");
    });
  });

  /**
   * The lockfile is generated but committed, so it is read in reviews and diffs.
   * Writing its entries in a stable order keeps a dependency added in the middle
   * from rewriting the lines around it.
   */
  it("writes the lockfile entries in a stable order", async () => {
    await inTempDir(async () => {
      await writeLockFile({
        lockfileVersion: 1,
        dependencies: {
          "z-last/plugin": { version: "2.0.0", component: false },
          "a-first/open.mp": { version: "v1.6.7.3218" },
          "m-middle/plugin": { version: "1.0.0", component: true },
        },
      });

      const written = await fs.readJson(path.resolve(process.cwd(), "infernus-lock.json"));

      assert.deepEqual(Object.keys(written.dependencies), [
        "a-first/open.mp",
        "m-middle/plugin",
        "z-last/plugin",
      ]);
      assert.deepEqual(written.dependencies["m-middle/plugin"], {
        version: "1.0.0",
        component: true,
      });
    });
  });

  it("cleanup", async () => {
    await Promise.all(tempDirs.map((dir) => fs.remove(dir)));
  });
});
