import type { TextDrawAlignEnum } from "core/enums";
import { InvalidEnum, LimitsEnum, TextDrawFontsEnum } from "core/enums";
import type { ITextDraw } from "core/interfaces";
import * as w from "core/wrapper/native";
import { PlayerEvent, type Player } from "../player";
import { I18n } from "../../utils/i18n";
import { textDrawPool, playerTextDrawPool } from "core/utils/pools";
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
      this._id = TextDraw.__inject__.TextDrawCreate(x, y, _text);
      if (
        this.id === InvalidEnum.TEXT_DRAW ||
        TextDraw.getInstances().length === LimitsEnum.MAX_TEXT_DRAWS
      )
        throw new Error("[TextDraw]: Unable to create textdraw");
      textDrawPool.set(this.id, this);
    } else {
      this._id = TextDraw.__inject__.CreatePlayerTextDraw(
        player.id,
        x,
        y,
        _text,
      );
      if (
        this.id === InvalidEnum.TEXT_DRAW ||
        TextDraw.getInstances(player).length === LimitsEnum.MAX_TEXT_DRAWS
      )
        throw new Error("[TextDraw]: Unable to create player textdraw");

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
      if (!playerTextDrawPool.has(player)) {
        playerTextDrawPool.set(player, new Map());
      }
      playerTextDrawPool.get(player)!.set(this._id, this);
    }

    return this;
  }
  destroy(): this {
    if (this.id === InvalidEnum.TEXT_DRAW)
      TextDraw.beforeCreateWarn("destroy the textdraw");
    const { player } = this.sourceInfo;
    if (!player) {
      if (!INTERNAL_FLAGS.skip) {
        TextDraw.__inject__.TextDrawDestroy(this.id);
      }
      textDrawPool.delete(this.id);
    } else {
      if (!INTERNAL_FLAGS.skip) {
        TextDraw.__inject__.PlayerTextDrawDestroy(player.id, this.id);
      }
      if (playerTextDrawPool.has(player)) {
        const perPlayerTextDraw = playerTextDrawPool.get(player)!;
        perPlayerTextDraw.delete(this.id);

        if (!perPlayerTextDraw.size) {
          playerTextDrawPool.delete(player);
        }
      }
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
      TextDraw.__inject__.PlayerTextDrawFont(player.id, this.id, style);
    else TextDraw.__inject__.TextDrawFont(this.id, style);
    return this;
  }
  setColor(color: string | number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set color");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.PlayerTextDrawColor(player.id, this.id, color);
    else TextDraw.__inject__.TextDrawColor(this.id, color);
    return this;
  }
  setBoxColors(color: string | number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set box color");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.PlayerTextDrawBoxColor(player.id, this.id, color);
    else TextDraw.__inject__.TextDrawBoxColor(this.id, color);
    return this;
  }
  setBackgroundColors(color: string | number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set background color");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.PlayerTextDrawBackgroundColor(
        player.id,
        this.id,
        color,
      );
    else TextDraw.__inject__.TextDrawBackgroundColor(this.id, color);
    return this;
  }
  setAlignment(alignment: TextDrawAlignEnum) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set alignment");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.PlayerTextDrawAlignment(
        player.id,
        this.id,
        alignment,
      );
    else TextDraw.__inject__.TextDrawAlignment(this.id, alignment);
    return this;
  }
  setLetterSize(x: number, y: number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set letter size");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.PlayerTextDrawLetterSize(player.id, this.id, x, y);
    else TextDraw.__inject__.TextDrawLetterSize(this.id, x, y);
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
      TextDraw.__inject__.PlayerTextDrawSetOutline(player.id, this.id, size);
    else TextDraw.__inject__.TextDrawSetOutline(this.id, size);
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
      TextDraw.__inject__.PlayerTextDrawSetPreviewModel(
        player.id,
        this.id,
        modelIndex,
      );
    else TextDraw.__inject__.TextDrawSetPreviewModel(this.id, modelIndex);
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
      TextDraw.__inject__.PlayerTextDrawSetPreviewRot(
        player.id,
        this.id,
        fRotX,
        fRotY,
        fRotZ,
        fZoom,
      );
    else
      TextDraw.__inject__.TextDrawSetPreviewRot(
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
      TextDraw.__inject__.PlayerTextDrawSetPreviewVehicleColors(
        player.id,
        this.id,
        color1,
        color2,
      );
    else
      TextDraw.__inject__.TextDrawSetPreviewVehicleColors(
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
      TextDraw.__inject__.PlayerTextDrawSetProportional(
        player.id,
        this.id,
        set,
      );
    else TextDraw.__inject__.TextDrawSetProportional(this.id, set);
    return this;
  }
  setSelectable(set: boolean) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set Selectable");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.PlayerTextDrawSetSelectable(player.id, this.id, set);
    else TextDraw.__inject__.TextDrawSetSelectable(this.id, set);
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
      TextDraw.__inject__.PlayerTextDrawSetShadow(player.id, this.id, size);
    else TextDraw.__inject__.TextDrawSetShadow(this.id, size);
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
      TextDraw.__inject__.PlayerTextDrawSetString(_player.id, this.id, _text);
      // global with player
    } else if (player) {
      TextDraw.__inject__.TextDrawSetStringForPlayer(this.id, player.id, _text);
      // global
    } else {
      TextDraw.__inject__.TextDrawSetString(this.id, _text);
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
      TextDraw.__inject__.PlayerTextDrawTextSize(player.id, this.id, x, y);
    else TextDraw.__inject__.TextDrawTextSize(this.id, x, y);
    return this;
  }
  useBox(use: boolean) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set TextSize");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.PlayerTextDrawUseBox(player.id, this.id, use);
    else TextDraw.__inject__.TextDrawUseBox(this.id, use);
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
    if (p) TextDraw.__inject__.PlayerTextDrawShow(p.id, this.id);
    else {
      if (player) TextDraw.__inject__.TextDrawShowForPlayer(player.id, this.id);
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
    if (p) TextDraw.__inject__.PlayerTextDrawHide(p.id, this.id);
    else {
      if (player) TextDraw.__inject__.TextDrawHideForPlayer(player.id, this.id);
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
      TextDraw.__inject__.TextDrawShowForAll(this.id);
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
      TextDraw.__inject__.TextDrawHideForAll(this.id);
      return this;
    }
    throw new Error(
      "[TextDraw]: player's textdraw should not be hide for all.",
    );
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.TEXT_DRAW) return true;
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.IsValidPlayerTextDraw(p.id, this.id);
    return TextDraw.__inject__.IsValidTextDraw(this.id);
  }
  isVisibleForPlayer(player?: Player): boolean {
    if (this.id === InvalidEnum.TEXT_DRAW) return false;

    const { player: p } = this.sourceInfo;
    if (p) return TextDraw.__inject__.IsPlayerTextDrawVisible(p.id, this.id);

    if (!player) return false;
    return TextDraw.__inject__.IsTextDrawVisibleForPlayer(player.id, this.id);
  }
  getString(): string {
    if (this.id === InvalidEnum.TEXT_DRAW) return this.sourceInfo.text;
    const p = this.sourceInfo.player;
    if (p)
      return TextDraw.__inject__.PlayerTextDrawGetString(p.id, this.id).str;
    return TextDraw.__inject__.TextDrawGetString(this.id).str;
  }
  setPos(fX: number, fY: number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set position");
      return this;
    }
    const p = this.sourceInfo.player;
    if (p) TextDraw.__inject__.PlayerTextDrawSetPos(p.id, this.id, fX, fY);
    else TextDraw.__inject__.TextDrawSetPos(this.id, fX, fY);
    return this;
  }
  getLetterSize() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get letter size");
    const p = this.sourceInfo.player;
    if (p)
      return TextDraw.__inject__.PlayerTextDrawGetLetterSize(p.id, this.id);
    return TextDraw.__inject__.TextDrawGetLetterSize(this.id);
  }
  getTextSize() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get text size");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.PlayerTextDrawGetTextSize(p.id, this.id);
    return TextDraw.__inject__.TextDrawGetTextSize(this.id);
  }
  getPos() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get position");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.PlayerTextDrawGetPos(p.id, this.id);
    return TextDraw.__inject__.TextDrawGetPos(this.id);
  }
  getColor() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get color");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.PlayerTextDrawGetColor(p.id, this.id);
    return TextDraw.__inject__.TextDrawGetColor(this.id);
  }
  getBoxColor() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get box color");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.PlayerTextDrawGetBoxColor(p.id, this.id);
    return TextDraw.__inject__.TextDrawGetBoxColor(this.id);
  }
  getBackgroundColor() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get bg color");
    const p = this.sourceInfo.player;
    if (p)
      return TextDraw.__inject__.PlayerTextDrawGetBackgroundColor(
        p.id,
        this.id,
      );
    return TextDraw.__inject__.TextDrawGetBackgroundColor(this.id);
  }
  getShadow() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get shadow");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.PlayerTextDrawGetShadow(p.id, this.id);
    return TextDraw.__inject__.TextDrawGetShadow(this.id);
  }
  getOutline() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get outline");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.PlayerTextDrawGetOutline(p.id, this.id);
    return TextDraw.__inject__.TextDrawGetOutline(this.id);
  }
  getFont() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get font");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.PlayerTextDrawGetFont(p.id, this.id);
    return TextDraw.__inject__.TextDrawGetFont(this.id);
  }
  isBox() {
    if (this.id === InvalidEnum.TEXT_DRAW) return false;
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.PlayerTextDrawIsBox(p.id, this.id);
    return TextDraw.__inject__.TextDrawIsBox(this.id);
  }
  isProportional() {
    if (this.id === InvalidEnum.TEXT_DRAW) return false;
    const p = this.sourceInfo.player;
    if (p)
      return TextDraw.__inject__.PlayerTextDrawIsProportional(p.id, this.id);
    return TextDraw.__inject__.TextDrawIsProportional(this.id);
  }
  isSelectable() {
    if (this.id === InvalidEnum.TEXT_DRAW) return false;
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.PlayerTextDrawIsSelectable(p.id, this.id);
    return TextDraw.__inject__.TextDrawIsSelectable(this.id);
  }
  getAlignment() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get alignment");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.PlayerTextDrawGetAlignment(p.id, this.id);
    return TextDraw.__inject__.TextDrawGetAlignment(this.id);
  }
  getPreviewModel() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get preview model");
    const p = this.sourceInfo.player;
    if (p)
      return TextDraw.__inject__.PlayerTextDrawGetPreviewModel(p.id, this.id);
    return TextDraw.__inject__.TextDrawGetPreviewModel(this.id);
  }
  getPreviewRot() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get preview rotation");
    const p = this.sourceInfo.player;
    if (p)
      return TextDraw.__inject__.PlayerTextDrawGetPreviewRot(p.id, this.id);
    return TextDraw.__inject__.TextDrawGetPreviewRot(this.id);
  }
  getPreviewVehColors() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get preview vel colors");
    const p = this.sourceInfo.player;
    if (p)
      return TextDraw.__inject__.PlayerTextDrawGetPreviewVehicleColors(
        p.id,
        this.id,
      );
    return TextDraw.__inject__.TextDrawGetPreviewVehicleColors(this.id);
  }
  isGlobal() {
    return !this.getPlayer();
  }

  isPlayer() {
    return !this.isGlobal();
  }

  getPlayer() {
    if (this.sourceInfo && this.sourceInfo.player) {
      return this.sourceInfo.player;
    }
    return null;
  }

  getPlayerId() {
    const player = this.getPlayer();
    return player ? player.id : InvalidEnum.PLAYER_ID;
  }

  static getInstance(textDrawId: number, player?: Player) {
    if (!player) return textDrawPool.get(textDrawId);

    if (player.id === InvalidEnum.PLAYER_ID) return;
    return playerTextDrawPool.get(player)?.get(textDrawId);
  }

  static getInstances(player?: Player) {
    if (!player) return [...textDrawPool.values()];

    if (player.id === InvalidEnum.PLAYER_ID) return [];
    return [...(playerTextDrawPool.get(player)?.values() || [])];
  }

  static getPlayersInstances(): [Player, TextDraw[]][] {
    return Array.from(playerTextDrawPool.entries()).map(
      ([player, textDraws]) => {
        return [player, Array.from(textDraws.values())];
      },
    );
  }

  static __inject__ = {
    TextDrawCreate: w.TextDrawCreate,
    CreatePlayerTextDraw: w.CreatePlayerTextDraw,
    TextDrawDestroy: w.TextDrawDestroy,
    PlayerTextDrawDestroy: w.PlayerTextDrawDestroy,
    TextDrawFont: w.TextDrawFont,
    PlayerTextDrawFont: w.PlayerTextDrawFont,
    TextDrawColor: w.TextDrawColor,
    PlayerTextDrawColor: w.PlayerTextDrawColor,
    TextDrawBoxColor: w.TextDrawBoxColor,
    PlayerTextDrawBoxColor: w.PlayerTextDrawBoxColor,
    TextDrawBackgroundColor: w.TextDrawBackgroundColor,
    PlayerTextDrawBackgroundColor: w.PlayerTextDrawBackgroundColor,
    TextDrawAlignment: w.TextDrawAlignment,
    PlayerTextDrawAlignment: w.PlayerTextDrawAlignment,
    TextDrawLetterSize: w.TextDrawLetterSize,
    PlayerTextDrawLetterSize: w.PlayerTextDrawLetterSize,
    TextDrawSetOutline: w.TextDrawSetOutline,
    PlayerTextDrawSetOutline: w.PlayerTextDrawSetOutline,
    TextDrawSetPreviewModel: w.TextDrawSetPreviewModel,
    PlayerTextDrawSetPreviewModel: w.PlayerTextDrawSetPreviewModel,
    TextDrawSetPreviewRot: w.TextDrawSetPreviewRot,
    PlayerTextDrawSetPreviewRot: w.PlayerTextDrawSetPreviewRot,
    TextDrawSetPreviewVehicleColors: w.TextDrawSetPreviewVehicleColors,
    PlayerTextDrawSetPreviewVehicleColors:
      w.PlayerTextDrawSetPreviewVehicleColors,
    TextDrawSetProportional: w.TextDrawSetProportional,
    PlayerTextDrawSetProportional: w.PlayerTextDrawSetProportional,
    TextDrawSetSelectable: w.TextDrawSetSelectable,
    PlayerTextDrawSetSelectable: w.PlayerTextDrawSetSelectable,
    TextDrawSetShadow: w.TextDrawSetShadow,
    PlayerTextDrawSetShadow: w.PlayerTextDrawSetShadow,
    PlayerTextDrawSetString: w.PlayerTextDrawSetString,
    TextDrawSetStringForPlayer: w.TextDrawSetStringForPlayer,
    TextDrawSetString: w.TextDrawSetString,
    TextDrawTextSize: w.TextDrawTextSize,
    PlayerTextDrawTextSize: w.PlayerTextDrawTextSize,
    PlayerTextDrawUseBox: w.PlayerTextDrawUseBox,
    TextDrawUseBox: w.TextDrawUseBox,
    PlayerTextDrawShow: w.PlayerTextDrawShow,
    TextDrawShowForPlayer: w.TextDrawShowForPlayer,
    PlayerTextDrawHide: w.PlayerTextDrawHide,
    TextDrawHideForPlayer: w.TextDrawHideForPlayer,
    TextDrawShowForAll: w.TextDrawShowForAll,
    TextDrawHideForAll: w.TextDrawHideForAll,
    IsValidPlayerTextDraw: w.IsValidPlayerTextDraw,
    IsValidTextDraw: w.IsValidTextDraw,
    IsPlayerTextDrawVisible: w.IsPlayerTextDrawVisible,
    IsTextDrawVisibleForPlayer: w.IsTextDrawVisibleForPlayer,
    PlayerTextDrawGetString: w.PlayerTextDrawGetString,
    TextDrawGetString: w.TextDrawGetString,
    PlayerTextDrawSetPos: w.PlayerTextDrawSetPos,
    TextDrawSetPos: w.TextDrawSetPos,
    PlayerTextDrawGetLetterSize: w.PlayerTextDrawGetLetterSize,
    TextDrawGetLetterSize: w.TextDrawGetLetterSize,
    PlayerTextDrawGetTextSize: w.PlayerTextDrawGetTextSize,
    TextDrawGetTextSize: w.TextDrawGetTextSize,
    PlayerTextDrawGetPos: w.PlayerTextDrawGetPos,
    TextDrawGetPos: w.TextDrawGetPos,
    PlayerTextDrawGetColor: w.PlayerTextDrawGetColor,
    TextDrawGetColor: w.TextDrawGetColor,
    PlayerTextDrawGetBoxColor: w.PlayerTextDrawGetBoxColor,
    TextDrawGetBoxColor: w.TextDrawGetBoxColor,
    PlayerTextDrawGetBackgroundColor: w.PlayerTextDrawGetBackgroundColor,
    TextDrawGetBackgroundColor: w.TextDrawGetBackgroundColor,
    PlayerTextDrawGetShadow: w.PlayerTextDrawGetShadow,
    TextDrawGetShadow: w.TextDrawGetShadow,
    PlayerTextDrawGetOutline: w.PlayerTextDrawGetOutline,
    TextDrawGetOutline: w.TextDrawGetOutline,
    PlayerTextDrawGetFont: w.PlayerTextDrawGetFont,
    TextDrawGetFont: w.TextDrawGetFont,
    PlayerTextDrawIsBox: w.PlayerTextDrawIsBox,
    TextDrawIsBox: w.TextDrawIsBox,
    PlayerTextDrawIsProportional: w.PlayerTextDrawIsProportional,
    TextDrawIsProportional: w.TextDrawIsProportional,
    PlayerTextDrawIsSelectable: w.PlayerTextDrawIsSelectable,
    TextDrawIsSelectable: w.TextDrawIsSelectable,
    PlayerTextDrawGetAlignment: w.PlayerTextDrawGetAlignment,
    TextDrawGetAlignment: w.TextDrawGetAlignment,
    PlayerTextDrawGetPreviewModel: w.PlayerTextDrawGetPreviewModel,
    TextDrawGetPreviewModel: w.TextDrawGetPreviewModel,
    PlayerTextDrawGetPreviewRot: w.PlayerTextDrawGetPreviewRot,
    TextDrawGetPreviewRot: w.TextDrawGetPreviewRot,
    TextDrawGetPreviewVehicleColors: w.TextDrawGetPreviewVehicleColors,
    PlayerTextDrawGetPreviewVehicleColors:
      w.PlayerTextDrawGetPreviewVehicleColors,
  };
}
