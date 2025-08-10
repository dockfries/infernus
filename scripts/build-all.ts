import { pkgNames, build } from "./share";

const fixedSort = ["streamer", "core"];

async function buildAll() {
  const _pkgNames = fixedSort.concat(
    pkgNames.filter((pkgName) => !fixedSort.includes(pkgName)),
  );
  for (const pkgName of _pkgNames) {
    await build(pkgName);
  }
}
buildAll();
