import type { IDynamicPickup } from "core/interfaces";
import * as s from "@infernus/streamer";
import { Streamer } from "../common";
import { INTERNAL_FLAGS } from "../../../utils/flags";
import { Player } from "core/components";
import { dynamicPickupPool } from "core/utils/pools";

export class DynamicPickup {
  private sourceInfo: IDynamicPickup | null = null;
  private _id: number = s.StreamerMiscellaneous.INVALID_ID;
  get id(): number {
    return this._id;
  }
  constructor(pickupOrId: IDynamicPickup | null) {
    if (typeof pickupOrId === "number") {
      const obj = DynamicPickup.getInstance(pickupOrId);
      if (obj) {
        return obj;
      }
      this._id = pickupOrId;
      dynamicPickupPool.set(this._id, this);
    } else {
      this.sourceInfo = pickupOrId;
    }
  }
  create(): this {
    if (this.id !== s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerPickup]: Unable to create again");
    if (!this.sourceInfo)
      throw new Error("[StreamerPickup]: Unable to create with only id");
    let { streamDistance, worldId, interiorId, playerId, areaId, priority } =
      this.sourceInfo;
    const { type, modelId, x, y, z, extended } = this.sourceInfo;

    if (type < 0) throw new Error("[StreamerPickup]: Invalid pickup type");

    streamDistance ??= s.StreamerDistances.PICKUP_SD;
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

      this._id = DynamicPickup.__inject__.createEx(
        modelId,
        type,
        x,
        y,
        z,
        streamDistance,
        worldId,
        interiorId,
        playerId,
        areaId,
        priority,
      );
    } else {
      if (Array.isArray(worldId)) worldId = -1;
      else worldId ??= -1;
      if (Array.isArray(interiorId)) interiorId = -1;
      else interiorId ??= -1;
      if (Array.isArray(playerId)) playerId = -1;
      else playerId ??= -1;
      if (Array.isArray(areaId)) areaId = -1;
      else areaId ??= -1;

      this._id = DynamicPickup.__inject__.create(
        modelId,
        type,
        x,
        y,
        z,
        worldId,
        interiorId,
        playerId,
        streamDistance,
        areaId,
        priority,
      );
    }

    dynamicPickupPool.set(this._id, this);
    return this;
  }
  destroy(): this {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID && !INTERNAL_FLAGS.skip)
      throw new Error(
        "[StreamerPickup]: Unable to destroy pickup before create",
      );
    if (!INTERNAL_FLAGS.skip) DynamicPickup.__inject__.destroy(this.id);
    dynamicPickupPool.delete(this.id);
    this._id = s.StreamerMiscellaneous.INVALID_ID;
    return this;
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== s.StreamerMiscellaneous.INVALID_ID)
      return true;
    return DynamicPickup.isValid(this.id);
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerPickup]: Unable to toggle callbacks before create",
      );
    return Streamer.toggleItemCallbacks(
      s.StreamerItemTypes.PICKUP,
      this.id,
      toggle,
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return Streamer.isToggleItemCallbacks(s.StreamerItemTypes.PICKUP, this.id);
  }
  static isValid = s.IsValidDynamicPickup;
  static togglePlayerUpdate(player: Player, update = true) {
    return Streamer.toggleItemUpdate(
      player,
      s.StreamerItemTypes.PICKUP,
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
    return dynamicPickupPool.get(id);
  }
  static getInstances() {
    return [...dynamicPickupPool.values()];
  }

  static __inject__ = {
    create: s.CreateDynamicPickup,
    createEx: s.CreateDynamicPickupEx,
    destroy: s.DestroyDynamicPickup,
  };
}
