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
