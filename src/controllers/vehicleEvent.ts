import { OnVehicleDamageStatusUpdate } from "@/wrapper/callbacks";
import { BasePlayer } from "./player";

export class BaseVehicle<T extends BasePlayer> {
  private id = -1;
  constructor(player: T) {
    OnVehicleDamageStatusUpdate((vehicleid: number, playerid: number) => {
      if (playerid === player.id && vehicleid === this.id)
        this.onDamageStatusUpdate(player);
    });
  }
  protected onDamageStatusUpdate(player: T) {}
}
