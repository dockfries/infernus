import { LimitsEnum } from "@/enums";
import logger from "@/logger";
import { IsValidVehComponent } from "@/utils/vehicleUtils";
import {
  AddVehicleComponent,
  CreateVehicle,
  DestroyVehicle,
} from "@/wrapper/functions";
import { vehicleBus, vehicleHooks } from "./vehicleBus";

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
  private static createdCount = 0;
  private _id = -1;
  private info: IVehicle;
  public get id(): number {
    return this._id;
  }
  constructor(veh: IVehicle) {
    this.info = veh;
  }
  public create(): void {
    if (this.id !== -1)
      return logger.warn("[BaseVehicle]: Unable to create the vehicle again");
    if (BaseVehicle.createdCount === LimitsEnum.MAX_VEHICLES)
      return logger.warn(
        "[BaseVehicle]: Unable to continue to create vehicle, maximum allowable quantity has been reached"
      );
    const {
      vehicletype,
      x,
      y,
      z,
      rotation,
      color1,
      color2,
      respawn_delay,
      addsiren,
    } = this.info;
    this._id = CreateVehicle(
      vehicletype,
      x,
      y,
      z,
      rotation,
      color1,
      color2,
      respawn_delay || -1,
      addsiren || 0
    );
    BaseVehicle.createdCount++;
    vehicleBus.emit(vehicleHooks.created, this);
  }
  public destroy(): void {
    if (this.id === -1)
      return logger.warn(
        "[BaseVehicle]: Unable to destroy the vehicle before create"
      );
    DestroyVehicle(this.id);
    BaseVehicle.createdCount--;
    vehicleBus.emit(vehicleHooks.created, this);
    this._id = -1;
  }
  public addComponent(componentid: number): number | undefined {
    if (this.id !== -1) return;
    if (!IsValidVehComponent(this.info.vehicletype, componentid)) {
      logger.warn(
        `[BaseVehicle]: Invalid component id ${componentid} attempted to attach to the vehicle ${this}`
      );
      return;
    }
    return AddVehicleComponent(this.id, componentid);
  }
}
