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

import { raceCPBus, raceCPHooks } from "./raceCPBus";

export class DynamicRaceCP {
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
  destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerRaceCP]: Unable to destroy the checkpoint before create"
      );
    DestroyDynamicCP(this.id);
    raceCPBus.emit(raceCPHooks.destroyed, this);
    return this;
  }
  isValid(): boolean {
    return IsValidDynamicCP(this.id);
  }
  togglePlayer<P extends Player>(player: P, toggle: boolean): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerRaceCP]: Unable to toggle the player before create"
      );
    TogglePlayerDynamicRaceCP(player.id, this.id, toggle);
    return this;
  }
  static togglePlayerAll<P extends Player>(player: P, toggle: boolean): number {
    return TogglePlayerAllDynamicRaceCPs(player.id, toggle);
  }
  isPlayerIn<P extends Player>(player: P): boolean {
    if (this.id === -1) return false;
    return IsPlayerInDynamicRaceCP(player.id, this.id);
  }
  static getPlayerVisible<P extends Player, C extends DynamicRaceCP>(
    player: P,
    checkpoints: Map<number, C>
  ): C | undefined {
    return checkpoints.get(GetPlayerVisibleDynamicRaceCP(player.id));
  }
  toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerRaceCP]: Unable to toggle callbacks before create"
      );
    return Streamer.toggleItemCallbacks(
      StreamerItemTypes.RACE_CP,
      this.id,
      toggle
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) false;
    return Streamer.isToggleItemCallbacks(StreamerItemTypes.RACE_CP, this.id);
  }
}
