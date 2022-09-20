import { CarModTypeEnum, LimitsEnum, VehicleModelInfoEnum } from "@/enums";
import type { TBasePos } from "@/types";
import type { IVehicle } from "@/interfaces";
import type { BasePlayer } from "../player";
import { logger } from "@/logger";
import { isValidPaintJob, isValidVehComponent } from "@/utils/vehicleUtils";
import { vehicleBus, vehicleHooks } from "./vehicleBus";
import * as vehFunc from "@/wrapper/functions";

export abstract class BaseVehicle {
  private _id = -1;
  private static createdCount = 0;
  private readonly sourceInfo: IVehicle;
  private readonly isStatic: boolean;
  public get id(): number {
    return this._id;
  }
  constructor(veh: IVehicle, isStatic = false) {
    this.sourceInfo = veh;
    this.isStatic = isStatic;
  }
  public create(): void {
    if (this.id !== -1)
      return logger.warn("[BaseVehicle]: Unable to create the vehicle again");
    if (BaseVehicle.createdCount === LimitsEnum.MAX_VEHICLES)
      return logger.warn(
        "[BaseVehicle]: Unable to continue to create vehicle, maximum allowable quantity has been reached"
      );
    const {
      modelid,
      x,
      y,
      z,
      z_angle,
      color1,
      color2,
      respawn_delay,
      addsiren,
    } = this.sourceInfo;
    if (this.isStatic) {
      if (respawn_delay === undefined) {
        this._id = vehFunc.AddStaticVehicle(
          modelid,
          x,
          y,
          z,
          z_angle,
          color1,
          color2
        );
        return;
      }
      this._id = vehFunc.AddStaticVehicleEx(
        modelid,
        x,
        y,
        z,
        z_angle,
        color1,
        color2,
        respawn_delay || -1,
        addsiren || false
      );
    } else {
      this._id = vehFunc.CreateVehicle(
        modelid,
        x,
        y,
        z,
        z_angle,
        color1,
        color2,
        respawn_delay || -1,
        addsiren || false
      );
    }
    BaseVehicle.createdCount++;
    vehicleBus.emit(vehicleHooks.created, this);
  }
  public destroy(): void {
    if (this.id === -1)
      return logger.warn(
        "[BaseVehicle]: Unable to destroy the vehicle before create"
      );
    vehFunc.DestroyVehicle(this.id);
    BaseVehicle.createdCount--;
    vehicleBus.emit(vehicleHooks.destroyed, this);
    this._id = -1;
  }
  public addComponent(componentid: number): number {
    if (this.id === -1) return 0;
    if (!isValidVehComponent(this.getModel(), componentid)) {
      logger.warn(
        `[BaseVehicle]: Invalid component id ${componentid} attempted to attach to the vehicle ${this}`
      );
      return 0;
    }
    return vehFunc.AddVehicleComponent(this.id, componentid);
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
    return vehFunc.RemoveVehicleComponent(this.id, componentid);
  }
  public getComponentInSlot(slot: CarModTypeEnum) {
    return vehFunc.GetVehicleComponentInSlot(this.id, slot);
  }
  public static getComponentType(component: number) {
    return vehFunc.GetVehicleComponentType(component);
  }
  public linkToInterior(interiorId: number): number {
    if (this.id === -1) return 0;
    return vehFunc.LinkVehicleToInterior(this.id, interiorId);
  }
  public setVirtualWorld(worldId: number): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleVirtualWorld(this.id, worldId);
  }
  public getVirtualWorld(): number {
    if (this.id === -1) return 0;
    return vehFunc.GetVehicleVirtualWorld(this.id);
  }
  public repair(): number {
    if (this.id === -1) return 0;
    return vehFunc.RepairVehicle(this.id);
  }
  public setPos(x: number, y: number, z: number): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehiclePos(this.id, x, y, z);
  }
  public getPos(): void | TBasePos {
    if (this.id === -1) return;
    return vehFunc.GetVehiclePos(this.id);
  }
  public getHealth(): number {
    if (this.id === -1) return 0;
    return vehFunc.GetVehicleHealth(this.id);
  }
  public setHealth(health: number): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleHealth(this.id, health);
  }
  public isPlayerIn<P extends BasePlayer>(player: P): boolean {
    if (this.id === -1) return false;
    return vehFunc.IsPlayerInVehicle(player.id, this.id);
  }
  public putPlayerIn<P extends BasePlayer>(player: P, seatid: number): number {
    if (this.id === -1) return 0;
    if (seatid < 0) return 0;
    if (seatid > 4) {
      logger.warn(
        "[BaseVehicle]: If the seat is invalid or is taken, will cause a crash when they EXIT the vehicle."
      );
    }
    return vehFunc.PutPlayerInVehicle(player.id, this.id, seatid);
  }
  public getZAngle(): number {
    if (this.id === -1) return 0;
    return vehFunc.GetVehicleZAngle(this.id);
  }
  public setZAngle(z_angle: number): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleZAngle(this.id, z_angle);
  }
  public setNumberPlate(numberplate: string): number {
    if (this.id === -1) return 0;
    if (numberplate.length < 1 || numberplate.length > 32) {
      logger.error(
        "[BaseVehicle]: The length of the number plate ranges from 32 characters"
      );
      return 0;
    }
    return vehFunc.SetVehicleNumberPlate(this.id, numberplate);
  }
  public static getPoolSize(): number {
    return vehFunc.GetVehiclePoolSize();
  }
  public changeColor(color1: string, color2: string): number {
    if (this.id === -1) return 0;
    return vehFunc.ChangeVehicleColor(this.id, color1, color2);
  }
  public setVelocity(X: number, Y: number, Z: number): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleVelocity(this.id, X, Y, Z);
  }
  public getVelocity(): void | TBasePos {
    if (this.id === -1) return;
    const [x, y, z] = vehFunc.GetVehicleVelocity(this.id);
    return { x, y, z };
  }
  public setAngularVelocity(X: number, Y: number, Z: number): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleAngularVelocity(this.id, X, Y, Z);
  }
  public getDamageStatus() {
    if (this.id === -1) return;
    return vehFunc.GetVehicleDamageStatus(this.id);
  }
  public updateDamageStatus(
    panels: number,
    doors: number,
    lights: number,
    tires: number
  ): void {
    if (this.id === -1) return;
    vehFunc.UpdateVehicleDamageStatus(this.id, panels, doors, lights, tires);
  }
  public getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return vehFunc.GetVehicleDistanceFromPoint(this.id, X, Y, Z);
  }
  public getModel(): number {
    return vehFunc.GetVehicleModel(this.id);
  }
  public static getModelInfo(
    vehiclemodel: number,
    infotype: VehicleModelInfoEnum
  ): TBasePos {
    return vehFunc.GetVehicleModelInfo(vehiclemodel, infotype);
  }
  public getModelInfo(infotype: VehicleModelInfoEnum): void | TBasePos {
    if (this.id === -1) return;
    return BaseVehicle.getModelInfo(this.getModel(), infotype);
  }
  public getRotationQuat() {
    if (this.id === -1) return;
    const [w, x, y, z] = vehFunc.GetVehicleRotationQuat(this.id);
    return { w, x, y, z };
  }
  public setRespawn(): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleToRespawn(this.id);
  }
  public isStreamedIn<P extends BasePlayer>(forplayer: P): boolean {
    if (this.id === -1) return false;
    return vehFunc.IsVehicleStreamedIn(this.id, forplayer.id);
  }
  public setParamsCarDoors(
    driver: boolean,
    passenger: boolean,
    backleft: boolean,
    backright: boolean
  ): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleParamsCarDoors(
      this.id,
      driver,
      passenger,
      backleft,
      backright
    );
  }
  public setParamsCarWindows(
    driver: boolean,
    passenger: boolean,
    backleft: boolean,
    backright: boolean
  ) {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleParamsCarWindows(
      this.id,
      driver,
      passenger,
      backleft,
      backright
    );
  }
  public getParamsCarDoors() {
    if (this.id === -1) return undefined;
    return vehFunc.GetVehicleParamsCarDoors(this.id);
  }
  public getParamsCarWindows() {
    if (this.id === -1) return undefined;
    return vehFunc.GetVehicleParamsCarWindows(this.id);
  }
  public setParamsEx(
    engine: boolean,
    lights: boolean,
    alarm: boolean,
    doors: boolean,
    bonnet: boolean,
    boot: boolean,
    objective: boolean
  ): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleParamsEx(
      this.id,
      engine,
      lights,
      alarm,
      doors,
      bonnet,
      boot,
      objective
    );
  }
  public getParamsEx() {
    if (this.id === -1) return undefined;
    const [engine, lights, alarm, doors, bonnet, boot, objective] =
      vehFunc.GetVehicleParamsEx(this.id);
    return { engine, lights, alarm, doors, bonnet, boot, objective };
  }
  public getParamsSirenState(): number {
    if (this.id === -1) return -2;
    return vehFunc.GetVehicleParamsSirenState(this.id);
  }
  public setParamsForPlayer<P extends BasePlayer>(
    player: P,
    objective: boolean,
    doorslocked: boolean
  ): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleParamsForPlayer(
      this.id,
      player.id,
      objective,
      doorslocked
    );
  }
  public isTrailerAttached(): boolean {
    if (this.id === -1) return false;
    return vehFunc.IsTrailerAttachedToVehicle(this.id);
  }
  public changePaintjob(paintjobid: 0 | 1 | 2): number {
    if (this.id === -1) return 0;
    if (!isValidPaintJob(this.getModel(), paintjobid)) return 0;
    this.changeColor("#fff", "#fff");
    vehFunc.ChangeVehiclePaintjob(this.id, paintjobid);
    return 1;
  }
  public attachTrailer<V extends BaseVehicle>(trailer: V): number {
    if (this.id === -1) return 0;
    return vehFunc.AttachTrailerToVehicle(trailer.id, this.id);
  }
  public detachTrailer() {
    if (this.id === -1) return;
    if (this.isTrailerAttached()) vehFunc.DetachTrailerFromVehicle(this.id);
  }
  public getTrailer<V extends BaseVehicle>(vehicles: Array<V>): V | undefined {
    if (this.id === -1) return;
    return vehicles.find((v) => v.id === vehFunc.GetVehicleTrailer(this.id));
  }
  public static isValid(vehicleId: number) {
    return vehFunc.IsValidVehicle(vehicleId);
  }
}
