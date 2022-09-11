import { CarModTypeEnum, LimitsEnum } from "@/enums";
import logger from "@/logger";
import { basePos } from "@/types";
import { IsValidVehComponent } from "@/utils/vehicleUtils";
import {
  AddVehicleComponent,
  ChangeVehicleColor,
  CreateVehicle,
  DestroyVehicle,
  GetVehicleComponentInSlot,
  GetVehicleComponentType,
  GetVehicleHealth,
  GetVehiclePoolSize,
  GetVehiclePos,
  GetVehicleVelocity,
  GetVehicleVirtualWorld,
  GetVehicleZAngle,
  IsPlayerInVehicle,
  LinkVehicleToInterior,
  PutPlayerInVehicle,
  RemoveVehicleComponent,
  RepairVehicle,
  SetVehicleAngularVelocity,
  SetVehicleHealth,
  SetVehicleNumberPlate,
  SetVehiclePos,
  SetVehicleVelocity,
  SetVehicleVirtualWorld,
  SetVehicleZAngle,
} from "@/wrapper/functions";
import { BasePlayer } from "../player";
import { vehicleBus, vehicleHooks } from "./vehicleBus";

export interface IVehicle {
  vehicletype: number;
  x: number;
  y: number;
  z: number;
  rotation: number;
  color1: string;
  color2: string;
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
  public addComponent(componentid: number): number {
    if (this.id === -1) return 0;
    if (!IsValidVehComponent(this.info.vehicletype, componentid)) {
      logger.warn(
        `[BaseVehicle]: Invalid component id ${componentid} attempted to attach to the vehicle ${this}`
      );
      return 0;
    }
    return AddVehicleComponent(this.id, componentid);
  }
  public removeComponent(componentid: number): number {
    if (
      this.getComponentInSlot(BaseVehicle.getComponentType(componentid)) === 0
    ) {
      logger.warn(
        `[BaseVehicle]: component id ${componentid} does not exist on this vehicle`
      );
      return 0;
    }
    return RemoveVehicleComponent(this.id, componentid);
  }
  public getComponentInSlot(slot: CarModTypeEnum) {
    return GetVehicleComponentInSlot(this.id, slot);
  }
  public static getComponentType(component: number) {
    return GetVehicleComponentType(component);
  }
  public linkToInterior(interiorId: number): number {
    if (this.id === -1) return 0;
    return LinkVehicleToInterior(this.id, interiorId);
  }
  public setVirtualWorld(worldId: number): number {
    if (this.id === -1) return 0;
    return SetVehicleVirtualWorld(this.id, worldId);
  }
  public getVirtualWorld(): number {
    if (this.id === -1) return 0;
    return GetVehicleVirtualWorld(this.id);
  }
  public repair(): number {
    if (this.id === -1) return 0;
    return RepairVehicle(this.id);
  }
  public setPos(x: number, y: number, z: number): number {
    if (this.id === -1) return 0;
    return SetVehiclePos(this.id, x, y, z);
  }
  public getPos(): void | basePos {
    if (this.id === -1) return;
    return GetVehiclePos(this.id);
  }
  public getHealth(): number {
    if (this.id === -1) return 0;
    return GetVehicleHealth(this.id);
  }
  public setHealth(health: number): number {
    if (this.id === -1) return 0;
    return SetVehicleHealth(this.id, health);
  }
  public isPlayerIn<P extends BasePlayer>(player: P): boolean {
    if (this.id === -1) return false;
    return IsPlayerInVehicle(player.id, this.id);
  }
  public putPlayerIn<P extends BasePlayer>(player: P, seatid: number): number {
    if (this.id === -1) return 0;
    if (seatid < 0) return 0;
    if (seatid > 4) {
      logger.warn(
        "[BaseVehicle]: If the seat is invalid or is taken, will cause a crash when they EXIT the vehicle."
      );
    }
    return PutPlayerInVehicle(player.id, this.id, seatid);
  }
  public getZAngle(): number {
    if (this.id === -1) return 0;
    return GetVehicleZAngle(this.id);
  }
  public setZAngle(z_angle: number): number {
    if (this.id === -1) return 0;
    return SetVehicleZAngle(this.id, z_angle);
  }
  public setNumberPlate(numberplate: string): number {
    if (this.id === -1) return 0;
    if (numberplate.length < 1 || numberplate.length > 32) {
      logger.error(
        "[BaseVehicle]: The length of the number plate ranges from 32 characters"
      );
      return 0;
    }
    return SetVehicleNumberPlate(this.id, numberplate);
  }
  public static getPoolSize(): number {
    return GetVehiclePoolSize();
  }
  public changeColor(color1: string, color2: string): number {
    if (this.id === -1) return 0;
    this.info.color1 = color1;
    this.info.color2 = color2;
    return ChangeVehicleColor(this.id, color1, color2);
  }
  public setVelocity(X: number, Y: number, Z: number): number {
    if (this.id === -1) return 0;
    return SetVehicleVelocity(this.id, X, Y, Z);
  }
  public getVelocity(): void | basePos {
    if (this.id === -1) return;
    const [x, y, z] = GetVehicleVelocity(this.id);
    return { x, y, z };
  }
  public setAngularVelocity(X: number, Y: number, Z: number): number {
    if (this.id === -1) return 0;
    return SetVehicleAngularVelocity(this.id, X, Y, Z);
  }
}
