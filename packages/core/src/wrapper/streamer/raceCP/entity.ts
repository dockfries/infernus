import type { Player } from "core/controllers/player";
import type { IDynamicRaceCp } from "core/interfaces";

import { logger } from "core/logger";
import {
  CreateDynamicRaceCP,
  CreateDynamicRaceCPEx,
  DestroyDynamicCP,
  GetPlayerVisibleDynamicRaceCP,
  IsPlayerInDynamicRaceCP,
  IsValidDynamicCP,
  StreamerDistances,
  StreamerItemTypes,
  TogglePlayerAllDynamicRaceCPs,
  TogglePlayerDynamicRaceCP,
} from "@infernus/streamer";
import { Streamer } from "../common";
import { streamerFlag } from "../flag";

export class DynamicRaceCP {
  static readonly checkpoints = new Map<number, DynamicRaceCP>();

  private sourceInfo: IDynamicRaceCp;
  private _id = -1;
  get id(): number {
    return this._id;
  }
  constructor(checkPoint: IDynamicRaceCp) {
    this.sourceInfo = checkPoint;
  }
  create(): void | this {
    if (this.id !== -1)
      return logger.warn("[StreamerRaceCP]: Unable to create checkpoint again");
    let { streamDistance, worldId, interiorId, playerId, areaId, priority } =
      this.sourceInfo;
    const { type, size, x, y, z, nextX, nextY, nextZ, extended } =
      this.sourceInfo;

    if (type < 0 || type > 8)
      return logger.error("[StreamerRaceCP]: Invalid type");

    if (size < 0) return logger.error("[StreamerRaceCP]: Invalid size");

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

      this._id = CreateDynamicRaceCPEx(
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

      this._id = CreateDynamicRaceCP(
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

    DynamicRaceCP.checkpoints.set(this._id, this);
    return this;
  }
  destroy(): void | this {
    if (this.id === -1 && !streamerFlag.skip)
      return logger.warn(
        "[StreamerRaceCP]: Unable to destroy the checkpoint before create",
      );
    !streamerFlag.skip && DestroyDynamicCP(this.id);
    DynamicRaceCP.checkpoints.delete(this.id);
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
        "[StreamerRaceCP]: Unable to toggle the player before create",
      );
    TogglePlayerDynamicRaceCP(player.id, this.id, toggle);
    return this;
  }
  static togglePlayerAll(player: Player, toggle: boolean): number {
    return TogglePlayerAllDynamicRaceCPs(player.id, toggle);
  }
  isPlayerIn(player: Player): boolean {
    if (this.id === -1) return false;
    return IsPlayerInDynamicRaceCP(player.id, this.id);
  }
  static getPlayerVisible(player: Player) {
    return DynamicRaceCP.checkpoints.get(
      GetPlayerVisibleDynamicRaceCP(player.id),
    );
  }
  toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerRaceCP]: Unable to toggle callbacks before create",
      );
    return Streamer.toggleItemCallbacks(
      StreamerItemTypes.RACE_CP,
      this.id,
      toggle,
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) false;
    return Streamer.isToggleItemCallbacks(StreamerItemTypes.RACE_CP, this.id);
  }

  static getInstance(id: number) {
    return this.checkpoints.get(id);
  }
  static getInstances() {
    return [...this.checkpoints.values()];
  }
}
