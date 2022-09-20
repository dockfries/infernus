import type { BasePlayer } from "@/controllers/player";
import { OnPlayerPickUpDynamicPickup } from "omp-wrapper-streamer";
import { DynamicPickup } from "./basePickup";
import { pickupBus, pickupHooks } from "./pickupBus";

export abstract class DynamicPickupEvent<
  P extends BasePlayer,
  K extends DynamicPickup
> {
  public readonly pickups = new Map<number, K>();
  private readonly players;

  constructor(playersMap: Map<number, P>) {
    this.players = playersMap;
    pickupBus.on(pickupHooks.created, (pickup: K) => {
      this.pickups.set(pickup.id, pickup);
    });
    pickupBus.on(pickupHooks.destroyed, (pickup: K) => {
      this.pickups.delete(pickup.id);
    });
    OnPlayerPickUpDynamicPickup(
      (playerid: number, pickupid: number): number => {
        const k = this.pickups.get(pickupid);
        if (!k) return 0;
        const p = this.players.get(playerid);
        if (!p) return 0;
        return this.onPlayerPickUp(p, k);
      }
    );
  }

  protected abstract onPlayerPickUp(player: P, pickup: K): number;

  public getPickupsArr(): Array<K> {
    return [...this.pickups.values()];
  }
}
