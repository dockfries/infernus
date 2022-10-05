import { logger } from "@/logger";
import { TFilterScript } from "@/types";
import { OnRconCommand } from "@/utils/helperUtils";

const preInstallScripts: Array<TFilterScript> = [];
const installedScripts: Array<TFilterScript> = [];

const loadScript = (scriptName: string): void => {
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
    }
  });
};
const unloadScript = (scriptName: string): void => {
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
    }
  });
};

OnRconCommand((command: string): number => {
  const regCmd = command.trim().match(/[^/\s]+/gi);
  if (!regCmd || regCmd.length < 2) return 1;
  const [firstLevel, scriptName] = command;
  if (firstLevel === "loadfs") {
    loadScript(scriptName);
  } else if (firstLevel === "unloadfs") {
    unloadScript(scriptName);
  } else if (firstLevel === "reloadfs") {
    unloadScript(scriptName);
    loadScript(scriptName);
  }
  return 1;
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
  loadScript(plugin.name);
};
