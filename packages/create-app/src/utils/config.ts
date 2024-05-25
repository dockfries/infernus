import path from "node:path";
import os from "node:os";
import fs from "fs-extra";
import type { LocalConfig, GlobalConfig, LockFileContent } from "../types";

const globalDir = path.resolve(os.homedir(), ".infernus");
const globalConfigPath = path.resolve(globalDir, "config.json");
export const depsPath = path.resolve(os.homedir(), ".infernus", "dependencies");

fs.ensureDirSync(globalDir);
fs.ensureDirSync(depsPath);

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

export function writeLocalConfig(config: object) {
  return fs.writeJson(getConfigPath(), config, { spaces: 2 });
}

export async function readLockFile() {
  try {
    return (await fs.readJson(getLockPath())) as LockFileContent;
  } catch {
    return null;
  }
}

export function writeLockFile(data: object) {
  return fs.writeJson(getLockPath(), data, { spaces: 2 });
}

export async function readOmpConfig() {
  try {
    return await fs.readJson(getOmpConfigPath());
  } catch {
    return null;
  }
}

export function writeOmpConfig(config: object) {
  return fs.writeJson(getOmpConfigPath(), config, { spaces: 2 });
}

function getConfigPath() {
  return path.resolve(process.cwd(), "infernus.json");
}

function getLockPath() {
  return path.resolve(process.cwd(), "infernus.lock.json");
}

function getOmpConfigPath() {
  return path.resolve(process.cwd(), "config.json");
}
