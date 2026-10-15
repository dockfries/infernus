import path from "node:path";
import os from "node:os";
import fs from "fs-extra";
import chalk from "chalk";
import type { LocalConfig, GlobalConfig, LockFileContent } from "../types";

const globalDir = path.resolve(os.homedir(), ".infernus");
const globalConfigPath = path.resolve(globalDir, "config.json");

export const GLOBAL_DEPS_PATH = path.resolve(globalDir, "dependencies");
export const INF_CONFIG_NAME = "infernus.json";
const INF_LOCK_NAME = "infernus-lock.json";

/** the schema shipped with the package, so editors can validate and complete */
const SCHEMA_URL =
  "https://raw.githubusercontent.com/dockfries/infernus/main/packages/cli/schemas/infernus.schema.json";

fs.ensureDirSync(globalDir);
fs.ensureDirSync(GLOBAL_DEPS_PATH);

export async function readGlobalConfig() {
  try {
    return (await fs.readJson(globalConfigPath)) as GlobalConfig;
  } catch {
    return null;
  }
}

export function writeGlobalConfig(config: object) {
  return fs.writeJson(globalConfigPath, config, { spaces: 2 });
}

export async function readLocalConfig() {
  try {
    return (await fs.readJson(getConfigPath())) as LocalConfig;
  } catch {
    return null;
  }
}

/** Point a project file at the schema, keeping any key the user relies on. */
function withSchema<T extends object>(file: T) {
  return { $schema: SCHEMA_URL, ...file };
}

/**
 * Write a project file, never creating one just to record that it is empty.
 *
 * `remove` and `install` run in directories that may not be the project they
 * think they are, and a file holding nothing but the schema reference claims a
 * project that is not there.
 */
async function writeProjectFile(filePath: string, data: object, isEmpty: boolean) {
  if (isEmpty && !(await fs.pathExists(filePath))) return false;

  await fs.writeJson(filePath, data, { spaces: 2 });
  return true;
}

export function writeLocalConfig(config: LocalConfig) {
  const isEmpty = !Object.keys(config.dependencies ?? {}).length;
  return writeProjectFile(getConfigPath(), withSchema(config), isEmpty);
}

/**
 * Read the lockfile, discarding entries that are not shaped like one.
 *
 * The file is generated but still hand-editable, and the version of an entry is
 * used as a path segment. A number, an object or a missing version would become
 * `undefined` in a path and fail deep inside a removal with a `TypeError` that
 * names neither the file nor the entry, so an unusable entry is dropped here and
 * reported instead.
 */
export async function readLockFile() {
  let parsed: any;

  try {
    parsed = await fs.readJson(getLockPath());
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

  const dependencies = parsed.dependencies;
  if (!dependencies || typeof dependencies !== "object" || Array.isArray(dependencies)) {
    return { ...parsed, dependencies: {} } as LockFileContent;
  }

  const usable: Record<string, { version: string; component?: boolean }> = {};
  const dropped: string[] = [];

  for (const [name, entry] of Object.entries<any>(dependencies)) {
    if (entry && typeof entry === "object" && typeof entry.version === "string" && entry.version) {
      usable[name] = entry;
    } else {
      dropped.push(name);
    }
  }

  if (dropped.length) {
    console.log(
      chalk.yellow(
        `  warn: ignoring ${dropped.length} malformed lockfile entr${
          dropped.length === 1 ? "y" : "ies"
        } (${dropped.slice(0, 3).join(", ")}${dropped.length > 3 ? ", ..." : ""}); ` +
          `run \`infernus install\` to regenerate the lockfile`,
      ),
    );
  }

  return { ...parsed, dependencies: usable } as LockFileContent;
}

export function writeLockFile(data: object) {
  const isEmpty = !Object.keys((data as LockFileContent).dependencies ?? {}).length;
  return writeProjectFile(getLockPath(), withSchema(data), isEmpty);
}

export async function readOmpConfig() {
  try {
    return await fs.readJson(getOmpConfigPath());
  } catch {
    return null;
  }
}

/**
 * Write the open.mp server config, keeping a copy of what it replaces.
 *
 * This file belongs to the running server as much as to the CLI: it holds the
 * settings an operator tunes by hand next to the plugin list the CLI maintains.
 * It is therefore backed up before being rewritten, so editing it by hand is
 * never silently undone.
 *
 * A project with no server config and nothing to record gets no file: the CLI
 * runs `remove` and `install` on projects that do not use open.mp at all, and
 * leaving an empty `{}` behind would claim a server that is not there.
 */
export async function writeOmpConfig(config: object) {
  const configPath = getOmpConfigPath();
  const next = `${JSON.stringify(config, null, 2)}\n`;
  const current = (await fs.pathExists(configPath)) ? await fs.readFile(configPath, "utf8") : null;

  if (current === next) return false;

  if (current === null && !Object.keys(config).length) return false;

  if (current !== null) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await fs.copy(configPath, `${configPath}.${stamp}.bak`);
    console.log(`kept a copy of the previous config.json as config.json.${stamp}.bak`);
  }

  await fs.writeFile(configPath, next);
  return true;
}

function getConfigPath() {
  return path.resolve(process.cwd(), INF_CONFIG_NAME);
}

function getLockPath() {
  return path.resolve(process.cwd(), INF_LOCK_NAME);
}

function getOmpConfigPath() {
  return path.resolve(process.cwd(), "config.json");
}
