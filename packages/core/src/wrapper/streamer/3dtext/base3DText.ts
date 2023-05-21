import { defaultCharset } from "core/controllers/gamemode/settings";
import { InvalidEnum } from "core/enums";
import type { IDynamic3DTextLabel } from "core/interfaces";
import { logger } from "core/logger";
import { rgba } from "core/utils/colorUtils";
import {
  CreateDynamic3DTextLabel,
  CreateDynamic3DTextLabelEx,
  GetDynamic3DTextLabelText,
  UpdateDynamic3DTextLabelText,
} from "core/utils/helperUtils";
import {
  DestroyDynamic3DTextLabel,
  IsValidDynamic3DTextLabel,
  StreamerDistances,
  StreamerItemTypes,
} from "@infernus/streamer";
import { Streamer } from "../common";
import { _3dTextBus, _3dTextHooks } from "./3dTextBus";

export class Dynamic3DTextLabel {
  private sourceInfo: IDynamic3DTextLabel;
  private _id = -1;
  get id(): number {
    return this._id;
  }
  constructor(textLabel: IDynamic3DTextLabel) {
    this.sourceInfo = textLabel;
  }
  create(): void | this {
    if (this.id !== -1)
      return logger.warn("[Streamer3DTextLabel]: Unable to create again");
    let {
      attachedplayer,
      attachedvehicle,
      testlos,
      streamdistance,
      worldid,
      interiorid,
      playerid,
      areaid,
      priority,
    } = this.sourceInfo;
    const { charset, text, colour, drawdistance, x, y, z, extended } =
      this.sourceInfo;

    attachedplayer ??= InvalidEnum.PLAYER_ID;
    attachedvehicle ??= InvalidEnum.VEHICLE_ID;
    streamdistance ??= StreamerDistances.TEXT_3D_LABEL_SD;
    testlos ??= false;
    priority ??= 0;

    if (extended) {
      if (typeof worldid === "number") worldid = [-1];
      else worldid ??= [-1];
      if (typeof interiorid === "number") interiorid = [-1];
      else interiorid ??= [-1];
      if (typeof playerid === "number") playerid = [-1];
      else playerid ??= [-1];
      if (typeof areaid === "number") areaid = [-1];
      else areaid ??= [-1];

      this._id = CreateDynamic3DTextLabelEx(
        text,
        rgba(colour),
        x,
        y,
        z,
        drawdistance,
        attachedplayer,
        attachedvehicle,
        testlos,
        streamdistance,
        worldid,
        interiorid,
        playerid,
        areaid,
        priority,
        charset || defaultCharset
      );
    } else {
      if (Array.isArray(worldid)) worldid = -1;
      else worldid ??= -1;
      if (Array.isArray(interiorid)) interiorid = -1;
      else interiorid ??= -1;
      if (Array.isArray(playerid)) playerid = -1;
      else playerid ??= -1;
      if (Array.isArray(areaid)) areaid = -1;
      else areaid ??= -1;

      this._id = CreateDynamic3DTextLabel(
        charset || defaultCharset,
        text,
        rgba(colour),
        x,
        y,
        z,
        drawdistance,
        attachedplayer,
        attachedvehicle,
        testlos,
        worldid,
        interiorid,
        playerid,
        streamdistance,
        areaid,
        priority
      );
    }
    _3dTextBus.emit(_3dTextHooks.created, this);
    return this;
  }
  destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[Streamer3DTextLabel]: Unable to destroy before create"
      );
    DestroyDynamic3DTextLabel(this.id);
    _3dTextBus.emit(_3dTextHooks.destroyed, this);
    return this;
  }
  isValid(): boolean {
    return IsValidDynamic3DTextLabel(this.id);
  }
  getColour(): void | string | number {
    if (this.id === -1)
      return logger.warn(
        "[Streamer3DTextLabel]: Unable to get colour before create"
      );
    return this.sourceInfo.colour;
  }
  getCharset(): void | string {
    if (this.id === -1)
      return logger.warn(
        "[Streamer3DTextLabel]: Unable to get charset before create"
      );
    return this.sourceInfo.charset;
  }
  getText(): void | string {
    if (this.id === -1)
      return logger.warn(
        "[Streamer3DTextLabel]: Unable to get text before create"
      );
    return GetDynamic3DTextLabelText(
      this.id,
      this.sourceInfo.charset || defaultCharset
    );
  }
  updateText(
    colour: string | number,
    text: string,
    charset = this.sourceInfo.charset
  ): void | number {
    if (this.id === -1)
      return logger.warn(
        "[Streamer3DTextLabel]: Unable to update text before create"
      );
    this.sourceInfo.charset = charset;
    return UpdateDynamic3DTextLabelText(
      this.id,
      rgba(colour),
      text,
      charset || defaultCharset
    );
  }
  toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[Streamer3DTextLabel]: Unable to toggle callbacks before create"
      );
    return Streamer.toggleItemCallbacks(
      StreamerItemTypes.TEXT_3D_LABEL,
      this.id,
      toggle
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) false;
    return Streamer.isToggleItemCallbacks(
      StreamerItemTypes.TEXT_3D_LABEL,
      this.id
    );
  }
}
