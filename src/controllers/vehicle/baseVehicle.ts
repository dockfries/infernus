import { CarModTypeEnum, LimitsEnum, VehicleModelInfoEnum } from "@/enums";
import { logger } from "@/logger";
import { basePos } from "@/types";
import { isValidPaintJob, isValidVehComponent } from "@/utils/vehicleUtils";
import {
  AddVehicleComponent,
  ChangeVehicleColor,
  CreateVehicle,
  DestroyVehicle,
  GetVehicleComponentInSlot,
  GetVehicleComponentType,
  GetVehicleDamageStatus,
  GetVehicleDistanceFromPoint,
  GetVehicleHealth,
  GetVehicleModel,
  GetVehicleModelInfo,
  GetVehicleParamsCarDoors,
  GetVehicleParamsCarWindows,
  GetVehicleParamsEx,
  GetVehicleParamsSirenState,
  GetVehiclePoolSize,
  GetVehiclePos,
  GetVehicleRotationQuat,
  GetVehicleVelocity,
  GetVehicleVirtualWorld,
  GetVehicleZAngle,
  IsPlayerInVehicle,
  IsTrailerAttachedToVehicle,
  IsVehicleStreamedIn,
  LinkVehicleToInterior,
  PutPlayerInVehicle,
  RemoveVehicleComponent,
  RepairVehicle,
  SetVehicleAngularVelocity,
  SetVehicleHealth,
  SetVehicleNumberPlate,
  SetVehicleParamsCarDoors,
  SetVehicleParamsCarWindows,
  SetVehicleParamsEx,
  SetVehicleParamsForPlayer,
  SetVehiclePos,
  SetVehicleToRespawn,
  SetVehicleVelocity,
  SetVehicleVirtualWorld,
  SetVehicleZAngle,
  UpdateVehicleDamageStatus,
  ChangeVehiclePaintjob,
  DetachTrailerFromVehicle,
  AttachTrailerToVehicle,
  GetVehicleTrailer,
  IsValidVehicle,
  AddStaticVehicleEx,
  AddStaticVehicle,
} from "@/wrapper/functions";
import { BasePlayer } from "../player";
import { vehicleBus, vehicleHooks } from "./vehicleBus";

export interface IVehicle {
  modelid: number;
  x: number;
  y: number;
  z: number;
  z_angle: number;
  color1: string;
  color2: string;
  respawn_delay?: number;
  addsiren?: boolean;
}

export abstract class BaseVehicle {
  private static createdCount = 0;
  private _id = -1;
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
        this._id = AddStaticVehicle(modelid, x, y, z, z_angle, color1, color2);
        return;
      }
      this._id = AddStaticVehicleEx(
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
      this._id = CreateVehicle(
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
    DestroyVehicle(this.id);
    BaseVehicle.createdCount--;
    vehicleBus.emit(vehicleHooks.created, this);
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
  public getDamageStatus() {
    if (this.id === -1) return;
    return GetVehicleDamageStatus(this.id);
  }
  public updateDamageStatus(
    panels: number,
    doors: number,
    lights: number,
    tires: number
  ): void {
    if (this.id === -1) return;
    UpdateVehicleDamageStatus(this.id, panels, doors, lights, tires);
  }
  public getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return GetVehicleDistanceFromPoint(this.id, X, Y, Z);
  }
  public getModel(): number {
    return GetVehicleModel(this.id);
  }
  public static getModelInfo(
    vehiclemodel: number,
    infotype: VehicleModelInfoEnum
  ): basePos {
    return GetVehicleModelInfo(vehiclemodel, infotype);
  }
  public getModelInfo(infotype: VehicleModelInfoEnum): void | basePos {
    if (this.id === -1) return;
    return BaseVehicle.getModelInfo(this.getModel(), infotype);
  }
  public getRotationQuat() {
    if (this.id === -1) return;
    const [w, x, y, z] = GetVehicleRotationQuat(this.id);
    return { w, x, y, z };
  }
  public setRespawn(): number {
    if (this.id === -1) return 0;
    return SetVehicleToRespawn(this.id);
  }
  public isStreamedIn<P extends BasePlayer>(forplayer: P): boolean {
    if (this.id === -1) return false;
    return IsVehicleStreamedIn(this.id, forplayer.id);
  }
  public setParamsCarDoors(
    driver: boolean,
    passenger: boolean,
    backleft: boolean,
    backright: boolean
  ): number {
    if (this.id === -1) return 0;
    return SetVehicleParamsCarDoors(
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
    return SetVehicleParamsCarWindows(
      this.id,
      driver,
      passenger,
      backleft,
      backright
    );
  }
  public getParamsCarDoors() {
    if (this.id === -1) return undefined;
    return GetVehicleParamsCarDoors(this.id);
  }
  public getParamsCarWindows() {
    if (this.id === -1) return undefined;
    return GetVehicleParamsCarWindows(this.id);
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
    return SetVehicleParamsEx(
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
      GetVehicleParamsEx(this.id);
    return { engine, lights, alarm, doors, bonnet, boot, objective };
  }
  public getParamsSirenState(): number {
    if (this.id === -1) return -2;
    return GetVehicleParamsSirenState(this.id);
  }
  public setParamsForPlayer<P extends BasePlayer>(
    player: P,
    objective: boolean,
    doorslocked: boolean
  ): number {
    if (this.id === -1) return 0;
    return SetVehicleParamsForPlayer(
      this.id,
      player.id,
      objective,
      doorslocked
    );
  }
  public isTrailerAttached(): boolean {
    if (this.id === -1) return false;
    return IsTrailerAttachedToVehicle(this.id);
  }
  public changePaintjob(paintjobid: 0 | 1 | 2): number {
    if (this.id === -1) return 0;
    if (!isValidPaintJob(this.getModel(), paintjobid)) return 0;
    this.changeColor("#fff", "#fff");
    ChangeVehiclePaintjob(this.id, paintjobid);
    return 1;
  }
  public attachTrailer<V extends BaseVehicle>(trailer: V): number {
    if (this.id === -1) return 0;
    return AttachTrailerToVehicle(trailer.id, this.id);
  }
  public detachTrailer() {
    if (this.id === -1) return;
    if (this.isTrailerAttached()) DetachTrailerFromVehicle(this.id);
  }
  public getTrailer<V extends BaseVehicle>(vehicles: Array<V>): V | undefined {
    if (this.id === -1) return;
    return vehicles.find((v) => v.id === GetVehicleTrailer(this.id));
  }
  public static isValid(vehicleId: number) {
    return IsValidVehicle(vehicleId);
  }
}
