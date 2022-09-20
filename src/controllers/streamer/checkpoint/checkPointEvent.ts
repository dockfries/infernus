import type { BasePlayer } from "@/controllers/player";
import {
  OnPlayerEnterDynamicCP,
  OnPlayerLeaveDynamicCP,
} from "omp-wrapper-streamer";
import { DynamicCheckpoint } from "./baseCheckpoint";
import { checkPointBus, checkPointHooks } from "./checkPointBus";

export abstract class DynamicCheckPointEvent<
  P extends BasePlayer,
  C extends DynamicCheckpoint
> {
  public readonly checkpoints = new Map<number, C>();
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
      return this.onPlayerEnter(p, cp);
    });
    OnPlayerLeaveDynamicCP((playerid: number, checkpointid: number): number => {
      const cp = this.checkpoints.get(checkpointid);
      if (!cp) return 0;
      const p = this.players.get(playerid);
      if (!p) return 0;
      return this.onPlayerLeave(p, cp);
    });
  }

  protected abstract onPlayerEnter(player: P, checkpoint: C): number;
  protected abstract onPlayerLeave(player: P, checkpoint: C): number;

  public getCheckPointsArr(): Array<C> {
    return [...this.checkpoints.values()];
  }
}
