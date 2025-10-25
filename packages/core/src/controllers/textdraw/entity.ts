import type { TextDrawAlignEnum } from "core/enums";
import { InvalidEnum, LimitsEnum, TextDrawFontsEnum } from "core/enums";
import type { ITextDraw } from "core/interfaces";
import * as w from "core/wrapper/native";
import { PlayerEvent, type Player } from "../player";
import { I18n } from "../i18n";
import { globalTextDrawPool, playerTextDrawPool } from "core/utils/pools";
import { INTERNAL_FLAGS } from "core/utils/flags";

export class TextDraw {
  private sourceInfo: ITextDraw;

  private _id: number = InvalidEnum.TEXT_DRAW;
  get id() {
    return this._id;
  }
  constructor(textDraw: ITextDraw) {
    this.sourceInfo = textDraw;
  }
  create(): this {
    if (this.id !== InvalidEnum.TEXT_DRAW)
      throw new Error("[TextDraw]: Unable to create again");

    const { x, y, text, player, charset = "iso-8859-1" } = this.sourceInfo;
    const _text = I18n.encodeToBuf(I18n.convertSpecialChar(text), charset);

    if (!player) {
      if (TextDraw.getInstances(true).length === LimitsEnum.MAX_TEXT_DRAWS)
        throw new Error(
          "[TextDraw]: Unable to continue to create textdraw, maximum allowable quantity has been reached",
        );
      this._id = TextDraw.__inject__TextDrawCreate(x, y, _text);
      globalTextDrawPool.set(this.id, this);
    } else {
      if (TextDraw.getInstances(false).length === LimitsEnum.MAX_TEXT_DRAWS)
        throw new Error(
          "[TextDraw]: Unable to continue to create textdraw, maximum allowable quantity has been reached",
        );
      this._id = TextDraw.__inject__CreatePlayerTextDraw(
        player.id,
        x,
        y,
        _text,
      );
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
      playerTextDrawPool.set(this.id, this);
    }

    return this;
  }
  destroy(): this {
    if (this.id === InvalidEnum.TEXT_DRAW)
      TextDraw.beforeCreateWarn("destroy the textdraw");
    const { player } = this.sourceInfo;
    if (!player) {
      if (!INTERNAL_FLAGS.skip) {
        TextDraw.__inject__TextDrawDestroy(this.id);
      }
      globalTextDrawPool.delete(this.id);
    } else {
      if (!INTERNAL_FLAGS.skip) {
        TextDraw.__inject__PlayerTextDrawDestroy(player.id, this.id);
      }
      playerTextDrawPool.delete(this.id);
    }
    this._id = InvalidEnum.TEXT_DRAW;
    return this;
  }
  setFont(style: 0 | 1 | 2 | 3 | TextDrawFontsEnum) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set font");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawFont(player.id, this.id, style);
    else TextDraw.__inject__TextDrawFont(this.id, style);
    return this;
  }
  setColor(color: string | number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set color");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawColor(player.id, this.id, color);
    else TextDraw.__inject__TextDrawColor(this.id, color);
    return this;
  }
  setBoxColors(color: string | number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set box color");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawBoxColor(player.id, this.id, color);
    else TextDraw.__inject__TextDrawBoxColor(this.id, color);
    return this;
  }
  setBackgroundColors(color: string | number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set background color");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawBackgroundColor(
        player.id,
        this.id,
        color,
      );
    else TextDraw.__inject__TextDrawBackgroundColor(this.id, color);
    return this;
  }
  setAlignment(alignment: TextDrawAlignEnum) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set alignment");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawAlignment(player.id, this.id, alignment);
    else TextDraw.__inject__TextDrawAlignment(this.id, alignment);
    return this;
  }
  setLetterSize(x: number, y: number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set letter size");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawLetterSize(player.id, this.id, x, y);
    else TextDraw.__inject__TextDrawLetterSize(this.id, x, y);
    return this;
  }
  setOutline(size: number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set outline model");
      return this;
    }
    if (size < 0) {
      throw new Error("[TextDraw]: Invalid outline value");
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawSetOutline(player.id, this.id, size);
    else TextDraw.__inject__TextDrawSetOutline(this.id, size);
    return this;
  }
  setPreviewModel(modelIndex: number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set preview model");
      return this;
    }
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawSetPreviewModel(
        player.id,
        this.id,
        modelIndex,
      );
    else TextDraw.__inject__TextDrawSetPreviewModel(this.id, modelIndex);
    return this;
  }
  setPreviewRot(fRotX: number, fRotY: number, fRotZ: number, fZoom = 1) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set preview rot");
      return this;
    }
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawSetPreviewRot(
        player.id,
        this.id,
        fRotX,
        fRotY,
        fRotZ,
        fZoom,
      );
    else
      TextDraw.__inject__TextDrawSetPreviewRot(
        this.id,
        fRotX,
        fRotY,
        fRotZ,
        fZoom,
      );
    return this;
  }
  setPreviewVehColors(color1: string | number, color2: string | number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set preview veh col");
      return this;
    }
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawSetPreviewVehicleColors(
        player.id,
        this.id,
        color1,
        color2,
      );
    else
      TextDraw.__inject__TextDrawSetPreviewVehicleColors(
        this.id,
        color1,
        color2,
      );
    return this;
  }
  setProportional(set = true) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set Proportional");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawSetProportional(player.id, this.id, set);
    else TextDraw.__inject__TextDrawSetProportional(this.id, set);
    return this;
  }
  setSelectable(set: boolean) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set Selectable");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawSetSelectable(player.id, this.id, set);
    else TextDraw.__inject__TextDrawSetSelectable(this.id, set);
    return this;
  }
  setShadow(size: number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set shadow");
      return this;
    }
    if (size < 0) {
      throw new Error("[TextDraw]: Invalid shadow value");
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawSetShadow(player.id, this.id, size);
    else TextDraw.__inject__TextDrawSetShadow(this.id, size);
    return this;
  }
  setString(text: string, player?: Player) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
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
      TextDraw.__inject__PlayerTextDrawSetString(_player.id, this.id, _text);
      // global with player
    } else if (player) {
      TextDraw.__inject__TextDrawSetStringForPlayer(this.id, player.id, _text);
      // global
    } else {
      TextDraw.__inject__TextDrawSetString(this.id, _text);
    }
    return this;
  }
  setTextSize(x: number, y: number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set TextSize");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawTextSize(player.id, this.id, x, y);
    else TextDraw.__inject__TextDrawTextSize(this.id, x, y);
    return this;
  }
  useBox(use: boolean) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set TextSize");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__PlayerTextDrawUseBox(player.id, this.id, use);
    else TextDraw.__inject__TextDrawUseBox(this.id, use);
    return this;
  }
  private static beforeCreateWarn(msg: string): void {
    throw new Error(`[TextDraw]: Unable to ${msg} before create`);
  }
  // player's textdraw should be shown / hidden only for whom it is created.
  show(player?: Player) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("show");
      return this;
    }
    const p = this.sourceInfo.player;
    if (p) TextDraw.__inject__PlayerTextDrawShow(p.id, this.id);
    else {
      if (player) TextDraw.__inject__TextDrawShowForPlayer(player.id, this.id);
      else {
        throw new Error("[TextDraw]: invalid player for show");
      }
    }
    return this;
  }
  hide(player?: Player) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("hide");
      return this;
    }
    const p = this.sourceInfo.player;
    if (p) TextDraw.__inject__PlayerTextDrawHide(p.id, this.id);
    else {
      if (player) TextDraw.__inject__TextDrawHideForPlayer(player.id, this.id);
      else {
        throw new Error("[TextDraw]: invalid player for hide");
      }
    }
    return this;
  }
  showAll() {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("show");
      return this;
    }
    const p = this.sourceInfo.player;
    if (!p) {
      TextDraw.__inject__TextDrawShowForAll(this.id);
      return this;
    }
    throw new Error(
      "[TextDraw]: player's textdraw should not be show for all.",
    );
  }
  hideAll() {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("hideAll");
      return this;
    }
    const p = this.sourceInfo.player;
    if (!p) {
      TextDraw.__inject__TextDrawHideForAll(this.id);
      return this;
    }
    throw new Error(
      "[TextDraw]: player's textdraw should not be hide for all.",
    );
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.TEXT_DRAW) return true;
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__IsValidPlayerTextDraw(p.id, this.id);
    return TextDraw.__inject__IsValidTextDraw(this.id);
  }
  isVisibleForPlayer(player?: Player): boolean {
    if (this.id === InvalidEnum.TEXT_DRAW) return false;

    const { player: p } = this.sourceInfo;
    if (p) return TextDraw.__inject__IsPlayerTextDrawVisible(p.id, this.id);

    if (!player) return false;
    return TextDraw.__inject__IsTextDrawVisibleForPlayer(player.id, this.id);
  }
  getString(): string {
    if (this.id === InvalidEnum.TEXT_DRAW) return this.sourceInfo.text;
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawGetString(p.id, this.id).str;
    return TextDraw.__inject__TextDrawGetString(this.id).str;
  }
  setPos(fX: number, fY: number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set position");
      return this;
    }
    const p = this.sourceInfo.player;
    if (p) TextDraw.__inject__PlayerTextDrawSetPos(p.id, this.id, fX, fY);
    else TextDraw.__inject__TextDrawSetPos(this.id, fX, fY);
    return this;
  }
  getLetterSize() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get letter size");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawGetLetterSize(p.id, this.id);
    return TextDraw.__inject__TextDrawGetLetterSize(this.id);
  }
  getTextSize() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get text size");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawGetTextSize(p.id, this.id);
    return TextDraw.__inject__TextDrawGetTextSize(this.id);
  }
  getPos() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get position");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawGetPos(p.id, this.id);
    return TextDraw.__inject__TextDrawGetPos(this.id);
  }
  getColor() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get color");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawGetColor(p.id, this.id);
    return TextDraw.__inject__TextDrawGetColor(this.id);
  }
  getBoxColor() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get box color");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawGetBoxColor(p.id, this.id);
    return TextDraw.__inject__TextDrawGetBoxColor(this.id);
  }
  getBackgroundColor() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get bg color");
    const p = this.sourceInfo.player;
    if (p)
      return TextDraw.__inject__PlayerTextDrawGetBackgroundColor(p.id, this.id);
    return TextDraw.__inject__TextDrawGetBackgroundColor(this.id);
  }
  getShadow() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get shadow");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawGetShadow(p.id, this.id);
    return TextDraw.__inject__TextDrawGetShadow(this.id);
  }
  getOutline() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get outline");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawGetOutline(p.id, this.id);
    return TextDraw.__inject__TextDrawGetOutline(this.id);
  }
  getFont() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get font");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawGetFont(p.id, this.id);
    return TextDraw.__inject__TextDrawGetFont(this.id);
  }
  isBox() {
    if (this.id === InvalidEnum.TEXT_DRAW) return false;
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawIsBox(p.id, this.id);
    return TextDraw.__inject__TextDrawIsBox(this.id);
  }
  isProportional() {
    if (this.id === InvalidEnum.TEXT_DRAW) return false;
    const p = this.sourceInfo.player;
    if (p)
      return TextDraw.__inject__PlayerTextDrawIsProportional(p.id, this.id);
    return TextDraw.__inject__TextDrawIsProportional(this.id);
  }
  isSelectable() {
    if (this.id === InvalidEnum.TEXT_DRAW) return false;
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawIsSelectable(p.id, this.id);
    return TextDraw.__inject__TextDrawIsSelectable(this.id);
  }
  getAlignment() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get alignment");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawGetAlignment(p.id, this.id);
    return TextDraw.__inject__TextDrawGetAlignment(this.id);
  }
  getPreviewModel() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get preview model");
    const p = this.sourceInfo.player;
    if (p)
      return TextDraw.__inject__PlayerTextDrawGetPreviewModel(p.id, this.id);
    return TextDraw.__inject__TextDrawGetPreviewModel(this.id);
  }
  getPreviewRot() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get preview rotation");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__PlayerTextDrawGetPreviewRot(p.id, this.id);
    return TextDraw.__inject__TextDrawGetPreviewRot(this.id);
  }
  getPreviewVehColors() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get preview vel colors");
    const p = this.sourceInfo.player;
    if (p)
      return TextDraw.__inject__PlayerTextDrawGetPreviewVehicleColors(
        p.id,
        this.id,
      );
    return TextDraw.__inject__TextDrawGetPreviewVehicleColors(this.id);
  }
  isGlobal() {
    return !!this.sourceInfo.player;
  }

  static getInstance(id: number, isGlobal: boolean) {
    if (isGlobal) return globalTextDrawPool.get(id);
    return playerTextDrawPool.get(id);
  }

  static getInstances(isGlobal: boolean) {
    if (isGlobal) return [...globalTextDrawPool.values()];
    return [...playerTextDrawPool.values()];
  }

  static __inject__TextDrawCreate = w.TextDrawCreate;
  static __inject__CreatePlayerTextDraw = w.CreatePlayerTextDraw;
  static __inject__TextDrawDestroy = w.TextDrawDestroy;
  static __inject__PlayerTextDrawDestroy = w.PlayerTextDrawDestroy;
  static __inject__TextDrawFont = w.TextDrawFont;
  static __inject__PlayerTextDrawFont = w.PlayerTextDrawFont;
  static __inject__TextDrawColor = w.TextDrawColor;
  static __inject__PlayerTextDrawColor = w.PlayerTextDrawColor;
  static __inject__TextDrawBoxColor = w.TextDrawBoxColor;
  static __inject__PlayerTextDrawBoxColor = w.PlayerTextDrawBoxColor;
  static __inject__TextDrawBackgroundColor = w.TextDrawBackgroundColor;
  static __inject__PlayerTextDrawBackgroundColor =
    w.PlayerTextDrawBackgroundColor;
  static __inject__TextDrawAlignment = w.TextDrawAlignment;
  static __inject__PlayerTextDrawAlignment = w.PlayerTextDrawAlignment;
  static __inject__TextDrawLetterSize = w.TextDrawLetterSize;
  static __inject__PlayerTextDrawLetterSize = w.PlayerTextDrawLetterSize;
  static __inject__TextDrawSetOutline = w.TextDrawSetOutline;
  static __inject__PlayerTextDrawSetOutline = w.PlayerTextDrawSetOutline;
  static __inject__TextDrawSetPreviewModel = w.TextDrawSetPreviewModel;
  static __inject__PlayerTextDrawSetPreviewModel =
    w.PlayerTextDrawSetPreviewModel;
  static __inject__TextDrawSetPreviewRot = w.TextDrawSetPreviewRot;
  static __inject__PlayerTextDrawSetPreviewRot = w.PlayerTextDrawSetPreviewRot;
  static __inject__TextDrawSetPreviewVehicleColors =
    w.TextDrawSetPreviewVehicleColors;
  static __inject__PlayerTextDrawSetPreviewVehicleColors =
    w.PlayerTextDrawSetPreviewVehicleColors;
  static __inject__TextDrawSetProportional = w.TextDrawSetProportional;
  static __inject__PlayerTextDrawSetProportional =
    w.PlayerTextDrawSetProportional;
  static __inject__TextDrawSetSelectable = w.TextDrawSetSelectable;
  static __inject__PlayerTextDrawSetSelectable = w.PlayerTextDrawSetSelectable;
  static __inject__TextDrawSetShadow = w.TextDrawSetShadow;
  static __inject__PlayerTextDrawSetShadow = w.PlayerTextDrawSetShadow;
  static __inject__PlayerTextDrawSetString = w.PlayerTextDrawSetString;
  static __inject__TextDrawSetStringForPlayer = w.TextDrawSetStringForPlayer;
  static __inject__TextDrawSetString = w.TextDrawSetString;
  static __inject__TextDrawTextSize = w.TextDrawTextSize;
  static __inject__PlayerTextDrawTextSize = w.PlayerTextDrawTextSize;
  static __inject__PlayerTextDrawUseBox = w.PlayerTextDrawUseBox;
  static __inject__TextDrawUseBox = w.TextDrawUseBox;
  static __inject__PlayerTextDrawShow = w.PlayerTextDrawShow;
  static __inject__TextDrawShowForPlayer = w.TextDrawShowForPlayer;
  static __inject__PlayerTextDrawHide = w.PlayerTextDrawHide;
  static __inject__TextDrawHideForPlayer = w.TextDrawHideForPlayer;
  static __inject__TextDrawShowForAll = w.TextDrawShowForAll;
  static __inject__TextDrawHideForAll = w.TextDrawHideForAll;
  static __inject__IsValidPlayerTextDraw = w.IsValidPlayerTextDraw;
  static __inject__IsValidTextDraw = w.IsValidTextDraw;
  static __inject__IsPlayerTextDrawVisible = w.IsPlayerTextDrawVisible;
  static __inject__IsTextDrawVisibleForPlayer = w.IsTextDrawVisibleForPlayer;
  static __inject__PlayerTextDrawGetString = w.PlayerTextDrawGetString;
  static __inject__TextDrawGetString = w.TextDrawGetString;
  static __inject__PlayerTextDrawSetPos = w.PlayerTextDrawSetPos;
  static __inject__TextDrawSetPos = w.TextDrawSetPos;
  static __inject__PlayerTextDrawGetLetterSize = w.PlayerTextDrawGetLetterSize;
  static __inject__TextDrawGetLetterSize = w.TextDrawGetLetterSize;
  static __inject__PlayerTextDrawGetTextSize = w.PlayerTextDrawGetTextSize;
  static __inject__TextDrawGetTextSize = w.TextDrawGetTextSize;
  static __inject__PlayerTextDrawGetPos = w.PlayerTextDrawGetPos;
  static __inject__TextDrawGetPos = w.TextDrawGetPos;
  static __inject__PlayerTextDrawGetColor = w.PlayerTextDrawGetColor;
  static __inject__TextDrawGetColor = w.TextDrawGetColor;
  static __inject__PlayerTextDrawGetBoxColor = w.PlayerTextDrawGetBoxColor;
  static __inject__TextDrawGetBoxColor = w.TextDrawGetBoxColor;
  static __inject__PlayerTextDrawGetBackgroundColor =
    w.PlayerTextDrawGetBackgroundColor;
  static __inject__TextDrawGetBackgroundColor = w.TextDrawGetBackgroundColor;
  static __inject__PlayerTextDrawGetShadow = w.PlayerTextDrawGetShadow;
  static __inject__TextDrawGetShadow = w.TextDrawGetShadow;
  static __inject__PlayerTextDrawGetOutline = w.PlayerTextDrawGetOutline;
  static __inject__TextDrawGetOutline = w.TextDrawGetOutline;
  static __inject__PlayerTextDrawGetFont = w.PlayerTextDrawGetFont;
  static __inject__TextDrawGetFont = w.TextDrawGetFont;
  static __inject__PlayerTextDrawIsBox = w.PlayerTextDrawIsBox;
  static __inject__TextDrawIsBox = w.TextDrawIsBox;
  static __inject__PlayerTextDrawIsProportional =
    w.PlayerTextDrawIsProportional;
  static __inject__TextDrawIsProportional = w.TextDrawIsProportional;
  static __inject__PlayerTextDrawIsSelectable = w.PlayerTextDrawIsSelectable;
  static __inject__TextDrawIsSelectable = w.TextDrawIsSelectable;
  static __inject__PlayerTextDrawGetAlignment = w.PlayerTextDrawGetAlignment;
  static __inject__TextDrawGetAlignment = w.TextDrawGetAlignment;
  static __inject__PlayerTextDrawGetPreviewModel =
    w.PlayerTextDrawGetPreviewModel;
  static __inject__TextDrawGetPreviewModel = w.TextDrawGetPreviewModel;
  static __inject__PlayerTextDrawGetPreviewRot = w.PlayerTextDrawGetPreviewRot;
  static __inject__TextDrawGetPreviewRot = w.TextDrawGetPreviewRot;
  static __inject__TextDrawGetPreviewVehicleColors =
    w.TextDrawGetPreviewVehicleColors;
  static __inject__PlayerTextDrawGetPreviewVehicleColors =
    w.PlayerTextDrawGetPreviewVehicleColors;
}
