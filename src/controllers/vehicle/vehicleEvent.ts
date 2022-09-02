// import { OnVehicleDamageStatusUpdate } from "@/wrapper/callbacks";
import { BasePlayer } from "../player";
import { BaseVehicle } from "./baseVehicle";

abstract class VehicleEvent<V extends BaseVehicle, P extends BasePlayer> {
  protected abstract onDamageStatusUpdate(vehicle: V, player: P): void;
}

// Need a way to get an array of all players of the specified player event class
export abstract class BaseVehicleEvent<
  V extends BaseVehicle,
  P extends BasePlayer
> extends VehicleEvent<V, P> {
  constructor() {
    super();
    // OnVehicleDamageStatusUpdate((vehicleid: number, playerid: number) => {
    // const veh: BaseVehicle = this.vehicles.find((v) => v.id === vehicle.id);
    // const player: BasePlayer = players.find.....
    //   this.onDamageStatusUpdate(veh, player);
    // });
  }
}
