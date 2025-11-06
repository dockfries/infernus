import type { Player } from "core/components/player";
import type { IDynamicRaceCp } from "core/interfaces";

import {
  CreateDynamicRaceCP,
  CreateDynamicRaceCPEx,
  DestroyDynamicRaceCP,
  GetPlayerVisibleDynamicRaceCP,
  IsPlayerInDynamicRaceCP,
  IsValidDynamicCP,
  StreamerDistances,
  StreamerItemTypes,
  StreamerMiscellaneous,
  TogglePlayerAllDynamicRaceCPs,
  TogglePlayerDynamicRaceCP,
} from "@infernus/streamer";
import { Streamer } from "../common";
import { INTERNAL_FLAGS } from "../../../utils/flags";
import { dynamicRaceCPPool } from "core/utils/pools";

export class DynamicRaceCP {
  private sourceInfo: IDynamicRaceCp | null = null;
  private _id: number = StreamerMiscellaneous.INVALID_ID;
  get id(): number {
    return this._id;
  }
  constructor(checkPointOrId: IDynamicRaceCp | number) {
    if (typeof checkPointOrId === "number") {
      const obj = DynamicRaceCP.getInstance(checkPointOrId);
      if (obj) {
        return obj;
      }
      this._id = checkPointOrId;
      dynamicRaceCPPool.set(this._id, this);
    } else {
      this.sourceInfo = checkPointOrId;
    }
  }
  create(): this {
    if (this.id !== StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerRaceCP]: Unable to create again");
    if (!this.sourceInfo)
      throw new Error("[StreamerRaceCP]: Unable to create with only id");
    let { streamDistance, worldId, interiorId, playerId, areaId, priority } =
      this.sourceInfo;
    const { type, size, x, y, z, nextX, nextY, nextZ, extended } =
      this.sourceInfo;

    if (type < 0 || type > 8) throw new Error("[StreamerRaceCP]: Invalid type");

    if (size < 0) throw new Error("[StreamerRaceCP]: Invalid size");

    streamDistance ??= StreamerDistances.RACE_CP_SD;
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

      this._id = DynamicRaceCP.__inject__.createEx(
        type,
        x,
        y,
        z,
        nextX,
        nextY,
        nextZ,
        size,
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

      this._id = DynamicRaceCP.__inject__.create(
        type,
        x,
        y,
        z,
        nextX,
        nextY,
        nextZ,
        size,
        worldId,
        interiorId,
        playerId,
        streamDistance,
        areaId,
        priority,
      );
    }

    dynamicRaceCPPool.set(this._id, this);
    return this;
  }
  destroy(): this {
    if (this.id === StreamerMiscellaneous.INVALID_ID && !INTERNAL_FLAGS.skip)
      throw new Error(
        "[StreamerRaceCP]: Unable to destroy the checkpoint before create",
      );
    if (!INTERNAL_FLAGS.skip) {
      DynamicRaceCP.__inject__.destroy(this.id);
    }
    dynamicRaceCPPool.delete(this.id);
    this._id = StreamerMiscellaneous.INVALID_ID;
    return this;
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== StreamerMiscellaneous.INVALID_ID)
      return true;
    return DynamicRaceCP.isValid(this.id);
  }
  togglePlayer(player: Player, toggle: boolean): this {
    if (this.id === StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerRaceCP]: Unable to toggle player before create",
      );
    DynamicRaceCP.__inject__.togglePlayer(player.id, this.id, toggle);
    return this;
  }
  static togglePlayerAll(player: Player, toggle: boolean): number {
    return DynamicRaceCP.__inject__.togglePlayerAll(player.id, toggle);
  }
  isPlayerIn(player: Player): boolean {
    if (this.id === StreamerMiscellaneous.INVALID_ID) return false;
    return DynamicRaceCP.__inject__.isPlayerIn(player.id, this.id);
  }
  static getPlayerVisible(player: Player) {
    return dynamicRaceCPPool.get(
      DynamicRaceCP.__inject__.getPlayerVisible(player.id),
    );
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerRaceCP]: Unable to toggle callbacks before create",
      );
    return Streamer.toggleItemCallbacks(
      StreamerItemTypes.RACE_CP,
      this.id,
      toggle,
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === StreamerMiscellaneous.INVALID_ID) return false;
    return Streamer.isToggleItemCallbacks(StreamerItemTypes.RACE_CP, this.id);
  }
  static isValid = IsValidDynamicCP;
  static togglePlayerUpdate(player: Player, update = true) {
    return Streamer.toggleItemUpdate(player, StreamerItemTypes.RACE_CP, update);
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
    return dynamicRaceCPPool.get(id);
  }
  static getInstances() {
    return [...dynamicRaceCPPool.values()];
  }

  static __inject__ = {
    create: CreateDynamicRaceCP,
    createEx: CreateDynamicRaceCPEx,
    destroy: DestroyDynamicRaceCP,
    getPlayerVisible: GetPlayerVisibleDynamicRaceCP,
    isPlayerIn: IsPlayerInDynamicRaceCP,
    isValid: IsValidDynamicCP,
    togglePlayerAll: TogglePlayerAllDynamicRaceCPs,
    togglePlayer: TogglePlayerDynamicRaceCP,
  };
}
