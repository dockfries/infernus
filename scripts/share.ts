import fs from "node:fs";
import path from "node:path";
import { execa } from "execa";

export const rootPkgJsonPath = path.resolve(process.cwd(), "package.json");

export const pkgDir = path.resolve(process.cwd(), "./packages");

export const pkgNames = fs.readdirSync(pkgDir).filter((dirPath) => {
  return fs.statSync(path.resolve(pkgDir, dirPath)).isDirectory();
});

export async function build(pkgName) {
  const pkgPath = path.resolve(pkgDir, pkgName);

  const pkgRollupConfig = path.resolve(pkgPath, "rollup.config.js");

  const useSelfConfig = fs.existsSync(pkgRollupConfig);

  const args = [
    "-c",
    useSelfConfig ? pkgRollupConfig : "",
    "--environment",
    `TARGET:${pkgName}`,
  ].filter(Boolean);

  await execa("rollup", args, {
    cwd: useSelfConfig ? pkgPath : process.cwd(),
    stdio: "inherit",
  });
}
