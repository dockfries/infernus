import type { Player } from "core/controllers/player";
import type { IDynamicCheckPoint } from "core/interfaces";
import {
  CreateDynamicCP,
  CreateDynamicCPEx,
  DestroyDynamicCP,
  GetPlayerVisibleDynamicCP,
  IsPlayerInDynamicCP,
  IsValidDynamicCP,
  StreamerDistances,
  StreamerItemTypes,
  TogglePlayerAllDynamicCPs,
  TogglePlayerDynamicCP,
} from "@infernus/streamer";
import { Streamer } from "../common";
import { INTERNAL_FLAGS } from "../../../utils/flags";
import { dynamicCheckpointPool } from "core/utils/pools";

export class DynamicCheckpoint {
  private sourceInfo: IDynamicCheckPoint | null = null;
  private _id = -1;
  get id(): number {
    return this._id;
  }
  constructor(checkPointOrId: IDynamicCheckPoint | number) {
    if (typeof checkPointOrId === "number") {
      const obj = DynamicCheckpoint.getInstance(checkPointOrId);
      if (obj) {
        return obj;
      }
      this._id = checkPointOrId;
      dynamicCheckpointPool.set(this._id, this);
    } else {
      this.sourceInfo = checkPointOrId;
    }
  }
  create(): this {
    if (this.id !== -1)
      throw new Error("[StreamerCheckpoint]: Unable to create again");
    if (!this.sourceInfo)
      throw new Error("[StreamerCheckpoint]: Unable to create with only id");
    let {
      streamDistance,
      worldId,
      interiorId: interiorId,
      playerId,
      areaId,
      priority,
    } = this.sourceInfo;
    const { size, x, y, z, extended } = this.sourceInfo;

    if (size < 0)
      throw new Error("[StreamerCheckpoint]: Invalid checkpoint size");

    streamDistance ??= StreamerDistances.CP_SD;
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

      this._id = CreateDynamicCPEx(
        x,
        y,
        z,
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

      this._id = CreateDynamicCP(
        x,
        y,
        z,
        size,
        worldId,
        interiorId,
        playerId,
        streamDistance,
        areaId,
        priority,
      );
    }

    dynamicCheckpointPool.set(this._id, this);
    return this;
  }
  destroy(): this {
    if (this.id === -1 && !INTERNAL_FLAGS.skip)
      throw new Error(
        "[StreamerCheckpoint]: Unable to destroy the checkpoint before create",
      );
    if (!INTERNAL_FLAGS.skip) {
      DestroyDynamicCP(this.id);
    }
    dynamicCheckpointPool.delete(this.id);
    this._id = -1;
    return this;
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== -1) return true;
    return DynamicCheckpoint.isValid(this.id);
  }
  togglePlayer(player: Player, toggle: boolean): this {
    if (this.id === -1)
      throw new Error(
        "[StreamerCheckpoint]: Unable to toggle the player before create",
      );
    TogglePlayerDynamicCP(player.id, this.id, toggle);
    return this;
  }
  isPlayerIn(player: Player): boolean {
    if (this.id === -1) return false;
    return IsPlayerInDynamicCP(player.id, this.id);
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === -1)
      throw new Error(
        "[StreamerCheckpoint]: Unable to toggle callbacks before create",
      );
    return Streamer.toggleItemCallbacks(StreamerItemTypes.CP, this.id, toggle);
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) return false;
    return Streamer.isToggleItemCallbacks(StreamerItemTypes.CP, this.id);
  }
  static isValid = IsValidDynamicCP;
  static togglePlayerAll(player: Player, toggle: boolean): number {
    return TogglePlayerAllDynamicCPs(player.id, toggle);
  }
  static getPlayerVisible(player: Player) {
    return dynamicCheckpointPool.get(GetPlayerVisibleDynamicCP(player.id));
  }
  static togglePlayerUpdate(player: Player, update = true) {
    return Streamer.toggleItemUpdate(player, StreamerItemTypes.CP, update);
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
    return dynamicCheckpointPool.get(id);
  }
  static getInstances() {
    return [...dynamicCheckpointPool.values()];
  }
}
