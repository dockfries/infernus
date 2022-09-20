import type { BasePlayer } from "@/controllers/player";
import { logger } from "@/logger";
import type { IDynamicCheckPoint } from "@/interfaces";
import {
  CreateDynamicCP,
  CreateDynamicCPEx,
  DestroyDynamicCP,
  GetPlayerVisibleDynamicCP,
  IsPlayerInDynamicCP,
  IsValidDynamicCP,
  StreamerDistances,
  TogglePlayerAllDynamicCPs,
  TogglePlayerDynamicCP,
} from "omp-wrapper-streamer";
import { checkPointBus, checkPointHooks } from "./checkPointBus";

export class DynamicCheckpoint {
  private sourceInfo: IDynamicCheckPoint;
  private _id = -1;
  public get id(): number {
    return this._id;
  }
  constructor(checkPoint: IDynamicCheckPoint) {
    this.sourceInfo = checkPoint;
  }
  public create(): void | this {
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

    checkPointBus.emit(checkPointHooks.created, this);
    return this;
  }
  public destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerCheckpoint]: Unable to destroy the checkpoint before create"
      );
    DestroyDynamicCP(this.id);
    checkPointBus.emit(checkPointHooks.destroyed, this);
    return this;
  }
  public static isValid(checkpoint: DynamicCheckpoint): boolean {
    return IsValidDynamicCP(checkpoint.id);
  }
  public togglePlayer<P extends BasePlayer>(
    player: P,
    toggle: boolean
  ): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerCheckpoint]: Unable to toggle the player before create"
      );
    TogglePlayerDynamicCP(player.id, this.id, toggle);
    return this;
  }
  public static togglePlayerAll<P extends BasePlayer>(
    player: P,
    toggle: boolean
  ): number {
    return TogglePlayerAllDynamicCPs(player.id, toggle);
  }
  public isPlayerIn<P extends BasePlayer>(player: P): boolean {
    if (this.id === -1) return false;
    return IsPlayerInDynamicCP(player.id, this.id);
  }
  public static getPlayerVisible<
    P extends BasePlayer,
    C extends DynamicCheckpoint
  >(player: P, checkpoints: Map<number, C>): C | undefined {
    return checkpoints.get(GetPlayerVisibleDynamicCP(player.id));
  }
}
