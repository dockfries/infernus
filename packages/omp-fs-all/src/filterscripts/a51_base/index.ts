/**
 * ------------------------------------------------------
 * Example Filterscript for the Area 51 (69) Base Objects
 * ------------------------------------------------------
 * By Matite in March 2015
 * 
 * This script removes the existing GTASA Area 51 (69) land section, fence and
 * buildings. It then replaces the land section and buildings with the new
 * enterable versions. It also replaces the perimeter fence and adds two
 * gates that can be opened or closed.
 * 
 * Warning...
 * This script uses a total of:
 * 11 objects = 1 for the replacement land object, 7 for the replacement
   building objects, 1 for the outer fence and 2 for the gates
 * Enables the /a51 command to teleport the player to the Area 51 (69) Base
 * 2 3D Text Labels = 1 on each gate
 */

import { IA51Options } from "@/interfaces";

import { BaseGameText, I18n, IFilterScript } from "omp-node-lib";

import { loadLabels, registerLabelEvent, unloadLabels } from "./label";
import { loadObjects, moveGate, removeBuilding, unloadObjects } from "./object";

import zh_cn from "./locales/zh-CN.json";
import en_us from "./locales/en-US.json";
import { playerEvent } from "./player";

export const useA51BaseFS = (options?: IA51Options): IFilterScript => {
  let unregisterCommand: ReturnType<typeof playerEvent.onCommandText>;
  const _options = options || {};
  _options.defaultLocale = _options.defaultLocale || "en_US";
  _options.command = _options.command || "a51";

  const { locales, defaultLocale } = _options;
  const i18n = new I18n(defaultLocale, { zh_cn, en_us });
  if (locales) i18n.addLocales(locales);

  const registerEvent = () => {
    playerEvent.onConnect = (p) => {
      removeBuilding(p);
      loadLabels(p, _options, i18n);
      return true;
    };
    playerEvent.onDisconnect = (p) => {
      unloadLabels(_options, i18n, p);
      return true;
    };
    playerEvent.onKeyStateChange = (p, newKeys) => {
      moveGate(playerEvent, p, newKeys, _options, i18n);
      return true;
    };
    if (_options.onCommandReceived) {
      playerEvent.onCommandReceived = _options.onCommandReceived;
    }
  };

  const unregisterEvent = () => {
    playerEvent.onConnect = undefined;
    playerEvent.onKeyStateChange = undefined;
    playerEvent.onCommandReceived = undefined;
  };

  const registerCommand = () => {
    const { command, onTeleport } = _options;
    unregisterCommand = playerEvent.onCommandText(command as string, (p) => {
      p.setInterior(0);
      p.setPos(135.2, 1948.51, 19.74);
      p.setFacingAngle(180);
      p.setCameraBehind();
      if (onTeleport) onTeleport(p);
      else
        new BaseGameText(
          `~b~~h~${i18n?.$t("a51.text.teleport", null, p.locale)}`,
          3000,
          3
        ).forPlayer(p);
      return true;
    });
  };

  const separator = () => {
    console.log("  |---------------------------------------------------");
  };

  return {
    name: "a51_base",
    load() {
      registerEvent();
      loadObjects(_options, i18n);
      registerLabelEvent(_options, i18n);
      registerCommand();

      console.log("\n");
      separator();
      console.log(`  |--- ${i18n.$t("a51.load.line-1")}`);
      console.log(`  |--  ${i18n.$t("a51.load.line-2")}`);
      console.log(`  |--  ${i18n.$t("a51.load.line-3")}`);
      separator();
    },
    unload() {
      unregisterEvent();
      unregisterCommand();
      unloadObjects(_options, i18n);
      unloadLabels(_options, i18n);

      separator();
      console.log(`  |--- ${i18n?.$t("a51.unload.line-1")}`);
      separator();
    },
  };
};
