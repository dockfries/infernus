import { IPlayerSettings } from "@/interfaces";
import { SendClientMessage } from "@/utils/helperUtils";
import {
  AllowPlayerTeleport,
  EnablePlayerCameraTarget,
  EnableStuntBonusForPlayer,
  GetPlayerColor,
  GetPlayerDrunkLevel,
  GetPlayerHealth,
  GetPlayerInterior,
  GetPlayerMoney,
  GivePlayerMoney,
  IsPlayerNPC,
  ResetPlayerMoney,
  ResetPlayerWeapons,
  SetPlayerColor,
  SetPlayerDrunkLevel,
  SetPlayerHealth,
  SetPlayerInterior,
  SetPlayerMarkerForPlayer,
  ShowPlayerNameTagForPlayer,
  SpawnPlayer,
  TogglePlayerClock,
  TogglePlayerControllable,
  TogglePlayerSpectating,
  PlayerSpectatePlayer,
  PlayerSpectateVehicle,
} from "@/wrapper/functions";
import logger from "@/logger";
import { BaseGameMode } from "../gamemode";
import { SpectateModesEnum } from "@/enums";
import { BaseVehicle } from "../vehicle";

export abstract class BasePlayer {
  private _id: number;
  public isRecording = false;
  public name = "";
  // Note: The locale and character set must be assigned at application level development time. Otherwise i18n will be problematic.
  public settings: IPlayerSettings = {
    locale: "",
    charset: BaseGameMode.charset,
  };
  private lastDrunkLevel = 0;
  private lastFps = 0;
  private _isNpc: boolean;

  get charset() {
    return this.settings.charset;
  }
  set charset(charset: string) {
    this.settings.charset = charset;
  }

  get locale(): string {
    return this.settings.locale;
  }
  set locale(language: string) {
    this.settings.locale = language;
  }

  get id(): number {
    return this._id;
  }

  public constructor(id: number) {
    this._id = id;
    this._isNpc = Boolean(IsPlayerNPC(this.id));
  }

  public sendClientMessage(color: string, msg: string): number {
    return SendClientMessage(this, color, msg);
  }

  public isNpc(): boolean {
    return this._isNpc;
  }

  // should be called at one second intervals
  // first call will return 0;
  public getFps(): number {
    const nowDrunkLevel = this.getDrunkLevel();
    if (nowDrunkLevel < 100) {
      this.setDrunkLevel(2000);
      this.lastDrunkLevel = 2000;
      return 0;
    }
    if (this.lastDrunkLevel === nowDrunkLevel) return this.lastFps;
    this.lastFps = this.lastDrunkLevel - nowDrunkLevel - 1;
    this.lastDrunkLevel = nowDrunkLevel;
    return this.lastFps;
  }
  public getDrunkLevel(): number {
    return GetPlayerDrunkLevel(this.id);
  }
  public setDrunkLevel(level: number): void {
    if (level < 0 || level > 50000)
      return logger.error(
        new Error("[BasePlayer] player's drunk level ranges from 0 to 50000")
      );
    SetPlayerDrunkLevel(this.id, level);
  }
  public allowTeleport(allow: boolean): void {
    AllowPlayerTeleport(this.id, allow);
  }
  public enableCameraTarget(enable: boolean): void {
    EnablePlayerCameraTarget(this.id, enable);
  }
  public enableStuntBonus(enable: boolean): void {
    EnableStuntBonusForPlayer(this.id, enable);
  }
  public getInterior(): number {
    return GetPlayerInterior(this.id);
  }
  public setInterior(interiorId: number): number {
    return SetPlayerInterior(this.id, interiorId);
  }
  public showPlayerNameTag<P extends BasePlayer>(
    showPlayer: P,
    show: boolean
  ): void {
    ShowPlayerNameTagForPlayer(this.id, showPlayer.id, show);
  }
  public setColor(color: string): void {
    SetPlayerColor(this.id, color);
  }
  public getColor(): number {
    return GetPlayerColor(this.id);
  }
  public setPlayerMarker<P extends BasePlayer>(showPlayer: P, color: string) {
    SetPlayerMarkerForPlayer(this.id, showPlayer.id, color);
  }
  public resetMoney(): number {
    return ResetPlayerMoney(this.id);
  }
  public getMoney(): number {
    return GetPlayerMoney(this.id);
  }
  public giveMoney(money: number): number {
    return GivePlayerMoney(this.id, money);
  }
  public resetWeapons(): number {
    return ResetPlayerWeapons(this.id);
  }
  public spawn(): number {
    return SpawnPlayer(this.id);
  }
  public setHealth(health: number): number {
    return SetPlayerHealth(this.id, health);
  }
  public getHealth(): number {
    return GetPlayerHealth(this.id);
  }
  public toggleClock(toggle: boolean): number {
    return TogglePlayerClock(this.id, toggle);
  }
  public toggleControllable(toggle: boolean): number {
    return TogglePlayerControllable(this.id, toggle);
  }
  public toggleSpectating(toggle: boolean): number {
    return TogglePlayerSpectating(this.id, toggle);
  }
  public spectatePlayer<P extends BasePlayer>(
    targetPlayer: P,
    mode: SpectateModesEnum
  ) {
    return PlayerSpectatePlayer(this.id, targetPlayer.id, mode);
  }
  public spectateVehicle<V extends BaseVehicle>(
    targetVehicle: V,
    mode: SpectateModesEnum
  ) {
    return PlayerSpectateVehicle(this.id, targetVehicle.id, mode);
  }
}
