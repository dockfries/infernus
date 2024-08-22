import {
  onInit,
  onExit,
  onIncomingConnection,
  onRconCommand,
  onRconLoginAttempt,
} from "./event";

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
import { SendRconCommand } from "core/utils/helperUtils";
import { CmdBus } from "../player/command";

export class GameMode {
  private constructor() {
    throw new Error("This is a static class and cannot be instantiated.");
  }

  static onInit = onInit;
  static onExit = onExit;
  static onIncomingConnection = onIncomingConnection;
  static onRconCommand = onRconCommand;
  static onRconLoginAttempt = onRconLoginAttempt;

  static use(plugin: IFilterScript, ...options: Array<any>) {
    useFilterScript(plugin, ...options);
    return this;
  }

  static loadUseScript = loadUseScript;
  static reloadUseScript = reloadUseScript;
  static unloadUseScript = unloadUseScript;

  static enableCmdCaseSensitive = CmdBus.enableCaseSensitive;
  static disableCmdCaseSensitive = CmdBus.disableCaseSensitive;
  static isCmdCaseSensitive = CmdBus.isCaseSensitive;

  static supportAllNickname() {
    /**
     * In utf8, different national languages take up different numbers of bytes,
     * but no matter how many bytes they take up, a byte always takes up 8 bits of binary,
     * i.e., a decimal integer up to 255.
     */
    for (let i = 0; i <= 255; i++) {
      if (!this.isNickNameCharacterAllowed(i))
        this.allowNickNameCharacter(i, true);
    }
  }

  static setWeather(weather: number): number {
    if (weather < 0 || weather > 255) {
      logger.error("[GameMode]: The valid weather value is only 0 to 255");
      return 0;
    }
    return w.SetWeather(weather);
  }
  static setWorldTime(hour: number): number {
    if (hour < 0 || hour > 23) {
      logger.error("[GameMode]: The valid hour value is only 0 to 23");
      return 0;
    }
    return w.SetWorldTime(hour);
  }
  static getWorldTime = w.GetWorldTime;
  static setTeamCount = w.SetTeamCount;
  static sendRconCommand = SendRconCommand;
  static addPlayerClass = w.AddPlayerClass;
  static addPlayerClassEx = w.AddPlayerClassEx;
  static createExplosion(
    X: number,
    Y: number,
    Z: number,
    type: number,
    radius: number,
  ): number {
    if (type < 0 || type > 13) {
      logger.error(
        "[GameMode]: The valid explosion type value is only 0 to 13",
      );
      return 0;
    }
    return w.CreateExplosion(X, Y, Z, type, radius);
  }
  static manualVehicleEngineAndLights = w.ManualVehicleEngineAndLights;
  static blockIpAddress = w.BlockIpAddress;
  static unBlockIpAddress = w.UnBlockIpAddress;
  static getServerTickRate = w.GetServerTickRate;
  static addSimpleModel(
    virtualWorld: number,
    baseId: number,
    newId: number,
    dffName: string,
    txdName: string,
  ): number {
    if (this.checkSimpleModel(virtualWorld, baseId, newId, dffName, txdName)) {
      return w.AddSimpleModel(virtualWorld, baseId, newId, dffName, txdName);
    }
    return 0;
  }
  static addSimpleModelTimed(
    virtualWorld: number,
    baseId: number,
    newId: number,
    dffName: string,
    txdName: string,
    timeOn: number,
    timeOff: number,
  ): number {
    if (
      this.checkSimpleModel(
        virtualWorld,
        baseId,
        newId,
        dffName,
        txdName,
        timeOn,
        timeOff,
      )
    ) {
      return w.AddSimpleModelTimed(
        virtualWorld,
        baseId,
        newId,
        dffName,
        txdName,
        timeOn,
        timeOff,
      );
    }
    return 0;
  }
  static checkSimpleModel(
    virtualWorld: number,
    baseId: number,
    newId: number,
    dffName: string,
    txdName: string,
    timeOn?: number,
    timeOff?: number,
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
  }
  static isValidCustomModel = w.IsValidCustomModel;
  static getCustomModePath = w.GetCustomModePath;
  static getConsoleVarAsString(varname: string, charset = "utf8") {
    const consoleVar = w.GetConsoleVarAsByteArray(varname);
    return I18n.decodeFromBuf(I18n.getValidStr(consoleVar), charset);
  }
  static getRestartTime = w.GetModeRestartTime;
  static setRestartTime = w.SetModeRestartTime;
  static allowAdminTeleport = w.AllowAdminTeleport;
  static isAdminTeleportAllowed = w.IsAdminTeleportAllowed;
  static allowInteriorWeapons = w.AllowInteriorWeapons;
  static areInteriorWeaponsAllowed = w.AreInteriorWeaponsAllowed;
  static areAllAnimationsEnabled = w.AreAllAnimationsEnabled;
  static enableAllAnimations = w.EnableAllAnimations;
  static enableStuntBonusForAll = w.EnableStuntBonusForAll;
  static enableVehicleFriendlyFire = w.EnableVehicleFriendlyFire;
  static enableZoneNames = w.EnableZoneNames;
  static disableInteriorEnterExits = w.DisableInteriorEnterExits;
  static setGameModeText = w.SetGameModeText;
  static getGravity = w.GetGravity;
  static setGravity = w.SetGravity;
  static showNameTags = w.ShowNameTags;
  static disableNameTagLOS = w.DisableNameTagLOS;
  static usePlayerPedAnims = w.UsePlayerPedAnims;
  static showPlayerMarkers = w.ShowPlayerMarkers;
  static limitPlayerMarkerRadius = w.LimitPlayerMarkerRadius;
  static limitGlobalChatRadius = w.LimitGlobalChatRadius;
  static setNameTagDrawDistance = w.SetNameTagDrawDistance;
  static findModelFileNameFromCRC = w.FindModelFileNameFromCRC;
  static findTextureFileNameFromCRC = w.FindTextureFileNameFromCRC;
  static getWeaponName = w.GetWeaponName;
  static setObjectsDefaultCameraCollision = w.SetObjectsDefaultCameraCollision;
  static vectorSize = w.VectorSize;
  static clearBanList = w.ClearBanList;
  static isBanned = w.IsBanned;
  static isValidNickName = w.IsValidNickName;
  static allowNickNameCharacter = w.AllowNickNameCharacter;
  static isNickNameCharacterAllowed = w.IsNickNameCharacterAllowed;
  static addServerRule = w.AddServerRule;
  static setServerRule = w.SetServerRule;
  static isValidServerRule = w.IsValidServerRule;
  static removeServerRule = w.RemoveServerRule;
  static getWeaponSlot = w.GetWeaponSlot;
  static getAvailableClasses = w.GetAvailableClasses;
  static getPlayerClass = w.GetPlayerClass;
  static editPlayerClass = w.EditPlayerClass;
  static toggleChatTextReplacement = w.ToggleChatTextReplacement;
  static chatTextReplacementToggled = w.ChatTextReplacementToggled;
  static getConsoleVarAsInt = w.GetConsoleVarAsInt;
  static getConsoleVarAsBool = w.GetConsoleVarAsBool;
  static getWeather = w.GetWeather;
  static getServerRuleFlag = w.GetServerRuleFlags;
  static setServerRuleFlags = w.SetServerRuleFlags;
}
