import path from "node:path";
import { select, confirm } from "@inquirer/prompts";
import { execa } from "execa";
import { versionBump, type VersionBumpOptions } from "bumpp";
import { pkgDir, pkgNames, build } from "./share";

let pkgName: string, pkgPath: string;

function bumpVersion(isReady: boolean) {
  const isCore = pkgName === "core";

  const files = [`./packages/${pkgName}/package.json`];

  if (isCore) {
    files.unshift("./package.json");
  }

  const options: VersionBumpOptions = {
    all: true,
    push: false,
    tag: isReady && isCore,
    commit: `chore(release): ${pkgName} v%s`,
    files,
    cwd: process.cwd(),
  };

  if (isCore) options.execute = "pnpm changelog";

  return versionBump(options);
}

function releasePkg(isReady: boolean) {
  const args = ["--access", "public"];
  if (!isReady) {
    args.unshift("--dry-run");
  }
  return execa("pnpm publish", args, {
    cwd: pkgPath,
    stdio: "inherit",
  });
}

export async function selectRelease() {
  const pkg = await select<string>({
    message: "Which package do you want to release?",
    choices: pkgNames,
  });

  const isReady = await confirm({
    message: "Are you ready to publish to npm? (N means dry run)",
    default: false,
  });

  pkgName = pkg;
  pkgPath = path.resolve(pkgDir, pkgName);

  await build(pkg);

  await bumpVersion(isReady);

  await releasePkg(isReady);
}

selectRelease();
