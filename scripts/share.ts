import fs from "node:fs";
import path from "node:path";
import { execa } from "execa";

export const rootPkgJsonPath = path.resolve(process.cwd(), "package.json");

export const pkgDir = path.resolve(process.cwd(), "./packages");

const excludePkg = ["types"];

export const pkgNames = fs.readdirSync(pkgDir).filter((dirPath) => {
  return (
    fs.statSync(path.resolve(pkgDir, dirPath)).isDirectory() &&
    !excludePkg.includes(dirPath)
  );
});

function onceSIGINTKill(subProc: ReturnType<typeof execa>) {
  const fn = async (signal: NodeJS.Signals) => {
    subProc.kill(signal);
    await subProc;
    process.exit(subProc.exitCode);
  };
  process.once("SIGINT", fn);
  return () => {
    process.off("SIGINT", fn);
  };
}

export async function build(pkgName: string) {
  const pkgPath = path.resolve(pkgDir, pkgName);

  const pkgRollupConfig = path.resolve(pkgPath, "rollup.config.js");

  const useSelfConfig = fs.existsSync(pkgRollupConfig);

  const args = [
    "-c",
    useSelfConfig ? pkgRollupConfig : "",
    "--environment",
    `TARGET:${pkgName}`,
  ].filter(Boolean);

  const subProc = execa("rollup", args, {
    cwd: useSelfConfig ? pkgPath : process.cwd(),
    stdio: "inherit",
  });

  const cancelFn = onceSIGINTKill(subProc);

  await subProc;

  cancelFn();
}
