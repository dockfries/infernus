import type { IFilterScript } from "../../interfaces";

import {
  useFilterScript,
  loadUseScript,
  reloadUseScript,
  unloadUseScript,
} from "../filterscript";

import * as w from "core/wrapper/native";

import { I18n } from "../i18n";
import { logger } from "../../logger";

export default {
  use(plugin: IFilterScript, ...options: Array<any>) {
    useFilterScript(plugin, ...options);
    return this;
  },

  loadUseScript,
  reloadUseScript,
  unloadUseScript,

  supportAllNickname() {
    /**
     * In utf8, different national languages take up different numbers of bytes,
     * but no matter how many bytes they take up, a byte always takes up 8 bits of binary,
     * i.e., a decimal integer up to 255.
     */
    for (let i = 0; i <= 255; i++) {
      if (!this.isNickNameCharacterAllowed(i))
        this.allowNickNameCharacter(i, true);
    }
  },

  setWeather(weather: number): number {
    if (weather < 0 || weather > 255) {
      logger.error("[GameMode]: The valid weather value is only 0 to 255");
      return 0;
    }
    return w.SetWeather(weather);
  },
  setWorldTime(hour: number): number {
    if (hour < 0 || hour > 23) {
      logger.error("[GameMode]: The valid hour value is only 0 to 23");
      return 0;
    }
    return w.SetWorldTime(hour);
  },
  getWorldTime: w.GetWorldTime,
  setTeamCount: w.SetTeamCount,
  sendRconCommand: w.SendRconCommand,
  addPlayerClass: w.AddPlayerClass,
  addPlayerClassEx: w.AddPlayerClassEx,
  createExplosion(
    X: number,
    Y: number,
    Z: number,
    type: number,
    radius: number
  ): number {
    if (type < 0 || type > 13) {
      logger.error(
        "[GameMode]: The valid explosion type value is only 0 to 13"
      );
      return 0;
    }
    return w.CreateExplosion(X, Y, Z, type, radius);
  },
  manualVehicleEngineAndLights: w.ManualVehicleEngineAndLights,
  blockIpAddress: w.BlockIpAddress,
  unBlockIpAddress: w.UnBlockIpAddress,
  getServerTickRate: w.GetServerTickRate,
  addSimpleModel(
    virtualWorld: number,
    baseId: number,
    newId: number,
    dffName: string,
    txdName: string
  ): number {
    if (this.checkSimpleModel(virtualWorld, baseId, newId, dffName, txdName)) {
      return w.AddSimpleModel(virtualWorld, baseId, newId, dffName, txdName);
    }
    return 0;
  },
  addSimpleModelTimed(
    virtualWorld: number,
    baseId: number,
    newId: number,
    dffName: string,
    txdName: string,
    timeOn: number,
    timeOff: number
  ): number {
    if (
      this.checkSimpleModel(
        virtualWorld,
        baseId,
        newId,
        dffName,
        txdName,
        timeOn,
        timeOff
      )
    ) {
      return w.AddSimpleModelTimed(
        virtualWorld,
        baseId,
        newId,
        dffName,
        txdName,
        timeOn,
        timeOff
      );
    }
    return 0;
  },
  checkSimpleModel(
    virtualWorld: number,
    baseId: number,
    newId: number,
    dffName: string,
    txdName: string,
    timeOn?: number,
    timeOff?: number
  ): number {
    if (virtualWorld < -1) {
      logger.error("[GameMode]: AddSimpleModel - Error virtual world");
      return 0;
    }
    if (baseId < 0) {
      logger.error("[GameMode]: AddSimpleModel - Error baseId");
      return 0;
    }
    if (newId > -1000 || newId < -30000) {
      logger.error("[GameMode]: AddSimpleModel - Error newId range");
      return 0;
    }
    if (dffName.trim().length < 0) {
      logger.error("[GameMode]: AddSimpleModel - Empty dffName");
      return 0;
    }
    if (txdName.trim().length < 0) {
      logger.error("[GameMode]: AddSimpleModel - Empty txdName");
      return 0;
    }
    if (timeOn !== undefined && (timeOn < 0 || timeOn > 23)) {
      logger.error("[GameMode]: AddSimpleModel - Error time on range");
      return 0;
    }
    if (timeOff !== undefined && (timeOff < 0 || timeOff > 23)) {
      logger.error("[GameMode]: AddSimpleModel - Error time off range");
      return 0;
    }
    return 1;
  },
  isValidCustomModel: w.IsValidCustomModel,
  getCustomModePath: w.GetCustomModePath,
  getConsoleVarAsString(varname: string, charset = "utf8") {
    const consoleVar = w.GetConsoleVarAsByteArray(varname);
    return I18n.decodeFromBuf(I18n.getValidStr(consoleVar), charset);
  },
  getRestartTime: w.GetModeRestartTime,
  setRestartTime: w.SetModeRestartTime,
  allowAdminTeleport: w.AllowAdminTeleport,
  isAdminTeleportAllowed: w.IsAdminTeleportAllowed,
  allowInteriorWeapons: w.AllowInteriorWeapons,
  areInteriorWeaponsAllowed: w.AreInteriorWeaponsAllowed,
  areAllAnimationsEnabled: w.AreAllAnimationsEnabled,
  enableAllAnimations: w.EnableAllAnimations,
  enableStuntBonusForAll: w.EnableStuntBonusForAll,
  enableVehicleFriendlyFire: w.EnableVehicleFriendlyFire,
  enableZoneNames: w.EnableZoneNames,
  disableInteriorEnterExits: w.DisableInteriorEnterExits,
  setGameModeText: w.SetGameModeText,
  getGravity: w.GetGravity,
  setGravity: w.SetGravity,
  showNameTags: w.ShowNameTags,
  disableNameTagLOS: w.DisableNameTagLOS,
  usePlayerPedAnims: w.UsePlayerPedAnims,
  showPlayerMarkers: w.ShowPlayerMarkers,
  limitPlayerMarkerRadius: w.LimitPlayerMarkerRadius,
  limitGlobalChatRadius: w.LimitGlobalChatRadius,
  setNameTagDrawDistance: w.SetNameTagDrawDistance,
  findModelFileNameFromCRC: w.FindModelFileNameFromCRC,
  findTextureFileNameFromCRC: w.FindTextureFileNameFromCRC,
  getWeaponName: w.GetWeaponName,
  setObjectsDefaultCameraCollision: w.SetObjectsDefaultCameraCollision,
  vectorSize: w.VectorSize,
  clearBanList: w.ClearBanList,
  isBanned: w.IsBanned,
  isValidNickName: w.IsValidNickName,
  allowNickNameCharacter: w.AllowNickNameCharacter,
  isNickNameCharacterAllowed: w.IsNickNameCharacterAllowed,
  addServerRule: w.AddServerRule,
  setServerRule: w.SetServerRule,
  isValidServerRule: w.IsValidServerRule,
  removeServerRule: w.RemoveServerRule,
  getWeaponSlot: w.GetWeaponSlot,
  getAvailableClasses: w.GetAvailableClasses,
  getPlayerClass: w.GetPlayerClass,
  editPlayerClass: w.EditPlayerClass,
  toggleChatTextReplacement: w.ToggleChatTextReplacement,
  chatTextReplacementToggled: w.ChatTextReplacementToggled,
  getConsoleVarAsInt: w.GetConsoleVarAsInt,
  getConsoleVarAsBool: w.GetConsoleVarAsBool,
  getWeather: w.GetWeather,
  getServerRuleFlag: w.GetServerRuleFlags,
  setServerRuleFlags: w.SetServerRuleFlags,
};
