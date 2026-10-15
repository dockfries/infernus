import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { planCache } from "../src/utils/plan";

/**
 * The cache decision decides whether a build is reused, re-downloaded or
 * fetched, so every branch is pinned here.
 */
describe("planCache", () => {
  const miss = { cachedTag: null, dropTag: null, needsDownload: true };

  it("cannot answer when the dependency was never installed", () => {
    assert.deepEqual(planCache({ cachedVersions: null, requested: "1.6.7" }), miss);
  });

  it("reuses a cached release that a pin names exactly", () => {
    assert.deepEqual(
      planCache({
        cachedVersions: ["v1.6.7.3218", "v1.6.6.3000"],
        requested: "v1.6.7.3218",
      }),
      { cachedTag: "v1.6.7.3218", dropTag: null, needsDownload: false },
    );
  });

  it("does not confuse two builds of the same version", () => {
    // both coerce to 1.6.7, so only the build number tells them apart
    assert.deepEqual(
      planCache({ cachedVersions: ["v1.6.7.3217"], requested: "v1.6.7.3218" }),
      miss,
    );
  });

  it("asks the repository for a range, even when the cache could satisfy it", () => {
    // a newer matching release may exist, so the cache must not short circuit it
    assert.deepEqual(planCache({ cachedVersions: ["v1.6.7.3218"], requested: "^1.6.7" }), miss);
  });

  it("re-downloads a pinned release when an update asks for it again", () => {
    assert.deepEqual(
      planCache({
        cachedVersions: ["v1.6.7.3218"],
        requested: "v1.6.7.3218",
        previousVersion: "v1.6.7.3218",
        isUpdate: true,
      }),
      { cachedTag: null, dropTag: "v1.6.7.3218", needsDownload: true },
    );
  });

  it("still reuses a pinned release when it is not the installed one", () => {
    assert.deepEqual(
      planCache({
        cachedVersions: ["v1.6.7.3218"],
        requested: "v1.6.7.3218",
        previousVersion: "v1.6.6.3000",
        isUpdate: true,
      }),
      { cachedTag: "v1.6.7.3218", dropTag: null, needsDownload: false },
    );
  });

  it("treats a request that names no release as a range", () => {
    assert.deepEqual(planCache({ cachedVersions: ["2.6.1"], requested: "*" }), miss);
  });
});
