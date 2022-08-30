import { SendClientMessageToAll } from "@/utils/helperUtils";
import { BasePlayer } from ".";

export class BasePlayerFunc<T extends BasePlayer> {
  private playersArr: Array<T>;
  constructor(playersArr: Array<T>) {
    this.playersArr = playersArr;
  }
  public sendClientMessageToAll(color: string, msg: string) {
    SendClientMessageToAll(this.playersArr, color, msg);
  }
}
