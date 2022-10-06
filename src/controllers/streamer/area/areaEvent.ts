import { BasePlayer, DynamicArea, TCommonCallback } from "@/main";
import { promisifyCallback } from "@/utils/helperUtils";
import {
  OnPlayerEnterDynamicArea,
  OnPlayerLeaveDynamicArea,
} from "omp-wrapper-streamer";
import { areaBus, areaHooks } from "./areaBus";

export abstract class DynamicAreaEvent<
  P extends BasePlayer,
  A extends DynamicArea
> {
  private readonly areas = new Map<number, A>();
  private readonly players;

  constructor(playersMap: Map<number, P>) {
    this.players = playersMap;

    areaBus.on(areaHooks.created, (res: A) => {
      this.areas.set(res.id, res);
    });
    areaBus.on(areaHooks.destroyed, (res: A) => {
      if (this.areas.has(res.id)) this.areas.delete(res.id);
    });

    OnPlayerEnterDynamicArea((playerId, areaId) => {
      const p = this.players.get(playerId);
      if (!p) return 0;
      const a = this.areas.get(areaId);
      if (!a) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onPlayerEnter,
        "OnPlayerEnterDynamicArea"
      );
      return pFn(p, a);
    });
    OnPlayerLeaveDynamicArea((playerId, areaId) => {
      const p = this.players.get(playerId);
      if (!p) return 0;
      const a = this.areas.get(areaId);
      if (!a) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onPlayerLeave,
        "OnPlayerLeaveDynamicArea"
      );
      return pFn(p, a);
    });
  }

  protected abstract onPlayerEnter(player: P, area: A): TCommonCallback;
  protected abstract onPlayerLeave(player: P, area: A): TCommonCallback;
}
