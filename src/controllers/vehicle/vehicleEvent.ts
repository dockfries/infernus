// import { OnVehicleDamageStatusUpdate } from "@/wrapper/callbacks";
import { BasePlayer } from "../player";
import { BaseVehicle } from "./baseVehicle";

abstract class VehicleEvent<V extends BaseVehicle, P extends BasePlayer> {
  protected players: Array<P>;
  constructor(players: Array<P>) {
    this.players = players;
  }
  protected abstract onDamageStatusUpdate(vehicle: V, player: P): void;
}

export abstract class BaseVehicleEvent<
  V extends BaseVehicle,
  P extends BasePlayer
> extends VehicleEvent<V, P> {
  // Need a way to get an array of all players of the specified player event class
  constructor(players: Array<P>) {
    super(players);
    // OnVehicleDamageStatusUpdate((vehicleid: number, playerid: number) => {
    // const veh: BaseVehicle = this.vehicles.find((v) => v.id === vehicleid);
    // const player: BasePlayer = this.players.find((p) => p.id === playerid);
    //   this.onDamageStatusUpdate(veh, player);
    // });
  }
}
