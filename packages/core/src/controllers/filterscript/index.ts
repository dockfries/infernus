import type { IFilterScript } from "../../interfaces";
import { onExit, onInit } from "../gamemode/event";
import { logger } from "../../logger";

const preInstallScripts: Array<IFilterScript> = [];
const installedScripts: Array<IFilterScript> = [];

export const loadUseScript = (scriptName: string): void => {
  setTimeout(async () => {
    try {
      const fsIdx = preInstallScripts.findIndex((fs) => fs.name === scriptName);
      if (fsIdx === -1) return;

      const fs = preInstallScripts[fsIdx];
      await fs.load();

      preInstallScripts.splice(fsIdx, 1);
      installedScripts.push(fs);
    } catch (err) {
      logger.error(`[GameMode]: script ${scriptName} load fail`);
      logger.warn(new Error(JSON.stringify(err)));
    }
  });
};
export const unloadUseScript = (scriptName: string): void => {
  setTimeout(async () => {
    try {
      const fsIdx = installedScripts.findIndex((fs) => fs.name === scriptName);
      if (fsIdx === -1) return;

      const fs = installedScripts[fsIdx];
      await fs.unload();

      installedScripts.splice(fsIdx, 1);
      preInstallScripts.push(fs);
    } catch (err) {
      logger.error(`[GameMode]: script ${scriptName} unload fail`);
      logger.warn(new Error(JSON.stringify(err)));
    }
  });
};

export const reloadUseScript = (scriptName: string) => {
  unloadUseScript(scriptName);
  loadUseScript(scriptName);
};

onInit(({ next }) => {
  preInstallScripts.forEach((fs) => loadUseScript(fs.name));
  next();
});

onExit(({ next }) => {
  installedScripts.forEach((fs) => unloadUseScript(fs.name));
  next();
});

export const useFilterScript = function (
  plugin: IFilterScript,
  ...options: Array<any>
): void {
  if (
    preInstallScripts.some((fs) => fs === plugin) ||
    installedScripts.some((fs) => fs === plugin)
  ) {
    logger.warn(`[GameMode]: script has already been applied`);
    return;
  }
  plugin.load = plugin.load.bind(plugin, ...options);
  preInstallScripts.push(plugin);
};
