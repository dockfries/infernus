#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import decompress from "decompress";

import fs from "fs-extra";

import {
  wrapLoading,
  downloadGitRepo,
  downloadGitRelease,
  installPlugin,
} from "./utils/index.js";

let relativeGenPath = "";
let configJsonPath = "";

function successInstalled(projectName) {
  console.log(`\nSuccessfully created project ${chalk.cyan(projectName)}`);
  console.log(`\ncd ${chalk.cyan(projectName)}`);
  console.log(`pnpm install`);
  console.log("pnpm dev\n");
}

async function initializeStarter(projectName) {
  console.log("\n");
  const isMac = process.platform === "darwin";
  const isCreatedProject = await fs.ensureDir(relativeGenPath);
  if (!isCreatedProject)
    throw `The project directory ${projectName} already exists`;

  if (isMac) {
    console.log(
      chalk.yellow(
        "You are using a mac system and cannot run directly on the mac system after the configuration is complete"
      )
    );
  }

  const starterPath = await downloadGitRepo(
    "dockfries",
    "infernus-starter",
    relativeGenPath
  );

  await wrapLoading(
    decompress,
    `decompress ${starterPath}`,
    starterPath,
    relativeGenPath,
    { strip: 1 }
  );

  fs.remove(starterPath);
  fs.remove(relativeGenPath + "/.git");
  fs.remove(relativeGenPath + "/.husky");
}

function changePkgName(projectName) {
  const pkgFilePath = relativeGenPath + "/package.json";
  const pkg = fs.readJsonSync(pkgFilePath);
  pkg.name = projectName;
  delete pkg.scripts.prepare;
  delete pkg.husky;
  fs.writeJson(pkgFilePath, pkg, { spaces: 2 });
}

async function initializeBase(isLinux) {
  const base = await downloadGitRelease(
    isLinux,
    "openmultiplayer",
    "open.mp",
    relativeGenPath
  );

  const decompressOmpPath = relativeGenPath + "/omp";

  await wrapLoading(decompress, `decompress ${base}`, base, decompressOmpPath, {
    strip: 1,
  });

  await fs.remove(base);

  await fs.copy(decompressOmpPath, relativeGenPath, { overwrite: false });

  await fs.remove(decompressOmpPath);
}

async function changeConfigJson(password, isRakNet) {
  const configJson = await fs.readJson(configJsonPath);

  configJson.rcon.password = password;

  if (isRakNet) {
    configJson.pawn.main_scripts = ["polyfill_raknet 1"];
  }

  return fs.writeJSON(configJsonPath, configJson, { spaces: 2 });
}

async function installPlugins(isLinux, isRakNet) {
  fs.ensureDirSync(relativeGenPath + "/plugins");

  const plugins = [
    { author: "AmyrAhmady", repo: "samp-node", fileName: "samp-node" },
    {
      author: "samp-incognito",
      repo: "samp-streamer-plugin",
      fileName: "streamer",
    },
  ];

  if (isRakNet) {
    plugins.push({
      author: "katursis",
      repo: "Pawn.RakNet",
      fileName: "pawnraknet",
      isComponent: true,
    });
  }

  const downPlugins = plugins.map((p) => {
    return () => installPlugin(relativeGenPath, isLinux, p);
  });

  for (const plugin of downPlugins) {
    await plugin();
  }
}

async function init() {
  const isWin = process.platform === "win32";

  try {
    const questions = [
      {
        name: "projectName",
        message: "What do you want to call the project?",
        default: "my-app",
        validate(input) {
          if (!/^[^\\/?*":<>|\r\n]+$/.test(input)) {
            console.log(
              chalk.red.bold(
                "\nThe project name cannot contain special characters"
              )
            );
            return false;
          }
          return true;
        },
      },
      {
        name: "env",
        type: "list",
        message: "Which system environment do you plan to configure in?",
        choices: ["win", "linux"],
        default: isWin ? 0 : 1,
      },
      {
        name: "isRakNet",
        type: "confirm",
        message: "Whether you need to install RakNet?",
        default: false,
      },
      {
        name: "password",
        message: "What password do you want for rcon?",
        validate(input) {
          if (!input.length) {
            console.log(chalk.red.bold("\nYou have to enter a password"));
            return false;
          }
          if (!/^\w+$/.test(input)) {
            console.log(
              chalk.red.bold(
                "\nPlease enter a password consisting of case, digits, and underscores."
              )
            );
            return false;
          }
          if (input.trim() === "changeme") {
            console.log(
              chalk.red.bold("\nThe default rcon password cannot be used.")
            );
            return false;
          }
          return true;
        },
      },
    ];

    const { projectName, env, isRakNet, password } = await inquirer.prompt(
      questions
    );

    const isLinux = env === "linux";
    relativeGenPath = "./" + projectName;
    configJsonPath = relativeGenPath + "/config.json";

    await initializeStarter(projectName);

    changePkgName(projectName);

    changeConfigJson(password, isRakNet);

    await initializeBase(isLinux);

    await installPlugins(isLinux, isRakNet);

    successInstalled(projectName);
  } catch (err) {
    if (err.isTtyError) {
      console.log(
        chalk.red.bold(
          "\nPrompt couldn't be rendered in the current environment"
        )
      );
      return;
    }
    console.log(chalk.red.bold(err));
  }
}

init();
