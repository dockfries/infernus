import { logger } from "@/logger";
import { TFilterScript } from "@/types";
import { OnGameModeExit } from "@/wrapper/native/callbacks";

const preInstallScripts: Array<TFilterScript> = [];
const installedScripts: Array<TFilterScript> = [];

export const loadUseScript = (scriptName: string): void => {
  setTimeout(async () => {
    try {
      const fsIdx = preInstallScripts.findIndex((fs) => fs.name === scriptName);
      if (fsIdx === -1) return;

      const fs = preInstallScripts[fsIdx];
      const loadFn = fs.load;
      if (loadFn instanceof Promise) await loadFn();
      else loadFn();

      preInstallScripts.splice(fsIdx, 1);
      installedScripts.push(fs);
    } catch (err) {
      logger.error(`[BaseGameMode]: script ${scriptName} load fail`);
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
      const unloadFn = fs.unload;
      if (unloadFn instanceof Promise) await unloadFn();
      else unloadFn();

      installedScripts.splice(fsIdx, 1);
      preInstallScripts.push(fs);
    } catch (err) {
      logger.error(`[BaseGameMode]: script ${scriptName} unload fail`);
      logger.warn(new Error(JSON.stringify(err)));
    }
  });
};

export const reloadUseScript = (scriptName: string) => {
  unloadUseScript(scriptName);
  loadUseScript(scriptName);
};

OnGameModeExit(() => {
  installedScripts.forEach((fs) => unloadUseScript(fs.name));
});

export const useFilterScript = function (
  this: any,
  plugin: TFilterScript,
  ...options: Array<any>
): void {
  if (
    preInstallScripts.some((fs) => fs === plugin) ||
    installedScripts.some((fs) => fs === plugin)
  ) {
    logger.warn(`[BaseGameMode]: script has already been applied`);
    return;
  }
  plugin.load = plugin.load.bind(plugin, this, ...options);
  preInstallScripts.push(plugin);
  loadUseScript(plugin.name);
};
