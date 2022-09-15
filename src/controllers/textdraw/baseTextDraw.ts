import { LimitsEnum, TextDrawAlignEnum, TextDrawFontsEnum } from "@/enums";
import { IBaseTextDraw } from "@/interfaces";
import { logger } from "@/logger";
import {
  CreatePlayerTextDraw,
  PlayerTextDrawAlignment,
  PlayerTextDrawBackgroundColor,
  PlayerTextDrawBoxColor,
  PlayerTextDrawColor,
  PlayerTextDrawDestroy,
  PlayerTextDrawFont,
  PlayerTextDrawLetterSize,
  PlayerTextDrawSetOutline,
  PlayerTextDrawSetPreviewModel,
  PlayerTextDrawSetPreviewRot,
  PlayerTextDrawSetPreviewVehCol,
  PlayerTextDrawSetProportional,
  PlayerTextDrawSetSelectable,
  PlayerTextDrawSetShadow,
  PlayerTextDrawSetString,
  PlayerTextDrawUseBox,
  TextDrawAlignment,
  TextDrawBackgroundColor,
  TextDrawBoxColor,
  TextDrawColor,
  TextDrawCreate,
  TextDrawDestroy,
  TextDrawFont,
  TextDrawLetterSize,
  TextDrawSetOutline,
  TextDrawSetPreviewModel,
  TextDrawSetPreviewRot,
  TextDrawSetPreviewVehCol,
  TextDrawSetProportional,
  TextDrawSetSelectable,
  TextDrawSetShadow,
  TextDrawSetString,
  TextDrawTextSize,
  TextDrawUseBox,
} from "@/wrapper/functions";
import { BasePlayer } from "../player";
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
      this._id = TextDrawCreate(x, y, text);
      BaseTextDraw.createdGlobalCount++;
    } else {
      if (BaseTextDraw.createdPlayerCount === LimitsEnum.MAX_TEXT_DRAWS)
        return logger.warn(
          "[BaseTextDraw]: Unable to continue to create textdraw, maximum allowable quantity has been reached"
        );
      this._id = CreatePlayerTextDraw(player.id, x, y, text);
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
      TextDrawDestroy(this.id);
      BaseTextDraw.createdGlobalCount--;
    } else {
      PlayerTextDrawDestroy(player.id, this.id);
      BaseTextDraw.createdPlayerCount++;
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
    if (player) PlayerTextDrawFont(player.id, this.id, style);
    else TextDrawFont(this.id, style);
    return this;
  }
  public setColor(color: string): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set color");
    const { player } = this.sourceInfo;
    if (player) PlayerTextDrawColor(player.id, this.id, color);
    else TextDrawColor(this.id, color);
    return this;
  }
  public setBoxColor(color: string): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set box color");
    const { player } = this.sourceInfo;
    if (player) PlayerTextDrawBoxColor(player.id, this.id, color);
    else TextDrawBoxColor(this.id, color);
    return this;
  }
  public setBackgroundColor(color: string): void | this {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("set background color");
    const { player } = this.sourceInfo;
    if (player) PlayerTextDrawBackgroundColor(player.id, this.id, color);
    else TextDrawBackgroundColor(this.id, color);
    return this;
  }
  public setAlignment(alignment: TextDrawAlignEnum): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set alignment");
    const { player } = this.sourceInfo;
    if (player) PlayerTextDrawAlignment(player.id, this.id, alignment);
    else TextDrawAlignment(this.id, alignment);
    return this;
  }
  public setLetterSize(x: number, y: number): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set letter size");
    const { player } = this.sourceInfo;
    if (player) PlayerTextDrawLetterSize(player.id, this.id, x, y);
    else TextDrawLetterSize(this.id, x, y);
    return this;
  }
  public setOutline(size: number): void | this {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("set outline model");
    if (size < 0) return logger.warn("[BaseTextDraw]: Invalid outline value");
    const { player } = this.sourceInfo;
    if (player) PlayerTextDrawSetOutline(player.id, this.id, size);
    else TextDrawSetOutline(this.id, size);
    return this;
  }
  public setPreviewModel(modelIndex: number): void | this {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("set preview model");
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player) PlayerTextDrawSetPreviewModel(player.id, this.id, modelIndex);
    else TextDrawSetPreviewModel(this.id, modelIndex);
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
      PlayerTextDrawSetPreviewRot(
        player.id,
        this.id,
        fRotX,
        fRotY,
        fRotZ,
        fZoom
      );
    else TextDrawSetPreviewRot(this.id, fRotX, fRotY, fRotZ, fZoom);
    return this;
  }
  public setPreviewVehCol(color1: string, color2: string): void | this {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("set preview veh col");
    this.setFont(TextDrawFontsEnum.MODEL_PREVIEW);
    const { player } = this.sourceInfo;
    if (player)
      PlayerTextDrawSetPreviewVehCol(player.id, this.id, color1, color2);
    else TextDrawSetPreviewVehCol(this.id, color1, color2);
    return this;
  }
  public setProportional(set = true): void | this {
    if (this.id === -1)
      return BaseTextDraw.beforeCreateWarn("set Proportional");
    const { player } = this.sourceInfo;
    if (player) PlayerTextDrawSetProportional(player.id, this.id, set);
    else TextDrawSetProportional(this.id, set);
    return this;
  }
  public setSelectable(set: boolean): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set Selectable");
    const { player } = this.sourceInfo;
    if (player) PlayerTextDrawSetSelectable(player.id, this.id, set);
    else TextDrawSetSelectable(this.id, set);
    return this;
  }
  public setShadow(size: number): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set shadow");
    if (size < 0) return logger.warn("[BaseTextDraw]: Invalid shadow value");
    const { player } = this.sourceInfo;
    if (player) PlayerTextDrawSetShadow(player.id, this.id, size);
    else TextDrawSetShadow(this.id, size);
    return this;
  }
  public setString(text: string): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set string");
    if (text.length === 0 || text.length > 1024)
      return logger.warn("[BaseTextDraw]: Invalid text length");
    const { player } = this.sourceInfo;
    if (player) PlayerTextDrawSetString(player.id, this.id, text);
    else TextDrawSetString(this.id, text);
    return this;
  }
  public setTextSize(x: number, y: number): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set TextSize");
    TextDrawTextSize(this.id, x, y);
    return this;
  }
  public UseBox(use: boolean): void | this {
    if (this.id === -1) return BaseTextDraw.beforeCreateWarn("set TextSize");
    const { player } = this.sourceInfo;
    if (player) PlayerTextDrawUseBox(player.id, this.id, use);
    else TextDrawUseBox(this.id, use);
    return this;
  }
  private static beforeCreateWarn(msg: string): void {
    logger.warn(`[BaseTextDraw]: Unable to ${msg} before create`);
  }
  private unregisterEvent() {
    textDrawBus.emit(textDrawHooks.destroyed, {
      key: { id: this.id, global: false },
      value: this,
    });
    samp.removeEventListener("OnPlayerDisconnect", this.unregisterEvent);
    return 1;
  }
}
