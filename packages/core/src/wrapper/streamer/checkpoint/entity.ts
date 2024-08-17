import type { Player } from "core/controllers/player";
import { logger } from "core/logger";
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
import { streamerFlag } from "../flag";

export class DynamicCheckpoint {
  static readonly checkpoints = new Map<number, DynamicCheckpoint>();

  private sourceInfo: IDynamicCheckPoint;
  private _id = -1;
  get id(): number {
    return this._id;
  }
  constructor(checkPoint: IDynamicCheckPoint) {
    this.sourceInfo = checkPoint;
  }
  create(): void | this {
    if (this.id !== -1)
      return logger.warn(
        "[StreamerCheckpoint]: Unable to create checkpoint again",
      );
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
      return logger.error("[StreamerCheckpoint]: Invalid checkpoint size");

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

    DynamicCheckpoint.checkpoints.set(this._id, this);
    return this;
  }
  destroy(): void | this {
    if (this.id === -1 && !streamerFlag.skip)
      return logger.warn(
        "[StreamerCheckpoint]: Unable to destroy the checkpoint before create",
      );
    !streamerFlag.skip && DestroyDynamicCP(this.id);
    DynamicCheckpoint.checkpoints.delete(this.id);
    this._id = -1;
    return this;
  }
  isValid(): boolean {
    if (streamerFlag.skip && this.id !== -1) return true;
    return IsValidDynamicCP(this.id);
  }
  togglePlayer(player: Player, toggle: boolean): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerCheckpoint]: Unable to toggle the player before create",
      );
    TogglePlayerDynamicCP(player.id, this.id, toggle);
    return this;
  }
  static togglePlayerAll(player: Player, toggle: boolean): number {
    return TogglePlayerAllDynamicCPs(player.id, toggle);
  }
  isPlayerIn(player: Player): boolean {
    if (this.id === -1) return false;
    return IsPlayerInDynamicCP(player.id, this.id);
  }
  static getPlayerVisible(player: Player) {
    return DynamicCheckpoint.checkpoints.get(
      GetPlayerVisibleDynamicCP(player.id),
    );
  }
  toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerCheckpoint]: Unable to toggle callbacks before create",
      );
    return Streamer.toggleItemCallbacks(StreamerItemTypes.CP, this.id, toggle);
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) false;
    return Streamer.isToggleItemCallbacks(StreamerItemTypes.CP, this.id);
  }

  static getInstance(id: number) {
    return this.checkpoints.get(id);
  }
  static getInstances() {
    return [...this.checkpoints.values()];
  }
}
