import { I18n } from "../i18n";
import type { Player } from "../player";
import * as w from "core/wrapper/native";

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
    w.HideGameTextForAll(style);
  }

  static has(player: Player, style: number) {
    return w.HasGameText(player.id, style);
  }

  forAll(charset = "win1252") {
    w.GameTextForAll(
      I18n.encodeToBuf(I18n.convertSpecialChar(this.text), charset),
      this.time,
      this.style,
    );
  }

  forPlayer(player: Player, charset = "win1252") {
    w.GameTextForPlayer(
      player.id,
      I18n.encodeToBuf(I18n.convertSpecialChar(this.text), charset),
      this.time,
      this.style,
    );
  }

  hideForPlayer(player: Player) {
    return w.HideGameTextForPlayer(player.id, this.style);
  }
}
