import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { resolveRelease } from "../src/utils/api";
import { moveDependency, planCache } from "../src/utils/dep";
import { copyServer, decideFileAction } from "../src/utils/omp";

/** the real shape of openmultiplayer/open.mp releases */
const ompReleases = [
  "v1.6.7.3218",
  "v1.6.7.3217",
  "v1.5.8.3079",
  "v1.4.0.2779",
  "v1.1.0.2612",
  "v1-RC2",
].map((tag) => ({ tag_name: tag, assets: [] }));

const pluginReleases = ["v2.9.6", "2.6.1", "0.3.7"].map((tag) => ({
  tag_name: tag,
  assets: [],
}));

describe("resolveRelease", () => {
  it("takes the newest build for a range", () => {
    assert.equal(resolveRelease("^1.6.7", ompReleases)?.tag_name, "v1.6.7.3218");
    assert.equal(resolveRelease("^1.5.8", ompReleases)?.tag_name, "v1.6.7.3218");
    assert.equal(resolveRelease("~1.5.8", ompReleases)?.tag_name, "v1.5.8.3079");
    assert.equal(resolveRelease("*", ompReleases)?.tag_name, "v1.6.7.3218");
  });

  it("returns the exact release for a four segment pin", () => {
    assert.equal(resolveRelease("v1.6.7.3217", ompReleases)?.tag_name, "v1.6.7.3217");
    assert.equal(resolveRelease("v1.6.7.3218", ompReleases)?.tag_name, "v1.6.7.3218");
  });

  it("falls back to the closest release when a three segment pin has no tag", () => {
    // the reported bug: `1.6.7` is not a tag, `v1.6.7.3218` is the release
    assert.equal(resolveRelease("1.6.7", ompReleases)?.tag_name, "v1.6.7.3218");
    assert.equal(resolveRelease("v1.5.8", ompReleases)?.tag_name, "v1.5.8.3079");
  });

  it("does not invent a release that does not exist", () => {
    assert.equal(resolveRelease("9.9.9", ompReleases), null);
    assert.equal(resolveRelease("^9.9.9", ompReleases), null);
    assert.equal(resolveRelease("v1.6.7.9999", ompReleases), null);
  });

  it("never picks a tag whose version it cannot read", () => {
    assert.equal(resolveRelease("*", ompReleases)?.tag_name, "v1.6.7.3218");
    assert.notEqual(resolveRelease("*", ompReleases)?.tag_name, "v1-RC2");
  });

  it("handles plugin repositories without build numbers", () => {
    assert.equal(resolveRelease("^2.9.0", pluginReleases)?.tag_name, "v2.9.6");
    assert.equal(resolveRelease("~2.6.0", pluginReleases)?.tag_name, "2.6.1");
    assert.equal(resolveRelease("2.6.1", pluginReleases)?.tag_name, "2.6.1");
  });
});

describe("planCache", () => {
  const cachedVersions = ["v1.6.7.3218", "v1.6.7.3217", "v1.5.8.3079"];

  it("tells two builds apart when the request pins a release", () => {
    // the regression: both builds coerce to 1.6.7, so the old check called the
    // cached 3218 build the answer for a request of 3217
    const plan = planCache({
      cachedVersions: ["v1.6.7.3218", "v1.5.8.3079"],
      requested: "v1.6.7.3217",
      previousVersion: "v1.6.7.3218",
      isUpdate: true,
    });

    assert.equal(plan.cachedTag, null, "3218 must not satisfy a pin of 3217");
    assert.equal(plan.needsDownload, true);
  });

  it("reuses a cached build that is not the installed one", () => {
    const plan = planCache({
      cachedVersions,
      requested: "v1.6.7.3217",
      previousVersion: "v1.5.8.3079",
      isUpdate: true,
    });

    assert.equal(plan.cachedTag, "v1.6.7.3217");
    assert.equal(plan.needsDownload, false);
    assert.equal(plan.dropTag, null);
  });

  it("re-downloads the release the lockfile already pins during an update", () => {
    const plan = planCache({
      cachedVersions,
      requested: "v1.6.7.3218",
      previousVersion: "v1.6.7.3218",
      isUpdate: true,
    });

    assert.equal(plan.cachedTag, null);
    assert.equal(plan.dropTag, "v1.6.7.3218");
    assert.equal(plan.needsDownload, true);
  });

  it("keeps the cached release when the same install is repeated", () => {
    const plan = planCache({
      cachedVersions,
      requested: "v1.6.7.3218",
      previousVersion: "v1.6.7.3218",
      isUpdate: false,
    });

    assert.equal(plan.cachedTag, "v1.6.7.3218");
    assert.equal(plan.dropTag, null);
  });

  it("resolves a range over the repository instead of trusting the cache", () => {
    // the cache may hold an older build than the newest matching release, so a
    // range is never answered by "the newest cached build"
    const plan = planCache({
      cachedVersions,
      requested: "^1.5.8",
      previousVersion: "v1.5.8.3079",
      isUpdate: true,
    });

    assert.equal(plan.cachedTag, null);
    assert.equal(plan.needsDownload, true);
  });

  it("always re-resolves a wildcard", () => {
    const plan = planCache({
      cachedVersions,
      requested: "*",
      previousVersion: "v1.6.7.3218",
      isUpdate: true,
    });

    assert.equal(plan.needsDownload, true);
    assert.equal(plan.cachedTag, null);
  });

  it("downloads when nothing is cached or nothing matches", () => {
    assert.deepEqual(planCache({ cachedVersions: null, requested: "^1.6.7", isUpdate: false }), {
      cachedTag: null,
      needsDownload: true,
      dropTag: null,
    });
    assert.deepEqual(planCache({ cachedVersions: [], requested: "^1.6.7", isUpdate: false }), {
      cachedTag: null,
      needsDownload: true,
      dropTag: null,
    });
    assert.deepEqual(planCache({ cachedVersions, requested: "^9.0.0", isUpdate: false }), {
      cachedTag: null,
      needsDownload: true,
      dropTag: null,
    });
  });
});

/**
 * open.mp is the server the plugins run inside, so it is installed before them
 * and removed after them.
 *
 * An install list carries `owner/repo@^1.6.7` while a removal list carries the
 * bare `owner/repo`, and comparing whole entries matched neither: the server
 * silently kept whatever position the user wrote, which is exactly what the
 * ordering exists to override.
 */
describe("moveDependency", () => {
  const OMP = "openmultiplayer/open.mp";

  it("finds a versioned entry by its name alone", () => {
    const deps = ["dockfries/plugin@^2.9.6", `${OMP}@^1.6.7`, "dockfries/other@1.0.0"];

    assert.deepEqual(moveDependency(deps, OMP, "first"), [
      `${OMP}@^1.6.7`,
      "dockfries/plugin@^2.9.6",
      "dockfries/other@1.0.0",
    ]);
  });

  it("moves a bare entry to the back, which is how a removal orders it", () => {
    const deps = [OMP, "dockfries/plugin"];

    assert.deepEqual(moveDependency(deps, OMP, "last"), ["dockfries/plugin", OMP]);
  });

  it("carries the entry verbatim, version suffix included", () => {
    const moved = moveDependency(["a/b@^1.0.0", `${OMP}@1.6.7.3218`], OMP, "first");

    assert.equal(moved[0], `${OMP}@1.6.7.3218`);
  });

  it("returns an untouched copy when the name is not in the list", () => {
    const deps = ["a/b@1.0.0"];
    const moved = moveDependency(deps, OMP, "first");

    assert.deepEqual(moved, deps);
    assert.notEqual(moved, deps, "the caller's list must not be mutated");
  });

  it("does not take a name for a prefix of another", () => {
    const deps = [`${OMP}-extra@1.0.0`, `${OMP}@1.6.7`];

    assert.deepEqual(moveDependency(deps, OMP, "first"), [`${OMP}@1.6.7`, `${OMP}-extra@1.0.0`]);
  });
});

describe("decideFileAction", () => {
  const shipped = { size: 10, sha256: "new" };
  const previousInstall = { size: 10, sha256: "old" };

  it("installs a file the project does not have", () => {
    assert.equal(decideFileAction({ isUserFile: false, installed: null, shipped }), "install");
  });

  it("overwrites the previous build's untouched file", () => {
    assert.equal(
      decideFileAction({
        isUserFile: false,
        installed: previousInstall,
        shipped,
        previouslyInstalled: previousInstall,
      }),
      "overwrite",
    );
  });

  it("keeps a file the project edited", () => {
    assert.equal(
      decideFileAction({
        isUserFile: false,
        installed: { size: 12, sha256: "edited" },
        shipped,
        previouslyInstalled: previousInstall,
      }),
      "keep",
    );
  });

  it("leaves an identical file alone instead of rewriting it", () => {
    assert.equal(
      decideFileAction({
        isUserFile: false,
        installed: { size: 10, sha256: "new" },
        shipped,
        previouslyInstalled: previousInstall,
      }),
      "current",
    );
  });

  it("never replaces the files a running server owns", () => {
    for (const installed of [null, previousInstall, { size: 99, sha256: "mine" }]) {
      assert.equal(
        decideFileAction({
          isUserFile: true,
          installed,
          shipped,
          previouslyInstalled: previousInstall,
        }),
        installed === null ? "install" : "keep",
      );
    }
  });

  /**
   * With no history there is nothing to compare against, but a plain server file
   * that differs from what is being installed is an older build rather than an
   * edit — the project is not expected to edit it. Keeping it made an upgrade
   * report "4 kept (modified by this project)" and change nothing on disk while
   * the lockfile moved to the new version.
   */
  it("replaces a plain server file when no history is known", () => {
    assert.equal(
      decideFileAction({
        isUserFile: false,
        installed: { size: 10, sha256: "from-some-old-build" },
        shipped,
        previouslyInstalled: undefined,
      }),
      "overwrite",
    );
  });

  it("still keeps a file the project owns when no history is known", () => {
    assert.equal(
      decideFileAction({
        isUserFile: true,
        installed: { size: 10, sha256: "edited by the operator" },
        shipped,
        previouslyInstalled: undefined,
      }),
      "keep",
    );
  });
});

describe("copyServer", () => {
  const tempRoots: string[] = [];
  async function makeDir(files: Record<string, string>) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-omp-"));
    tempRoots.push(root);
    await Promise.all(
      Object.entries(files).map(async ([name, content]) => {
        const target = path.resolve(root, name);
        await fs.ensureDir(path.dirname(target));
        await fs.writeFile(target, content);
      }),
    );
    return root;
  }

  after(async () => {
    await Promise.all(tempRoots.map((root) => fs.remove(root)));
  });

  it("installs every shipped file into an empty project", async () => {
    const source = await makeDir({
      "omp-server.exe": "new-server",
      "libnode.dll": "new-lib",
      "config.json": "default-config",
    });
    const target = await makeDir({});

    const result = await copyServer({ source, target });

    assert.deepEqual(result.written.sort(), ["config.json", "libnode.dll", "omp-server.exe"]);
    assert.equal(await fs.readFile(path.resolve(target, "omp-server.exe"), "utf8"), "new-server");
  });

  it("replaces shipped files when the project still has the previous build", async () => {
    const previous = await makeDir({
      "omp-server.exe": "old-server-build",
      "libnode.dll": "old-lib",
      "config.json": "default-config",
    });
    const source = await makeDir({
      "omp-server.exe": "new-server-build",
      "libnode.dll": "new-lib-here",
      "config.json": "default-config-v2",
    });
    // the project currently holds exactly what the previous build shipped
    const target = await makeDir({
      "omp-server.exe": "old-server-build",
      "libnode.dll": "old-lib",
      "config.json": "default-config",
    });

    const result = await copyServer({ source, target, previousPath: previous });

    assert.ok(result.written.includes("omp-server.exe"), "the server must be upgraded");
    assert.ok(result.written.includes("libnode.dll"));
    assert.equal(
      await fs.readFile(path.resolve(target, "omp-server.exe"), "utf8"),
      "new-server-build",
    );
    // a run time config belongs to the project and is never replaced
    assert.ok(result.kept.includes("config.json"));
    assert.equal(await fs.readFile(path.resolve(target, "config.json"), "utf8"), "default-config");
  });

  /**
   * A plain server file with no history is treated as an older build rather than
   * as an edit. The project is not expected to edit `omp-server.exe`, and keeping
   * it means the upgrade changes nothing while the lockfile moves on — the
   * failure mode is silent, which is worse than replacing a file the project was
   * not supposed to touch.
   */
  it("replaces a plain server file when nothing proves where it came from", async () => {
    const source = await makeDir({ "omp-server.exe": "new-server-build" });
    const target = await makeDir({ "omp-server.exe": "something-we-did-not-install" });

    const result = await copyServer({ source, target, previousPath: null });

    assert.deepEqual(result.written, ["omp-server.exe"]);
    assert.deepEqual(result.kept, []);
    assert.equal(
      await fs.readFile(path.resolve(target, "omp-server.exe"), "utf8"),
      "new-server-build",
    );
  });

  it("keeps files the project modified itself", async () => {
    const previous = await makeDir({
      "omp-server.exe": "old-server-build",
      "libnode.dll": "old-lib",
    });
    const source = await makeDir({
      "omp-server.exe": "new-server-build",
      "libnode.dll": "new-lib-here",
    });
    const target = await makeDir({
      "omp-server.exe": "old-server-build",
      "libnode.dll": "project-patched-lib",
    });

    const result = await copyServer({ source, target, previousPath: previous });

    assert.ok(result.written.includes("omp-server.exe"));
    assert.ok(result.kept.includes("libnode.dll"));
    assert.equal(
      await fs.readFile(path.resolve(target, "libnode.dll"), "utf8"),
      "project-patched-lib",
    );
  });

  it("leaves a file alone when the project already has this build", async () => {
    const previous = await makeDir({ "omp-server.exe": "old-server-build" });
    const source = await makeDir({ "omp-server.exe": "new-server-build" });
    const target = await makeDir({ "omp-server.exe": "new-server-build" });

    const result = await copyServer({ source, target, previousPath: previous });

    assert.deepEqual(result.written, []);
    assert.deepEqual(result.unchanged, ["omp-server.exe"]);
  });

  it("still installs with a cold cache, without touching user files", async () => {
    const source = await makeDir({
      "omp-server.exe": "new-server",
      "config.json": "default-config",
      "bans.json": "[]",
    });
    const target = await makeDir({
      "omp-server.exe": "old-server",
      "config.json": "my-config",
      "bans.json": "my-bans",
    });

    const result = await copyServer({ source, target, previousPath: null });

    // the server file is brought up to date, while the files a running server
    // owns are the project's and are never touched
    assert.deepEqual(result.written, ["omp-server.exe"]);
    assert.deepEqual(result.kept.sort(), ["bans.json", "config.json"]);
    assert.equal(await fs.readFile(path.resolve(target, "config.json"), "utf8"), "my-config");
  });

  it("copies files the new build adds that the project does not have", async () => {
    const previous = await makeDir({ "omp-server.exe": "old-server" });
    const source = await makeDir({ "omp-server.exe": "new-server", "components/new.so": "plugin" });
    const target = await makeDir({ "omp-server.exe": "old-server" });

    const result = await copyServer({ source, target, previousPath: previous });

    assert.ok(result.written.includes("components/new.so"));
    assert.equal(await fs.readFile(path.resolve(target, "components/new.so"), "utf8"), "plugin");
  });
});
