import { OnPlayerConnect, OnPlayerDisconnect } from "@/wrapper/callbacks";
import {
  GetPlayerDrunkLevel,
  IsPlayerNPC,
  SetPlayerDrunkLevel,
} from "@/wrapper/functions";

interface ISettings {
  locale: string;
  charset: string;
}
export class BasePlayer {
  public static players: Array<BasePlayer> = [];
  public id: number;
  public name: string = "";
  public settings: ISettings;
  private lastDrunkLevel: number = 0;
  private lastFps: number = 0;

  constructor(id: number, settings: ISettings) {
    this.id = id;
    this.settings = settings;
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

  public static OnConnect(fn: (p: BasePlayer) => void): void {
    OnPlayerConnect((playerid: number) => {
      // todo: need outside default value
      const p = new BasePlayer(playerid, { locale: "", charset: "" });
      BasePlayer.players.push(p);
      fn(p);
    });
  }

  public static OnDisconnect(fn: (p: BasePlayer) => void): void {
    OnPlayerDisconnect((playerid: number) => {
      const p = BasePlayer.findPlayerIdx(playerid);
      if (p === -1) return;
      fn(BasePlayer.players[p]);
      BasePlayer.players.splice(p, 1);
    });
  }

  public static findPlayer(playerid: number): BasePlayer | undefined {
    return BasePlayer.players.find((p) => p.id === playerid);
  }

  public static findPlayerIdx(playerid: number): number {
    return BasePlayer.players.findIndex((p) => p.id === playerid);
  }
}
