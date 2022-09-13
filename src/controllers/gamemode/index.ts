import {
  OnGameModeExit,
  OnGameModeInit,
  OnIncomingConnection,
} from "@/wrapper/callbacks";
import {
  AddPlayerClass,
  AddPlayerClassEx,
  AddSimpleModel,
  AddSimpleModelTimed,
  AllowAdminTeleport,
  AllowInteriorWeapons,
  BlockIpAddress,
  CreateExplosion,
  DisableInteriorEnterExits,
  DisableNameTagLOS,
  EnableStuntBonusForAll,
  EnableVehicleFriendlyFire,
  EnableZoneNames,
  GameModeExit,
  GetGravity,
  GetServerTickRate,
  LimitGlobalChatRadius,
  LimitPlayerMarkerRadius,
  ManualVehicleEngineAndLights,
  SendRconCommand,
  SetDeathDropAmount,
  SetGameModeText,
  SetGravity,
  SetNameTagDrawDistance,
  SetTeamCount,
  SetWeather,
  SetWorldTime,
  ShowNameTags,
  ShowPlayerMarkers,
  UnBlockIpAddress,
  UsePlayerPedAnims,
} from "@/wrapper/functions";
import { logger } from "@/logger";
import {
  FindModelFileNameFromCRC,
  FindTextureFileNameFromCRC,
  GetWeaponName,
  OnClientMessage,
  OnRconCommand,
  OnRconLoginAttempt,
} from "@/utils/helperUtils";

export abstract class AbstractGM {
  public static charset = "utf8";
  protected abstract onInit(): void;
  protected abstract onExit(): void;
  protected abstract onIncomingConnection(
    playerid: number,
    ipAddress: string,
    port: number
  ): void;
  protected abstract onClientMessage(color: number, text: string): void;
  protected abstract onRconCommand(cmd: string): void;
  protected abstract onRconLoginAttempt(
    ip: string,
    password: string,
    success: boolean
  ): void;
}

export abstract class BaseGameMode extends AbstractGM {
  private initialized = false;

  public constructor() {
    super();
    OnGameModeInit((): void => {
      if (this.initialized)
        return logger.error(
          "[BaseGameMode]: Cannot be initialized more than once"
        );
      this.initialized = true;
      this.onInit();
    });
    OnGameModeExit((): void => {
      if (!this.initialized)
        return logger.error("[BaseGameMode]: Cannot unload more than once");
      this.initialized = false;
      this.onExit();
    });
    OnClientMessage(this.onClientMessage);
    OnIncomingConnection(this.onIncomingConnection);
    OnRconCommand(this.onRconCommand);
    OnRconLoginAttempt(this.onRconLoginAttempt);
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  // do something during close/restart server, such as storage of player data
  public static exit(): void {
    // it's restart
    GameModeExit();
  }
  public static allowAdminTeleport = AllowAdminTeleport;
  public static allowInteriorWeapons = AllowInteriorWeapons;
  public static enableStuntBonusForAll = EnableStuntBonusForAll;
  public static enableVehicleFriendlyFire = EnableVehicleFriendlyFire;
  public static enableZoneNames = EnableZoneNames;
  public static disableInteriorEnterExits = DisableInteriorEnterExits;
  public static setGameModeText = SetGameModeText;
  public static getGravity = GetGravity;
  public static setGravity = SetGravity;
  public static showNameTags = ShowNameTags;
  public static disableNameTagLOS = DisableNameTagLOS;
  public static usePlayerPedAnims = UsePlayerPedAnims;
  public static showPlayerMarkers = ShowPlayerMarkers;
  public static limitPlayerMarkerRadius = LimitPlayerMarkerRadius;
  public static limitGlobalChatRadius = LimitGlobalChatRadius;
  public static setNameTagDrawDistance = SetNameTagDrawDistance;
  public static setWeather(weather: number): number {
    if (weather < 0 || weather > 255) {
      logger.error("[BaseGameMode]: The valid weather value is only 0 to 255");
      return 0;
    }
    return SetWeather(weather);
  }
  public static setWorldTime(hour: number): number {
    if (hour < 0 || hour > 23) {
      logger.error("[BaseGameMode]: The valid hour value is only 0 to 23");
      return 0;
    }
    return SetWorldTime(hour);
  }
  public static setTeamCount = SetTeamCount;
  public static sendRconCommand = SendRconCommand;
  public static addPlayerClass = AddPlayerClass;
  public static addPlayerClassEx = AddPlayerClassEx;
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
    return CreateExplosion(X, Y, Z, type, Radius);
  }
  public static setDeathDropAmount = SetDeathDropAmount;
  public static manualVehicleEngineAndLights = ManualVehicleEngineAndLights;
  public static blockIpAddress = BlockIpAddress;
  public static unBlockIpAddress = UnBlockIpAddress;
  public static getServerTickRate = GetServerTickRate;
  public static addSimpleModel(
    virtualworld: number,
    baseid: number,
    newid: number,
    dffname: string,
    txdname: string
  ): number {
    if (this.checkSimpleModel(virtualworld, baseid, newid, dffname, txdname)) {
      return AddSimpleModel(virtualworld, baseid, newid, dffname, txdname);
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
      return AddSimpleModelTimed(
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
  public static findModelFileNameFromCRC(crc: number): string {
    return FindModelFileNameFromCRC(crc);
  }
  public static findTextureFileNameFromCRC(crc: number): string {
    return FindTextureFileNameFromCRC(crc);
  }
  public static getWeaponName(weaponid: number): string {
    return GetWeaponName(weaponid);
  }
}
