import semver from "semver";

/**
 * A release tag parsed into something comparable.
 *
 * open.mp publishes four segment tags (`v1.6.7.3218`) where the last segment is
 * the build number. Keeping that build in semver's build metadata means the
 * version range rules of npm still apply (`^1.6.7` matches `v1.6.7.3218`, as npm
 * ignores build metadata when matching), while the build stays available to tell
 * two consecutive builds apart. That distinction is exactly what
 * `semver.coerce` loses: it flattens `v1.6.7.3217` and `v1.6.7.3218` to `1.6.7`.
 */
export interface ParsedTag {
  /** the tag exactly as published, e.g. "v1.6.7.3218"; used as the cache key */
  tag: string;
  /** the semver this tag represents, with the build number as build metadata */
  version: semver.SemVer;
  /** the build number when the tag carried a fourth segment */
  build: number | null;
}

const TAG_PATTERN = /^(\d+)\.(\d+)\.(\d+)(.*)$/;

export function parseTag(tag: string): ParsedTag | null {
  if (typeof tag !== "string") return null;

  const matched = TAG_PATTERN.exec(tag.trim().replace(/^v/, ""));
  if (!matched) return null;

  const [, major, minor, patch, rest] = matched;
  const core = `${major}.${minor}.${patch}`;

  // The build is the fourth segment, and the fourth segment is only ever the one
  // a dot introduced straight after `x.y.z` (`v1.6.7.3218`). Everything after a
  // hyphen is the prerelease, kept whole: `1.6.7-rc.1` cannot be split any other
  // way without guessing whether the `1` ends the identifier or the build.
  const explicitBuild = /^\.(\d+)$/.exec(rest);
  const prerelease = explicitBuild ? "" : rest.replace(/^-/, "");
  const build = explicitBuild ? Number(explicitBuild[1]) : null;

  try {
    const version = new semver.SemVer(
      `${core}${prerelease ? `-${prerelease}` : ""}${build !== null ? `+${build}` : ""}`,
    );

    return { tag: tag.trim(), version, build };
  } catch {
    return null;
  }
}

/**
 * Order two tags.
 *
 * Semver decides the base version and the prerelease, then the build number
 * breaks the remaining tie. A build counts as newer than the version it extends
 * (`1.6.7.3218 > 1.6.7`), which is what open.mp means by publishing
 * `v1.6.7.3218` after `v1.6.7.3217`, and tags without a build compare as they
 * always did.
 */
export function compareTag(a: ParsedTag, b: ParsedTag) {
  const byCore = semver.compare(
    new semver.SemVer(`${a.version.major}.${a.version.minor}.${a.version.patch}`),
    new semver.SemVer(`${b.version.major}.${b.version.minor}.${b.version.patch}`),
  );
  if (byCore !== 0) return byCore;

  const byPrerelease = semver.compare(
    new semver.SemVer(
      `0.0.0${a.version.prerelease.length ? `-${a.version.prerelease.join(".")}` : ""}`,
    ),
    new semver.SemVer(
      `0.0.0${b.version.prerelease.length ? `-${b.version.prerelease.join(".")}` : ""}`,
    ),
  );
  if (byPrerelease !== 0) return byPrerelease;

  return (a.build ?? -1) - (b.build ?? -1);
}

/** Whether a dependency spec is a semver range (as npm writes it) rather than a release tag. */
export function isRangeSpec(spec: string) {
  if (spec === "" || spec === "*") return true;
  if (parseTag(spec)) return false;
  return semver.validRange(spec) !== null;
}

/**
 * Whether a dependency spec already points at exactly the cached release.
 *
 * Written on the tags rather than on coerced versions: `coerce` reports `1.6.7`
 * for both `v1.6.7.3217` and `v1.6.7.3218`, so comparing coerced versions would
 * call two different builds the same download.
 *
 * The optional `v` prefix is ignored, because repositories are inconsistent
 * about it: samp-node tags `2.6.1` where open.mp tags `v1.6.7.3218`, and a user
 * should be able to write either. The build number still decides, so a pin of
 * `1.6.7.3217` never matches the cached `v1.6.7.3218`.
 */
export function isSameReleaseTag(a?: string | null, b?: string | null) {
  if (!a || !b) return false;

  const parsedA = parseTag(a);
  const parsedB = parseTag(b);
  if (!parsedA || !parsedB) return parsedA === null && parsedB === null && a === b;

  return withoutVersionPrefix(parsedA.tag) === withoutVersionPrefix(parsedB.tag);
}

/** `v1.6.7.3218` and `1.6.7.3218` name the same release */
export function withoutVersionPrefix(tag: string) {
  return tag.replace(/^v(?=\d)/i, "");
}

/**
 * The newest tag a range can be satisfied by.
 *
 * Semver decides membership with npm's own rules, so `^1.6.7` accepts
 * `v1.6.7.3218` (a build is metadata, not a prerelease) and rejects
 * `v1.5.8.3079`; the build number then decides the winner among the tags that
 * matched, which is the part npm cannot do because it treats `1.6.7+3217` and
 * `1.6.7+3218` as the same version.
 */
export function matchByRange(parsedVersions: ParsedTag[], range: string) {
  const candidates = parsedVersions.filter((parsed) => semver.satisfies(parsed.version, range));

  if (!candidates.length) return null;

  return candidates.reduce((newest, parsed) => (compareTag(parsed, newest) > 0 ? parsed : newest));
}

/**
 * Whether a locked tag still answers what the manifest declares.
 *
 * This is the question a lockfile has to answer before anything is resolved, and
 * npm's rule for it: an entry is authoritative while the manifest still accepts
 * it, and only the entries that fail this are resolved again.
 *
 * A range is decided by npm's own rules, where the build number is metadata and
 * is therefore ignored. A pin is compared as the tag it names, so a `v` prefix
 * does not matter and the build number still does. A three segment pin names the
 * release *family* rather than one build, because open.mp publishes
 * `v1.6.7.3218` and never `1.6.7`; that is the same fallback `resolveRelease`
 * makes, so a pin and its lockfile agree on what it means.
 */
export function satisfiesSpec(tag: string | null | undefined, spec: string) {
  const parsed = parseTag(tag ?? "");
  if (!parsed) return false;

  if (isRangeSpec(spec)) return semver.satisfies(parsed.version, spec);

  const pin = parseTag(spec);
  if (!pin) return false;
  if (isSameReleaseTag(tag, spec)) return true;

  return pin.build === null && semver.satisfies(parsed.version, pin.version.version);
}

/**
 * The spec to declare for a release, the way npm saves one.
 *
 * npm writes a caret range on the version it resolved, and `--save-exact` writes
 * the version itself. The build number is dropped from the caret form on
 * purpose: `^1.6.7` is a range open.mp's `v1.6.7.3218` satisfies, while
 * `^1.6.7.3218` is not a range at all. The exact form keeps the tag verbatim, so
 * a four segment pin still names one build.
 *
 * This only ever sees a tag that resolution produced, which already had to be
 * parseable, so the fallback covers a case that cannot happen rather than one
 * that does.
 */
export function saveSpecFor(tag: string, exact = false) {
  const parsed = parseTag(tag);
  if (!parsed || exact) return tag;

  return `^${parsed.version.version}`;
}
