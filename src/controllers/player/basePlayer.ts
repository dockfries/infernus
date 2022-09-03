import { IPlayerSettings } from "@/interfaces";
import { SendClientMessage } from "@/utils/helperUtils";
import {
  GetPlayerDrunkLevel,
  IsPlayerNPC,
  SetPlayerDrunkLevel,
} from "@/wrapper/functions";
import logger from "@/logger";
import { BaseGameMode } from "../gamemode";

export abstract class BasePlayer {
  private _id: number;
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
}
