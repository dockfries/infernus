import {
  OnGameModeExit,
  OnGameModeInit,
  OnIncomingConnection,
} from "@/wrapper/callbacks";
import {
  AddPlayerClass,
  AddPlayerClassEx,
  AllowAdminTeleport,
  AllowInteriorWeapons,
  DisableInteriorEnterExits,
  DisableNameTagLOS,
  EnableStuntBonusForAll,
  EnableVehicleFriendlyFire,
  EnableZoneNames,
  GameModeExit,
  GetGravity,
  LimitGlobalChatRadius,
  LimitPlayerMarkerRadius,
  SendRconCommand,
  SetGameModeText,
  SetGravity,
  SetNameTagDrawDistance,
  SetTeamCount,
  SetWeather,
  SetWorldTime,
  ShowNameTags,
  ShowPlayerMarkers,
  UsePlayerPedAnims,
} from "@/wrapper/functions";
import logger from "@/logger";
import {
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
          new Error("[BaseGameMode]: Cannot be initialized more than once")
        );
      this.initialized = true;
      this.onInit();
    });
    OnGameModeExit((): void => {
      if (!this.initialized)
        return logger.error(
          new Error("[BaseGameMode]: Cannot unload more than once")
        );
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
      logger.warn("[BaseGameMode]: The valid weather value is only 0 to 255");
      return 0;
    }
    return SetWeather(weather);
  }
  public static setWorldTime(hour: number): number {
    if (hour < 0 || hour > 23) {
      logger.warn("[BaseGameMode]: The valid hour value is only 0 to 23");
      return 0;
    }
    return SetWorldTime(hour);
  }
  public static setTeamCount = SetTeamCount;
  public static sendRconCommand = SendRconCommand;
  public static addPlayerClass = AddPlayerClass;
  public static addPlayerClassEx = AddPlayerClassEx;
}
