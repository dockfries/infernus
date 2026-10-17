import path from "node:path";
import fs from "fs-extra";
import { addDeps } from "./dep";
import { readLocalConfig, readOmpConfig, writeOmpConfig } from "./config";
import type { LocalConfig } from "../types";

export const PROJECT_NAME_DEFAULT = "my-app";

/** the rcon password a fresh project refuses to keep */
export const FORBIDDEN_RCON_PASSWORD = "changeme";

/** a project name has to survive being a path segment */
export function isValidAppName(name: string) {
  return /^[^\\/?*":<>|\r\n]+$/.test(name);
}

/** the rcon password is written into config.json and used verbatim by the server */
export function isValidRconPassword(password: string) {
  if (!password.length) return false;
  if (!/^\w+$/.test(password)) return false;

  // case-insensitive: the guard is against the default the starter ships, and
  // "Changeme" protects the server console no better than "changeme"
  return password.trim().toLowerCase() !== FORBIDDEN_RCON_PASSWORD;
}

/** Install the dependencies the starter declared, inside `projectDir`. */
export async function installProjectDependencies(projectDir: string) {
  const previous = process.cwd();
  process.chdir(projectDir);
  try {
    const config: LocalConfig | null = await readLocalConfig();
    if (!Object.keys(config?.dependencies ?? {}).length) return;

    // The manifest drives the install, so a starter that ships a lockfile keeps
    // the releases it pinned instead of resolving them again.
    await addDeps({}, "install");
  } finally {
    process.chdir(previous);
  }
}

/** Name the generated package after the project the user asked for. */
export async function changePkgName(projectDir: string, projectName: string) {
  const pkgFilePath = path.resolve(projectDir, "package.json");
  const pkg = await fs.readJson(pkgFilePath);

  pkg.name = projectName;
  await fs.writeJson(pkgFilePath, pkg, { spaces: 2 });
}

/**
 * Set the rcon password, and the RakNet main script when that flavour was asked
 * for, in the generated server config.
 */
export async function changeConfigJson(projectDir: string, password: string, isRakNet: boolean) {
  const previous = process.cwd();
  process.chdir(projectDir);
  try {
    const config = (await readOmpConfig()) ?? {};

    config.rcon = config.rcon ?? {};
    config.rcon.password = password;

    if (isRakNet) {
      config.pawn = config.pawn ?? {};
      config.pawn.main_scripts = ["polyfill_raknet 1"];
    }

    return await writeOmpConfig(config);
  } finally {
    process.chdir(previous);
  }
}
