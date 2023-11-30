import type { Player } from "../player";
import * as f from "../../wrapper/native/functions";

export class GameText {
  private _text: string;
  private _time: number;
  private _style: number;

  get text(): string {
    return this._text;
  }
  set text(value: string) {
    this._text = value;
  }

  get time(): number {
    return this._time;
  }
  set time(value: number) {
    this._time = value;
  }

  get style(): number {
    return this._style;
  }
  set style(value: number) {
    this._style = value;
  }

  constructor(str: string, time: number, style: number) {
    this._text = str;
    this._time = time;
    this._style = style;
  }

  static hideForAll(style: number) {
    f.HideGameTextForAll(style);
  }

  static has(player: Player, style: number) {
    return f.HasGameText(player.id, style);
  }

  forAll() {
    f.GameTextForAll(this.text, this.time, this.style);
  }

  forPlayer(player: Player) {
    f.GameTextForPlayer(player.id, this.text, this.time, this.style);
  }

  hideForPlayer(player: Player) {
    return f.HideGameTextForPlayer(player.id, this.style);
  }
}
