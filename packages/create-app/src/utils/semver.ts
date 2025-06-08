import semver, { type SemVer } from "semver";

export function minSatisfying(versions: string[], range: string) {
  if (range === "*") {
    const allVersion = versions
      .map((version) => [version, semver.coerce(version)])
      .filter((s) => Boolean(s[1])) as [string, SemVer][];
    const descVersions = semver.rsort(allVersion.map((s) => s[1]));
    if (!descVersions.length) return null;
    const minSatisfying = allVersion.find(
      (s) => s[1].version === descVersions[0].version,
    );
    return minSatisfying ? minSatisfying[0] : null;
  }

  const satisfy = semver.minSatisfying(versions, range);
  if (satisfy) return satisfy;
  const coerceRange = semver.coerce(range);
  if (!coerceRange) return null;
  return versions.find((version) => {
    const coerceVersion = semver.coerce(version);
    if (!coerceVersion) return;
    return semver.minSatisfying([coerceVersion], coerceRange.version);
  });
}

export function validRange(range: string) {
  if (range === "*") return true;
  const coerceRange = semver.coerce(range);
  if (!coerceRange) return false;
  return semver.validRange(coerceRange.version);
}
