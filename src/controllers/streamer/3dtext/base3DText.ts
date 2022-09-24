import { InvalidEnum } from "@/enums";
import type { IDynamic3DTextLabel } from "@/interfaces";
import { logger } from "@/logger";
import { rgba } from "@/utils/colorUtils";
import {
  CreateDynamic3DTextLabel,
  CreateDynamic3DTextLabelEx,
  GetDynamic3DTextLabelText,
  UpdateDynamic3DTextLabelText,
} from "@/utils/helperUtils";
import {
  DestroyDynamic3DTextLabel,
  IsValidDynamic3DTextLabel,
  StreamerDistances,
} from "omp-wrapper-streamer";

export class Dynamic3DTextLabel {
  private sourceInfo: IDynamic3DTextLabel;
  private _id = -1;
  public get id(): number {
    return this._id;
  }
  constructor(textLabel: IDynamic3DTextLabel) {
    this.sourceInfo = textLabel;
  }
  public create(): void | this {
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
    const { charset, text, color, drawdistance, x, y, z, extended } =
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
        rgba(color),
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
        charset
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
        charset,
        text,
        rgba(color),
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

    return this;
  }
  public destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[Streamer3DTextLabel]: Unable to destroy before create"
      );
    DestroyDynamic3DTextLabel(this.id);
    return this;
  }
  public isValid(): boolean {
    return IsValidDynamic3DTextLabel(this.id);
  }
  public getText(): void | string {
    if (this.id === -1)
      return logger.warn(
        "[Streamer3DTextLabel]: Unable to get text before create"
      );
    return GetDynamic3DTextLabelText(this.id, this.sourceInfo.charset);
  }
  public updateText(
    color: string,
    text: string,
    charset = this.sourceInfo.charset
  ): void | number {
    if (this.id === -1)
      return logger.warn(
        "[Streamer3DTextLabel]: Unable to update text before create"
      );
    this.sourceInfo.charset = charset;
    return UpdateDynamic3DTextLabelText(this.id, rgba(color), text, charset);
  }
}
