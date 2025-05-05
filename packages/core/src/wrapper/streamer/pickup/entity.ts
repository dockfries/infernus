import type { IDynamicPickup } from "core/interfaces";
import * as s from "@infernus/streamer";
import { Streamer } from "../common";
import { streamerFlag } from "../flag";
import { Player } from "core/controllers";

export class DynamicPickup {
  static readonly pickups = new Map<number, DynamicPickup>();

  private sourceInfo: IDynamicPickup;
  private _id = -1;
  get id(): number {
    return this._id;
  }
  constructor(pickup: IDynamicPickup) {
    this.sourceInfo = pickup;
  }
  create(): this {
    if (this.id !== -1)
      throw new Error("[StreamerPickup]: Unable to create pickup again");
    let {
      streamDistance,
      worldId,
      interiorId: interiorId,
      playerId,
      areaId,
      priority,
    } = this.sourceInfo;
    const { type, modelId: modelId, x, y, z, extended } = this.sourceInfo;

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

      this._id = DynamicPickup.__inject_CreateDynamicPickupEx(
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

      this._id = DynamicPickup.__inject_CreateDynamicPickup(
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

    DynamicPickup.pickups.set(this._id, this);
    return this;
  }
  destroy(): this {
    if (this.id === -1 && !streamerFlag.skip)
      throw new Error(
        "[StreamerPickup]: Unable to destroy the pickup before create",
      );
    if (!streamerFlag.skip)
      DynamicPickup.__inject_DestroyDynamicPickup(this.id);
    DynamicPickup.pickups.delete(this.id);
    this._id = -1;
    return this;
  }
  isValid(): boolean {
    if (streamerFlag.skip && this.id !== -1) return true;
    return s.IsValidDynamicPickup(this.id);
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === -1)
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
    if (this.id === -1) return false;
    return Streamer.isToggleItemCallbacks(s.StreamerItemTypes.PICKUP, this.id);
  }
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
    if (pos) {
      Streamer.updateEx(player, pos.x, pos.y, pos.z);
    } else {
      Streamer.updateEx(player, 0, 0, z);
    }
    return this.togglePlayerUpdate(player, true);
  }
  static getInstance(id: number) {
    return this.pickups.get(id);
  }
  static getInstances() {
    return [...this.pickups.values()];
  }

  static __inject_CreateDynamicPickup = s.CreateDynamicPickup;
  static __inject_CreateDynamicPickupEx = s.CreateDynamicPickupEx;
  static __inject_DestroyDynamicPickup = s.DestroyDynamicPickup;
}
