import { OnPlayerConnect, OnPlayerDisconnect } from "@/wrapper/callbacks";
import { IsPlayerNPC } from "@/wrapper/functions";

interface Settings {
  locale: string;
  charset: string;
}
export class BasePlayer {
  public static players: Array<BasePlayer> = [];
  public id: number;
  public name: string = "";
  public settings: Settings;

  constructor(id: number, settings: Settings) {
    this.id = id;
    this.settings = settings;
  }

  get isNpc() {
    return IsPlayerNPC(this.id);
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
