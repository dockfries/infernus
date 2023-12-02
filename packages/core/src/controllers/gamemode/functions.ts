import type { IFilterScript } from "../../interfaces";

import {
  useFilterScript,
  loadUseScript,
  reloadUseScript,
  unloadUseScript,
} from "../filterscript";

import * as w from "@infernus/wrapper";
import * as f from "../../wrapper/native/functions";

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
    return f.SetWeather(weather);
  },
  setWorldTime(hour: number): number {
    if (hour < 0 || hour > 23) {
      logger.error("[GameMode]: The valid hour value is only 0 to 23");
      return 0;
    }
    return f.SetWorldTime(hour);
  },
  setTeamCount: f.SetTeamCount,
  sendRconCommand: f.SendRconCommand,
  addPlayerClass: f.AddPlayerClass,
  addPlayerClassEx: f.AddPlayerClassEx,
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
    return f.CreateExplosion(X, Y, Z, type, radius);
  },
  manualVehicleEngineAndLights: f.ManualVehicleEngineAndLights,
  blockIpAddress: f.BlockIpAddress,
  unBlockIpAddress: f.UnBlockIpAddress,
  getServerTickRate: f.GetServerTickRate,
  addSimpleModel(
    virtualWorld: number,
    baseid: number,
    newid: number,
    dffname: string,
    txdName: string
  ): number {
    if (this.checkSimpleModel(virtualWorld, baseid, newid, dffname, txdName)) {
      return f.AddSimpleModel(virtualWorld, baseid, newid, dffname, txdName);
    }
    return 0;
  },
  addSimpleModelTimed(
    virtualWorld: number,
    baseid: number,
    newid: number,
    dffname: string,
    txdName: string,
    timeon: number,
    timeoff: number
  ): number {
    if (
      this.checkSimpleModel(
        virtualWorld,
        baseid,
        newid,
        dffname,
        txdName,
        timeon,
        timeoff
      )
    ) {
      return f.AddSimpleModelTimed(
        virtualWorld,
        baseid,
        newid,
        dffname,
        txdName,
        timeon,
        timeoff
      );
    }
    return 0;
  },
  checkSimpleModel(
    virtualWorld: number,
    baseid: number,
    newid: number,
    dffname: string,
    txdName: string,
    timeon?: number,
    timeoff?: number
  ): number {
    if (virtualWorld < -1) {
      logger.error("[GameMode]: AddSimpleModel - Error virtual world");
      return 0;
    }
    if (baseid < 0) {
      logger.error("[GameMode]: AddSimpleModel - Error baseid");
      return 0;
    }
    if (newid > -1000 || newid < -30000) {
      logger.error("[GameMode]: AddSimpleModel - Error newid range");
      return 0;
    }
    if (dffname.trim().length < 0) {
      logger.error("[GameMode]: AddSimpleModel - Empty dffname");
      return 0;
    }
    if (txdName.trim().length < 0) {
      logger.error("[GameMode]: AddSimpleModel - Empty txdName");
      return 0;
    }
    if (timeon !== undefined && (timeon < 0 || timeon > 23)) {
      logger.error("[GameMode]: AddSimpleModel - Error time on range");
      return 0;
    }
    if (timeoff !== undefined && (timeoff < 0 || timeoff > 23)) {
      logger.error("[GameMode]: AddSimpleModel - Error time off range");
      return 0;
    }
    return 1;
  },

  getConsoleVarAsString(varname: string, charset = "utf8") {
    const consoleVar = w.GetConsoleVarAsByteArray(varname);
    return I18n.decodeFromBuf(I18n.getValidStr(consoleVar), charset);
  },

  allowAdminTeleport: w.AllowAdminTeleport,
  isAdminTeleportAllowed: w.IsAdminTeleportAllowed,
  allowInteriorWeapons: w.AllowInteriorWeapons,
  areInteriorWeaponsAllowed: w.AreInteriorWeaponsAllowed,
  areAllAnimationsEnabled: w.AreAllAnimationsEnabled,
  enableAllAnimations: w.EnableAllAnimations,
  enableStuntBonusForAll: f.EnableStuntBonusForAll,
  enableVehicleFriendlyFire: f.EnableVehicleFriendlyFire,
  enableZoneNames: f.EnableZoneNames,
  disableInteriorEnterExits: f.DisableInteriorEnterExits,
  setGameModeText: f.SetGameModeText,
  getGravity: f.GetGravity,
  setGravity: f.SetGravity,
  showNameTags: f.ShowNameTags,
  disableNameTagLOS: f.DisableNameTagLOS,
  usePlayerPedAnims: f.UsePlayerPedAnims,
  showPlayerMarkers: f.ShowPlayerMarkers,
  limitPlayerMarkerRadius: f.LimitPlayerMarkerRadius,
  limitGlobalChatRadius: f.LimitGlobalChatRadius,
  setNameTagDrawDistance: f.SetNameTagDrawDistance,
  findModelFileNameFromCRC: f.FindModelFileNameFromCRC,
  findTextureFileNameFromCRC: f.FindTextureFileNameFromCRC,
  getWeaponName: f.GetWeaponName,
  setObjectsDefaultCameraCollision: f.SetObjectsDefaultCameraCollision,
  vectorSize: f.VectorSize,
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
};
