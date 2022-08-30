import { OnVehicleDamageStatusUpdate } from "@/wrapper/callbacks";
import { BasePlayer } from "../player";

export class BaseVehicleEvent<T extends BasePlayer> {
  private id = -1;
  constructor(player: T) {
    OnVehicleDamageStatusUpdate((vehicleid: number, playerid: number) => {
      if (playerid === player.id && vehicleid === this.id)
        this.onDamageStatusUpdate(player);
    });
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */

  protected onDamageStatusUpdate(player: T) {}

  /* eslint-disable @typescript-eslint/no-unused-vars */
}
