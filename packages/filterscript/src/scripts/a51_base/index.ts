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

import type { IA51Options } from "filterscript/interfaces";

import type { IFilterScript } from "@infernus/core";
import { GameText, I18n, PlayerEvent } from "@infernus/core";

import { loadLabels, registerLabelEvent, unloadLabels } from "./label";
import { loadObjects, moveGate, removeBuilding, unloadObjects } from "./object";

import zh_cn from "./locales/zh-CN.json";
import en_us from "./locales/en-US.json";

export const useA51BaseFS = (options?: IA51Options): IFilterScript => {
  const _options = options || {};
  _options.defaultLocale = _options.defaultLocale || "en_US";
  _options.command = _options.command || "a51";

  const { locales, defaultLocale } = _options;
  const i18n = new I18n(defaultLocale, { zh_cn, en_us });
  if (locales) i18n.addLocales(locales);

  function registerEvent() {
    const offOnConnect = PlayerEvent.onConnect(({ player, next }) => {
      removeBuilding(player);
      loadLabels(player, _options, i18n);
      return next();
    });
    const offOnDisconnect = PlayerEvent.onDisconnect(({ player, next }) => {
      unloadLabels(_options, i18n, player);
      return next();
    });
    const offOnKeyStateChange = PlayerEvent.onKeyStateChange(
      ({ player, newKeys, next }) => {
        moveGate(player, newKeys, _options, i18n);
        return next();
      },
    );

    const offOnCommandReceived = PlayerEvent.onCommandReceived(
      ({ player, command, next }) => {
        if (_options.onCommandReceived) {
          const ret = _options.onCommandReceived(player, command);
          if (!ret) return ret;
          return next();
        }
      },
    );

    return [
      offOnConnect,
      offOnDisconnect,
      offOnKeyStateChange,
      offOnCommandReceived,
    ];
  }

  function registerCommand() {
    const { command, onTeleport } = _options;
    return PlayerEvent.onCommandText(command as string, ({ player, next }) => {
      player.setInterior(0);
      player.setPos(135.2, 1948.51, 19.74);
      player.setFacingAngle(180);
      player.setCameraBehind();
      if (onTeleport) onTeleport(player);
      else
        new GameText(
          `~b~~h~${i18n?.$t("a51.text.teleport", null, player.locale)}`,
          3000,
          3,
        ).forPlayer(player);
      return next();
    });
  }

  const separator = () => {
    console.log("  |---------------------------------------------------");
  };

  return {
    name: "a51_base",
    load() {
      const offs = registerEvent();
      offs.push(loadObjects(_options, i18n));
      offs.push(registerLabelEvent(_options, i18n));
      offs.push(registerCommand());

      console.log("\n");
      separator();
      console.log(`  |--- ${i18n.$t("a51.load.line-1")}`);
      console.log(`  |--  ${i18n.$t("a51.load.line-2")}`);
      console.log(`  |--  ${i18n.$t("a51.load.line-3")}`);
      separator();

      return offs;
    },
    unload() {
      unloadObjects(_options, i18n);
      unloadLabels(_options, i18n);

      separator();
      console.log(`  |--- ${i18n?.$t("a51.unload.line-1")}`);
      separator();
    },
  };
};
