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

    const { x, y, text, player, charset = "ISO-8859-1" } = this.sourceInfo;
    const _text = I18n.encodeToBuf(I18n.convertSpecialChar(text), charset);

    if (!player) {
      this._id = TextDraw.__inject__.create(x, y, _text);
      if (
        this.id === InvalidEnum.TEXT_DRAW ||
        TextDraw.getInstances().length === LimitsEnum.MAX_TEXT_DRAWS
      )
        throw new Error("[TextDraw]: Unable to create textdraw");
      textDrawPool.set(this.id, this);
    } else {
      this._id = TextDraw.__inject__.createPlayer(player.id, x, y, _text);
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
      TextDraw.beforeCreateWarn("destroy textdraw");
    const { player } = this.sourceInfo;
    if (!player) {
      if (!INTERNAL_FLAGS.skip) {
        TextDraw.__inject__.destroy(this.id);
      }
      textDrawPool.delete(this.id);
    } else {
      if (!INTERNAL_FLAGS.skip) {
        TextDraw.__inject__.destroyPlayer(player.id, this.id);
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
    if (player) TextDraw.__inject__.setFontPlayer(player.id, this.id, style);
    else TextDraw.__inject__.setFont(this.id, style);
    return this;
  }
  setColor(color: string | number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set color");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) TextDraw.__inject__.setColorPlayer(player.id, this.id, color);
    else TextDraw.__inject__.setColor(this.id, color);
    return this;
  }
  setBoxColors(color: string | number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set box color");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.setBoxColorPlayer(player.id, this.id, color);
    else TextDraw.__inject__.setBoxColor(this.id, color);
    return this;
  }
  setBackgroundColors(color: string | number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set background color");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.setBackgroundColorPlayer(player.id, this.id, color);
    else TextDraw.__inject__.setBackgroundColor(this.id, color);
    return this;
  }
  setAlignment(alignment: TextDrawAlignEnum) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set alignment");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.setAlignmentPlayer(player.id, this.id, alignment);
    else TextDraw.__inject__.setAlignment(this.id, alignment);
    return this;
  }
  setLetterSize(x: number, y: number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set letter size");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.setLetterSizePlayer(player.id, this.id, x, y);
    else TextDraw.__inject__.setLetterSize(this.id, x, y);
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
    if (player) TextDraw.__inject__.setOutlinePlayer(player.id, this.id, size);
    else TextDraw.__inject__.setOutline(this.id, size);
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
      TextDraw.__inject__.setPreviewModelPlayer(player.id, this.id, modelIndex);
    else TextDraw.__inject__.setPreviewModel(this.id, modelIndex);
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
      TextDraw.__inject__.setPreviewRotPlayer(
        player.id,
        this.id,
        fRotX,
        fRotY,
        fRotZ,
        fZoom,
      );
    else TextDraw.__inject__.setPreviewRot(this.id, fRotX, fRotY, fRotZ, fZoom);
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
      TextDraw.__inject__.setPreviewVehicleColorsPlayer(
        player.id,
        this.id,
        color1,
        color2,
      );
    else TextDraw.__inject__.setPreviewVehicleColors(this.id, color1, color2);
    return this;
  }
  setProportional(set = true) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set Proportional");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.setProportionalPlayer(player.id, this.id, set);
    else TextDraw.__inject__.setProportional(this.id, set);
    return this;
  }
  setSelectable(set: boolean) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set Selectable");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player)
      TextDraw.__inject__.setSelectablePlayer(player.id, this.id, set);
    else TextDraw.__inject__.setSelectable(this.id, set);
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
    if (player) TextDraw.__inject__.setShadowPlayer(player.id, this.id, size);
    else TextDraw.__inject__.setShadow(this.id, size);
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
    const { player: _player, charset = "ISO-8859-1" } = this.sourceInfo;
    const _text = I18n.encodeToBuf(I18n.convertSpecialChar(text), charset);

    // not-global
    if (_player) {
      TextDraw.__inject__.setStringPlayer(_player.id, this.id, _text);
      // global with player
    } else if (player) {
      TextDraw.__inject__.setStringForPlayer(this.id, player.id, _text);
      // global
    } else {
      TextDraw.__inject__.setString(this.id, _text);
    }
    return this;
  }
  setTextSize(x: number, y: number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set TextSize");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) TextDraw.__inject__.setTextSizePlayer(player.id, this.id, x, y);
    else TextDraw.__inject__.setTextSize(this.id, x, y);
    return this;
  }
  useBox(use: boolean) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set TextSize");
      return this;
    }
    const { player } = this.sourceInfo;
    if (player) TextDraw.__inject__.useBoxPlayer(player.id, this.id, use);
    else TextDraw.__inject__.useBox(this.id, use);
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
    if (p) TextDraw.__inject__.showPlayer(p.id, this.id);
    else {
      if (player) TextDraw.__inject__.showForPlayer(player.id, this.id);
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
    if (p) TextDraw.__inject__.hidePlayer(p.id, this.id);
    else {
      if (player) TextDraw.__inject__.hideForPlayer(player.id, this.id);
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
      TextDraw.__inject__.showForAll(this.id);
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
      TextDraw.__inject__.hideForAll(this.id);
      return this;
    }
    throw new Error(
      "[TextDraw]: player's textdraw should not be hide for all.",
    );
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.TEXT_DRAW) return true;
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.isValidPlayer(p.id, this.id);
    return TextDraw.__inject__.isValid(this.id);
  }
  isVisibleForPlayer(player?: Player): boolean {
    if (this.id === InvalidEnum.TEXT_DRAW) return false;

    const { player: p } = this.sourceInfo;
    if (p) return TextDraw.__inject__.isVisiblePlayer(p.id, this.id);

    if (!player) return false;
    return TextDraw.__inject__.isVisibleForPlayer(player.id, this.id);
  }
  getString(): string {
    if (this.id === InvalidEnum.TEXT_DRAW) return this.sourceInfo.text;
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getStringPlayer(p.id, this.id).str;
    return TextDraw.__inject__.getString(this.id).str;
  }
  setPos(fX: number, fY: number) {
    if (this.id === InvalidEnum.TEXT_DRAW) {
      TextDraw.beforeCreateWarn("set position");
      return this;
    }
    const p = this.sourceInfo.player;
    if (p) TextDraw.__inject__.setPosPlayer(p.id, this.id, fX, fY);
    else TextDraw.__inject__.setPos(this.id, fX, fY);
    return this;
  }
  getLetterSize() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get letter size");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getLetterSizePlayer(p.id, this.id);
    return TextDraw.__inject__.getLetterSize(this.id);
  }
  getTextSize() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get text size");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getTextSizePlayer(p.id, this.id);
    return TextDraw.__inject__.getTextSize(this.id);
  }
  getPos() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get position");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getPosPlayer(p.id, this.id);
    return TextDraw.__inject__.getPos(this.id);
  }
  getColor() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get color");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getColorPlayer(p.id, this.id);
    return TextDraw.__inject__.getColor(this.id);
  }
  getBoxColor() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get box color");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getBoxColorPlayer(p.id, this.id);
    return TextDraw.__inject__.getBoxColor(this.id);
  }
  getBackgroundColor() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get bg color");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getBackgroundColorPlayer(p.id, this.id);
    return TextDraw.__inject__.getBackgroundColor(this.id);
  }
  getShadow() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get shadow");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getShadowPlayer(p.id, this.id);
    return TextDraw.__inject__.getShadow(this.id);
  }
  getOutline() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get outline");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getOutlinePlayer(p.id, this.id);
    return TextDraw.__inject__.getOutline(this.id);
  }
  getFont() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get font");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getFontPlayer(p.id, this.id);
    return TextDraw.__inject__.getFont(this.id);
  }
  isBox() {
    if (this.id === InvalidEnum.TEXT_DRAW) return false;
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.isBoxPlayer(p.id, this.id);
    return TextDraw.__inject__.isBox(this.id);
  }
  isProportional() {
    if (this.id === InvalidEnum.TEXT_DRAW) return false;
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.isProportionalPlayer(p.id, this.id);
    return TextDraw.__inject__.isProportional(this.id);
  }
  isSelectable() {
    if (this.id === InvalidEnum.TEXT_DRAW) return false;
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.isSelectablePlayer(p.id, this.id);
    return TextDraw.__inject__.isSelectable(this.id);
  }
  getAlignment() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get alignment");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getAlignmentPlayer(p.id, this.id);
    return TextDraw.__inject__.getAlignment(this.id);
  }
  getPreviewModel() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get preview model");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getPreviewModelPlayer(p.id, this.id);
    return TextDraw.__inject__.getPreviewModel(this.id);
  }
  getPreviewRot() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get preview rotation");
    const p = this.sourceInfo.player;
    if (p) return TextDraw.__inject__.getPreviewRotPlayer(p.id, this.id);
    return TextDraw.__inject__.getPreviewRot(this.id);
  }
  getPreviewVehColors() {
    if (this.id === InvalidEnum.TEXT_DRAW)
      return TextDraw.beforeCreateWarn("get preview vel colors");
    const p = this.sourceInfo.player;
    if (p)
      return TextDraw.__inject__.getPreviewVehicleColorsPlayer(p.id, this.id);
    return TextDraw.__inject__.getPreviewVehicleColors(this.id);
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
    create: w.TextDrawCreate,
    createPlayer: w.CreatePlayerTextDraw,
    destroy: w.TextDrawDestroy,
    destroyPlayer: w.PlayerTextDrawDestroy,
    setFont: w.TextDrawFont,
    setFontPlayer: w.PlayerTextDrawFont,
    setColor: w.TextDrawColor,
    setColorPlayer: w.PlayerTextDrawColor,
    setBoxColor: w.TextDrawBoxColor,
    setBoxColorPlayer: w.PlayerTextDrawBoxColor,
    setBackgroundColor: w.TextDrawBackgroundColor,
    setBackgroundColorPlayer: w.PlayerTextDrawBackgroundColor,
    setAlignment: w.TextDrawAlignment,
    setAlignmentPlayer: w.PlayerTextDrawAlignment,
    setLetterSize: w.TextDrawLetterSize,
    setLetterSizePlayer: w.PlayerTextDrawLetterSize,
    setOutline: w.TextDrawSetOutline,
    setOutlinePlayer: w.PlayerTextDrawSetOutline,
    setPreviewModel: w.TextDrawSetPreviewModel,
    setPreviewModelPlayer: w.PlayerTextDrawSetPreviewModel,
    setPreviewRot: w.TextDrawSetPreviewRot,
    setPreviewRotPlayer: w.PlayerTextDrawSetPreviewRot,
    setPreviewVehicleColors: w.TextDrawSetPreviewVehicleColors,
    setPreviewVehicleColorsPlayer: w.PlayerTextDrawSetPreviewVehicleColors,
    setProportional: w.TextDrawSetProportional,
    setProportionalPlayer: w.PlayerTextDrawSetProportional,
    setSelectable: w.TextDrawSetSelectable,
    setSelectablePlayer: w.PlayerTextDrawSetSelectable,
    setShadow: w.TextDrawSetShadow,
    setShadowPlayer: w.PlayerTextDrawSetShadow,
    setStringPlayer: w.PlayerTextDrawSetString,
    setStringForPlayer: w.TextDrawSetStringForPlayer,
    setString: w.TextDrawSetString,
    setTextSize: w.TextDrawTextSize,
    setTextSizePlayer: w.PlayerTextDrawTextSize,
    useBoxPlayer: w.PlayerTextDrawUseBox,
    useBox: w.TextDrawUseBox,
    showPlayer: w.PlayerTextDrawShow,
    showForPlayer: w.TextDrawShowForPlayer,
    hidePlayer: w.PlayerTextDrawHide,
    hideForPlayer: w.TextDrawHideForPlayer,
    showForAll: w.TextDrawShowForAll,
    hideForAll: w.TextDrawHideForAll,
    isValidPlayer: w.IsValidPlayerTextDraw,
    isValid: w.IsValidTextDraw,
    isVisiblePlayer: w.IsPlayerTextDrawVisible,
    isVisibleForPlayer: w.IsTextDrawVisibleForPlayer,
    getStringPlayer: w.PlayerTextDrawGetString,
    getString: w.TextDrawGetString,
    setPosPlayer: w.PlayerTextDrawSetPos,
    setPos: w.TextDrawSetPos,
    getLetterSizePlayer: w.PlayerTextDrawGetLetterSize,
    getLetterSize: w.TextDrawGetLetterSize,
    getTextSizePlayer: w.PlayerTextDrawGetTextSize,
    getTextSize: w.TextDrawGetTextSize,
    getPosPlayer: w.PlayerTextDrawGetPos,
    getPos: w.TextDrawGetPos,
    getColorPlayer: w.PlayerTextDrawGetColor,
    getColor: w.TextDrawGetColor,
    getBoxColorPlayer: w.PlayerTextDrawGetBoxColor,
    getBoxColor: w.TextDrawGetBoxColor,
    getBackgroundColorPlayer: w.PlayerTextDrawGetBackgroundColor,
    getBackgroundColor: w.TextDrawGetBackgroundColor,
    getShadowPlayer: w.PlayerTextDrawGetShadow,
    getShadow: w.TextDrawGetShadow,
    getOutlinePlayer: w.PlayerTextDrawGetOutline,
    getOutline: w.TextDrawGetOutline,
    getFontPlayer: w.PlayerTextDrawGetFont,
    getFont: w.TextDrawGetFont,
    isBoxPlayer: w.PlayerTextDrawIsBox,
    isBox: w.TextDrawIsBox,
    isProportionalPlayer: w.PlayerTextDrawIsProportional,
    isProportional: w.TextDrawIsProportional,
    isSelectablePlayer: w.PlayerTextDrawIsSelectable,
    isSelectable: w.TextDrawIsSelectable,
    getAlignmentPlayer: w.PlayerTextDrawGetAlignment,
    getAlignment: w.TextDrawGetAlignment,
    getPreviewModelPlayer: w.PlayerTextDrawGetPreviewModel,
    getPreviewModel: w.TextDrawGetPreviewModel,
    getPreviewRotPlayer: w.PlayerTextDrawGetPreviewRot,
    getPreviewRot: w.TextDrawGetPreviewRot,
    getPreviewVehicleColors: w.TextDrawGetPreviewVehicleColors,
    getPreviewVehicleColorsPlayer: w.PlayerTextDrawGetPreviewVehicleColors,
  };
}
