import fs from "node:fs";
import path from "node:path";
import { execa } from "execa";
import { typeCheck } from "./type-check";

export const rootPkgJsonPath = path.resolve(process.cwd(), "package.json");

export const pkgDir = path.resolve(process.cwd(), "./packages");

const excludePkg = ["types", "shared"];

export const pkgNames = fs.readdirSync(pkgDir).filter((dirPath) => {
  return (
    fs.statSync(path.resolve(pkgDir, dirPath)).isDirectory() &&
    !excludePkg.includes(dirPath)
  );
});

function onceSIGKill(subProc: ReturnType<typeof execa>) {
  const fn = (signal: NodeJS.Signals) => {
    subProc.kill(signal);
    process.exit(subProc.exitCode);
  };
  process.once("SIGINT", fn);
  process.once("SIGTERM", fn);
}

export async function build(pkgName: string) {
  const pkgPath = path.resolve(pkgDir, pkgName);

  if (!fs.existsSync(pkgPath)) {
    throw new Error(`Package ${pkgName} not found`);
  }

  typeCheck(pkgName);

  const pkgRolldownConfig = path.resolve(pkgPath, "rolldown.config.js");

  const useSelfConfig = fs.existsSync(pkgRolldownConfig);

  const args = [
    "-c",
    "rolldown.config.js",
    "--environment",
    `TARGET:${pkgName}`,
  ].filter(Boolean);

  const subProc = execa("rolldown", args, {
    cwd: useSelfConfig ? pkgPath : process.cwd(),
    stdio: "inherit",
  });

  onceSIGKill(subProc);

  try {
    await new Promise((resolve) => {
      subProc.once("exit", resolve);
    });
  } finally {
    subProc.removeAllListeners("exit");
    process.removeAllListeners("SIGINT");
    process.removeAllListeners("SIGTERM");
  }
}
