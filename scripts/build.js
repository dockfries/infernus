import inquirer from "inquirer";
import { pkgNames, build } from "./share.js";

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
