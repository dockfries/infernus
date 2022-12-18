import { IBelongsToEvent, ICommonGangZoneKey } from "@/interfaces";
import { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import { OnGameModeExit } from "@/wrapper/native/callbacks";
import {
  OnPlayerEnterGangZone,
  OnPlayerEnterPlayerGangZone,
  OnPlayerLeaveGangZone,
  OnPlayerLeavePlayerGangZone,
} from "omp-wrapper";
import { BasePlayer } from "../player";
import { BaseGangZone } from "./baseGangZone";

export abstract class BaseGangZoneEvent<
  P extends BasePlayer = any,
  G extends BaseGangZone<P> = any
> implements IBelongsToEvent<G>
{
  public readonly gangZones = new Map<ICommonGangZoneKey, G>();
  private readonly destroyOnExit: boolean;
  private readonly players;

  constructor(playersMap: Map<number, P>, destroyOnExit = true) {
    this.players = playersMap;
    this.destroyOnExit = destroyOnExit;

    if (this.destroyOnExit) {
      OnGameModeExit(() => {
        this.gangZones.forEach((g) => {
          this._onDestroyed(g, false);
          this._onDestroyed(g, true);
        });
        this.gangZones.clear();
      });
    }

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

  public _onCreated(gz: G, isGlobal: boolean) {
    this.gangZones.set({ id: gz.id, global: isGlobal }, gz);
  }

  public _onDestroyed(gz: G, isGlobal: boolean) {
    this.gangZones.delete({ id: gz.id, global: isGlobal });
  }

  protected abstract onPlayerEnter(player: P, gangZone: G): TCommonCallback;
  protected abstract onPlayerLeave(player: P, gangZone: G): TCommonCallback;
}
