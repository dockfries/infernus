import { BasePlayer, BasePlayerEvent } from "../player";
import { BaseVehicle } from "./baseVehicle";
import { vehicleBus, vehicleHooks } from "./vehicleBus";

export abstract class BaseVehicleEvent<
  P extends BasePlayer,
  E extends BasePlayerEvent<P>,
  V extends BaseVehicle
> {
  public readonly vehicles: Array<V> = [];
  private playerEvent: E;
  constructor(playerEvent: E) {
    this.playerEvent = playerEvent;
    // The class event is extended through the event bus
    vehicleBus.on(vehicleHooks.created, (veh: V) => {
      this.vehicles.push(veh);
    });
    vehicleBus.on(vehicleHooks.destroyed, (veh: V) => {
      const vIdx = this.vehicles.findIndex((v) => v === veh);
      if (vIdx === -1) return;
      this.vehicles.splice(vIdx, 1);
    });
  }
}
