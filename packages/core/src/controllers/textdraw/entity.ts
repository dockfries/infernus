import type { TextDrawAlignEnum } from "core/enums";
import { LimitsEnum, TextDrawFontsEnum } from "core/enums";
import type { ITextDraw } from "core/interfaces";
import * as w from "core/wrapper/native";
import { PlayerEvent, type Player } from "../player";
import { I18n } from "../i18n";

export class TextDraw {
  static readonly globalTextDraws = new Map<number, TextDraw>();
  static readonly playerTextDraws = new Map<number, TextDraw>();

  private readonly sourceInfo: ITextDraw;

  private _id = -1;
  get id() {
    return this._id;
  }
  constructor(textDraw: ITextDraw) {
    this.sourceInfo = textDraw;
  }
  create(): this {
    if (this.id !== -1)
      throw new Error("[TextDraw]: Unable to create the textdraw again");

    const { x, y, text, player, charset = "iso-8859-1" } = this.sourceInfo;
    const _text = I18n.encodeToBuf(I18n.convertSpecialChar(text), charset);

    if (!player) {
      if (TextDraw.getInstances(true).length === LimitsEnum.MAX_TEXT_DRAWS)
        throw new Error(
          "[TextDraw]: Unable to continue to create textdraw, maximum allowable quantity has been reached",
        );
      this._id = w.TextDrawCreate(x, y, _text);
      TextDraw.globalTextDraws.set(this.id, this);
    } else {
      if (TextDraw.getInstances(false).length === LimitsEnum.MAX_TEXT_DRAWS)
        throw new Error(
          "[TextDraw]: Unable to continue to create textdraw, maximum allowable quantity has been reached",
        );
      this._id = w.CreatePlayerTextDraw(player.id, x, y, _text);
      // Player-textdraws are automatically destroyed when a player disconnects.
      const off = PlayerEvent.onDisconnect(({ player: p, next }) => {
        const ret = next();
        if (p === player) {
          if (this.isValid()) {
            this.destroy();
          }
          off();
        }
        return ret;
      });
      TextDraw.playerTextDraws.set(this.id, this);
    }

    return this;
  }
  destroy(): this {
    if (this.id === -1) TextDraw.beforeCreateWarn("destroy the textdraw");
    const { player } = this.sourceInfo;
    if (!player) {
      w.TextDrawDestroy(this.id);
      TextDraw.globalTextDraws.delete(this.id);
    } else {
      w.PlayerTextDrawDestroy(player.id, this.id);
      TextDraw.playerTextDraws.delete(this.id);
    }
    this._id = -1;
    return this;
  }
  setFont(style: 0 | 1 | 2 | 3 | TextDrawFontsEnum) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set font");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawFont(player.id, this.id, style);
    else w.TextDrawFont(this.id, style);
    return this;
  }
  setColor(color: string | number) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set color");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawColor(player.id, this.id, color);
    else w.TextDrawColor(this.id, color);
    return this;
  }
  setBoxColors(color: string | number) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set box color");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawBoxColor(player.id, this.id, color);
    else w.TextDrawBoxColor(this.id, color);
    return this;
  }
  setBackgroundColors(color: string | number) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set background color");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawBackgroundColor(player.id, this.id, color);
    else w.TextDrawBackgroundColor(this.id, color);
    return this;
  }
  setAlignment(alignment: TextDrawAlignEnum) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set alignment");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawAlignment(player.id, this.id, alignment);
    else w.TextDrawAlignment(this.id, alignment);
    return this;
  }
  setLetterSize(x: number, y: number) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set letter size");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawLetterSize(player.id, this.id, x, y);
    else w.TextDrawLetterSize(this.id, x, y);
    return this;
  }
  setOutline(size: number) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set outline model");
      return this;
    }
    if (size < 0) {
      throw new Error("[TextDraw]: Invalid outline value");
    }
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawSetOutline(player.id, this.id, size);
    else w.TextDrawSetOutline(this.id, size);
    return this;
  }
  setPreviewModel(modelIndex: number) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set preview model");
      return this;
    }
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawSetPreviewModel(player.id, this.id, modelIndex);
    else w.TextDrawSetPreviewModel(this.id, modelIndex);
    return this;
  }
  setPreviewRot(fRotX: number, fRotY: number, fRotZ: number, fZoom = 1) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set preview rot");
      return this;
    }
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player)
      w.PlayerTextDrawSetPreviewRot(
        player.id,
        this.id,
        fRotX,
        fRotY,
        fRotZ,
        fZoom,
      );
    else w.TextDrawSetPreviewRot(this.id, fRotX, fRotY, fRotZ, fZoom);
    return this;
  }
  setPreviewVehColors(color1: string | number, color2: string | number) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set preview veh col");
      return this;
    }
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player)
      w.PlayerTextDrawSetPreviewVehicleColors(
        player.id,
        this.id,
        color1,
        color2,
      );
    else w.TextDrawSetPreviewVehicleColors(this.id, color1, color2);
    return this;
  }
  setProportional(set = true) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set Proportional");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawSetProportional(player.id, this.id, set);
    else w.TextDrawSetProportional(this.id, set);
    return this;
  }
  setSelectable(set: boolean) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set Selectable");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawSetSelectable(player.id, this.id, set);
    else w.TextDrawSetSelectable(this.id, set);
    return this;
  }
  setShadow(size: number) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set shadow");
      return this;
    }
    if (size < 0) {
      throw new Error("[TextDraw]: Invalid shadow value");
    }
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawSetShadow(player.id, this.id, size);
    else w.TextDrawSetShadow(this.id, size);
    return this;
  }
  setString(text: string, player?: Player) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set string");
      return this;
    }
    if (text.length === 0 || text.length > 1024) {
      throw new Error("[TextDraw]: Invalid text length");
    }
    const { player: _player, charset = "iso-8859-1" } = this.sourceInfo;
    const _text = I18n.encodeToBuf(I18n.convertSpecialChar(text), charset);

    // not-global
    if (_player) {
      w.PlayerTextDrawSetString(_player.id, this.id, _text);
      // global with player
    } else if (player) {
      w.TextDrawSetStringForPlayer(this.id, player.id, _text);
      // global
    } else {
      w.TextDrawSetString(this.id, _text);
    }
    return this;
  }
  setTextSize(x: number, y: number) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set TextSize");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawTextSize(player.id, this.id, x, y);
    else w.TextDrawTextSize(this.id, x, y);
    return this;
  }
  useBox(use: boolean) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set TextSize");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) w.PlayerTextDrawUseBox(player.id, this.id, use);
    else w.TextDrawUseBox(this.id, use);
    return this;
  }
  private static beforeCreateWarn(msg: string): void {
    throw new Error(`[TextDraw]: Unable to ${msg} before create`);
  }
  // player's textdraw should be shown / hidden only for whom it is created.
  show(player?: Player) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("show");
      return this;
    }
    const p = this.sourceInfo.player;
    if (p) w.PlayerTextDrawShow(p.id, this.id);
    else {
      if (player) w.TextDrawShowForPlayer(player.id, this.id);
      else {
        throw new Error("[TextDraw]: invalid player for show");
      }
    }
    return this;
  }
  hide(player?: Player) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("hide");
      return this;
    }
    const p = this.sourceInfo.player;
    if (p) w.PlayerTextDrawHide(p.id, this.id);
    else {
      if (player) w.TextDrawHideForPlayer(player.id, this.id);
      else {
        throw new Error("[TextDraw]: invalid player for hide");
      }
    }
    return this;
  }
  showAll() {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("show");
      return this;
    }
    const p = this.sourceInfo.player;
    if (!p) {
      w.TextDrawShowForAll(this.id);
      return this;
    }
    throw new Error(
      "[TextDraw]: player's textdraw should not be show for all.",
    );
  }
  hideAll() {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("hideAll");
      return this;
    }
    const p = this.sourceInfo.player;
    if (!p) {
      w.TextDrawHideForAll(this.id);
      return this;
    }
    throw new Error(
      "[TextDraw]: player's textdraw should not be hide for all.",
    );
  }
  isValid(): boolean {
    const p = this.sourceInfo.player;
    if (p) return w.IsValidPlayerTextDraw(p.id, this.id);
    return w.IsValidTextDraw(this.id);
  }
  isVisibleForPlayer(player?: Player): boolean {
    if (this.id === -1) return false;

    const { player: p } = this.sourceInfo;
    if (p) return w.IsPlayerTextDrawVisible(p.id, this.id);

    if (!player) return false;
    return w.IsTextDrawVisibleForPlayer(player.id, this.id);
  }
  getString(): string {
    if (this.id === -1) return this.sourceInfo.text;
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetString(p.id, this.id);
    return w.TextDrawGetString(this.id);
  }
  setPos(fX: number, fY: number) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set position");
      return this;
    }
    const p = this.sourceInfo.player;
    if (p) w.PlayerTextDrawSetPos(p.id, this.id, fX, fY);
    else w.TextDrawSetPos(this.id, fX, fY);
    return this;
  }
  getLetterSize() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get letter size");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetLetterSize(p.id, this.id);
    return w.TextDrawGetLetterSize(this.id);
  }
  getTextSize() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get text size");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetTextSize(p.id, this.id);
    return w.TextDrawGetTextSize(this.id);
  }
  getPos() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get position");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetPos(p.id, this.id);
    return w.TextDrawGetPos(this.id);
  }
  getColor() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get color");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetColor(p.id, this.id);
    return w.TextDrawGetColor(this.id);
  }
  getBoxColor() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get box color");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetBoxColor(p.id, this.id);
    return w.TextDrawGetBoxColor(this.id);
  }
  getBackgroundColor() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get bg color");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetBackgroundColor(p.id, this.id);
    return w.TextDrawGetBackgroundColor(this.id);
  }
  getShadow() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get shadow");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetShadow(p.id, this.id);
    return w.TextDrawGetShadow(this.id);
  }
  getOutline() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get outline");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetOutline(p.id, this.id);
    return w.TextDrawGetOutline(this.id);
  }
  getFont() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get font");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetFont(p.id, this.id);
    return w.TextDrawGetFont(this.id);
  }
  isBox() {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawIsBox(p.id, this.id);
    return w.TextDrawIsBox(this.id);
  }
  isProportional() {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawIsProportional(p.id, this.id);
    return w.TextDrawIsProportional(this.id);
  }
  isSelectable() {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawIsSelectable(p.id, this.id);
    return w.TextDrawIsSelectable(this.id);
  }
  getAlignment() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get alignment");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetAlignment(p.id, this.id);
    return w.TextDrawGetAlignment(this.id);
  }
  getPreviewModel() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get preview model");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetPreviewModel(p.id, this.id);
    return w.TextDrawGetPreviewModel(this.id);
  }
  getPreviewRot() {
    if (this.id === -1)
      return TextDraw.beforeCreateWarn("get preview rotation");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetPreviewRot(p.id, this.id);
    return w.TextDrawGetPreviewRot(this.id);
  }
  getPreviewVehColors() {
    if (this.id === -1)
      return TextDraw.beforeCreateWarn("get preview vel colors");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerTextDrawGetPreviewVehicleColors(p.id, this.id);
    return w.TextDrawGetPreviewVehicleColors(this.id);
  }
  isGlobal() {
    return !!this.sourceInfo.player;
  }

  static getInstance(id: number, isGlobal: boolean) {
    if (isGlobal) return this.globalTextDraws.get(id);
    return this.playerTextDraws.get(id);
  }

  static getInstances(isGlobal: boolean) {
    if (isGlobal) return [...this.globalTextDraws.values()];
    return [...this.playerTextDraws.values()];
  }
}
