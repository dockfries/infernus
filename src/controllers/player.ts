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

OnPlayerConnect((playerid: number): void => {
  const p = new BasePlayer();
  p.id = playerid;
  BasePlayer.players.push(p);
  p.OnConnect();
});

OnPlayerDisconnect((playerid: number): void => {
  const p = BasePlayer.findPlayerIdx(playerid);
  if (p === -1) return;
  BasePlayer.players[p].OnDisconnect();
  BasePlayer.players.splice(p, 1);
});

export class BasePlayer {
  public static players: Array<BasePlayer> = [];
  public id = -1;
  public name = "";
  public settings: IPlayerSettings = { locale: "", charset: "" };
  private lastDrunkLevel = 0;
  private lastFps = 0;

  public constructor() {}

  // todo: need outside default locale value
  public OnConnect(): void {}
  public OnDisconnect(): void {}

  get isNpc(): boolean {
    return Boolean(IsPlayerNPC(this.id));
  }

  // should be called at one second intervals
  // first call will return 0;
  get fps(): number {
    const nowDrunkLevel = GetPlayerDrunkLevel(this.id);
    if (nowDrunkLevel < 100) {
      SetPlayerDrunkLevel(this.id, 2000);
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
