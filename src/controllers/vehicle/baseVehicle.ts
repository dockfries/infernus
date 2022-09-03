import logger from "@/logger";
import { IsValidVehComponent } from "@/utils/vehicleUtils";
import {
  AddVehicleComponent,
  CreateVehicle,
  DestroyVehicle,
} from "@/wrapper/functions";

export interface IVehicle {
  vehicletype: number;
  x: number;
  y: number;
  z: number;
  rotation: number;
  color1: number;
  color2: number;
  respawn_delay?: number;
  addsiren?: number;
}

export abstract class BaseVehicle {
  private _id = -1;
  private info: IVehicle;
  public get id(): number {
    return this._id;
  }
  constructor(veh: IVehicle) {
    this._id = CreateVehicle(
      veh.vehicletype,
      veh.x,
      veh.y,
      veh.z,
      veh.rotation,
      veh.color1,
      veh.color2,
      veh.respawn_delay || -1,
      veh.addsiren || 0
    );
    this.info = veh;
  }
  public destroy(): void {
    DestroyVehicle(this.id);
    this._id = -1;
  }
  public addComponent(componentid: number): number {
    if (!IsValidVehComponent(this.info.vehicletype, componentid)) {
      logger.warn(
        `[BaseVehicle]: Invalid component id ${componentid} attempted to attach to the vehicle ${this}`
      );
      return -1;
    }
    return AddVehicleComponent(this.id, componentid);
  }
}
