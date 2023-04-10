import { LimitsEnum, TextDrawAlignEnum, TextDrawFontsEnum } from "@/enums";
import type { ITextDraw } from "@/interfaces";
import { logger } from "@/logger";
import * as fns from "@/wrapper/native/functions";
import {
  IsValidPlayer3DTextLabel,
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
  PlayerTextDrawGetColour,
  TextDrawGetColour,
  PlayerTextDrawGetBoxColour,
  TextDrawGetBoxColour,
  PlayerTextDrawGetBackgroundColour,
  TextDrawGetBackgroundColour,
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
  PlayerTextDrawGetPreviewVehicleColours,
  TextDrawGetPreviewVehicleColours,
} from "@infernus/wrapper";

import type { Player } from "../player";
import { textDrawBus, textDrawHooks } from "./textdrawBus";

export class TextDraw<P extends Player> {
  private static createdGlobalCount = 0;
  private static createdPlayerCount = 0;
  private readonly sourceInfo: ITextDraw<P>;
  private _id = -1;
  get id() {
    return this._id;
  }
  constructor(textDraw: ITextDraw<P>) {
    this.sourceInfo = textDraw;
  }
  create(): void | this {
    if (this.id !== -1)
      return logger.warn("[TextDraw]: Unable to create the textdraw again");
    const { x, y, text, player } = this.sourceInfo;
    if (!player) {
      if (TextDraw.createdGlobalCount === LimitsEnum.MAX_TEXT_DRAWS)
        return logger.warn(
          "[TextDraw]: Unable to continue to create textdraw, maximum allowable quantity has been reached"
        );
      this._id = fns.TextDrawCreate(x, y, text);
      TextDraw.createdGlobalCount++;
    } else {
      if (TextDraw.createdPlayerCount === LimitsEnum.MAX_TEXT_DRAWS)
        return logger.warn(
          "[TextDraw]: Unable to continue to create textdraw, maximum allowable quantity has been reached"
        );
      this._id = fns.CreatePlayerTextDraw(player.id, x, y, text);
      TextDraw.createdPlayerCount++;
      // Player-textdraws are automatically destroyed when a player disconnects.
      samp.addEventListener("OnPlayerDisconnect", this.unregisterEvent);
    }
    textDrawBus.emit(textDrawHooks.created, {
      key: { id: this.id, global: player === undefined },
      value: this,
    });
    return this;
  }
  destroy(): void | this {
    if (this.id === -1)
      return TextDraw.beforeCreateWarn("destroy the textdraw");
    const { player } = this.sourceInfo;
    if (!player) {
      fns.TextDrawDestroy(this.id);
      TextDraw.createdGlobalCount--;
    } else {
      fns.PlayerTextDrawDestroy(player.id, this.id);
      TextDraw.createdPlayerCount--;
    }
    textDrawBus.emit(textDrawHooks.destroyed, {
      id: this.id,
      global: player === undefined,
    });
    this._id = -1;
    return this;
  }
  setFont(style: 0 | 1 | 2 | 3 | TextDrawFontsEnum): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set font");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawFont(player.id, this.id, style);
    else fns.TextDrawFont(this.id, style);
    return this;
  }
  setColour(Colour: string | number): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set Colour");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawColour(player.id, this.id, Colour);
    else fns.TextDrawColour(this.id, Colour);
    return this;
  }
  setBoxColours(Colour: string | number): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set box Colour");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawBoxColour(player.id, this.id, Colour);
    else fns.TextDrawBoxColour(this.id, Colour);
    return this;
  }
  setBackgroundColours(Colour: string | number): void | this {
    if (this.id === -1)
      return TextDraw.beforeCreateWarn("set background Colour");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawBackgroundColour(player.id, this.id, Colour);
    else fns.TextDrawBackgroundColour(this.id, Colour);
    return this;
  }
  setAlignment(alignment: TextDrawAlignEnum): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set alignment");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawAlignment(player.id, this.id, alignment);
    else fns.TextDrawAlignment(this.id, alignment);
    return this;
  }
  setLetterSize(x: number, y: number): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set letter size");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawLetterSize(player.id, this.id, x, y);
    else fns.TextDrawLetterSize(this.id, x, y);
    return this;
  }
  setOutline(size: number): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set outline model");
    if (size < 0) return logger.warn("[TextDraw]: Invalid outline value");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawSetOutline(player.id, this.id, size);
    else fns.TextDrawSetOutline(this.id, size);
    return this;
  }
  setPreviewModel(modelIndex: number): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set preview model");
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player)
      fns.PlayerTextDrawSetPreviewModel(player.id, this.id, modelIndex);
    else fns.TextDrawSetPreviewModel(this.id, modelIndex);
    return this;
  }
  setPreviewRot(
    fRotX: number,
    fRotY: number,
    fRotZ: number,
    fZoom = 1
  ): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set preview rot");
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player)
      fns.PlayerTextDrawSetPreviewRot(
        player.id,
        this.id,
        fRotX,
        fRotY,
        fRotZ,
        fZoom
      );
    else fns.TextDrawSetPreviewRot(this.id, fRotX, fRotY, fRotZ, fZoom);
    return this;
  }
  setPreviewVehColours(Colour1: string, Colour2: string): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set preview veh col");
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player)
      fns.PlayerTextDrawSetPreviewVehicleColours(
        player.id,
        this.id,
        Colour1,
        Colour2
      );
    else fns.TextDrawSetPreviewVehicleColours(this.id, Colour1, Colour2);
    return this;
  }
  setProportional(set = true): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set Proportional");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawSetProportional(player.id, this.id, set);
    else fns.TextDrawSetProportional(this.id, set);
    return this;
  }
  setSelectable(set: boolean): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set Selectable");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawSetSelectable(player.id, this.id, set);
    else fns.TextDrawSetSelectable(this.id, set);
    return this;
  }
  setShadow(size: number): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set shadow");
    if (size < 0) return logger.warn("[TextDraw]: Invalid shadow value");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawSetShadow(player.id, this.id, size);
    else fns.TextDrawSetShadow(this.id, size);
    return this;
  }
  setString(text: string): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set string");
    if (text.length === 0 || text.length > 1024)
      return logger.warn("[TextDraw]: Invalid text length");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawSetString(player.id, this.id, text);
    else fns.TextDrawSetString(this.id, text);
    return this;
  }
  setTextSize(x: number, y: number): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set TextSize");
    fns.TextDrawTextSize(this.id, x, y);
    return this;
  }
  useBox(use: boolean): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set TextSize");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawUseBox(player.id, this.id, use);
    else fns.TextDrawUseBox(this.id, use);
    return this;
  }
  private static beforeCreateWarn(msg: string): void {
    logger.warn(`[TextDraw]: Unable to ${msg} before create`);
  }
  private unregisterEvent() {
    this.destroy();
    samp.removeEventListener("OnPlayerDisconnect", this.unregisterEvent);
    return 1;
  }
  // player's textdraw should be shown / hidden only for whom it is created.
  show(player?: P): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("show");
    const p = this.sourceInfo.player;
    if (p) fns.PlayerTextDrawShow(p.id, this.id);
    else {
      if (player) fns.TextDrawShowForPlayer(player.id, this.id);
      else return logger.warn("[TextDraw]: invalid player for show");
    }
    return this;
  }
  hide(player?: P): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("hide");
    const p = this.sourceInfo.player;
    if (p) fns.PlayerTextDrawHide(p.id, this.id);
    else {
      if (player) fns.TextDrawHideForPlayer(player.id, this.id);
      else return logger.warn("[TextDraw]: invalid player for hide");
    }
    return this;
  }
  showAll(): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("show");
    const p = this.sourceInfo.player;
    if (!p) {
      fns.TextDrawShowForAll(this.id);
      return this;
    }
    return logger.warn(
      "[TextDraw]: player's textdraw should not be show for all."
    );
  }
  hideAll(): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("hideAll");
    const p = this.sourceInfo.player;
    if (!p) {
      fns.TextDrawHideForAll(this.id);
      return this;
    }
    return logger.warn(
      "[TextDraw]: player's textdraw should not be hide for all."
    );
  }
  isValid(): boolean {
    const p = this.sourceInfo.player;
    if (p) return IsValidPlayer3DTextLabel(p.id, this.id);
    return IsValidTextDraw(this.id);
  }
  isVisibleForPlayer<P extends Player>(player: P): boolean {
    if (this.id === -1) return false;
    return IsTextDrawVisibleForPlayer(player.id, this.id);
  }
  getString(): string {
    if (this.id === -1) return this.sourceInfo.text;
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetString(p.id, this.id);
    return TextDrawGetString(this.id);
  }
  setPos(fX: number, fY: number): void | this {
    if (this.id === -1) return TextDraw.beforeCreateWarn("set position");
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
  getColour() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get Colour");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetColour(p.id, this.id);
    return TextDrawGetColour(this.id);
  }
  getBoxColour() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get box Colour");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetBoxColour(p.id, this.id);
    return TextDrawGetBoxColour(this.id);
  }
  getBackgroundColour() {
    if (this.id === -1) return TextDraw.beforeCreateWarn("get bg Colour");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetBackgroundColour(p.id, this.id);
    return TextDrawGetBackgroundColour(this.id);
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
  getPreviewVehColours() {
    if (this.id === -1)
      return TextDraw.beforeCreateWarn("get preview vel Colours");
    const p = this.sourceInfo.player;
    if (p) return PlayerTextDrawGetPreviewVehicleColours(p.id, this.id);
    return TextDrawGetPreviewVehicleColours(this.id);
  }
}
