import type { BasePlayer } from "@/controllers/player";
import { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import { OnGameModeExit } from "@/wrapper/native/callbacks";
import {
  OnPlayerEnterDynamicCP,
  OnPlayerLeaveDynamicCP,
  StreamerItemTypes,
} from "omp-wrapper-streamer";
import { Streamer } from "../common";
import { DynamicCheckpoint } from "./baseCheckpoint";
import { checkPointBus, checkPointHooks } from "./checkPointBus";

export abstract class DynamicCheckPointEvent<
  P extends BasePlayer,
  C extends DynamicCheckpoint
> {
  private readonly checkpoints = new Map<number, C>();
  private readonly players;

  constructor(playersMap: Map<number, P>) {
    this.players = playersMap;
    checkPointBus.on(checkPointHooks.created, (checkpoint: C) => {
      this.checkpoints.set(checkpoint.id, checkpoint);
    });
    checkPointBus.on(checkPointHooks.destroyed, (checkpoint: C) => {
      this.checkpoints.delete(checkpoint.id);
    });
    OnPlayerEnterDynamicCP((playerid: number, checkpointid: number): number => {
      const cp = this.checkpoints.get(checkpointid);
      if (!cp) return 0;
      const p = this.players.get(playerid);
      if (!p) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onPlayerEnter,
        "OnPlayerEnterDynamicCP"
      );
      return pFn(p, cp);
    });
    OnPlayerLeaveDynamicCP((playerid: number, checkpointid: number): number => {
      const cp = this.checkpoints.get(checkpointid);
      if (!cp) return 0;
      const p = this.players.get(playerid);
      if (!p) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onPlayerLeave,
        "OnPlayerLeaveDynamicCP"
      );
      return pFn(p, cp);
    });
    Streamer.onItemStreamIn((type, item, player) => {
      if (type === StreamerItemTypes.CP) {
        const cp = this.checkpoints.get(item);
        const p = this.players.get(player);
        if (cp && p) this.onStreamIn(cp, p);
      }
      return 1;
    });
    Streamer.onItemStreamOut((type, item, player) => {
      if (type === StreamerItemTypes.CP) {
        const cp = this.checkpoints.get(item);
        const p = this.players.get(player);
        if (cp && p) this.onStreamOut(cp, p);
      }
      return 1;
    });
    OnGameModeExit(() => {
      setTimeout(() => {
        this.getCheckPointsArr().forEach((cp) => {
          cp.isValid() && cp.destroy();
        });
      });
    });
  }

  protected abstract onPlayerEnter(player: P, checkpoint: C): TCommonCallback;
  protected abstract onPlayerLeave(player: P, checkpoint: C): TCommonCallback;
  protected abstract onStreamIn(checkpoint: C, player: P): TCommonCallback;
  protected abstract onStreamOut(checkpoint: C, player: P): TCommonCallback;

  public getCheckPointsArr(): Array<C> {
    return [...this.checkpoints.values()];
  }

  public getCheckPointsMap(): Map<number, C> {
    return this.checkpoints;
  }
}
