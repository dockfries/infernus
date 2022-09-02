import { SendClientMessageToAll } from "@/utils/helperUtils";
import { BasePlayer } from "./basePlayer";

export class BasePlayersFunc<T extends BasePlayer> {
  private playersArr: Array<T>;
  constructor(playersArr: Array<T>) {
    this.playersArr = playersArr;
  }
  public sendClientMessageToAll(color: string, msg: string) {
    SendClientMessageToAll(this.playersArr, color, msg);
  }
}
