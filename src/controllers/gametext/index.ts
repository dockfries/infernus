import { GameTextForAll, GameTextForPlayer } from "@/wrapper/native/functions";
import { BasePlayer } from "../player";

export class BaseGameText {
  private _str: string;
  get str(): string {
    return this._str;
  }
  set str(value: string) {
    this._str = value;
  }
  private _time: number;
  get time(): number {
    return this._time;
  }
  set time(value: number) {
    this._time = value;
  }
  private _style: number;
  get style(): number {
    return this._style;
  }
  set style(value: number) {
    this._style = value;
  }
  constructor(str: string, time: number, style: number) {
    this._str = str;
    this._time = time;
    this._style = style;
  }
  forAll() {
    GameTextForAll(this.str, this.time, this.style);
  }
  forPlayer<P extends BasePlayer>(player: P) {
    GameTextForPlayer(player.id, this.str, this.time, this.style);
  }
}
