import type { IDynamicMapIcon } from "core/interfaces";
import { logger } from "core/logger";
import { rgba } from "core/utils/colorUtils";

import {
  IsValidDynamicMapIcon,
  DestroyDynamicMapIcon,
  StreamerDistances,
  CreateDynamicMapIconEx,
  CreateDynamicMapIcon,
  MapIconStyles,
  StreamerItemTypes,
} from "@infernus/streamer";
import { Streamer } from "../common";

export class DynamicMapIcon {
  static readonly mapIcons = new Map<number, DynamicMapIcon>();

  private sourceInfo: IDynamicMapIcon;
  private _id = -1;
  get id(): number {
    return this._id;
  }
  constructor(mapIcon: IDynamicMapIcon) {
    this.sourceInfo = mapIcon;
  }
  create(): void | this {
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
    const { x, y, z, type, colour, extended } = this.sourceInfo;

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
        rgba(colour),
        style,
        streamdistance,
        worldid,
        interiorid,
        playerid,
        areaid,
        priority
      );
      DynamicMapIcon.mapIcons.set(this._id, this);
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
      rgba(colour),
      worldid,
      interiorid,
      playerid,
      streamdistance,
      style,
      areaid,
      priority
    );
    DynamicMapIcon.mapIcons.set(this._id, this);
    return this;
  }
  destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerMapIcon]: Unable to destroy the map icon before create"
      );
    DestroyDynamicMapIcon(this.id);
    DynamicMapIcon.mapIcons.delete(this._id);
    return this;
  }
  isValid(): boolean {
    return IsValidDynamicMapIcon(this.id);
  }
  toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerMapIcon]: Unable to toggle callbacks before create"
      );
    return Streamer.toggleItemCallbacks(
      StreamerItemTypes.MAP_ICON,
      this.id,
      toggle
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) false;
    return Streamer.isToggleItemCallbacks(StreamerItemTypes.MAP_ICON, this.id);
  }

  static getInstance(id: number) {
    return this.mapIcons.get(id);
  }
  static getInstances() {
    return [...this.mapIcons.values()];
  }
}