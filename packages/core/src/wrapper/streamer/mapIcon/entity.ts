import type { IDynamicMapIcon } from "core/interfaces";
import { rgba } from "core/utils/color";

import {
  IsValidDynamicMapIcon,
  DestroyDynamicMapIcon,
  StreamerDistances,
  CreateDynamicMapIconEx,
  CreateDynamicMapIcon,
  MapIconStyles,
  StreamerItemTypes,
  StreamerMiscellaneous,
} from "@infernus/streamer";
import { Streamer } from "../common";
import { INTERNAL_FLAGS } from "../../../utils/flags";
import { Player } from "core/components";
import { dynamicMapIconPool } from "core/utils/pools";

export class DynamicMapIcon {
  private sourceInfo: IDynamicMapIcon | null = null;
  private _id: number = StreamerMiscellaneous.INVALID_ID;
  get id(): number {
    return this._id;
  }
  constructor(mapIconOrId: IDynamicMapIcon | null) {
    if (typeof mapIconOrId === "number") {
      if (mapIconOrId === StreamerMiscellaneous.INVALID_ID) {
        throw new Error("[StreamerMapIcon]: Invalid id");
      }

      const obj = DynamicMapIcon.getInstance(mapIconOrId);
      if (obj) {
        return obj;
      }
      this._id = mapIconOrId;
      dynamicMapIconPool.set(this._id, this);
    } else {
      this.sourceInfo = mapIconOrId;
    }
  }
  create(): this {
    if (this.id !== StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerMapIcon]: Unable to create again");
    if (!this.sourceInfo)
      throw new Error("[StreamerMapIcon]: Unable to create with only id");
    let {
      style,
      streamDistance,
      worldId,
      interiorId,
      playerId,
      areaId,
      priority,
    } = this.sourceInfo;
    const { x, y, z, type, color: color, extended } = this.sourceInfo;

    if (type < 0 || type > 63)
      throw new Error("[StreamerMapIcon]: Invalid map icon type");

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

      this._id = DynamicMapIcon.__inject__.createEx(
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
      dynamicMapIconPool.set(this._id, this);
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

    this._id = DynamicMapIcon.__inject__.create(
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
    dynamicMapIconPool.set(this._id, this);
    return this;
  }
  destroy(): this {
    if (this.id === StreamerMiscellaneous.INVALID_ID && !INTERNAL_FLAGS.skip)
      throw new Error(
        "[StreamerMapIcon]: Unable to destroy the map icon before create",
      );
    if (!INTERNAL_FLAGS.skip) {
      DynamicMapIcon.__inject__.destroy(this.id);
    }
    dynamicMapIconPool.delete(this._id);
    this._id = StreamerMiscellaneous.INVALID_ID;
    return this;
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== StreamerMiscellaneous.INVALID_ID)
      return true;
    return DynamicMapIcon.isValid(this.id);
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerMapIcon]: Unable to toggle callbacks before create",
      );
    return Streamer.toggleItemCallbacks(
      StreamerItemTypes.MAP_ICON,
      this.id,
      toggle,
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === StreamerMiscellaneous.INVALID_ID) return false;
    return Streamer.isToggleItemCallbacks(StreamerItemTypes.MAP_ICON, this.id);
  }
  static isValid = IsValidDynamicMapIcon;
  static togglePlayerUpdate(player: Player, update = true) {
    return Streamer.toggleItemUpdate(
      player,
      StreamerItemTypes.MAP_ICON,
      update,
    );
  }
  static hideForPlayer(player: Player, z = -50000) {
    Streamer.updateEx(player, 0, 0, z);
    return this.togglePlayerUpdate(player, false);
  }
  static showForPlayer(player: Player, z = -50000) {
    const pos = player.getPos();
    if (pos.ret) {
      Streamer.updateEx(player, pos.x, pos.y, pos.z);
    } else {
      Streamer.updateEx(player, 0, 0, z);
    }
    return this.togglePlayerUpdate(player, true);
  }

  static getInstance(id: number) {
    return dynamicMapIconPool.get(id);
  }
  static getInstances() {
    return [...dynamicMapIconPool.values()];
  }

  static __inject__ = {
    createEx: CreateDynamicMapIconEx,
    create: CreateDynamicMapIcon,
    destroy: DestroyDynamicMapIcon,
  };
}
