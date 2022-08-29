import { OnPlayerConnect, OnPlayerDisconnect } from "@/wrapper/callbacks";
import {
  GetPlayerDrunkLevel,
  IsPlayerNPC,
  SetPlayerDrunkLevel,
} from "@/wrapper/functions";

export interface IPlayerSettings {
  locale: string;
  charset: string;
}

export class BasePlayer {
  public static players: Array<BasePlayer> = [];
  public id = -1;
  public name = "";
  public settings: IPlayerSettings = { locale: "", charset: "utf8" };
  private lastDrunkLevel = 0;
  private lastFps = 0;

  public constructor() {
    // Each instance can be called to callbacks, so you can split the logic.
    OnPlayerConnect((playerid: number): void => {
      if (playerid === this.id) this.OnConnect();
    });
    OnPlayerDisconnect((playerid: number, reason: number): void => {
      if (playerid === this.id) this.OnDisconnect(reason);
    });
  }

  // ignore class params no used start
  /* eslint-disable @typescript-eslint/no-unused-vars */

  // Note: The locale and character set must be assigned at application level development time. Otherwise i18n will be problematic.

  protected OnConnect(): void {}

  protected OnDisconnect(reason: number): void {}

  /* eslint-enable @typescript-eslint/no-unused-vars */
  // ignore class params no used end

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

  public static findPlayer(playerid: number): BasePlayer | undefined {
    return BasePlayer.players.find((p) => p.id === playerid);
  }

  public static findPlayerIdx(playerid: number): number {
    return BasePlayer.players.findIndex((p) => p.id === playerid);
  }
}

OnPlayerConnect((playerid: number): void => {
  const p = new BasePlayer();
  p.id = playerid;
  BasePlayer.players.push(p);
});

OnPlayerDisconnect((playerid: number): void => {
  const pIdx = BasePlayer.findPlayerIdx(playerid);
  if (pIdx !== -1) BasePlayer.players.splice(pIdx, 1);
});
