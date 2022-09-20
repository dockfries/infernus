import type { BasePlayer } from "@/controllers/player";
import type { IDynamicRaceCp } from "@/interfaces";

import { logger } from "@/logger";
import {
  CreateDynamicRaceCP,
  CreateDynamicRaceCPEx,
  DestroyDynamicCP,
  GetPlayerVisibleDynamicRaceCP,
  IsPlayerInDynamicRaceCP,
  IsValidDynamicCP,
  StreamerDistances,
  TogglePlayerAllDynamicRaceCPs,
  TogglePlayerDynamicRaceCP,
} from "omp-wrapper-streamer";

import { raceCPBus, raceCPHooks } from "./raceCPBus";

export class DynamicRaceCP {
  private sourceInfo: IDynamicRaceCp;
  private _id = -1;
  public get id(): number {
    return this._id;
  }
  constructor(checkPoint: IDynamicRaceCp) {
    this.sourceInfo = checkPoint;
  }
  public create(): void | this {
    if (this.id !== -1)
      return logger.warn("[StreamerRaceCP]: Unable to create checkpoint again");
    let { streamdistance, worldid, interiorid, playerid, areaid, priority } =
      this.sourceInfo;
    const { type, size, x, y, z, nextx, nexty, nextz, extended } =
      this.sourceInfo;

    if (type < 0 || type > 8)
      return logger.error("[StreamerRaceCP]: Invalid type");

    if (size < 0) return logger.error("[StreamerRaceCP]: Invalid size");

    streamdistance ??= StreamerDistances.RACE_CP_SD;
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

      this._id = CreateDynamicRaceCPEx(
        type,
        x,
        y,
        z,
        nextx,
        nexty,
        nextz,
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

      this._id = CreateDynamicRaceCP(
        type,
        x,
        y,
        z,
        nextx,
        nexty,
        nextz,
        size,
        worldid,
        interiorid,
        playerid,
        streamdistance,
        areaid,
        priority
      );
    }

    raceCPBus.emit(raceCPHooks.created, this);
    return this;
  }
  public destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerRaceCP]: Unable to destroy the checkpoint before create"
      );
    DestroyDynamicCP(this.id);
    raceCPBus.emit(raceCPHooks.destroyed, this);
    return this;
  }
  public static isValid(checkpoint: DynamicRaceCP): boolean {
    return IsValidDynamicCP(checkpoint.id);
  }
  public togglePlayer<P extends BasePlayer>(
    player: P,
    toggle: boolean
  ): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerRaceCP]: Unable to toggle the player before create"
      );
    TogglePlayerDynamicRaceCP(player.id, this.id, toggle);
    return this;
  }
  public static togglePlayerAll<P extends BasePlayer>(
    player: P,
    toggle: boolean
  ): number {
    return TogglePlayerAllDynamicRaceCPs(player.id, toggle);
  }
  public isPlayerIn<P extends BasePlayer>(player: P): boolean {
    if (this.id === -1) return false;
    return IsPlayerInDynamicRaceCP(player.id, this.id);
  }
  public static getPlayerVisible<P extends BasePlayer, C extends DynamicRaceCP>(
    player: P,
    checkpoints: Map<number, C>
  ): C | undefined {
    return checkpoints.get(GetPlayerVisibleDynamicRaceCP(player.id));
  }
}
