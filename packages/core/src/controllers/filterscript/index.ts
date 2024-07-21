import type { IFilterScript } from "../../interfaces";
import { onExit, onInit } from "../gamemode/event";
import { logger } from "../../logger";

const preInstallScripts: Array<IFilterScript> = [];
const installedScripts: Array<IFilterScript> = [];
const registeredEvents = new Map<string, Array<() => void>>();

export const loadUseScript = async (scriptName: string) => {
  try {
    const fsIdx = preInstallScripts.findIndex((fs) => fs.name === scriptName);
    if (fsIdx === -1) return;

    const fs = preInstallScripts[fsIdx];
    const events = await fs.load();
    events.length && registeredEvents.set(scriptName, events);

    preInstallScripts.splice(fsIdx, 1);
    installedScripts.push(fs);
  } catch (err) {
    logger.error(`[GameMode]: script ${scriptName} load fail`);
    logger.warn(err);
  }
};
export const unloadUseScript = async (scriptName: string) => {
  try {
    const fsIdx = installedScripts.findIndex((fs) => fs.name === scriptName);
    if (fsIdx === -1) return;

    const fs = installedScripts[fsIdx];

    const offs = registeredEvents.get(scriptName);
    offs && offs.forEach((off) => off());
    registeredEvents.delete(scriptName);

    await fs.unload();

    installedScripts.splice(fsIdx, 1);
    preInstallScripts.push(fs);
  } catch (err) {
    logger.error(`[GameMode]: script ${scriptName} unload fail`);
    logger.warn(err);
  }
};

export const reloadUseScript = async (scriptName: string) => {
  await unloadUseScript(scriptName);
  await loadUseScript(scriptName);
};

onInit(({ next }) => {
  preInstallScripts.forEach((fs) => loadUseScript(fs.name));
  return next();
});

onExit(({ next }) => {
  installedScripts.forEach((fs) => unloadUseScript(fs.name));
  return next();
});

export const useFilterScript = function (
  script: IFilterScript,
  ...options: Array<any>
): void {
  if (
    preInstallScripts.some((fs) => fs === script) ||
    installedScripts.some((fs) => fs === script)
  ) {
    logger.warn(`[GameMode]: script ${script.name} has already been applied`);
    return;
  }
  script.load = script.load.bind(script, ...options);
  preInstallScripts.push(script);
};
