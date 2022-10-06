import { ICommonGangZoneKey } from "@/interfaces";
import { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import {
  OnPlayerEnterGangZone,
  OnPlayerEnterPlayerGangZone,
  OnPlayerLeaveGangZone,
  OnPlayerLeavePlayerGangZone,
} from "omp-wrapper";
import { BasePlayer } from "../player";
import { BaseGangZone } from "./baseGangZone";
import { gangZoneBus, gangZoneHooks } from "./gangZoneBus";

export abstract class BaseGangZoneEvent<
  P extends BasePlayer,
  G extends BaseGangZone<P>
> {
  public readonly gangZones = new Map<ICommonGangZoneKey, G>();
  private readonly players;
  constructor(playersMap: Map<number, P>) {
    this.players = playersMap;
    gangZoneBus.on(
      gangZoneHooks.created,
      (res: { key: ICommonGangZoneKey; value: G }) => {
        this.gangZones.set(res.key, res.value);
      }
    );
    gangZoneBus.on(gangZoneHooks.destroyed, (res: ICommonGangZoneKey) => {
      if (this.gangZones.has(res)) this.gangZones.delete(res);
    });

    OnPlayerEnterGangZone((playerId, gangZoneId): number => {
      const p = this.players.get(playerId);
      if (!p) return 0;
      const g = this.gangZones.get({ id: gangZoneId, global: true });
      if (!g) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onPlayerEnter,
        "OnPlayerEnterGangZone"
      );
      return pFn(p, g);
    });

    OnPlayerEnterPlayerGangZone((playerId, gangZoneId): number => {
      const p = this.players.get(playerId);
      if (!p) return 0;
      const g = this.gangZones.get({ id: gangZoneId, global: false });
      if (!g) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onPlayerEnter,
        "OnPlayerEnterPlayerGangZone"
      );
      return pFn(p, g);
    });

    OnPlayerLeaveGangZone((playerId, gangZoneId): number => {
      const p = this.players.get(playerId);
      if (!p) return 0;
      const g = this.gangZones.get({ id: gangZoneId, global: true });
      if (!g) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onPlayerLeave,
        "OnPlayerLeaveGangZone"
      );
      return pFn(p, g);
    });

    OnPlayerLeavePlayerGangZone((playerId, gangZoneId): number => {
      const p = this.players.get(playerId);
      if (!p) return 0;
      const g = this.gangZones.get({ id: gangZoneId, global: false });
      if (!g) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onPlayerLeave,
        "OnPlayerLeavePlayerGangZone"
      );
      return pFn(p, g);
    });
  }

  protected abstract onPlayerEnter(player: P, gangZone: G): TCommonCallback;
  protected abstract onPlayerLeave(player: P, gangZone: G): TCommonCallback;
}
