import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  compareTag,
  isRangeSpec,
  isSameReleaseTag,
  matchByRange,
  parseTag,
  satisfiesSpec,
  saveSpecFor,
  type ParsedTag,
} from "../src/utils/release";
import { validRange } from "../src/utils/semver";

/** every tag openmultiplayer/open.mp has published, newest first */
const OMP_TAGS = [
  "v1.6.7.3218",
  "v1.6.7.3217",
  "v1.5.8.3079",
  "v1.4.0.2779",
  "v1.3.1.2748",
  "v1.2.0.2670",
  "v1.1.0.2612",
  "v1-RC2",
  "v1-RC1",
];

/** tags used by the plugin repositories, three segments and some with a `v` */
const PLUGIN_TAGS = ["v2.9.6", "2.6.1", "0.3.7"];

const parseAll = (tags: string[]) =>
  tags.map(parseTag).filter((parsed): parsed is ParsedTag => parsed !== null);

describe("parseTag", () => {
  it("keeps the build number of four segment tags instead of flattening it", () => {
    const bleeding = parseTag("v1.6.7.3217");
    const promoted = parseTag("v1.6.7.3218");

    assert.ok(bleeding && promoted);
    // semver.coerce would report "1.6.7" for both, losing the only difference
    assert.equal(bleeding.version.version, "1.6.7");
    assert.equal(promoted.version.version, "1.6.7");
    assert.equal(bleeding.build, 3217);
    assert.equal(promoted.build, 3218);
    assert.equal(isSameReleaseTag(bleeding.tag, promoted.tag), false);
    assert.equal(isSameReleaseTag(promoted.tag, promoted.tag), true);
  });

  it("keeps the tag verbatim as the cache key", () => {
    assert.equal(parseTag("v1.6.7.3218")?.tag, "v1.6.7.3218");
    assert.equal(parseTag("2.6.1")?.tag, "2.6.1");
  });

  it("parses three segment tags with and without the v prefix", () => {
    assert.equal(parseTag("v2.9.6")?.version.version, "2.9.6");
    assert.equal(parseTag("2.6.1")?.version.version, "2.6.1");
    assert.equal(parseTag("v2.9.6")?.build, null);
  });

  it("parses prerelease tags and keeps the identifier whole", () => {
    assert.equal(parseTag("1.6.7-rc.1")?.version.version, "1.6.7-rc.1");
    assert.equal(parseTag("1.6.7-rc.1")?.build, null);
    // everything after the hyphen is the prerelease; the build is the segment a
    // dot introduced after x.y.z, never a digit inside a prerelease
    assert.equal(parseTag("1.6.7-rc.1.9")?.version.version, "1.6.7-rc.1.9");
    assert.equal(parseTag("1.6.7-rc.1.9")?.build, null);
  });

  it("orders a build above the version it extends, and prereleases below it", () => {
    const tag = (value: string) => parseTag(value)!;

    assert.ok(compareTag(tag("1.6.7.3218"), tag("1.6.7.3217")) > 0);
    assert.ok(compareTag(tag("1.6.7.3217"), tag("1.6.7.3218")) < 0);
    assert.ok(compareTag(tag("1.6.7.3217"), tag("1.6.7")) > 0);
    assert.ok(compareTag(tag("1.6.7"), tag("1.6.7-rc.2")) > 0);
    assert.ok(compareTag(tag("1.6.7-rc.2"), tag("1.6.7-rc.1")) > 0);
    assert.ok(compareTag(tag("v1.6.7.3218"), tag("v1.5.8.3079")) > 0);
  });

  it("rejects tags it cannot compare", () => {
    for (const tag of ["v1-RC2", "v1-RC1", "latest", "", "1.6", "nightly-2024"]) {
      assert.equal(parseTag(tag), null, `${tag} must not parse`);
    }
  });
});

describe("matchByRange", () => {
  const omp = parseAll(OMP_TAGS);

  it("matches a four segment tag against its own range", () => {
    assert.equal(matchByRange(omp, "^1.6.7")?.tag, "v1.6.7.3218");
    assert.equal(matchByRange(omp, "1.6.7")?.tag, "v1.6.7.3218");
    assert.equal(matchByRange(omp, "~1.6.7")?.tag, "v1.6.7.3218");
  });

  it("picks the newest build when several builds satisfy the range", () => {
    // the regression: both builds report 1.6.7, only the build number orders them
    assert.equal(matchByRange(omp, "^1.6.7")?.tag, "v1.6.7.3218");
    assert.equal(matchByRange(omp, "1.6.7")?.tag, "v1.6.7.3218");
    // npm reads `^1.6.7.3217` as a prerelease range, and a stable release must
    // not satisfy a prerelease range, exactly as `npm install` behaves
    assert.equal(matchByRange(omp, "^1.6.7.3217"), null);
    assert.equal(matchByRange(omp, ">=1.6.7-0")?.tag, "v1.6.7.3218");
  });

  it("does not let a newer build satisfy an older range across minors", () => {
    assert.equal(matchByRange(omp, "^1.5.8")?.tag, "v1.6.7.3218");
    assert.equal(matchByRange(omp, "~1.5.8")?.tag, "v1.5.8.3079");
    assert.equal(matchByRange(omp, "^1.4.0")?.tag, "v1.6.7.3218");
  });

  it("takes the newest release for a wildcard", () => {
    assert.equal(matchByRange(omp, "*")?.tag, "v1.6.7.3218");
  });

  it("returns null when nothing satisfies the range", () => {
    assert.equal(matchByRange(omp, "^9.9.9"), null);
    assert.equal(matchByRange(omp, "~1.1.0")?.tag, "v1.1.0.2612");
  });

  it("handles plugin style tags without builds", () => {
    const plugins = parseAll(PLUGIN_TAGS);
    assert.equal(matchByRange(plugins, "^2.9.0")?.tag, "v2.9.6");
    assert.equal(matchByRange(plugins, "^2.6.1")?.tag, "v2.9.6");
    assert.equal(matchByRange(plugins, "~2.6.0")?.tag, "2.6.1");
  });

  it("never selects a tag it cannot parse", () => {
    const selected = matchByRange(omp, "*");
    assert.ok(selected && selected.tag !== "v1-RC2" && selected.tag !== "v1-RC1");
  });
});

describe("isRangeSpec", () => {
  it("treats npm style ranges as ranges", () => {
    for (const spec of ["*", "", "^1.5.8", "~1.6.7", ">=1.2.0 <2.0.0"]) {
      assert.equal(isRangeSpec(spec), true, `${spec} is a range`);
    }
  });

  it("treats release tags as pins, including four segment ones", () => {
    for (const spec of ["v1.6.7.3218", "1.6.7.3218", "2.6.1", "v2.9.6"]) {
      assert.equal(isRangeSpec(spec), false, `${spec} is a pin`);
    }
  });
});

/**
 * The question a lockfile answers before anything is resolved: does the release
 * it records still satisfy what the manifest declares? npm re-resolves only the
 * entries that fail it, so getting this wrong either freezes a project that the
 * manifest has moved past or upgrades one it did not.
 */
describe("satisfiesSpec", () => {
  it("answers a range with npm's own rules", () => {
    assert.equal(satisfiesSpec("2.6.1", "^2.6.1"), true);
    assert.equal(satisfiesSpec("2.8.1", "^2.6.1"), true);
    assert.equal(satisfiesSpec("3.0.0", "^2.6.1"), false);
    assert.equal(satisfiesSpec("2.5.9", "^2.6.1"), false);
    assert.equal(satisfiesSpec("2.6.1", "*"), true);
  });

  it("ignores the build number of a range and the v prefix", () => {
    assert.equal(satisfiesSpec("v1.6.7.3218", "^1.6.7"), true);
    assert.equal(satisfiesSpec("1.6.7.3218", "^1.6.7"), true);
    assert.equal(satisfiesSpec("v1.5.8.3079", "^1.6.7"), false);
  });

  it("treats a three segment pin as the release family it names", () => {
    // open.mp publishes v1.6.7.3218 and never 1.6.7, which is exactly the
    // fallback resolveRelease makes, so a pin and its lockfile agree
    assert.equal(satisfiesSpec("v1.6.7.3218", "1.6.7"), true);
    assert.equal(satisfiesSpec("v1.6.7.3217", "1.6.7"), true);
    // a four segment pin names one build, so its neighbours do not answer it
    assert.equal(satisfiesSpec("v1.6.7.3218", "1.6.7.3217"), false);
    assert.equal(satisfiesSpec("v1.6.7.3217", "1.6.7.3217"), true);
  });

  it("does not confuse two plugin tags that share a version", () => {
    assert.equal(satisfiesSpec("2.6.1", "2.6.1"), true);
    assert.equal(satisfiesSpec("v2.6.1", "2.6.1"), true);
    assert.equal(satisfiesSpec("2.7.1", "2.6.1"), false);
  });

  it("does not let a prerelease answer a stable declaration", () => {
    assert.equal(satisfiesSpec("1.6.7-rc.1", "1.6.7"), false);
    assert.equal(satisfiesSpec("1.7.0-omp", "^1.7.0-omp"), true);
  });

  it("cannot answer for a release it cannot read", () => {
    assert.equal(satisfiesSpec("latest", "^1.6.7"), false);
    assert.equal(satisfiesSpec(null, "^1.6.7"), false);
    assert.equal(satisfiesSpec(undefined, "*"), false);
  });
});

/**
 * What a dependency added without a version ends up declaring. npm writes the
 * caret range of the version it resolved; the build number is dropped from that
 * form because `^1.6.7.3218` is not a range at all, while `v1.6.7.3218` still
 * satisfies `^1.6.7`.
 */
describe("saveSpecFor", () => {
  it("writes a caret range on the released version", () => {
    assert.equal(saveSpecFor("2.8.1"), "^2.8.1");
    assert.equal(saveSpecFor("v2.9.6"), "^2.9.6");
    assert.equal(saveSpecFor("0.3.7"), "^0.3.7");
  });

  it("drops the build number, which a range cannot carry", () => {
    assert.equal(saveSpecFor("v1.6.7.3218"), "^1.6.7");
    assert.equal(satisfiesSpec("v1.6.7.3218", saveSpecFor("v1.6.7.3218")), true);
  });

  it("keeps a prerelease, since a range without it would not match the release", () => {
    assert.equal(saveSpecFor("1.7.0-omp"), "^1.7.0-omp");
    assert.equal(satisfiesSpec("1.7.0-omp", saveSpecFor("1.7.0-omp")), true);
  });

  it("keeps the tag verbatim as an exact declaration", () => {
    assert.equal(saveSpecFor("v1.6.7.3218", true), "v1.6.7.3218");
    assert.equal(saveSpecFor("2.8.1", true), "2.8.1");
  });

  it("produces a spec the CLI accepts", () => {
    for (const tag of ["2.8.1", "v2.9.6", "v1.6.7.3218", "1.7.0-omp"]) {
      assert.equal(validRange(saveSpecFor(tag)), true, `${saveSpecFor(tag)} must be installable`);
    }
  });
});
