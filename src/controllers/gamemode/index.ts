import {
  OnGameModeExit,
  OnGameModeInit,
  OnIncomingConnection,
} from "@/wrapper/callbacks";
import {
  AllowAdminTeleport,
  AllowInteriorWeapons,
  DisableInteriorEnterExits,
  EnableStuntBonusForAll,
  EnableVehicleFriendlyFire,
  EnableZoneNames,
  GameModeExit,
  GetGravity,
  SetGameModeText,
  SetGravity,
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
          new Error("[GameMode]: Cannot be initialized more than once")
        );
      this.initialized = true;
      this.onInit();
    });
    OnGameModeExit((): void => {
      if (!this.initialized)
        return logger.error(
          new Error("[GameMode]: Cannot be unload more than once")
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
}
