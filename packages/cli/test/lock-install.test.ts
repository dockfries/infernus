import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import fs from "fs-extra";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { addDeps } from "../src/utils/dep";
import { planDependency } from "../src/utils/plan";
import { startReleaseServer } from "./fixtures/sandbox";

/**
 * The lockfile decides what an install is allowed to move.
 *
 * npm's two rules are covered here: `install` keeps everything the lockfile still
 * satisfies and only resolves what it does not (so a settled project installs
 * offline and never upgrades by surprise), while `update` resolves the declared
 * ranges again and rewrites the lockfile. `--frozen` is `npm ci`: it reproduces
 * the lockfile and refuses a project it no longer describes.
 */
const NAME = "lockcheck/plugin-fixture";
const OLD = "2.6.1";
const NEW = "2.8.1";

const cacheRoot = path.resolve(os.homedir(), ".infernus", "dependencies");
const cachePath = path.resolve(cacheRoot, "lockcheck", "plugin-fixture");

/** what the fixture repository declares, and the files each build ships */
const resources = [
  { name: "plugin-fixture.dll", platform: "windows", version: "0.3.7", archive: false },
  { name: "plugin-fixture.so", platform: "linux", version: "0.3.7", archive: false },
];

const REPO = { name: NAME, tags: [NEW, "2.7.1", OLD], layout: "pawn" as const };

describe("the lockfile answers what the manifest still accepts", () => {
  const cwd = process.cwd();
  const tempDirs: string[] = [];
  let server: Awaited<ReturnType<typeof startReleaseServer>>;
  /** answers every request with a failure, so any lookup would throw */
  let failing: http.Server;
  let failingUrl: string;

  before(async () => {
    server = await startReleaseServer([REPO]);

    failing = http.createServer((_req, res) => {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "boom" }));
    });
    await new Promise<void>((resolve) => failing.listen(0, "127.0.0.1", resolve));
    failingUrl = `http://127.0.0.1:${(failing.address() as any).port}`;
  });

  after(async () => {
    process.chdir(cwd);
    delete process.env.INFERNUS_GITHUB_API;
    await server.close();
    await new Promise<void>((resolve) => failing.close(() => resolve()));
    await fs.remove(cachePath);
    await Promise.all(tempDirs.map((dir) => fs.remove(dir)));
  });

  /** a cached build, so the lockfile can be answered without a lookup */
  async function seedCache(...tags: string[]) {
    await fs.remove(cachePath);
    for (const tag of tags) {
      const dir = path.resolve(cachePath, tag);
      await fs.ensureDir(dir);
      await fs.writeJson(path.resolve(dir, "pawn.json"), { resources }, { spaces: 2 });
      await fs.writeFile(path.resolve(dir, "plugin-fixture.dll"), `dll ${tag}`);
      await fs.writeFile(path.resolve(dir, "plugin-fixture.so"), `so ${tag}`);
    }
  }

  it("answers from the lockfile without asking the repository", async () => {
    process.env.INFERNUS_GITHUB_API = failingUrl;
    await seedCache(OLD, NEW);

    const plan = await planDependency(`${NAME}@^2.6.1`, {
      mode: "install",
      lockedVersion: OLD,
      previousVersion: OLD,
    });

    assert.equal(plan.fromLock, true);
    assert.equal(plan.finalVersion, OLD, "an install must keep what the lockfile pins");
    assert.equal(plan.cachedTag, OLD);
    assert.equal(plan.matchedRelease, null, "the repository must not be contacted at all");
  });

  it("resolves again when the lockfile no longer satisfies the manifest", async () => {
    process.env.INFERNUS_GITHUB_API = server.baseUrl;
    await seedCache(OLD, NEW);

    const plan = await planDependency(`${NAME}@^2.7.0`, {
      mode: "install",
      lockedVersion: OLD,
      previousVersion: OLD,
    });

    assert.equal(plan.fromLock, false, "2.6.1 does not satisfy ^2.7.0");
    assert.equal(plan.finalVersion, NEW);
  });

  it("moves within the declared range on an update, even when the lockfile matches", async () => {
    process.env.INFERNUS_GITHUB_API = server.baseUrl;
    await seedCache(OLD, NEW);

    const plan = await planDependency(`${NAME}@^2.6.1`, {
      mode: "update",
      lockedVersion: OLD,
      previousVersion: OLD,
    });

    assert.equal(plan.fromLock, false, "an update re-resolves the range");
    assert.equal(plan.finalVersion, NEW);
  });

  it("installs the locked release for a frozen install", async () => {
    process.env.INFERNUS_GITHUB_API = failingUrl;
    await seedCache(OLD, NEW);

    const plan = await planDependency(`${NAME}@^2.6.1`, {
      mode: "frozen",
      lockedVersion: OLD,
      previousVersion: OLD,
    });

    assert.equal(plan.fromLock, true);
    assert.equal(plan.finalVersion, OLD);
  });

  it("refuses a frozen install the lockfile does not cover", async () => {
    await seedCache(OLD, NEW);

    await assert.rejects(
      () => planDependency(`${NAME}@^2.7.0`, { mode: "frozen", lockedVersion: OLD }),
      /lockfile out of sync/,
    );
    await assert.rejects(
      () => planDependency(`${NAME}@^2.6.1`, { mode: "frozen" }),
      /lockfile out of sync/,
    );
  });

  it("fails an install whose locked release disappeared upstream", async () => {
    // the release list no longer carries 2.6.1, and the cache is cold
    const without = await startReleaseServer([{ ...REPO, tags: [NEW] }]);
    process.env.INFERNUS_GITHUB_API = without.baseUrl;
    await seedCache();

    try {
      await assert.rejects(
        () => planDependency(`${NAME}@^2.6.1`, { mode: "install", lockedVersion: OLD }),
        /pinned by the lockfile/,
      );
    } finally {
      await without.close();
    }
  });

  /** the same rules, driven through the command the user runs */
  async function project(manifest: Record<string, string>, lock?: Record<string, string>) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-lock-"));
    tempDirs.push(dir);

    await fs.writeJson(
      path.resolve(dir, "infernus.json"),
      { dependencies: manifest },
      {
        spaces: 2,
      },
    );

    if (lock) {
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
    }

    process.chdir(dir);
    return dir;
  }

  it("keeps the pinned release on install, without a single request", async () => {
    process.env.INFERNUS_GITHUB_API = failingUrl;
    await seedCache(OLD);
    const dir = await project({ [NAME]: "^2.6.1" }, { [NAME]: OLD });

    await addDeps({});

    const lockfile = await fs.readJson(path.resolve(dir, "infernus-lock.json"));
    assert.equal(
      lockfile.dependencies[NAME].version,
      OLD,
      "a range must not walk forward behind the user's back",
    );
    assert.equal(
      await fs.readFile(path.resolve(dir, "plugins", "plugin-fixture.dll"), "utf8"),
      `dll ${OLD}`,
      "the files come from the cached build the lockfile names",
    );
  });

  it("moves the lockfile on update", async () => {
    process.env.INFERNUS_GITHUB_API = server.baseUrl;
    await seedCache(OLD);
    const dir = await project({ [NAME]: "^2.6.1" }, { [NAME]: OLD });

    await addDeps({}, "update");

    const lockfile = await fs.readJson(path.resolve(dir, "infernus-lock.json"));
    assert.equal(lockfile.dependencies[NAME].version, NEW);
    assert.equal(
      await fs.readFile(path.resolve(dir, "plugins", "plugin-fixture.dll"), "utf8"),
      "plugin-fixture.dll",
      "the new build's asset replaced the old one",
    );
  });

  it("resolves a dependency the lockfile does not record", async () => {
    process.env.INFERNUS_GITHUB_API = server.baseUrl;
    await seedCache();
    const dir = await project({ [NAME]: "^2.6.1" });

    await addDeps({});

    const lockfile = await fs.readJson(path.resolve(dir, "infernus-lock.json"));
    assert.equal(lockfile.dependencies[NAME].version, NEW, "a missing entry is resolved, like npm");
  });

  it("reproduces the lockfile on a frozen install and leaves it byte for byte", async () => {
    process.env.INFERNUS_GITHUB_API = failingUrl;
    await seedCache(OLD);
    const dir = await project({ [NAME]: "^2.6.1" }, { [NAME]: OLD });

    const before = await fs.readFile(path.resolve(dir, "infernus-lock.json"), "utf8");

    await addDeps({}, "frozen");

    assert.equal(
      await fs.readFile(path.resolve(dir, "infernus-lock.json"), "utf8"),
      before,
      "a frozen install must not rewrite the file it reproduces",
    );
    assert.equal(
      await fs.readFile(path.resolve(dir, "plugins", "plugin-fixture.dll"), "utf8"),
      `dll ${OLD}`,
    );
  });

  it("refuses an out of sync frozen install before touching anything", async () => {
    process.env.INFERNUS_GITHUB_API = server.baseUrl;
    await seedCache(OLD, NEW);
    const dir = await project({ [NAME]: "^2.7.0" }, { [NAME]: OLD });

    const manifestBefore = await fs.readFile(path.resolve(dir, "infernus.json"), "utf8");
    const lockBefore = await fs.readFile(path.resolve(dir, "infernus-lock.json"), "utf8");

    await assert.rejects(() => addDeps({}, "frozen"), /out of sync/);

    assert.equal(await fs.readFile(path.resolve(dir, "infernus.json"), "utf8"), manifestBefore);
    assert.equal(await fs.readFile(path.resolve(dir, "infernus-lock.json"), "utf8"), lockBefore);
    assert.equal(
      await fs.pathExists(path.resolve(dir, "plugins")),
      false,
      "nothing was placed either",
    );
  });

  it("takes no dependency arguments when frozen", async () => {
    await assert.rejects(
      () => addDeps({ dependencies: [`${NAME}@${OLD}`] }, "frozen"),
      /takes no dependencies/,
    );
  });

  it("leaves an up to date project untouched, edits included", async () => {
    process.env.INFERNUS_GITHUB_API = failingUrl;
    await seedCache(NEW);
    const dir = await project({ [NAME]: "^2.6.1" }, { [NAME]: NEW });

    await addDeps({});

    const plugin = path.resolve(dir, "plugins", "plugin-fixture.dll");
    assert.equal(await fs.readFile(plugin, "utf8"), `dll ${NEW}`, "the first install placed it");

    await fs.writeFile(plugin, "patched by the project");

    await addDeps({});

    assert.equal(
      await fs.readFile(plugin, "utf8"),
      "patched by the project",
      "an install with nothing to do must not rewrite the files it placed earlier",
    );
    assert.equal(
      (await fs.readJson(path.resolve(dir, "infernus-lock.json"))).dependencies[NAME].version,
      NEW,
    );
  });

  it("places the files again when the project lost them", async () => {
    process.env.INFERNUS_GITHUB_API = failingUrl;
    await seedCache(NEW);
    const dir = await project({ [NAME]: "^2.6.1" }, { [NAME]: NEW });

    await addDeps({});
    await fs.remove(path.resolve(dir, "plugins"));

    await addDeps({});

    assert.equal(
      await fs.readFile(path.resolve(dir, "plugins", "plugin-fixture.dll"), "utf8"),
      `dll ${NEW}`,
      "a fresh clone carries the lockfile and no plugins/, so they have to be placed",
    );
  });

  it("replaces the files when the release changes", async () => {
    process.env.INFERNUS_GITHUB_API = server.baseUrl;
    await seedCache(OLD);
    const dir = await project({ [NAME]: "^2.6.1" }, { [NAME]: OLD });

    await addDeps({});
    const plugin = path.resolve(dir, "plugins", "plugin-fixture.dll");
    await fs.writeFile(plugin, "patched by the project");

    await addDeps({}, "update");

    assert.equal(
      await fs.readFile(plugin, "utf8"),
      "plugin-fixture.dll",
      "a changing release has to replace the file the old build left",
    );
  });

  it("moves every declared dependency on a bare update", async () => {
    process.env.INFERNUS_GITHUB_API = server.baseUrl;
    await seedCache(OLD);
    const dir = await project({ [NAME]: "^2.6.1" }, { [NAME]: OLD });

    await addDeps({}, "update");

    assert.equal(
      (await fs.readJson(path.resolve(dir, "infernus-lock.json"))).dependencies[NAME].version,
      NEW,
    );
    assert.equal(
      (await fs.readJson(path.resolve(dir, "infernus.json"))).dependencies[NAME],
      "^2.6.1",
      "an update moves the lockfile, never the declaration",
    );
  });

  it("drops a lockfile entry for a dependency the manifest no longer declares", async () => {
    process.env.INFERNUS_GITHUB_API = failingUrl;
    await seedCache(NEW);
    const dir = await project({ [NAME]: "^2.6.1" }, { [NAME]: NEW, "gone/plugin": "1.0.0" });

    await addDeps({});

    const lockfile = await fs.readJson(path.resolve(dir, "infernus-lock.json"));
    assert.deepEqual(
      Object.keys(lockfile.dependencies),
      [NAME],
      "a generated lockfile describes the manifest, so an orphan entry is not carried forever",
    );
  });

  it("refuses a frozen install of a lockfile format it does not write", async () => {
    await seedCache(NEW);
    const dir = await project({ [NAME]: "^2.6.1" }, { [NAME]: NEW });
    await fs.writeJson(
      path.resolve(dir, "infernus-lock.json"),
      { lockfileVersion: 2, dependencies: { [NAME]: { version: NEW } } },
      { spaces: 2 },
    );

    await assert.rejects(() => addDeps({}, "frozen"), /lockfileVersion 2/);
  });
});

/**
 * npm's save-prefix: what a dependency that was named without a version ends up
 * declaring. The manifest is the project's own statement of intent, so an
 * existing declaration is never widened by an install-like command.
 */
describe("what add saves", () => {
  const cwd = process.cwd();
  const tempDirs: string[] = [];
  const cachePath = path.resolve(os.homedir(), ".infernus", "dependencies", "lockcheck");
  let server: Awaited<ReturnType<typeof startReleaseServer>>;

  before(async () => {
    server = await startReleaseServer([REPO]);
    process.env.INFERNUS_GITHUB_API = server.baseUrl;
  });

  after(async () => {
    process.chdir(cwd);
    delete process.env.INFERNUS_GITHUB_API;
    await server.close();
    await fs.remove(cachePath);
    await Promise.all(tempDirs.map((dir) => fs.remove(dir)));
  });

  async function project(manifest: Record<string, string> = {}) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-save-"));
    tempDirs.push(dir);
    await fs.writeJson(
      path.resolve(dir, "infernus.json"),
      { dependencies: manifest },
      {
        spaces: 2,
      },
    );
    process.chdir(dir);
    return dir;
  }

  it("declares a caret range for a dependency added without a version", async () => {
    const dir = await project();

    await addDeps({ dependencies: [NAME] });

    assert.equal(
      (await fs.readJson(path.resolve(dir, "infernus.json"))).dependencies[NAME],
      `^${NEW}`,
      "npm writes the caret range of the version it resolved",
    );
  });

  it("declares the exact tag with --save-exact", async () => {
    const dir = await project();

    await addDeps({ dependencies: [NAME], saveExact: true });

    assert.equal((await fs.readJson(path.resolve(dir, "infernus.json"))).dependencies[NAME], NEW);
  });

  it("keeps the range a project already declared", async () => {
    const dir = await project({ [NAME]: "^2.6.1" });

    await addDeps({ dependencies: [NAME] });

    assert.equal(
      (await fs.readJson(path.resolve(dir, "infernus.json"))).dependencies[NAME],
      "^2.6.1",
      "naming a dependency without a version must not widen what was declared",
    );
  });

  it("saves an explicit spec verbatim, including a wildcard", async () => {
    const dir = await project({ [NAME]: "^2.6.1" });

    await addDeps({ dependencies: [`${NAME}@*`] });

    assert.equal(
      (await fs.readJson(path.resolve(dir, "infernus.json"))).dependencies[NAME],
      "*",
      "a spec typed on the command line is what the manifest gets",
    );
  });
});
