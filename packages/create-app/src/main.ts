#! /usr/bin/env node

import type { ConfirmQuestion, InputQuestion, ListQuestion } from "inquirer";
import inquirer from "inquirer";
import chalk from "chalk";
import decompress from "decompress";

import fs from "fs-extra";

import type { Arguments, ArgumentsCamelCase, Argv } from "yargs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { downloadGitRepo } from "./utils/index";

import {
  addDeps,
  cleanAllGlobalDeps,
  cleanGlobalDeps,
  removeDeps,
} from "./utils/dep";
import type {
  AddDepsOptions,
  CleanCacheOptions,
  RemoveDepsOptions,
  SetGetConfigOptions,
} from "./types";
import {
  readGlobalConfig,
  readOmpConfig,
  writeGlobalConfig,
  writeOmpConfig,
} from "./utils/config";

const cli = yargs(hideBin(process.argv));

let appGeneratePath = "";

const currentFilePath = fileURLToPath(import.meta.url);

const pkgFilePath = resolve(dirname(currentFilePath), "../package.json");

const pkg = fs.readJsonSync(pkgFilePath);

function successInstalled(projectName: string) {
  console.log(`\nSuccessfully created project ${chalk.cyan(projectName)}`);
  console.log(`\ncd ${chalk.cyan(projectName)}`);
  console.log(`pnpm install`);
  console.log("pnpm dev\n");
}

async function initStarter(projectName: string) {
  console.log("\n");
  const isMac = process.platform === "darwin";
  const isCreatedProject = fs.existsSync(appGeneratePath);
  if (isCreatedProject) {
    const files = await fs.readdir(appGeneratePath);
    if (files.length)
      throw `The project directory ${projectName} already exists`;
  }

  if (isMac) {
    console.log(
      chalk.yellow(
        "You are using a mac system and cannot run directly on the mac system after the configuration is complete",
      ),
    );
  }

  const starterPath = await downloadGitRepo(
    "dockfries",
    "infernus-starter",
    appGeneratePath,
  );

  await decompress(starterPath, appGeneratePath, { strip: 1 });

  fs.remove(starterPath);
  fs.remove(resolve(appGeneratePath, ".git"));
  fs.remove(resolve(appGeneratePath, ".husky"));
}

function changePkgName(projectName: string) {
  const pkgFilePath = resolve(appGeneratePath, "package.json");
  const pkg = fs.readJsonSync(pkgFilePath);
  pkg.name = projectName;
  delete pkg.scripts.prepare;
  delete pkg.husky;
  fs.writeJson(pkgFilePath, pkg, { spaces: 2 });
}

async function changeConfigJson(password: string, isRakNet: boolean) {
  const configJson = (await readOmpConfig()) || {};

  configJson.rcon.password = password;

  if (isRakNet) {
    configJson.pawn.main_scripts = ["polyfill_raknet 1"];
  }

  return writeOmpConfig(configJson);
}

function initBaseDeps(isRakNet: boolean) {
  const deps = [
    "openmultiplayer/open.mp",
    "samp-incognito/samp-streamer-plugin",
    "dockfries/samp-node",
  ];
  if (isRakNet) {
    deps.push("katursis/Pawn.RakNet");
  }
  return addDeps(deps);
}

function generateRandomString(length: number) {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
}

async function createApp(args: ArgumentsCamelCase) {
  const appNameQuestion: InputQuestion = {
    name: "appName",
    message: "What do you want to call the application?",
    default: "my-app",
    validate(input) {
      if (!/^[^\\/?*":<>|\r\n]+$/.test(input)) {
        console.log(
          chalk.red.bold(
            "\nThe project name cannot contain special characters",
          ),
        );
        return false;
      }
      return true;
    },
  };

  const questions: (InputQuestion | ListQuestion | ConfirmQuestion)[] = [
    {
      name: "isRakNet",
      type: "confirm",
      message: "Whether you need to install RakNet?",
      default: false,
    },
    {
      name: "password",
      message: "What password do you want for rcon?",
      suffix: " (default random)",
      default: generateRandomString(12),
      validate(input) {
        if (!input.length) {
          console.log(chalk.red.bold("\nYou have to enter a password"));
          return false;
        }
        if (!/^\w+$/.test(input)) {
          console.log(
            chalk.red.bold(
              "\nPlease enter a password consisting of case, digits, and underscores.",
            ),
          );
          return false;
        }
        if (input.trim() === "changeme") {
          console.log(
            chalk.red.bold("\nThe default rcon password cannot be used."),
          );
          return false;
        }
        return true;
      },
    },
  ];

  if (!args.appName) {
    questions.unshift(appNameQuestion);
  }

  const { appName, isRakNet, password } = await inquirer.prompt(questions);

  appGeneratePath = resolve(process.cwd(), args.appName || appName);

  await fs.ensureDir(appGeneratePath);

  process.chdir(appGeneratePath);

  await initStarter(appName);

  changePkgName(appName);

  changeConfigJson(password, isRakNet);

  await initBaseDeps(isRakNet);

  successInstalled(appName);
}

async function addDependencies(args: ArgumentsCamelCase<AddDepsOptions>) {
  return addDeps(args.dependencies, false, args.production);
}

async function updateDependencies(args: ArgumentsCamelCase<AddDepsOptions>) {
  return addDeps(args.dependencies, true, args.production);
}

function removeDependencies(args: ArgumentsCamelCase<RemoveDepsOptions>) {
  return removeDeps(args.dependencies);
}

async function cleanCache(args: ArgumentsCamelCase<CleanCacheOptions>) {
  if (args.all) {
    await cleanAllGlobalDeps();
  } else {
    await cleanGlobalDeps(args.dependencies, false);
  }
  return;
}

async function setOrGetConfig(args: ArgumentsCamelCase<SetGetConfigOptions>) {
  const { list, key, value } = args;
  if (list) {
    const config = await readGlobalConfig();
    console.log(config);
    return;
  }
  if (!key) return;

  let config = await readGlobalConfig();
  if (!config) config = {};
  if (!value && config[key]) delete config[key];
  else config[key] = value;
  await writeGlobalConfig(config);
  console.log(config);
}

function addUpdateBuilder(y: Argv) {
  return y
    .option("production", {
      alias: ["p", "prod"],
      type: "boolean",
    })
    .check((argv: Arguments<AddDepsOptions>) => {
      if (argv.dependencies) {
        return true;
      } else if (argv._[0] === "install") {
        return true;
      }
      throw new Error("You must specify dependencies");
    });
}

function init() {
  cli
    .usage("Usage: infernus [command] <options>")
    .command("create [app-name]", "create a new project", () => {}, createApp)
    .command({
      command: "add [dependencies..]",
      describe: "add plugins or components",
      aliases: ["install"],
      builder: addUpdateBuilder,
      handler: addDependencies,
    })
    .command({
      command: "remove <dependencies..>",
      describe: "remove plugins or components",
      aliases: ["rm", "uninstall"],
      handler: removeDependencies,
    })
    .command({
      command: "update [dependencies..]",
      describe: "update plugins or components",
      builder: addUpdateBuilder,
      handler: updateDependencies,
    })
    .command({
      command: "config [key] [value]",
      describe: "set or get a config item",
      aliases: ["cfg"],
      builder: (y) => {
        return y
          .option("list", {
            alias: "l",
            type: "boolean",
            description: "list all config items",
          })
          .check((argv) => {
            if (argv.list) {
              return true;
            } else if (argv.key && !argv.value) {
              return true;
            } else if (argv.key) {
              return true;
            }
            throw new Error("You must specify a key");
          });
      },
      handler: setOrGetConfig,
    })
    .command(
      "clean [dependencies..]",
      "clean a dependency cache or all dependencies",
      (builder) => {
        return builder
          .option("all", {
            alias: "a",
            type: "boolean",
            description: "clean all caches",
          })
          .check((argv) => {
            if (!argv.all && !argv.dependencies) {
              throw new Error("You must specify a dependency to clean");
            }
            return true;
          });
      },
      cleanCache,
    )
    // .option("verbose", {
    //   type: "boolean",
    //   describe: "output all detailed information - useful for debugging",
    // })
    .alias("h", "help")
    .alias("v", "version")
    .wrap(null)
    .strict()
    .version(pkg.version)
    .demandCommand()
    .recommendCommands()
    .fail((msg, err, yargs) => {
      yargs.showHelp();
      console.log("\n");
      if (err) {
        console.log(chalk.red.bold(err));
      } else if (msg) {
        console.log(chalk.red.bold(msg));
      }
      process.exit(1);
    })
    .parse();
}

init();
