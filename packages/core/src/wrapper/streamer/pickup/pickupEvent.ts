import type { Player } from "@/controllers/player";
import type { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import { OnGameModeExit } from "@/wrapper/native/callbacks";
import {
  OnPlayerPickUpDynamicPickup,
  StreamerItemTypes,
} from "@infernus/streamer";
import { Streamer } from "../common";
import type { DynamicPickup } from "./basePickup";
import { pickupBus, pickupHooks } from "./pickupBus";

export class DynamicPickupEvent<P extends Player, K extends DynamicPickup> {
  private readonly pickups = new Map<number, K>();
  private readonly players;

  constructor(playersMap: Map<number, P>, destroyOnExit = true) {
    this.players = playersMap;
    pickupBus.on(pickupHooks.created, (pickup: K) => {
      this.pickups.set(pickup.id, pickup);
    });
    pickupBus.on(pickupHooks.destroyed, (pickup: K) => {
      this.pickups.delete(pickup.id);
    });
    if (destroyOnExit) {
      OnGameModeExit(() => {
        this.pickups.forEach((p) => p.destroy());
        this.pickups.clear();
      });
    }
    OnPlayerPickUpDynamicPickup(
      (playerid: number, pickupid: number): number => {
        const k = this.pickups.get(pickupid);
        if (!k) return 0;
        const p = this.players.get(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback(
          this,
          "onPlayerPickUp",
          "OnPlayerPickUpDynamicPickup"
        );
        return pFn(p, k);
      }
    );
    Streamer.onItemStreamIn((type, item, player) => {
      if (type === StreamerItemTypes.PICKUP) {
        const pk = this.pickups.get(item);
        const p = this.players.get(player);
        if (pk && p)
          return promisifyCallback(
            this,
            "onStreamIn",
            "Streamer_OnItemStreamIn"
          )(pk, p);
      }
      return 1;
    });
    Streamer.onItemStreamOut((type, item, player) => {
      if (type === StreamerItemTypes.PICKUP) {
        const pk = this.pickups.get(item);
        const p = this.players.get(player);
        if (pk && p)
          return promisifyCallback(
            this,
            "onStreamOut",
            "Streamer_OnItemStreamOut"
          )(pk, p);
      }
      return 1;
    });
  }

  onPlayerPickUp?(player: P, pickup: K): TCommonCallback;
  onStreamIn?(pickup: K, player: P): TCommonCallback;
  onStreamOut?(pickup: K, player: P): TCommonCallback;

  getPickupsArr(): Array<K> {
    return [...this.pickups.values()];
  }

  getPickupsMap(): Map<number, K> {
    return this.pickups;
  }
}
