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
        "[StreamerCheckpoint]: Unable to create checkpoint again"
      );
    let { streamdistance, worldid, interiorid, playerid, areaid, priority } =
      this.sourceInfo;
    const { size, x, y, z, extended } = this.sourceInfo;

    if (size < 0)
      return logger.error("[StreamerCheckpoint]: Invalid checkpoint size");

    streamdistance ??= StreamerDistances.CP_SD;
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

      this._id = CreateDynamicCPEx(
        x,
        y,
        z,
        size,
        streamdistance,
        worldid,
        interiorid,
        playerid,
        areaid,
        priority
      );
    } else {
      if (Array.isArray(worldid)) worldid = -1;
      else worldid ??= -1;
      if (Array.isArray(interiorid)) interiorid = -1;
      else interiorid ??= -1;
      if (Array.isArray(playerid)) playerid = -1;
      else playerid ??= -1;
      if (Array.isArray(areaid)) areaid = -1;
      else areaid ??= -1;

      this._id = CreateDynamicCP(
        x,
        y,
        z,
        size,
        worldid,
        interiorid,
        playerid,
        streamdistance,
        areaid,
        priority
      );
    }

    DynamicCheckpoint.checkpoints.set(this._id, this);
    return this;
  }
  destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerCheckpoint]: Unable to destroy the checkpoint before create"
      );
    DestroyDynamicCP(this.id);
    DynamicCheckpoint.checkpoints.delete(this.id);
    return this;
  }
  isValid(): boolean {
    return IsValidDynamicCP(this.id);
  }
  togglePlayer<P extends Player>(player: P, toggle: boolean): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerCheckpoint]: Unable to toggle the player before create"
      );
    TogglePlayerDynamicCP(player.id, this.id, toggle);
    return this;
  }
  static togglePlayerAll<P extends Player>(player: P, toggle: boolean): number {
    return TogglePlayerAllDynamicCPs(player.id, toggle);
  }
  isPlayerIn<P extends Player>(player: P): boolean {
    if (this.id === -1) return false;
    return IsPlayerInDynamicCP(player.id, this.id);
  }
  static getPlayerVisible<P extends Player, C extends DynamicCheckpoint>(
    player: P,
    checkpoints: Map<number, C>
  ): C | undefined {
    return checkpoints.get(GetPlayerVisibleDynamicCP(player.id));
  }
  toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerCheckpoint]: Unable to toggle callbacks before create"
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
