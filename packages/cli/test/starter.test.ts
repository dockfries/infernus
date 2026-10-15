import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { extractStarter } from "../src/utils/starter";
import { createZip } from "./fixtures/zip";

/**
 * The starter archive is unpacked into a project the user is about to work in, so
 * the extraction is checked against both layouts GitHub can produce and against
 * an archive that is simply wrong.
 */
describe("extractStarter", () => {
  const tempDirs: string[] = [];

  async function workspace() {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-starter-"));
    tempDirs.push(dir);
    return dir;
  }

  async function archive(entries: { name: string; content: string }[]) {
    const dir = await workspace();
    const file = path.resolve(dir, "starter.zip");
    await fs.writeFile(
      file,
      createZip(
        entries.map((entry) => ({ name: entry.name, content: Buffer.from(entry.content) })),
      ),
    );
    return file;
  }

  after(async () => {
    await Promise.all(tempDirs.map((dir) => fs.remove(dir)));
  });

  it("unpacks an archive that wraps everything in one directory", async () => {
    const source = await archive([
      { name: "infernus-starter-main/package.json", content: '{"name":"starter"}' },
      { name: "infernus-starter-main/infernus.json", content: '{"dependencies":{}}' },
      { name: "infernus-starter-main/gamemodes/main.pwn", content: "pawn" },
    ]);
    const target = await workspace();

    await extractStarter(source, target);

    assert.equal(
      await fs.readFile(path.resolve(target, "package.json"), "utf8"),
      '{"name":"starter"}',
    );
    assert.equal(await fs.pathExists(path.resolve(target, "gamemodes/main.pwn")), true);
    // no working directories are left behind
    assert.deepEqual((await fs.readdir(target)).sort(), [
      "gamemodes",
      "infernus.json",
      "package.json",
    ]);
  });

  it("unpacks an archive that is already flat", async () => {
    const source = await archive([
      { name: "package.json", content: '{"name":"starter"}' },
      { name: "infernus.json", content: '{"dependencies":{}}' },
    ]);
    const target = await workspace();

    await extractStarter(source, target);

    assert.equal(await fs.pathExists(path.resolve(target, "package.json")), true);
    assert.deepEqual((await fs.readdir(target)).sort(), ["infernus.json", "package.json"]);
  });

  it("fails loudly when the archive is not a starter", async () => {
    const source = await archive([{ name: "something/readme.txt", content: "not a starter" }]);
    const target = await workspace();

    await assert.rejects(() => extractStarter(source, target), /does not contain package\.json/);
    // nothing half unpacked is left in the project
    assert.deepEqual(await fs.readdir(target), []);
  });
});
