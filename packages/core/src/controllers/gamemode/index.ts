import {
  OnGameModeExit,
  OnGameModeInit,
  OnIncomingConnection,
} from "@/wrapper/native/callbacks";
import * as fns from "@/wrapper/native/functions";
import { logger } from "@/logger";
import {
  OnRconCommand,
  OnRconLoginAttempt,
  defineAsyncCallback,
} from "@/utils/helperUtils";
import { defaultCharset } from "./settings";
import type { TCommonCallback } from "@/types";
import {
  loadUseScript,
  reloadUseScript,
  unloadUseScript,
  useFilterScript,
} from "../filterscript";
import {
  ClearBanList,
  IsBanned,
  IsValidNickName,
  AllowNickNameCharacter,
  IsNickNameCharacterAllowed,
  AddServerRule,
  SetServerRule,
  IsValidServerRule,
  RemoveServerRule,
  GetWeaponSlot,
  GetAvailableClasses,
  GetPlayerClass,
  EditPlayerClass,
  ToggleChatTextReplacement,
  ChatTextReplacementToggled,
  AllowAdminTeleport,
  IsAdminTeleportAllowed,
  AllowInteriorWeapons,
  AreInteriorWeaponsAllowed,
  AreAllAnimationsEnabled,
  EnableAllAnimations,
} from "@infernus/wrapper";
import type { IFilterScript } from "@/interfaces";

export class GameMode {
  static charset = defaultCharset;
  private initialized = false;

  constructor() {
    OnGameModeInit((): void => {
      if (this.initialized)
        return logger.error("[GameMode]: Cannot be initialized more than once");
      GameMode.supportAllNickname();
      this.initialized = true;
      this.onInit && this.onInit();
    });
    OnGameModeExit((): void => {
      if (!this.initialized)
        return logger.error("[GameMode]: Cannot unload more than once");
      this.initialized = false;
      this.onExit && this.onExit();
    });
    OnIncomingConnection(defineAsyncCallback(this, "onIncomingConnection"));
    OnRconCommand(defineAsyncCallback(this, "onRconCommand"));
    OnRconLoginAttempt(defineAsyncCallback(this, "onRconLoginAttempt"));
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  // do something during close/restart server, such as storage of player data
  static exit(): void {
    // it's restart
    fns.GameModeExit();
  }

  // support filter script which use @infernus/core
  static use = (plugin: IFilterScript, ...options: Array<any>) => {
    useFilterScript(plugin, ...options);
    return this;
  };

  static loadScript = loadUseScript;
  static unloadScript = unloadUseScript;
  static reloadScript = reloadUseScript;

  static supportAllNickname() {
    /**
     * In utf8, different national languages take up different numbers of bytes,
     * but no matter how many bytes they take up, a byte always takes up 8 bits of binary,
     * i.e., a decimal integer up to 255.
     */
    for (let i = 0; i <= 255; i++) {
      if (!GameMode.isNickNameCharacterAllowed(i))
        GameMode.allowNickNameCharacter(i, true);
    }
  }

  onInit?(): void;
  onExit?(): void;
  onIncomingConnection?(
    playerid: number,
    ipAddress: string,
    port: number
  ): TCommonCallback;
  onRconCommand?(cmd: string): TCommonCallback;
  onRconLoginAttempt?(
    ip: string,
    password: string,
    success: boolean
  ): TCommonCallback;
  static allowAdminTeleport = AllowAdminTeleport;
  static isAdminTeleportAllowed = IsAdminTeleportAllowed;
  static allowInteriorWeapons = AllowInteriorWeapons;
  static areInteriorWeaponsAllowed = AreInteriorWeaponsAllowed;
  static areAllAnimationsEnabled = AreAllAnimationsEnabled;
  static enableAllAnimations = EnableAllAnimations;
  static enableStuntBonusForAll = fns.EnableStuntBonusForAll;
  static enableVehicleFriendlyFire = fns.EnableVehicleFriendlyFire;
  static enableZoneNames = fns.EnableZoneNames;
  static disableInteriorEnterExits = fns.DisableInteriorEnterExits;
  static setGameModeText = fns.SetGameModeText;
  static getGravity = fns.GetGravity;
  static setGravity = fns.SetGravity;
  static showNameTags = fns.ShowNameTags;
  static disableNameTagLOS = fns.DisableNameTagLOS;
  static usePlayerPedAnims = fns.UsePlayerPedAnims;
  static showPlayerMarkers = fns.ShowPlayerMarkers;
  static limitPlayerMarkerRadius = fns.LimitPlayerMarkerRadius;
  static limitGlobalChatRadius = fns.LimitGlobalChatRadius;
  static setNameTagDrawDistance = fns.SetNameTagDrawDistance;
  static setWeather(weather: number): number {
    if (weather < 0 || weather > 255) {
      logger.error("[GameMode]: The valid weather value is only 0 to 255");
      return 0;
    }
    return fns.SetWeather(weather);
  }
  static setWorldTime(hour: number): number {
    if (hour < 0 || hour > 23) {
      logger.error("[GameMode]: The valid hour value is only 0 to 23");
      return 0;
    }
    return fns.SetWorldTime(hour);
  }
  static setTeamCount = fns.SetTeamCount;
  static sendRconCommand = fns.SendRconCommand;
  static addPlayerClass = fns.AddPlayerClass;
  static addPlayerClassEx = fns.AddPlayerClassEx;
  static createExplosion(
    X: number,
    Y: number,
    Z: number,
    type: number,
    Radius: number
  ): number {
    if (type < 0 || type > 13) {
      logger.error(
        "[GameMode]: The valid explosion type value is only 0 to 13"
      );
      return 0;
    }
    return fns.CreateExplosion(X, Y, Z, type, Radius);
  }
  static manualVehicleEngineAndLights = fns.ManualVehicleEngineAndLights;
  static blockIpAddress = fns.BlockIpAddress;
  static unBlockIpAddress = fns.UnBlockIpAddress;
  static getServerTickRate = fns.GetServerTickRate;
  static addSimpleModel(
    virtualworld: number,
    baseid: number,
    newid: number,
    dffname: string,
    txdname: string
  ): number {
    if (this.checkSimpleModel(virtualworld, baseid, newid, dffname, txdname)) {
      return fns.AddSimpleModel(virtualworld, baseid, newid, dffname, txdname);
    }
    return 0;
  }
  static addSimpleModelTimed(
    virtualworld: number,
    baseid: number,
    newid: number,
    dffname: string,
    txdname: string,
    timeon: number,
    timeoff: number
  ): number {
    if (
      this.checkSimpleModel(
        virtualworld,
        baseid,
        newid,
        dffname,
        txdname,
        timeon,
        timeoff
      )
    ) {
      return fns.AddSimpleModelTimed(
        virtualworld,
        baseid,
        newid,
        dffname,
        txdname,
        timeon,
        timeoff
      );
    }
    return 0;
  }
  private static checkSimpleModel(
    virtualworld: number,
    baseid: number,
    newid: number,
    dffname: string,
    txdname: string,
    timeon?: number,
    timeoff?: number
  ): number {
    if (virtualworld < -1) {
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
    if (txdname.trim().length < 0) {
      logger.error("[GameMode]: AddSimpleModel - Empty txdname");
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
  }
  static findModelFileNameFromCRC = fns.FindModelFileNameFromCRC;
  static findTextureFileNameFromCRC = fns.FindTextureFileNameFromCRC;
  static getWeaponName = fns.GetWeaponName;
  static setObjectsDefaultCameraCollision =
    fns.SetObjectsDefaultCameraCollision;
  static vectorSize = fns.VectorSize;
  static clearBanList = ClearBanList;
  static isBanned = IsBanned;
  static isValidNickName = IsValidNickName;
  static allowNickNameCharacter = AllowNickNameCharacter;
  static isNickNameCharacterAllowed = IsNickNameCharacterAllowed;
  static addServerRule = AddServerRule;
  static setServerRule = SetServerRule;
  static isValidServerRule = IsValidServerRule;
  static removeServerRule = RemoveServerRule;
  static getWeaponSlot = GetWeaponSlot;
  static getAvailableClasses = GetAvailableClasses;
  static getPlayerClass = GetPlayerClass;
  static editPlayerClass = EditPlayerClass;
  static toggleChatTextReplacement = ToggleChatTextReplacement;
  static chatTextReplacementToggled = ChatTextReplacementToggled;
}
