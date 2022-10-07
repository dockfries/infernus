import type { BasePlayer } from "@/controllers/player";
import { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import {
  OnPlayerEnterDynamicRaceCP,
  OnPlayerLeaveDynamicRaceCP,
} from "omp-wrapper-streamer";
import { DynamicRaceCP } from "./baseRaceCP";
import { raceCPBus, raceCPHooks } from "./raceCPBus";

export abstract class DynamicRaceCPEvent<
  P extends BasePlayer,
  R extends DynamicRaceCP
> {
  private readonly raceCPs = new Map<number, R>();
  private readonly players;

  constructor(playersMap: Map<number, P>) {
    this.players = playersMap;
    raceCPBus.on(raceCPHooks.created, (checkpoint: R) => {
      this.raceCPs.set(checkpoint.id, checkpoint);
    });
    raceCPBus.on(raceCPHooks.destroyed, (checkpoint: R) => {
      this.raceCPs.delete(checkpoint.id);
    });
    OnPlayerEnterDynamicRaceCP(
      (playerid: number, checkpointid: number): number => {
        const cp = this.raceCPs.get(checkpointid);
        if (!cp) return 0;
        const p = this.players.get(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback.call(
          this,
          this.onPlayerEnter,
          "OnPlayerEnterDynamicRaceCP"
        );
        return pFn(p, cp);
      }
    );
    OnPlayerLeaveDynamicRaceCP(
      (playerid: number, checkpointid: number): number => {
        const cp = this.raceCPs.get(checkpointid);
        if (!cp) return 0;
        const p = this.players.get(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback.call(
          this,
          this.onPlayerLeave,
          "OnPlayerLeaveDynamicRaceCP"
        );
        return pFn(p, cp);
      }
    );
  }

  protected abstract onPlayerEnter(player: P, checkpoint: R): TCommonCallback;
  protected abstract onPlayerLeave(player: P, checkpoint: R): TCommonCallback;

  public getRaceCPsArr(): Array<R> {
    return [...this.raceCPs.values()];
  }

  public getRaceCPsMap(): Map<number, R> {
    return this.raceCPs;
  }
}
