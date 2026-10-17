#! /usr/bin/env node

import { input, confirm } from "@inquirer/prompts";
import chalk from "chalk";

import fs from "fs-extra";

import type { Arguments, ArgumentsCamelCase, Argv } from "yargs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import updateNotifier from "update-notifier";

import { execa, Options as ExecaOptions } from "execa";

import { addDeps, cleanAllGlobalDeps, cleanGlobalDeps, removeDeps } from "./utils/dep";
import { listVersions } from "./utils/versions";
import { generateRandomString } from "./utils/random";
import { fetchStarter } from "./utils/starter";
import {
  changeConfigJson,
  changePkgName,
  FORBIDDEN_RCON_PASSWORD,
  installProjectDependencies,
  isValidAppName,
  isValidRconPassword,
  PROJECT_NAME_DEFAULT,
} from "./utils/project";
import type {
  AddDepsOptions,
  CleanCacheOptions,
  ListVersionsOptions,
  RemoveDepsOptions,
  SetGetConfigOptions,
} from "./types";
import { readGlobalConfig, writeGlobalConfig } from "./utils/config";

const cli = yargs(hideBin(process.argv));

let appGeneratePath = "";

const currentFilePath = fileURLToPath(import.meta.url);

const pkgFilePath = resolve(dirname(currentFilePath), "../package.json");

const pkg = fs.readJsonSync(pkgFilePath);

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

async function createApp(args: ArgumentsCamelCase<{ appName?: string }>) {
  let appName = args.appName;

  if (!appName) {
    appName = await input({
      message: "What do you want to call the application?",
      default: PROJECT_NAME_DEFAULT,
      validate(name) {
        if (isValidAppName(name)) return true;

        console.log(chalk.red.bold("\nThe project name cannot contain special characters"));
        return false;
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
    validate(value) {
      if (isValidRconPassword(value)) return true;

      console.log(
        chalk.red.bold(
          `\nThe rcon password must use letters, digits and underscores only, and cannot be "${FORBIDDEN_RCON_PASSWORD}"`,
        ),
      );
      return false;
    },
  });

  // `infernus create a/b` would otherwise be accepted where the prompt refuses
  // the same name, and would write a path separator into package.json
  if (!isValidAppName(appName)) {
    throw new Error(`The project name ${JSON.stringify(appName)} contains special characters`);
  }

  appGeneratePath = resolve(process.cwd(), appName);

  // refused before anything is written, so a mistyped name cannot leave a
  // half filled directory behind
  const existing = (await fs.pathExists(appGeneratePath)) ? await fs.readdir(appGeneratePath) : [];
  if (existing.length) throw new Error(`The project directory ${appName} already exists`);

  if (process.platform === "darwin") {
    console.log(
      chalk.yellow(
        "You are using a macOS system and cannot run directly on the macOS system after the configuration is complete",
      ),
    );
  }

  await fs.ensureDir(appGeneratePath);
  process.chdir(appGeneratePath);

  await fetchStarter(appGeneratePath, isRakNet);
  await changePkgName(appGeneratePath, appName);
  await changeConfigJson(appGeneratePath, password, isRakNet);
  await successInstalled(appName);
}

async function addDependencies(args: ArgumentsCamelCase<AddDepsOptions>) {
  return addDeps(args, args.frozen ? "frozen" : "install");
}

async function updateDependencies(args: ArgumentsCamelCase<AddDepsOptions>) {
  return addDeps(args, "update");
}

async function listVersionsCommand(args: ArgumentsCamelCase<ListVersionsOptions>) {
  try {
    await listVersions(args);
  } catch (error: any) {
    // A consumer parsing `--json` should not have to read prose to find out what
    // went wrong, so the failure is reported in the shape it asked for.
    if (!args.json) throw error;

    process.stdout.write(
      `${JSON.stringify({ dependencies: [], error: error?.message ?? String(error) }, null, 2)}\n`,
    );
    process.exitCode = 1;
  }
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

/** the global config keys the CLI acts on */
const GLOBAL_CONFIG_KEYS = ["gh_token"] as const;
type GlobalConfigKey = (typeof GLOBAL_CONFIG_KEYS)[number];

async function setOrGetConfig(args: ArgumentsCamelCase<SetGetConfigOptions>) {
  const { list, key, value } = args;

  if (list) {
    console.log(await readGlobalConfig());
    return;
  }

  if (!key) return;

  // A key nothing reads would be written and then ignored for ever, which is
  // worse than a refusal: the user believes they configured something.
  if (!GLOBAL_CONFIG_KEYS.includes(key as GlobalConfigKey)) {
    throw new Error(
      `unknown config key ${JSON.stringify(key)}; the keys are: ${GLOBAL_CONFIG_KEYS.join(", ")}`,
    );
  }

  return setGlobalConfigKey(key as GlobalConfigKey, value);
}

/**
 * Set a config key, or clear it when no value is given.
 *
 * Clearing is what an absent value means here: `infernus config gh_token` with
 * nothing after it removes the stored token, and the token then falls back to
 * the environment. A key that is already unset is left alone.
 */
async function setGlobalConfigKey(key: GlobalConfigKey, value?: string) {
  const config = (await readGlobalConfig()) ?? {};

  if (!value) {
    if (!(key in config)) return;

    delete config[key];
  } else {
    config[key] = value;
  }

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
    .option("frozen", {
      alias: "locked",
      type: "boolean",
      description:
        "install exactly what infernus-lock.json records, failing if it no longer satisfies infernus.json",
      default: false,
    })
    .option("save-exact", {
      alias: "E",
      type: "boolean",
      description:
        "declare the exact release tag instead of a caret range when a dependency is named without a version",
      default: false,
    })
    .check((argv: Arguments<AddDepsOptions>) => {
      // an update exists to move the lockfile, so freezing it is a contradiction
      if (argv.frozen && argv._[0] === "update") {
        throw new Error(
          "`--frozen` cannot be combined with `infernus update`: an update resolves the declared " +
            "ranges again, a frozen install keeps the lockfile as it is",
        );
      }

      // both commands can act on every declared dependency, which is what makes
      // `infernus update` the way to move the whole project within its ranges
      const everyDependency = argv._[0] === "install" || argv._[0] === "update";

      if (!argv.dependencies?.length) {
        if (!everyDependency) throw new Error("You must specify dependencies");

        if (argv.component) {
          throw new Error(
            "You can't specify --component when installing or updating every dependency",
          );
        }
      }

      return true;
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
