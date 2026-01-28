import { GameModeException } from "core/exceptions";
import type { IFilterScript } from "../../interfaces";
import { onExit, onInit } from "../gamemode/event";

const preInstallScripts: Array<IFilterScript> = [];
const installedScripts: Array<IFilterScript> = [];
const registeredEvents = new Map<string, Array<() => void>>();
export const loadUseScript = async (scriptName: string) => {
  try {
    return await new Promise<void>((resolve, reject) => {
      const fsIdx = preInstallScripts.findIndex((fs) => fs.name === scriptName);
      if (fsIdx === -1) return;

      const scripts = preInstallScripts[fsIdx];

      function load(events: Array<() => void>) {
        if (events.length) registeredEvents.set(scriptName, events);
        preInstallScripts.splice(fsIdx, 1);
        installedScripts.push(scripts);
        setTimeout(resolve);
      }

      const ret = scripts.load();

      if (ret instanceof Promise) {
        ret.then(load).catch(reject);
      } else {
        load(ret);
      }
    });
  } catch (err) {
    throw new GameModeException(`script ${scriptName} load fail\nerr:${err}`);
  }
};

export const unloadUseScript = async (scriptName: string) => {
  try {
    return await new Promise<void>((resolve, reject) => {
      const fsIdx = installedScripts.findIndex((fs) => fs.name === scriptName);
      if (fsIdx === -1) return;

      const scripts = installedScripts[fsIdx];
      const offs = registeredEvents.get(scriptName);
      if (offs) {
        offs.forEach((off) => off());
        registeredEvents.delete(scriptName);
      }

      function unload() {
        installedScripts.splice(fsIdx, 1);
        preInstallScripts.push(scripts);
        setTimeout(resolve);
      }

      const ret = scripts.unload();
      if (ret instanceof Promise) {
        ret.then(unload).catch(reject);
      } else {
        unload();
      }
    });
  } catch (err) {
    throw new GameModeException(`script ${scriptName} unload fail\n${err}`);
  }
};

export const reloadUseScript = async (scriptName: string) => {
  await unloadUseScript(scriptName);
  await loadUseScript(scriptName);
};

export const isUseScriptLoaded = (scriptName: string) => {
  return registeredEvents.has(scriptName);
};

onInit(async ({ next }) => {
  const fsNames = preInstallScripts.map((fs) => fs.name);
  for (const fs of fsNames) {
    await loadUseScript(fs);
  }
  return next();
});

onExit(async ({ next }) => {
  const fsNames = installedScripts.map((fs) => fs.name);
  for (const fs of fsNames) {
    await unloadUseScript(fs);
  }
  return next();
});

export const useFilterScript = function (
  script: IFilterScript,
  ...options: Array<any>
): void {
  if (
    preInstallScripts.some((fs) => fs.name === script.name) ||
    installedScripts.some((fs) => fs.name === script.name)
  ) {
    throw new GameModeException(
      `script ${script.name} has already been applied`,
    );
  }
  script.load = script.load.bind(script, ...options);
  preInstallScripts.push(script);
};
