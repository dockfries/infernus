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
      streamDistance,
      worldId,
      interiorId: interiorId,
      playerId,
      areaId,
      priority,
    } = this.sourceInfo;
    const { x, y, z, type, color: color, extended } = this.sourceInfo;

    if (type < 0 || type > 63)
      return logger.error("[StreamerMapIcon]: Invalid map icon type");

    style ??= MapIconStyles.LOCAL;
    streamDistance ??= StreamerDistances.MAP_ICON_SD;
    priority ??= 0;

    if (extended) {
      if (typeof worldId === "number") worldId = [-1];
      else worldId ??= [-1];
      if (typeof interiorId === "number") interiorId = [-1];
      else interiorId ??= [-1];
      if (typeof playerId === "number") playerId = [-1];
      else playerId ??= [-1];
      if (typeof areaId === "number") areaId = [-1];
      else areaId ??= [-1];

      this._id = CreateDynamicMapIconEx(
        x,
        y,
        z,
        type,
        rgba(color),
        style,
        streamDistance,
        worldId,
        interiorId,
        playerId,
        areaId,
        priority,
      );
      DynamicMapIcon.mapIcons.set(this._id, this);
      return this;
    }

    if (Array.isArray(worldId)) worldId = -1;
    else worldId ??= -1;
    if (Array.isArray(interiorId)) interiorId = -1;
    else interiorId ??= -1;
    if (Array.isArray(playerId)) playerId = -1;
    else playerId ??= -1;
    if (Array.isArray(areaId)) areaId = -1;
    else areaId ??= -1;

    this._id = CreateDynamicMapIcon(
      x,
      y,
      z,
      type,
      rgba(color),
      worldId,
      interiorId,
      playerId,
      streamDistance,
      style,
      areaId,
      priority,
    );
    DynamicMapIcon.mapIcons.set(this._id, this);
    return this;
  }
  destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerMapIcon]: Unable to destroy the map icon before create",
      );
    DestroyDynamicMapIcon(this.id);
    DynamicMapIcon.mapIcons.delete(this._id);
    this._id = -1;
    return this;
  }
  isValid(): boolean {
    return IsValidDynamicMapIcon(this.id);
  }
  toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerMapIcon]: Unable to toggle callbacks before create",
      );
    return Streamer.toggleItemCallbacks(
      StreamerItemTypes.MAP_ICON,
      this.id,
      toggle,
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
