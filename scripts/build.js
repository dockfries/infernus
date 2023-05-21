import fs from "node:fs";
import path from "node:path";
import { execa } from "execa";
import inquirer from "inquirer";

const pkgDir = path.resolve("./packages");

const pkgNames = fs.readdirSync(pkgDir).filter((dirPath) => {
  return fs.statSync(path.resolve(pkgDir, dirPath)).isDirectory();
});

async function build(pkgName) {
  const pkgPath = path.resolve(pkgDir, pkgName);

  const pkgRollupConfig = path.resolve(pkgPath, "rollup.config.mjs");

  const useSelfConfig = fs.existsSync(pkgRollupConfig);

  const executeArgs = [
    "-c",
    useSelfConfig && pkgRollupConfig,
    "--environment",
    `TARGET:${pkgName}`,
  ].filter((empty) => empty);

  await execa("rollup", executeArgs, {
    cwd: useSelfConfig ? pkgPath : process.cwd(),
    stdio: "inherit",
  });
}

async function selectBuild() {
  const { pkg } = await inquirer.prompt([
    {
      name: "pkg",
      message: "Which package do you want to build?",
      type: "list",
      choices: pkgNames,
    },
  ]);
  build(pkg);
}

selectBuild();
