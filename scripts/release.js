import path from "node:path";
import inquirer from "inquirer";
import { execa } from "execa";
import { pkgDir, pkgNames, build } from "./share.js";
import { versionBump } from "bumpp";

let pkgName, pkgPath;

function bumpVersion() {
  const isCore = pkgName === "core";
  return versionBump({
    all: true,
    push: false,
    tag: isCore,
    execute: "pnpm changelog",
    commit: `chore(release): ${pkgName} v%s`,
    files: [
      isCore && "./package.json",
      `./packages/${pkgName}/package.json`,
    ].filter(Boolean),
    cwd: process.cwd(),
  });
}

function releasePkg(isReady) {
  return execa("pnpm publish", [!isReady && "--dry-run"].filter(Boolean), {
    cwd: pkgPath,
    stdio: "inherit",
  });
}

export async function selectRelease() {
  const { pkg } = await inquirer.prompt([
    {
      name: "pkg",
      message: "Which package do you want to release?",
      type: "list",
      choices: pkgNames,
    },
  ]);

  pkgName = pkg;
  pkgPath = path.resolve(pkgDir, pkgName);

  await build(pkg);

  await bumpVersion(pkg);

  const { dry } = await inquirer.prompt([
    {
      name: "dry",
      message: "Are you ready to publish to npm? The default is dry-run",
      type: "confirm",
      default: false,
    },
  ]);

  await releasePkg(dry);
}

selectRelease();
