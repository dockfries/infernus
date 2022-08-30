import { OnVehicleDamageStatusUpdate } from "@/wrapper/callbacks";
import { BasePlayer } from "./player";

export class BaseVehicle<T extends BasePlayer> {
  constructor() {
    OnVehicleDamageStatusUpdate((vehicleid: number, playerid: number) => {
      this.OnDamageStatusUpdate();
    });
  }
  protected OnDamageStatusUpdate(player: T) {}
}

// class CommonPlayer extends BasePlayer {

// }

// class B extends BaseVehicle<CommonPlayer>{
//   protected OnDamageStatusUpdate(player: CommonPlayer): void {

//   }
// }
