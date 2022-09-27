import { LimitsEnum, TextDrawAlignEnum, TextDrawFontsEnum } from "@/enums";
import type { IBaseTextDraw } from "@/interfaces";
import { logger } from "@/logger";
import * as fns from "@/wrapper/functions";
import * as ow from "omp-wrapper";
import type { BasePlayer } from "../player";
import { textDrawBus, textDrawHooks } from "./textdrawBus";

export abstract class BaseTextDraw<P extends BasePlayer> {
  private static createdGlobalCount = 0;
  private static createdPlayerCount = 0;
  private readonly sourceInfo: IBaseTextDraw<P>;
  private _id = -1;
  public get id() {
    return this._id;
  }
  constructor(textDraw: IBaseTextDraw<P>) {
    this.sourceInfo = textDraw;
  }
  public create(): void | this {
    if (this.id !== -1)
      return logger.warn("[BaseTextDraw]: Unable to create the textdraw again");
    const { x, y, text, player } = this.sourceInfo;
    if (!player) {
      if (BaseTextDraw.createdGlobalCount === LimitsEnum.MAX_TEXT_DRAWS)
        return logger.warn(
          "[BaseTextDraw]: Unable to continue to create textdraw, maximum allowable quantity has been reached"
        );
      this._id = fns.TextDrawCreate(x, y, text);
      BaseTextDraw.createdGlobalCount++;
    } else {
      if (BaseTextDraw.createdPlayerCount === LimitsEnum.MAX_TEXT_DRAWS)
        return logger.warn(
          "[BaseTextDraw]: Unable to continue to create textdraw, maximum allowable quantity has been reached"
        );
      this._id = fns.CreatePlayerTextDraw(player.id, x, y, text);
      BaseTextDraw.createdPlayerCount++;
      // Player-textdraws are automatically destroyed when a player disconnects.
      samp.addEventListener("OnPlayerDisconnect", this.unregisterEvent);
    }
    textDrawBus.emit(textDrawHooks.created, {
      key: { id: this.id, global: player === undefined },
      value: this,
    });
    return this;
  }
  public destroy(): void | this {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("destroy the textdraw");
    const { player } = this.sourceInfo;
    if (!player) {
      fns.TextDrawDestroy(this.id);
      BaseTextDraw.createdGlobalCount--;
    } else {
      fns.PlayerTextDrawDestroy(player.id, this.id);
      BaseTextDraw.createdPlayerCount--;
    }
    textDrawBus.emit(textDrawHooks.destroyed, {
      id: this.id,
      global: player === undefined,
    });
    this._id = -1;
    return this;
  }
  public setFont(style: 0 | 1 | 2 | 3 | TextDrawFontsEnum): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set font");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawFont(player.id, this.id, style);
    else fns.TextDrawFont(this.id, style);
    return this;
  }
  public setColor(color: string): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set color");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawColor(player.id, this.id, color);
    else fns.TextDrawColor(this.id, color);
    return this;
  }
  public setBoxColor(color: string): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set box color");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawBoxColor(player.id, this.id, color);
    else fns.TextDrawBoxColor(this.id, color);
    return this;
  }
  public setBackgroundColor(color: string): void | this {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("set background color");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawBackgroundColor(player.id, this.id, color);
    else fns.TextDrawBackgroundColor(this.id, color);
    return this;
  }
  public setAlignment(alignment: TextDrawAlignEnum): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set alignment");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawAlignment(player.id, this.id, alignment);
    else fns.TextDrawAlignment(this.id, alignment);
    return this;
  }
  public setLetterSize(x: number, y: number): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set letter size");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawLetterSize(player.id, this.id, x, y);
    else fns.TextDrawLetterSize(this.id, x, y);
    return this;
  }
  public setOutline(size: number): void | this {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("set outline model");
    if (size < 0) return logger.warn("[BaseTextDraw]: Invalid outline value");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawSetOutline(player.id, this.id, size);
    else fns.TextDrawSetOutline(this.id, size);
    return this;
  }
  public setPreviewModel(modelIndex: number): void | this {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("set preview model");
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player)
      fns.PlayerTextDrawSetPreviewModel(player.id, this.id, modelIndex);
    else fns.TextDrawSetPreviewModel(this.id, modelIndex);
    return this;
  }
  public setPreviewRot(
    fRotX: number,
    fRotY: number,
    fRotZ: number,
    fZoom = 1
  ): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set preview rot");
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
  public setPreviewVehCol(color1: string, color2: string): void | this {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("set preview veh col");
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player)
      fns.PlayerTextDrawSetPreviewVehCol(player.id, this.id, color1, color2);
    else fns.TextDrawSetPreviewVehCol(this.id, color1, color2);
    return this;
  }
  public setProportional(set = true): void | this {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("set Proportional");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawSetProportional(player.id, this.id, set);
    else fns.TextDrawSetProportional(this.id, set);
    return this;
  }
  public setSelectable(set: boolean): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set Selectable");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawSetSelectable(player.id, this.id, set);
    else fns.TextDrawSetSelectable(this.id, set);
    return this;
  }
  public setShadow(size: number): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set shadow");
    if (size < 0) return logger.warn("[BaseTextDraw]: Invalid shadow value");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawSetShadow(player.id, this.id, size);
    else fns.TextDrawSetShadow(this.id, size);
    return this;
  }
  public setString(text: string): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set string");
    if (text.length === 0 || text.length > 1024)
      return logger.warn("[BaseTextDraw]: Invalid text length");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawSetString(player.id, this.id, text);
    else fns.TextDrawSetString(this.id, text);
    return this;
  }
  public setTextSize(x: number, y: number): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set TextSize");
    fns.TextDrawTextSize(this.id, x, y);
    return this;
  }
  public useBox(use: boolean): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set TextSize");
    const { player } = this.sourceInfo;
    if (player) fns.PlayerTextDrawUseBox(player.id, this.id, use);
    else fns.TextDrawUseBox(this.id, use);
    return this;
  }
  private static beforeCreateWarn(msg: string): void {
    logger.warn(`[BaseTextDraw]: Unable to ${msg} before create`);
  }
  private unregisterEvent() {
    this.destroy();
    samp.removeEventListener("OnPlayerDisconnect", this.unregisterEvent);
    return 1;
  }
  // player's textdraw should be shown / hidden only for whom it is created.
  public show(player?: P): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("show");
    const p = this.sourceInfo.player;
    if (p) fns.PlayerTextDrawShow(p.id, this.id);
    else {
      if (player) fns.TextDrawShowForPlayer(player.id, this.id);
      else return logger.warn("[BaseTextDraw]: invalid player for show");
    }
    return this;
  }
  public hide(player?: P): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("hide");
    const p = this.sourceInfo.player;
    if (p) fns.PlayerTextDrawHide(p.id, this.id);
    else {
      if (player) fns.TextDrawHideForPlayer(player.id, this.id);
      else return logger.warn("[BaseTextDraw]: invalid player for hide");
    }
    return this;
  }
  public showAll(): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("show");
    const p = this.sourceInfo.player;
    if (!p) {
      fns.TextDrawShowForAll(this.id);
      return this;
    }
    return logger.warn(
      "[BaseTextDraw]: player's textdraw should not be show for all."
    );
  }
  public hideAll(): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("hideAll");
    const p = this.sourceInfo.player;
    if (!p) {
      fns.TextDrawHideForAll(this.id);
      return this;
    }
    return logger.warn(
      "[BaseTextDraw]: player's textdraw should not be hide for all."
    );
  }
  public isValid(): boolean {
    const p = this.sourceInfo.player;
    if (p) return ow.IsValidPlayer3DTextLabel(p.id, this.id);
    return ow.IsValidTextDraw(this.id);
  }
  public isVisibleForPlayer<P extends BasePlayer>(player: P): boolean {
    if (this.id === -1) return false;
    return ow.IsTextDrawVisibleForPlayer(player.id, this.id);
  }
  public getString(): string {
    if (this.id === -1) return this.sourceInfo.text;
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetString(p.id, this.id);
    return ow.TextDrawGetString(this.id);
  }
  public setPos(fX: number, fY: number): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set position");
    const p = this.sourceInfo.player;
    if (p) ow.PlayerTextDrawSetPos(p.id, this.id, fX, fY);
    else ow.TextDrawSetPos(this.id, fX, fY);
    return this;
  }
  public getLetterSize() {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("get letter size");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetLetterSize(p.id, this.id);
    return ow.TextDrawGetLetterSize(this.id);
  }
  public getTextSize() {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("get text size");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetTextSize(p.id, this.id);
    return ow.TextDrawGetTextSize(this.id);
  }
  public getPos() {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("get position");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetPos(p.id, this.id);
    return ow.TextDrawGetPos(this.id);
  }
  public getColor() {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("get color");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetColor(p.id, this.id);
    return ow.TextDrawGetColor(this.id);
  }
  public getBoxColor() {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("get box color");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetBoxColor(p.id, this.id);
    return ow.TextDrawGetBoxColor(this.id);
  }
  public getBackgroundColor() {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("get bg color");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetBackgroundCol(p.id, this.id);
    return ow.TextDrawGetBackgroundColor(this.id);
  }
  public getShadow() {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("get shadow");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetShadow(p.id, this.id);
    return ow.TextDrawGetShadow(this.id);
  }
  public getOutline() {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("get outline");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetOutline(p.id, this.id);
    return ow.TextDrawGetOutline(this.id);
  }
  public getFont() {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("get font");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetFont(p.id, this.id);
    return ow.TextDrawGetFont(this.id);
  }
  public isBox() {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawIsBox(p.id, this.id);
    return ow.TextDrawIsBox(this.id);
  }
  public isProportional() {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawIsProportional(p.id, this.id);
    return ow.TextDrawIsProportional(this.id);
  }
  public isSelectable() {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawIsSelectable(p.id, this.id);
    return ow.TextDrawIsSelectable(this.id);
  }
  public getAlignment() {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("get alignment");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetAlignment(p.id, this.id);
    return ow.TextDrawGetAlignment(this.id);
  }
  public getPreviewModel() {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("get preview model");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetPreviewModel(p.id, this.id);
    return ow.TextDrawGetPreviewModel(this.id);
  }
  public getPreviewRot() {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("get preview rotation");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetPreviewRot(p.id, this.id);
    return ow.TextDrawGetPreviewRot(this.id);
  }
  public getPreviewVehCol() {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("get preview vel color");
    const p = this.sourceInfo.player;
    if (p) return ow.PlayerTextDrawGetPreviewVehCol(p.id, this.id);
    return ow.TextDrawGetPreviewVehCol(this.id);
  }
}
