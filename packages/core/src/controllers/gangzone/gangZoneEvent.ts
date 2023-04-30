import type { ICommonGangZoneKey } from "@/interfaces";
import type { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import { OnGameModeExit } from "@/wrapper/native/callbacks";
import {
  OnPlayerEnterGangZone,
  OnPlayerEnterPlayerGangZone,
  OnPlayerLeaveGangZone,
  OnPlayerLeavePlayerGangZone,
} from "@infernus/wrapper";
import type { Player } from "../player";
import type { GangZone } from "./baseGangZone";
import { gangZoneBus, gangZoneHooks } from "./gangZoneBus";

export class GangZoneEvent<P extends Player, G extends GangZone<P>> {
  readonly gangZones = new Map<ICommonGangZoneKey, G>();
  private readonly players;
  constructor(playersMap: Map<number, P>, destroyOnExit = true) {
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
    if (destroyOnExit) {
      OnGameModeExit(() => {
        this.gangZones.forEach((g) => g.destroy());
        this.gangZones.clear();
      });
    }

    OnPlayerEnterGangZone((playerId, gangZoneId): number => {
      const p = this.players.get(playerId);
      if (!p) return 0;
      const g = this.gangZones.get({ id: gangZoneId, global: true });
      if (!g) return 0;
      const pFn = promisifyCallback(
        this,
        "onPlayerEnter",
        "OnPlayerEnterGangZone"
      );
      return pFn(p, g);
    });

    OnPlayerEnterPlayerGangZone((playerId, gangZoneId): number => {
      const p = this.players.get(playerId);
      if (!p) return 0;
      const g = this.gangZones.get({ id: gangZoneId, global: false });
      if (!g) return 0;
      const pFn = promisifyCallback(
        this,
        "onPlayerEnter",
        "OnPlayerEnterPlayerGangZone"
      );
      return pFn(p, g);
    });

    OnPlayerLeaveGangZone((playerId, gangZoneId): number => {
      const p = this.players.get(playerId);
      if (!p) return 0;
      const g = this.gangZones.get({ id: gangZoneId, global: true });
      if (!g) return 0;
      const pFn = promisifyCallback(
        this,
        "onPlayerLeave",
        "OnPlayerLeaveGangZone"
      );
      return pFn(p, g);
    });

    OnPlayerLeavePlayerGangZone((playerId, gangZoneId): number => {
      const p = this.players.get(playerId);
      if (!p) return 0;
      const g = this.gangZones.get({ id: gangZoneId, global: false });
      if (!g) return 0;
      const pFn = promisifyCallback(
        this,
        "onPlayerLeave",
        "OnPlayerLeavePlayerGangZone"
      );
      return pFn(p, g);
    });
  }

  onPlayerEnter?(player: P, gangZone: G): TCommonCallback;
  onPlayerLeave?(player: P, gangZone: G): TCommonCallback;
}
