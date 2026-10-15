import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import {
  changeConfigJson,
  changePkgName,
  FORBIDDEN_RCON_PASSWORD,
  isValidAppName,
  isValidRconPassword,
} from "../src/utils/project";

describe("project name validation", () => {
  it("accepts the names a user actually picks", () => {
    for (const name of ["my-app", "MyServer", "server_2", "omp.test", "a"]) {
      assert.equal(isValidAppName(name), true, name);
    }
  });

  it("rejects names that cannot be a path segment", () => {
    for (const name of ["a/b", "a\\b", "a:b", "a*b", "a?b", 'a"b', "a<b", "a>b", "a|b", "a\nb"]) {
      assert.equal(isValidAppName(name), false, JSON.stringify(name));
    }
  });
});

describe("rcon password validation", () => {
  it("accepts what the server can use", () => {
    assert.equal(isValidRconPassword("s3cret_Pass"), true);
  });

  it("rejects empty, spaced and forbidden values", () => {
    assert.equal(isValidRconPassword(""), false);
    assert.equal(isValidRconPassword("has space"), false);
    assert.equal(isValidRconPassword("has-dash"), false);
    assert.equal(isValidRconPassword(FORBIDDEN_RCON_PASSWORD), false);
    assert.equal(isValidRconPassword(` ${FORBIDDEN_RCON_PASSWORD} `), false);
  });
});

describe("generated project files", () => {
  const cwd = process.cwd();
  const tempDirs: string[] = [];

  after(async () => {
    process.chdir(cwd);
    await Promise.all(tempDirs.map((dir) => fs.remove(dir)));
  });

  async function project(files: Record<string, unknown> = {}) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-project-"));
    tempDirs.push(dir);
    for (const [name, content] of Object.entries(files)) {
      await fs.writeJson(path.resolve(dir, name), content, { spaces: 2 });
    }
    return dir;
  }

  it("renames the generated package", async () => {
    const dir = await project({ "package.json": { name: "infernus-starter", version: "1.0.0" } });

    await changePkgName(dir, "my-server");

    const pkg = await fs.readJson(path.resolve(dir, "package.json"));
    assert.equal(pkg.name, "my-server");
    assert.equal(pkg.version, "1.0.0", "the rest of the manifest is preserved");
  });

  it("sets the rcon password without disturbing other settings", async () => {
    const dir = await project({
      "config.json": { name: "my server", max_players: 50, rcon: { port: 7777 } },
    });

    await changeConfigJson(dir, "s3cret_Pass", false);

    const config = await fs.readJson(path.resolve(dir, "config.json"));
    assert.equal(config.rcon.password, "s3cret_Pass");
    assert.equal(config.rcon.port, 7777, "existing rcon settings survive");
    assert.equal(config.max_players, 50, "unrelated settings survive");
  });

  it("selects the RakNet main script when asked", async () => {
    const dir = await project({ "config.json": { name: "my server" } });

    await changeConfigJson(dir, "s3cret_Pass", true);

    const config = await fs.readJson(path.resolve(dir, "config.json"));
    assert.deepEqual(config.pawn.main_scripts, ["polyfill_raknet 1"]);
  });
});
