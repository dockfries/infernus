import { GameTextForAll, GameTextForPlayer } from "@/wrapper/native/functions";
import { BasePlayer } from "../player";

export class BaseGameText {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _str: string;
  public get str(): string {
    return this._str;
  }
  public set str(value: string) {
    this._str = value;
  }
  private _time: number;
  public get time(): number {
    return this._time;
  }
  public set time(value: number) {
    this._time = value;
  }
  private _style: number;
  public get style(): number {
    return this._style;
  }
  public set style(value: number) {
    this._style = value;
  }
  public constructor(str: string, time: number, style: number) {
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
