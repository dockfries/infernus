import { IPlayerSettings } from "@/interfaces";
import { SendClientMessage } from "@/utils/helperUtils";
import {
  GetPlayerDrunkLevel,
  IsPlayerNPC,
  SetPlayerDrunkLevel,
} from "@/wrapper/functions";

export class BasePlayer {
  public id: number;
  public name = "";
  public settings: IPlayerSettings = { locale: "", charset: "utf8" };
  private lastDrunkLevel = 0;
  private lastFps = 0;

  public constructor(id: number) {
    this.id = id;
  }

  // Note: The locale and character set must be assigned at application level development time. Otherwise i18n will be problematic.

  public sendClientMessage(color: string, msg: string): number {
    return SendClientMessage(this, color, msg);
  }

  get isNpc(): boolean {
    return Boolean(IsPlayerNPC(this.id));
  }

  // should be called at one second intervals
  // first call will return 0;
  get fps(): number {
    const nowDrunkLevel = GetPlayerDrunkLevel(this.id);
    if (nowDrunkLevel < 100) {
      SetPlayerDrunkLevel(this.id, 2000);
      this.lastDrunkLevel = 2000;
      return 0;
    }
    if (this.lastDrunkLevel === nowDrunkLevel) return this.lastFps;
    this.lastFps = this.lastDrunkLevel - nowDrunkLevel - 1;
    this.lastDrunkLevel = nowDrunkLevel;
    return this.lastFps;
  }

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
}
