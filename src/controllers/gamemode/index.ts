import {
  OnGameModeExit,
  OnGameModeInit,
  OnIncomingConnection,
} from "@/wrapper/callbacks";
import * as fns from "@/wrapper/functions";
import { logger } from "@/logger";
import {
  OnRconCommand,
  OnRconLoginAttempt,
  promisifyCallback,
} from "@/utils/helperUtils";
import * as ow from "omp-wrapper";
import { defaultCharset } from "./settings";
import { TCommonCallback, TUsePlugin } from "@/types";

export abstract class BaseGameMode {
  public static charset = defaultCharset;
  private static installedPlugins: Array<TUsePlugin> = [];
  private initialized = false;

  public constructor() {
    OnGameModeInit((): void => {
      if (this.initialized)
        return logger.error(
          "[BaseGameMode]: Cannot be initialized more than once"
        );
      BaseGameMode.supportAllNickname();
      this.initialized = true;
      this.onInit();
    });
    OnGameModeExit((): void => {
      if (!this.initialized)
        return logger.error("[BaseGameMode]: Cannot unload more than once");
      this.initialized = false;
      this.onExit();
    });
    OnIncomingConnection(
      promisifyCallback.call(
        this,
        this.onIncomingConnection,
        "onIncomingConnection"
      )
    );
    OnRconCommand(
      promisifyCallback.call(this, this.onRconCommand, "onRconCommand")
    );
    OnRconLoginAttempt(
      promisifyCallback.call(
        this,
        this.onRconLoginAttempt,
        "onRconLoginAttempt"
      )
    );
  }

  public static use(plugin: TUsePlugin, ...args: Array<any>) {
    if (BaseGameMode.installedPlugins.some(plugin)) return BaseGameMode;
    plugin(args);
    BaseGameMode.installedPlugins.push(plugin);
    return BaseGameMode;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  // do something during close/restart server, such as storage of player data
  public static exit(): void {
    // it's restart
    fns.GameModeExit();
  }

  public static supportAllNickname() {
    /**
     * In utf8, different national languages take up different numbers of bytes,
     * but no matter how many bytes they take up, a byte always takes up 8 bits of binary,
     * i.e., a decimal integer up to 255.
     * Most multibyte nicknames are supported to connect to the server,
     * but not for bytes with a decimal size of 233 ～ 255,
     * because the player's spawn will crash after the call.
     */
    for (let i = 0; i <= 255; i++) {
      if (!BaseGameMode.isNickNameCharacterAllowed(i))
        BaseGameMode.allowNickNameCharacter(i, true);
    }
  }

  protected abstract onInit(): void;
  protected abstract onExit(): void;
  protected abstract onIncomingConnection(
    playerid: number,
    ipAddress: string,
    port: number
  ): TCommonCallback;
  protected abstract onRconCommand(cmd: string): TCommonCallback;
  protected abstract onRconLoginAttempt(
    ip: string,
    password: string,
    success: boolean
  ): TCommonCallback;
  public static allowAdminTeleport = fns.AllowAdminTeleport;
  public static allowInteriorWeapons = fns.AllowInteriorWeapons;
  public static enableStuntBonusForAll = fns.EnableStuntBonusForAll;
  public static enableVehicleFriendlyFire = fns.EnableVehicleFriendlyFire;
  public static enableZoneNames = fns.EnableZoneNames;
  public static disableInteriorEnterExits = fns.DisableInteriorEnterExits;
  public static setGameModeText = fns.SetGameModeText;
  public static getGravity = fns.GetGravity;
  public static setGravity = fns.SetGravity;
  public static showNameTags = fns.ShowNameTags;
  public static disableNameTagLOS = fns.DisableNameTagLOS;
  public static usePlayerPedAnims = fns.UsePlayerPedAnims;
  public static showPlayerMarkers = fns.ShowPlayerMarkers;
  public static limitPlayerMarkerRadius = fns.LimitPlayerMarkerRadius;
  public static limitGlobalChatRadius = fns.LimitGlobalChatRadius;
  public static setNameTagDrawDistance = fns.SetNameTagDrawDistance;
  public static setWeather(weather: number): number {
    if (weather < 0 || weather > 255) {
      logger.error("[BaseGameMode]: The valid weather value is only 0 to 255");
      return 0;
    }
    return fns.SetWeather(weather);
  }
  public static setWorldTime(hour: number): number {
    if (hour < 0 || hour > 23) {
      logger.error("[BaseGameMode]: The valid hour value is only 0 to 23");
      return 0;
    }
    return fns.SetWorldTime(hour);
  }
  public static setTeamCount = fns.SetTeamCount;
  public static sendRconCommand = fns.SendRconCommand;
  public static addPlayerClass = fns.AddPlayerClass;
  public static addPlayerClassEx = fns.AddPlayerClassEx;
  public static createExplosion(
    X: number,
    Y: number,
    Z: number,
    type: number,
    Radius: number
  ): number {
    if (type < 0 || type > 13) {
      logger.error(
        "[BaseGameMode]: The valid explosion type value is only 0 to 13"
      );
      return 0;
    }
    return fns.CreateExplosion(X, Y, Z, type, Radius);
  }
  public static setDeathDropAmount = fns.SetDeathDropAmount;
  public static manualVehicleEngineAndLights = fns.ManualVehicleEngineAndLights;
  public static blockIpAddress = fns.BlockIpAddress;
  public static unBlockIpAddress = fns.UnBlockIpAddress;
  public static getServerTickRate = fns.GetServerTickRate;
  public static addSimpleModel(
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
  public static addSimpleModelTimed(
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
      logger.error("[BaseGameMode]: AddSimpleModel - Error virtual world");
      return 0;
    }
    if (baseid < 0) {
      logger.error("[BaseGameMode]: AddSimpleModel - Error baseid");
      return 0;
    }
    if (newid > -1000 || newid < -30000) {
      logger.error("[BaseGameMode]: AddSimpleModel - Error newid range");
      return 0;
    }
    if (dffname.trim().length < 0) {
      logger.error("[BaseGameMode]: AddSimpleModel - Empty dffname");
      return 0;
    }
    if (txdname.trim().length < 0) {
      logger.error("[BaseGameMode]: AddSimpleModel - Empty txdname");
      return 0;
    }
    if (timeon !== undefined && (timeon < 0 || timeon > 23)) {
      logger.error("[BaseGameMode]: AddSimpleModel - Error time on range");
      return 0;
    }
    if (timeoff !== undefined && (timeoff < 0 || timeoff > 23)) {
      logger.error("[BaseGameMode]: AddSimpleModel - Error time off range");
      return 0;
    }
    return 1;
  }
  public static findModelFileNameFromCRC = fns.FindModelFileNameFromCRC;
  public static findTextureFileNameFromCRC = fns.FindTextureFileNameFromCRC;
  public static getWeaponName = fns.GetWeaponName;
  public static setObjectsDefaultCameraCol = fns.SetObjectsDefaultCameraCol;
  public static vectorSize = fns.VectorSize;
  public static clearBanList = ow.ClearBanList;
  public static isBanned = ow.IsBanned;
  public static isValidNickName = ow.IsValidNickName;
  public static allowNickNameCharacter = ow.AllowNickNameCharacter;
  public static isNickNameCharacterAllowed = ow.IsNickNameCharacterAllowed;
  public static addServerRule = ow.AddServerRule;
  public static setServerRule = ow.SetServerRule;
  public static isValidServerRule = ow.IsValidServerRule;
  public static removeServerRule = ow.RemoveServerRule;
  public static getWeaponSlot = ow.GetWeaponSlot;
  public static getAvailableClasses = ow.GetAvailableClasses;
  public static getPlayerClass = ow.GetPlayerClass;
  public static editPlayerClass = ow.EditPlayerClass;
  public static toggleChatTextReplacement = ow.ToggleChatTextReplacement;
  public static chatTextReplacementToggled = ow.ChatTextReplacementToggled;
}
