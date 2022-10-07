import { CarModTypeEnum, LimitsEnum, VehicleModelInfoEnum } from "@/enums";
import type { TBasePos } from "@/types";
import type { IVehicle } from "@/interfaces";
import type { BasePlayer } from "../player";
import { logger } from "@/logger";
import { isValidPaintJob, isValidVehComponent } from "@/utils/vehicleUtils";
import { vehicleBus, vehicleHooks } from "./vehicleBus";
import * as vehFunc from "@/wrapper/functions";

import { rgba } from "@/utils/colorUtils";
import {
  GetVehicleMatrix,
  GetVehicleTrainSpeed,
  GetVehicleHydraReactorAngle,
  GetVehicleLandingGearState,
  GetVehicleSirenState,
  GetVehicleModelsUsed,
  GetVehicleDriver,
  GetVehicleLastDriver,
  GetVehicleModelCount,
  IsVehicleSirenEnabled,
  ToggleVehicleSirenEnabled,
  IsVehicleDead,
  GetVehicleRespawnTick,
  IsVehicleOccupied,
  HasVehicleBeenOccupied,
  GetVehicleOccupiedTick,
  GetVehicleCab,
  GetVehicleTower,
  GetVehicleRespawnDelay,
  SetVehicleRespawnDelay,
  GetVehicleNumberPlate,
  GetVehicleInterior,
  GetVehiclePaintjob,
  GetVehicleColor,
  SetVehicleSpawnInfo,
  GetVehicleSpawnInfo,
} from "omp-wrapper";

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
    if (!/^[a-zA-Z0-9]+$/.test(numberplate)) {
      logger.error(
        "[BaseVehicle]: number plates only allow letters and numbers"
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
  public isValid(): boolean {
    return vehFunc.IsValidVehicle(this.id);
  }
  public getMatrix() {
    if (this.id === -1) return;
    return GetVehicleMatrix(this.id);
  }
  public getTrainSpeed(): number {
    if (this.id === -1) return 0;
    return GetVehicleTrainSpeed(this.id);
  }
  public getHydraReactorAngle(): number {
    if (this.id === -1) return 0;
    return GetVehicleHydraReactorAngle(this.id);
  }
  public getLandingGearState(): number {
    if (this.id === -1) return 0;
    return GetVehicleLandingGearState(this.id);
  }
  public getSirenState(): number {
    if (this.id === -1) return 0;
    return GetVehicleSirenState(this.id);
  }
  public static getModelsUsed = GetVehicleModelsUsed;
  public getDriver<P extends BasePlayer>(
    players: Map<number, P>
  ): P | undefined {
    if (this.id === -1) return;
    return players.get(GetVehicleDriver(this.id));
  }
  public getLastDriver<P extends BasePlayer>(
    players: Map<number, P>
  ): P | undefined {
    if (this.id === -1) return;
    return players.get(GetVehicleLastDriver(this.id));
  }
  public static getModelCount = GetVehicleModelCount;
  public isSirenEnabled(): boolean {
    return IsVehicleSirenEnabled(this.id);
  }
  public toggleSirenEnabled(enabled: boolean): number {
    if (this.id === -1) return 0;
    return ToggleVehicleSirenEnabled(this.id, enabled);
  }
  public isDead(): boolean {
    if (this.id === -1) return true;
    return IsVehicleDead(this.id);
  }
  public getRespawnTick(): number {
    if (this.id === -1) return 0;
    return GetVehicleRespawnTick(this.id);
  }
  public isOccupied(): boolean {
    if (this.id === -1) return false;
    return IsVehicleOccupied(this.id);
  }
  public hasBeenOccupied(): boolean {
    if (this.id === -1) return false;
    return HasVehicleBeenOccupied(this.id);
  }
  public getOccupiedTick(): number {
    if (this.id === -1) return 0;
    return GetVehicleOccupiedTick(this.id);
  }
  public getCab(): number {
    if (this.id === -1) return 0;
    return GetVehicleCab(this.id);
  }
  public getTower(): number {
    if (this.id === -1) return 0;
    return GetVehicleTower(this.id);
  }
  public getRespawnDelay(): number {
    if (this.id === -1) return 0;
    return GetVehicleRespawnDelay(this.id);
  }
  public setRespawnDelay(delay: number): number {
    if (this.id === -1) return 0;
    return SetVehicleRespawnDelay(this.id, delay);
  }
  public getNumberPlate(): string {
    if (this.id === -1) return "";
    return GetVehicleNumberPlate(this.id);
  }
  public getInterior(): number {
    if (this.id === -1) return 0;
    return GetVehicleInterior(this.id);
  }
  public getPaintjob(): number {
    if (this.id === -1) return -1;
    return GetVehiclePaintjob(this.id);
  }
  public getColor() {
    if (this.id === -1) return;
    return GetVehicleColor(this.id);
  }
  public setSpawnInfo(
    modelid: number,
    fX: number,
    fY: number,
    fZ: number,
    fAngle: number,
    color1: string,
    color2: string,
    respawntime = -2,
    interior = -2
  ): number {
    if (this.id === -1) return 0;
    return SetVehicleSpawnInfo(
      this.id,
      modelid,
      fX,
      fY,
      fZ,
      fAngle,
      rgba(color1),
      rgba(color2),
      respawntime,
      interior
    );
  }
  public getSpawnInfo() {
    if (this.id === -1) return;
    return GetVehicleSpawnInfo(this.id);
  }
}
