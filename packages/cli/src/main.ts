#! /usr/bin/env node

import { input, confirm } from "@inquirer/prompts";
import chalk from "chalk";
// @ts-expect-error no types package
import decompress from "@xhmikosr/decompress";

import fs from "fs-extra";

import type { Arguments, ArgumentsCamelCase, Argv } from "yargs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import updateNotifier from "update-notifier";

import { execa, Options as ExecaOptions } from "execa";

import { downloadGitRepo } from "./utils/api";

import { addDeps, cleanAllGlobalDeps, cleanGlobalDeps, removeDeps } from "./utils/dep";
import { listVersions } from "./utils/versions";
import { generateRandomString } from "./utils/random";
import type {
  AddDepsOptions,
  CleanCacheOptions,
  ListVersionsOptions,
  LocalConfig,
  RemoveDepsOptions,
  SetGetConfigOptions,
} from "./types";
import {
  readGlobalConfig,
  readLocalConfig,
  readOmpConfig,
  writeGlobalConfig,
  writeOmpConfig,
} from "./utils/config";

const cli = yargs(hideBin(process.argv));

let appGeneratePath = "";

const currentFilePath = fileURLToPath(import.meta.url);

const pkgFilePath = resolve(dirname(currentFilePath), "../package.json");

const pkg = fs.readJsonSync(pkgFilePath);

/**
 * Install the dependencies of the project just generated.
 *
 * The work is done in this process rather than by shelling out to
 * `pnpm dlx <package>@latest install`: the running CLI is already the version the
 * user asked for, so there is nothing to download again and no chance of an
 * older cached copy doing the install.
 */
async function installProjectDependencies(projectDir: string) {
  const previous = process.cwd();
  process.chdir(projectDir);
  try {
    const config: LocalConfig | null = await readLocalConfig();
    const dependencies = Object.entries(config?.dependencies ?? {}).map(
      ([name, version]) => `${name}@${version}`,
    );

    if (!dependencies.length) return;
    await addDeps({ dependencies }, false);
  } finally {
    process.chdir(previous);
  }
}

async function successInstalled(projectName: string) {
  console.log(`\nSuccessfully created project ${chalk.cyan(projectName)}`);

  const install = await confirm({
    message: "Install dependencies now?",
    default: true,
  });

  if (install) {
    if (!appGeneratePath) throw new Error("appGeneratePath is empty");

    await installProjectDependencies(appGeneratePath);

    await execa("pnpm", ["install"], {
      cwd: appGeneratePath,
      stdio: "inherit",
      killDescendants: true,
    } as ExecaOptions);
  }

  console.log(`\ncd ${chalk.cyan(projectName)}`);
  if (!install) {
    console.log(`infernus install`);
    console.log(`pnpm install`);
  }
  console.log("pnpm dev\n");
}

async function initStarter(projectName: string, isRakNet = false) {
  console.log("\n");
  const isMac = process.platform === "darwin";
  const isCreatedProject = fs.existsSync(appGeneratePath);
  if (isCreatedProject) {
    const files = await fs.readdir(appGeneratePath);
    if (files.length) throw new Error(`The project directory ${projectName} already exists`);
  }

  if (isMac) {
    console.log(
      chalk.yellow(
        "You are using a macOS system and cannot run directly on the macOS system after the configuration is complete",
      ),
    );
  }

  const starterPath = await downloadGitRepo(
    "dockfries",
    "infernus-starter",
    appGeneratePath,
    isRakNet ? "raknet" : "main",
  );

  await decompress(starterPath, appGeneratePath, { strip: 1 });

  await fs.remove(starterPath);
  await fs.remove(resolve(appGeneratePath, ".git"));
}

async function changePkgName(projectName: string) {
  const pkgFilePath = resolve(appGeneratePath, "package.json");
  const pkg = fs.readJsonSync(pkgFilePath);
  pkg.name = projectName;
  await fs.writeJson(pkgFilePath, pkg, { spaces: 2 });
}

async function changeConfigJson(password: string, isRakNet: boolean) {
  const configJson = (await readOmpConfig()) || {};

  configJson.rcon = configJson.rcon || {};
  configJson.rcon.password = password;

  if (isRakNet) {
    configJson.pawn = configJson.pawn || {};
    configJson.pawn.main_scripts = ["polyfill_raknet 1"];
  }

  return writeOmpConfig(configJson);
}

async function createApp(args: ArgumentsCamelCase<{ appName?: string }>) {
  let appName = args.appName;

  if (!appName) {
    appName = await input({
      message: "What do you want to call the application?",
      default: "my-app",
      validate(input) {
        if (!/^[^\\/?*":<>|\r\n]+$/.test(input)) {
          console.log(chalk.red.bold("\nThe project name cannot contain special characters"));
          return false;
        }
        return true;
      },
    });
  }

  const isRakNet = await confirm({
    message: "Whether you need to install RakNet?",
    default: false,
  });

  const password = await input({
    message: "What password do you want for rcon? (default random)",
    default: generateRandomString(12),
    validate(input) {
      if (!input.length) {
        console.log(chalk.red.bold("\nYou have to enter a password"));
        return false;
      }
      if (!/^\w+$/.test(input)) {
        console.log(
          chalk.red.bold("\nPlease enter a password consisting of case, digits, and underscores."),
        );
        return false;
      }
      if (input.trim() === "changeme") {
        console.log(chalk.red.bold("\nThe default rcon password cannot be used."));
        return false;
      }
      return true;
    },
  });

  appGeneratePath = resolve(process.cwd(), appName);

  await fs.ensureDir(appGeneratePath);

  process.chdir(appGeneratePath);

  await initStarter(appName, isRakNet);

  changePkgName(appName);

  await changeConfigJson(password, isRakNet);

  await successInstalled(appName);
}

async function addDependencies(args: ArgumentsCamelCase<AddDepsOptions>) {
  return addDeps(args, false);
}

async function updateDependencies(args: ArgumentsCamelCase<AddDepsOptions>) {
  return addDeps(args, true);
}

async function listVersionsCommand(args: ArgumentsCamelCase<ListVersionsOptions>) {
  await listVersions(args);
  return;
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
      description: "if you do not need the .inc file, specify it",
      default: false,
    })
    .option("component", {
      alias: "c",
      type: "boolean",
      description: "install to components folder instead of plugins",
    })
    .option("verbose", {
      type: "boolean",
      description:
        "print every cache and release lookup detail, useful when a version cannot be resolved",
      default: false,
    })
    .option("dry-run", {
      type: "boolean",
      description:
        "resolve the versions and report what would change, without downloading or writing anything",
      default: false,
    })
    .check((argv: Arguments<AddDepsOptions>) => {
      if (argv.dependencies) {
        return true;
      } else if (argv._[0] === "install") {
        if (argv.component) {
          throw new Error("You can't specify component if install all");
        }
        return true;
      }
      throw new Error("You must specify dependencies");
    });
}

function init() {
  updateNotifier({ pkg }).notify();
  cli
    .usage("Usage: $0 [command] <options>")
    .scriptName("infernus")
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
      command: "versions [dependencies..]",
      describe: "list the releases a dependency can be installed from",
      aliases: ["ls"],
      builder: (y) => {
        return y
          .option("all", {
            alias: "a",
            type: "boolean",
            description: "print every release instead of the newest ones",
            default: false,
          })
          .option("limit", {
            alias: "n",
            type: "number",
            description: "how many releases to print per dependency",
            default: 10,
          })
          .option("json", {
            type: "boolean",
            description: "print the result as JSON, for scripts",
            default: false,
          })
          .option("verbose", {
            type: "boolean",
            description: "print every release request as it is made",
            default: false,
          });
      },
      handler: listVersionsCommand,
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
    .alias("h", "help")
    .alias("v", "version")
    .wrap(null)
    .strict()
    .version(pkg.version)
    .demandCommand()
    .recommendCommands()
    .fail((msg, err, yargs) => {
      // yargs sets msg together with err for CLI misuse, a bare err is our own runtime failure
      const isRuntimeError = !!err && !msg;

      if (!isRuntimeError) {
        yargs.showHelp("log");
        console.log("\n");
      }

      if (err) {
        console.log(chalk.red.bold(isRuntimeError ? err.message || String(err) : err));
        if (isRuntimeError) {
          console.log(
            chalk.gray("\nre-run with --verbose to print every cache and release lookup detail"),
          );
        }
      } else if (msg) {
        console.log(chalk.red.bold(msg));
      }
      process.exit(1);
    })
    .parse();
}

init();
