import path from "node:path";
import inquirer from "inquirer";
import { execa } from "execa";
import { versionBump } from "bumpp";
import { pkgDir, pkgNames, build } from "./share.js";

let pkgName, pkgPath;

function bumpVersion(isReady) {
  const isCore = pkgName === "core";

  const options = {
    all: true,
    push: false,
    tag: isReady && isCore,
    commit: `chore(release): ${pkgName} v%s`,
    files: [
      isCore && "./package.json",
      `./packages/${pkgName}/package.json`,
    ].filter(Boolean),
    cwd: process.cwd(),
  };

  if (isCore) options.execute = "pnpm changelog";

  return versionBump(options);
}

function releasePkg(isReady) {
  return execa(
    "pnpm publish",
    [!isReady && "--dry-run", "--access", "public"].filter(Boolean),
    {
      cwd: pkgPath,
      stdio: "inherit",
    },
  );
}

export async function selectRelease() {
  const { pkg, isReady } = await inquirer.prompt([
    {
      name: "pkg",
      message: "Which package do you want to release?",
      type: "list",
      choices: pkgNames,
    },
    {
      name: "isReady",
      message: "Are you ready to publish to npm? (N means dry run)",
      type: "confirm",
      default: false,
    },
  ]);

  pkgName = pkg;
  pkgPath = path.resolve(pkgDir, pkgName);

  await build(pkg);

  await bumpVersion(isReady);

  await releasePkg(isReady);
}

selectRelease();
