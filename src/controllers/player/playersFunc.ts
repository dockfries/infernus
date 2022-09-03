import { SendClientMessageToAll } from "@/utils/helperUtils";
import { BasePlayer } from "./basePlayer";

export abstract class BasePlayersFunc<P extends BasePlayer> {
  private playersArr: Array<P>;
  constructor(playersArr: Array<P>) {
    this.playersArr = playersArr;
  }
  public sendClientMessageToAll(color: string, msg: string) {
    SendClientMessageToAll(this.playersArr, color, msg);
  }
}
