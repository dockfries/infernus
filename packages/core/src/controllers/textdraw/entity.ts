import type { TextDrawAlignEnum } from "core/enums";
import { LimitsEnum, TextDrawFontsEnum } from "core/enums";
import type { ITextDraw } from "core/interfaces";
import { logger } from "core/logger";
import * as w from "core/wrapper/native";
import {
  IsValidTextDraw,
  IsTextDrawVisibleForPlayer,
  PlayerTextDrawGetString,
  TextDrawGetString,
  PlayerTextDrawSetPos,
  TextDrawSetPos,
  PlayerTextDrawGetLetterSize,
  TextDrawGetLetterSize,
  PlayerTextDrawGetTextSize,
  TextDrawGetTextSize,
  PlayerTextDrawGetPos,
  TextDrawGetPos,
  PlayerTextDrawGetColor,
  TextDrawGetColor,
  PlayerTextDrawGetBoxColor,
  TextDrawGetBoxColor,
  PlayerTextDrawGetBackgroundColor,
  TextDrawGetBackgroundColor,
  PlayerTextDrawGetShadow,
  TextDrawGetShadow,
  PlayerTextDrawGetOutline,
  TextDrawGetOutline,
  PlayerTextDrawGetFont,
  TextDrawGetFont,
  PlayerTextDrawIsBox,
  TextDrawIsBox,
  PlayerTextDrawIsProportional,
  TextDrawIsProportional,
  PlayerTextDrawIsSelectable,
  TextDrawIsSelectable,
  PlayerTextDrawGetAlignment,
  TextDrawGetAlignment,
  PlayerTextDrawGetPreviewModel,
  TextDrawGetPreviewModel,
  PlayerTextDrawGetPreviewRot,
  TextDrawGetPreviewRot,
  PlayerTextDrawGetPreviewVehicleColors,
  TextDrawGetPreviewVehicleColors,
  IsValidPlayerTextDraw,
} from "core/wrapper/native";

import { PlayerEvent, type Player } from "../player";

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
  create(): void | this {
    if (this.id !== -1)
      return logger.warn("[TextDraw]: Unable to create the textdraw again");
    const { x, y, text, player } = this.sourceInfo;
    if (!player) {
      if (TextDraw.getInstances(true).length === LimitsEnum.MAX_TEXT_DRAWS)
        return logger.warn(
          "[TextDraw]: Unable to continue to create textdraw, maximum allowable quantity has been reached",
        );
      this._id = w.TextDrawCreate(x, y, text);
      TextDraw.globalTextDraws.set(this.id, this);
    } else {
      if (TextDraw.getInstances(false).length === LimitsEnum.MAX_TEXT_DRAWS)
        return logger.warn(
          "[TextDraw]: Unable to continue to create textdraw, maximum allowable quantity has been reached",
        );
      this._id = w.CreatePlayerTextDraw(player.id, x, y, text);
      // Player-textdraws are automatically destroyed when a player disconnects.
      const off = PlayerEvent.onDisconnect(({ player: p, next }) => {
        const ret = next();
        if (p === player) {
          this.destroy();
          off();
        }
        return ret;
      });
      TextDraw.playerTextDraws.set(this.id, this);
    }

    return this;
  }
  destroy(): void | this {
    if (this.id === -1)
      return TextDraw.beforeCreateWarn("destroy the textdraw");
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
      logger.warn("[TextDraw]: Invalid outline value");
      return this;
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
  setPreviewVehColors(color1: string, color2: string) {
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
      logger.warn("[TextDraw]: Invalid shadow value");
      return this;
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
      logger.warn("[TextDraw]: Invalid text length");
      return this;
    }
    const { player: _player } = this.sourceInfo;
    // not-global
    if (_player) {
      w.PlayerTextDrawSetString(_player.id, this.id, text);
      // global with player
    } else if (player) {
      w.TextDrawSetStringForPlayer(this.id, player.id, text);
      // global
    } else {
      w.TextDrawSetString(this.id, text);
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
    logger.warn(`[TextDraw]: Unable to ${msg} before create`);
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
        logger.warn("[TextDraw]: invalid player for show");
        return this;
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
        logger.warn("[TextDraw]: invalid player for hide");
        return this;
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
    logger.warn("[TextDraw]: player's textdraw should not be show for all.");
    return this;
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
    logger.warn("[TextDraw]: player's textdraw should not be hide for all.");
    return this;
  }
  isValid(): boolean {
    const p = this.sourceInfo.player;
    if (p) return IsValidPlayerTextDraw(p.id, this.id);
    return IsValidTextDraw(this.id);
  }
  isVisibleForPlayer(player?: Player): boolean {
    if (this.id === -1) return false;

    const { player: p } = this.sourceInfo;
    if (p) return w.IsPlayerTextDrawVisible(p.id, this.id);

    if (!player) return false;
    return IsTextDrawVisibleForPlayer(player.id, this.id);
  }
  getString(): string {
    if (this.id === -1) return this.sourceInfo.text;
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetString(p.id, this.id);
    return TextDrawGetString(this.id);
  }
  setPos(fX: number, fY: number) {
    if (this.id === -1) {
      TextDraw.beforeCreateWarn("set position");
      return this;
    }
    const p = this.sourceInfo.player;
    if (p) PlayerTextDrawSetPos(p.id, this.id, fX, fY);
    else TextDrawSetPos(this.id, fX, fY);
    return this;
  }
  getLetterSize() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get letter size");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetLetterSize(p.id, this.id);
    return TextDrawGetLetterSize(this.id);
  }
  getTextSize() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get text size");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetTextSize(p.id, this.id);
    return TextDrawGetTextSize(this.id);
  }
  getPos() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get position");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetPos(p.id, this.id);
    return TextDrawGetPos(this.id);
  }
  getColor() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get color");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetColor(p.id, this.id);
    return TextDrawGetColor(this.id);
  }
  getBoxColor() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get box color");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetBoxColor(p.id, this.id);
    return TextDrawGetBoxColor(this.id);
  }
  getBackgroundColor() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get bg color");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetBackgroundColor(p.id, this.id);
    return TextDrawGetBackgroundColor(this.id);
  }
  getShadow() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get shadow");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetShadow(p.id, this.id);
    return TextDrawGetShadow(this.id);
  }
  getOutline() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get outline");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetOutline(p.id, this.id);
    return TextDrawGetOutline(this.id);
  }
  getFont() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get font");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetFont(p.id, this.id);
    return TextDrawGetFont(this.id);
  }
  isBox() {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawIsBox(p.id, this.id);
    return TextDrawIsBox(this.id);
  }
  isProportional() {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawIsProportional(p.id, this.id);
    return TextDrawIsProportional(this.id);
  }
  isSelectable() {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawIsSelectable(p.id, this.id);
    return TextDrawIsSelectable(this.id);
  }
  getAlignment() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get alignment");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetAlignment(p.id, this.id);
    return TextDrawGetAlignment(this.id);
  }
  getPreviewModel() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get preview model");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetPreviewModel(p.id, this.id);
    return TextDrawGetPreviewModel(this.id);
  }
  getPreviewRot() {
    if (this.id === -1)
      return TextDraw.beforeCreateWarn("get preview rotation");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetPreviewRot(p.id, this.id);
    return TextDrawGetPreviewRot(this.id);
  }
  getPreviewVehColors() {
    if (this.id === -1)
      return TextDraw.beforeCreateWarn("get preview vel colors");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetPreviewVehicleColors(p.id, this.id);
    return TextDrawGetPreviewVehicleColors(this.id);
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
