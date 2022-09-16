import { IDynamicMapIcon } from "@/interfaces";
import { logger } from "@/logger";
import { rgba } from "@/utils/colorUtils";

import {
  IsValidDynamicMapIcon,
  DestroyDynamicMapIcon,
  StreamerDistances,
  CreateDynamicMapIconEx,
  CreateDynamicMapIcon,
  MapIconStyles,
} from "omp-wrapper-streamer";

export class DynamicMapIcon {
  private sourceInfo: IDynamicMapIcon;
  private _id = -1;
  public get id(): number {
    return this._id;
  }
  constructor(mapIcon: IDynamicMapIcon) {
    this.sourceInfo = mapIcon;
  }
  public create(): void | this {
    if (this.id !== -1)
      return logger.warn("[StreamerMapIcon]: Unable to create map icon again");
    let {
      style,
      streamdistance,
      worldid,
      interiorid,
      playerid,
      areaid,
      priority,
    } = this.sourceInfo;
    const { x, y, z, type, color, extended } = this.sourceInfo;

    if (type < 0 || type > 63)
      return logger.error("[StreamerMapIcon]: Invalid map icon type");

    style ??= MapIconStyles.LOCAL;
    streamdistance ??= StreamerDistances.MAP_ICON_SD;
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

      this._id = CreateDynamicMapIconEx(
        x,
        y,
        z,
        type,
        rgba(color),
        style,
        streamdistance,
        worldid,
        interiorid,
        playerid,
        areaid,
        priority
      );

      return this;
    }

    if (Array.isArray(worldid)) worldid = -1;
    else worldid ??= -1;
    if (Array.isArray(interiorid)) interiorid = -1;
    else interiorid ??= -1;
    if (Array.isArray(playerid)) playerid = -1;
    else playerid ??= -1;
    if (Array.isArray(areaid)) areaid = -1;
    else areaid ??= -1;

    this._id = CreateDynamicMapIcon(
      x,
      y,
      z,
      type,
      rgba(color),
      worldid,
      interiorid,
      playerid,
      streamdistance,
      style,
      areaid,
      priority
    );
    return this;
  }
  public destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerMapIcon]: Unable to destroy the map icon before create"
      );
    DestroyDynamicMapIcon(this.id);
    return this;
  }
  public static isValid(icon: DynamicMapIcon): boolean {
    return IsValidDynamicMapIcon(icon.id);
  }
}
