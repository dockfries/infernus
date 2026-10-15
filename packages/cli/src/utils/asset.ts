import path from "node:path";

/**
 * The extension of an asset, normalised for comparison.
 *
 * `path.extname` keeps the leading dot, so comparing its result against `dll`
 * silently never matches: plugins get downloaded and then never placed in the
 * project, and removals leave them behind. Every extension check goes through
 * here so that class of mistake cannot come back.
 */
export function assetExtension(nameOrPath: string) {
  return path.extname(nameOrPath).slice(1).toLowerCase();
}

/** Whether an asset is a plugin binary. */
export function isPluginAsset(nameOrPath: string) {
  const extension = assetExtension(nameOrPath);
  return extension === "dll" || extension === "so";
}

/** Whether an asset is a Pawn include. */
export function isIncludeAsset(nameOrPath: string) {
  return assetExtension(nameOrPath) === "inc";
}

/** longer than any real asset pattern, and long enough to backtrack badly */
const MAX_ASSET_PATTERN = 512;
/** a quantifier applied to a group that itself quantifies: `(a+)+`, `(a*)*` */
const NESTED_QUANTIFIER = /\([^)]*[+*][^)]*\)\s*[+*{]/;
/** a quantifier applied twice in a row: `a++`, `a*+` */
const STACKED_QUANTIFIER = /[+*]][+*{]/;

/**
 * Match a release asset against the pattern a dependency declared.
 *
 * The pattern comes from someone else's `pawn.json` and is used as a regular
 * expression, so a nested quantifier in it turns matching into exponential
 * backtracking: `(a+)+$` against a long asset name never returns, and a
 * synchronous test with no deadline would hang the command with no way out. A
 * pattern that is that shapeless cannot be matching a real file name anyway, so
 * it throws instead of being run.
 *
 * @throws {Error} when the declared pattern cannot be used safely
 */
export function assetMatchesPattern(pattern: string, assetName: string) {
  if (pattern.length > MAX_ASSET_PATTERN) {
    throw new Error(`asset pattern is too long (${pattern.length} characters)`);
  }
  if (NESTED_QUANTIFIER.test(pattern) || STACKED_QUANTIFIER.test(pattern)) {
    throw new Error(`asset pattern "${pattern}" nests quantifiers and cannot be matched safely`);
  }

  return new RegExp(pattern).test(assetName);
}
