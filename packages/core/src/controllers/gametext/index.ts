import {
  GameTextForAll,
  GameTextForPlayer,
  HasGameText,
  HideGameTextForAll,
  HideGameTextForPlayer,
} from "@/wrapper/native/functions";
import type { Player } from "../player";

export class GameText<P extends Player = Player> {
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
    HideGameTextForAll(style);
  }

  static has<P extends Player>(player: P, style: number) {
    return HasGameText(player.id, style);
  }

  forAll() {
    GameTextForAll(this.text, this.time, this.style);
  }

  forPlayer(player: P) {
    GameTextForPlayer(player.id, this.text, this.time, this.style);
  }

  hideForPlayer(player: P) {
    return HideGameTextForPlayer(player.id, this.style);
  }
}
