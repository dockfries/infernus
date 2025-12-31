import semver, { type SemVer } from "semver";

export function minSatisfying(versions: string[], range: string) {
  const allVersion = versions
    .map((version) => [version, semver.coerce(version)])
    .filter((s) => !!s[1]) as [string, SemVer][];
  if (!allVersion.length) return null;

  const descVersions = semver.rsort(allVersion.map((s) => s[1]));
  if (!descVersions.length) return null;

  if (range === "*") {
    const maxVersion = allVersion.find(
      (s) => s[1].version === descVersions[0].version,
    );
    return maxVersion ? maxVersion[0] : null;
  }

  const coerceRange = semver.coerce(range);
  if (!coerceRange) return null;

  const satisfy = semver.minSatisfying(descVersions, range);
  if (satisfy) {
    return allVersion.find((s) => s[1].version === satisfy.version)?.[0];
  }
  return null;
}

export function validRange(range: string) {
  if (range === "*") return true;
  const coerceRange = semver.coerce(range);
  if (!coerceRange) return false;
  return semver.validRange(coerceRange.version);
}
