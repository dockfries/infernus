import fs from "node:fs";
import path from "node:path";
import { execa } from "execa";
import { typeCheck } from "./type-check";

export const rootPkgJsonPath = path.resolve(process.cwd(), "package.json");

export const pkgDir = path.resolve(process.cwd(), "./packages");

const excludePkg = ["types", "shared"];

export const pkgNames = fs.readdirSync(pkgDir).filter((dirPath) => {
  return fs.statSync(path.resolve(pkgDir, dirPath)).isDirectory() && !excludePkg.includes(dirPath);
});

export async function build(pkgName: string) {
  const pkgPath = path.resolve(pkgDir, pkgName);

  if (!fs.existsSync(pkgPath)) {
    throw new Error(`Package ${pkgName} not found`);
  }

  typeCheck(pkgName);

  const pkgRolldownConfig = path.resolve(pkgPath, "rolldown.config.js");

  const useSelfConfig = fs.existsSync(pkgRolldownConfig);

  const args = ["-c", "rolldown.config.js", "--environment", `TARGET:${pkgName}`].filter(Boolean);

  await execa("rolldown", args, {
    cwd: useSelfConfig ? pkgPath : process.cwd(),
    stdio: "inherit",
    killDescendants: true,
  });
}
