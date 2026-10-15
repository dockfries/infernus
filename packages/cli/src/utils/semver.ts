import semver from "semver";
import { isRangeSpec, parseTag } from "./release";

/**
 * Whether a dependency version in `infernus.json` can be understood at all.
 *
 * Both shapes users write are accepted: a semver range (`*`, `^1.5.8`) and a
 * literal release tag, including open.mp's four segment ones (`v1.6.7.3218`).
 * Checking the tag first matters because `semver.coerce('v1.6.7.3218')` reports
 * `1.6.7`, which would silently accept and then lose the build number.
 */
export function validRange(version: string) {
  if (version === "*") return true;
  if (parseTag(version)) return true;
  if (!isRangeSpec(version)) return false;
  return semver.validRange(version) !== null;
}
