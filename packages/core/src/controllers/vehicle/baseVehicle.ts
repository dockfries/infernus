import type { CarModTypeEnum, VehicleModelInfoEnum } from "core/enums";
import { LimitsEnum } from "core/enums";
import type { TPos } from "core/types";
import type { IVehicle } from "core/interfaces";
import type { Player } from "../player";
import { logger } from "core/logger";
import { isValidPaintJob, isValidVehComponent } from "core/utils/vehicleUtils";
import { vehicleBus, vehicleHooks } from "./vehicleBus";
import * as vehFunc from "core/wrapper/native/functions";

import { rgba } from "core/utils/colorUtils";
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
  GetVehicleRespawnDelay,
  SetVehicleRespawnDelay,
  GetVehicleNumberPlate,
  GetVehicleInterior,
  GetVehiclePaintjob,
  GetVehicleColours,
  SetVehicleSpawnInfo,
  GetVehicleSpawnInfo,
} from "@infernus/wrapper";

export class Vehicle {
  private _id = -1;
  private static createdCount = 0;
  private readonly sourceInfo: IVehicle;
  private readonly isStatic: boolean;
  get id(): number {
    return this._id;
  }
  constructor(veh: IVehicle, isStatic = false) {
    this.sourceInfo = veh;
    this.isStatic = isStatic;
  }
  create(ignoreRange = false): void {
    if (this.id !== -1)
      return logger.warn("[Vehicle]: Unable to create the vehicle again");
    if (Vehicle.createdCount === LimitsEnum.MAX_VEHICLES)
      return logger.warn(
        "[Vehicle]: Unable to continue to create vehicle, maximum allowable quantity has been reached"
      );
    const {
      modelid,
      x,
      y,
      z,
      z_angle,
      colour1,
      colour2,
      respawn_delay,
      addsiren,
    } = this.sourceInfo;
    if (!ignoreRange && (modelid < 400 || modelid > 611)) return;
    if (this.isStatic) {
      if (respawn_delay === undefined) {
        this._id = vehFunc.AddStaticVehicle(
          modelid,
          x,
          y,
          z,
          z_angle,
          colour1,
          colour2
        );
        return;
      }
      this._id = vehFunc.AddStaticVehicleEx(
        modelid,
        x,
        y,
        z,
        z_angle,
        colour1,
        colour2,
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
        colour1,
        colour2,
        respawn_delay || -1,
        addsiren || false
      );
    }
    Vehicle.createdCount++;
    vehicleBus.emit(vehicleHooks.created, this);
  }
  destroy(): void {
    if (this.id === -1)
      return logger.warn(
        "[Vehicle]: Unable to destroy the vehicle before create"
      );
    vehFunc.DestroyVehicle(this.id);
    Vehicle.createdCount--;
    vehicleBus.emit(vehicleHooks.destroyed, this);
    this._id = -1;
  }
  addComponent(componentid: number): number {
    if (this.id === -1) return 0;
    if (!isValidVehComponent(this.getModel(), componentid)) {
      logger.warn(
        `[Vehicle]: Invalid component id ${componentid} attempted to attach to the vehicle ${this}`
      );
      return 0;
    }
    return vehFunc.AddVehicleComponent(this.id, componentid);
  }
  removeComponent(componentid: number): number {
    if (this.getComponentInSlot(Vehicle.getComponentType(componentid)) === 0) {
      logger.warn(
        `[Vehicle]: component id ${componentid} does not exist on this vehicle`
      );
      return 0;
    }
    return vehFunc.RemoveVehicleComponent(this.id, componentid);
  }
  getComponentInSlot(slot: CarModTypeEnum) {
    return vehFunc.GetVehicleComponentInSlot(this.id, slot);
  }
  static getComponentType(component: number) {
    return vehFunc.GetVehicleComponentType(component);
  }
  linkToInterior(interiorId: number): number {
    if (this.id === -1) return 0;
    return vehFunc.LinkVehicleToInterior(this.id, interiorId);
  }
  setVirtualWorld(worldId: number): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleVirtualWorld(this.id, worldId);
  }
  getVirtualWorld(): number {
    if (this.id === -1) return 0;
    return vehFunc.GetVehicleVirtualWorld(this.id);
  }
  repair(): number {
    if (this.id === -1) return 0;
    return vehFunc.RepairVehicle(this.id);
  }
  setPos(x: number, y: number, z: number): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehiclePos(this.id, x, y, z);
  }
  getPos(): void | TPos {
    if (this.id === -1) return;
    return vehFunc.GetVehiclePos(this.id);
  }
  getHealth(): number {
    if (this.id === -1) return 0;
    return vehFunc.GetVehicleHealth(this.id);
  }
  setHealth(health: number): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleHealth(this.id, health);
  }
  isPlayerIn<P extends Player>(player: P): boolean {
    if (this.id === -1) return false;
    return vehFunc.IsPlayerInVehicle(player.id, this.id);
  }
  putPlayerIn<P extends Player>(player: P, seatid: number): number {
    if (this.id === -1) return 0;
    if (seatid < 0) return 0;
    if (seatid > 4) {
      logger.warn(
        "[Vehicle]: If the seat is invalid or is taken, will cause a crash when they EXIT the vehicle."
      );
    }
    return vehFunc.PutPlayerInVehicle(player.id, this.id, seatid);
  }
  getZAngle(): number {
    if (this.id === -1) return 0;
    return vehFunc.GetVehicleZAngle(this.id);
  }
  setZAngle(z_angle: number): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleZAngle(this.id, z_angle);
  }
  setNumberPlate(numberplate: string): number {
    if (this.id === -1) return 0;
    if (numberplate.length < 1 || numberplate.length > 32) {
      logger.error(
        "[Vehicle]: The length of the number plate ranges from 32 characters"
      );
      return 0;
    }
    if (!/^[a-zA-Z0-9]+$/.test(numberplate)) {
      logger.error("[Vehicle]: number plates only allow letters and numbers");
      return 0;
    }
    return vehFunc.SetVehicleNumberPlate(this.id, numberplate);
  }
  static getPoolSize(): number {
    return vehFunc.GetVehiclePoolSize();
  }
  changeColours(colour1: string | number, colour2: string | number): number {
    if (this.id === -1) return 0;
    return vehFunc.ChangeVehicleColours(this.id, colour1, colour2);
  }
  setVelocity(X: number, Y: number, Z: number): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleVelocity(this.id, X, Y, Z);
  }
  getVelocity(): void | TPos {
    if (this.id === -1) return;
    const [x, y, z] = vehFunc.GetVehicleVelocity(this.id);
    return { x, y, z };
  }
  setAngularVelocity(X: number, Y: number, Z: number): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleAngularVelocity(this.id, X, Y, Z);
  }
  getDamageStatus() {
    if (this.id === -1) return;
    return vehFunc.GetVehicleDamageStatus(this.id);
  }
  updateDamageStatus(
    panels: number,
    doors: number,
    lights: number,
    tires: number
  ): void {
    if (this.id === -1) return;
    vehFunc.UpdateVehicleDamageStatus(this.id, panels, doors, lights, tires);
  }
  getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return vehFunc.GetVehicleDistanceFromPoint(this.id, X, Y, Z);
  }
  getModel(): number {
    return vehFunc.GetVehicleModel(this.id);
  }
  static getModelInfo(
    vehiclemodel: number,
    infotype: VehicleModelInfoEnum
  ): TPos {
    return vehFunc.GetVehicleModelInfo(vehiclemodel, infotype);
  }
  getModelInfo(infotype: VehicleModelInfoEnum): void | TPos {
    if (this.id === -1) return;
    return Vehicle.getModelInfo(this.getModel(), infotype);
  }
  getRotationQuat() {
    if (this.id === -1) return;
    const [w, x, y, z] = vehFunc.GetVehicleRotationQuat(this.id);
    return { w, x, y, z };
  }
  setRespawn(): number {
    if (this.id === -1) return 0;
    return vehFunc.SetVehicleToRespawn(this.id);
  }
  isStreamedIn<P extends Player>(forplayer: P): boolean {
    if (this.id === -1) return false;
    return vehFunc.IsVehicleStreamedIn(this.id, forplayer.id);
  }
  setParamsCarDoors(
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
  setParamsCarWindows(
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
  getParamsCarDoors() {
    if (this.id === -1) return undefined;
    return vehFunc.GetVehicleParamsCarDoors(this.id);
  }
  getParamsCarWindows() {
    if (this.id === -1) return undefined;
    return vehFunc.GetVehicleParamsCarWindows(this.id);
  }
  setParamsEx(
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
  getParamsEx() {
    if (this.id === -1) return undefined;
    const [engine, lights, alarm, doors, bonnet, boot, objective] =
      vehFunc.GetVehicleParamsEx(this.id);
    return { engine, lights, alarm, doors, bonnet, boot, objective };
  }
  getParamsSirenState(): number {
    if (this.id === -1) return -2;
    return vehFunc.GetVehicleParamsSirenState(this.id);
  }
  setParamsForPlayer<P extends Player>(
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
  isTrailerAttached(): boolean {
    if (this.id === -1) return false;
    return vehFunc.IsTrailerAttachedToVehicle(this.id);
  }
  changePaintjob(paintjobid: 0 | 1 | 2): number {
    if (this.id === -1) return 0;
    if (!isValidPaintJob(this.getModel(), paintjobid)) return 0;
    this.changeColours("#fff", "#fff");
    vehFunc.ChangeVehiclePaintjob(this.id, paintjobid);
    return 1;
  }
  attachTrailer<V extends Vehicle>(trailer: V): number {
    if (this.id === -1) return 0;
    return vehFunc.AttachTrailerToVehicle(trailer.id, this.id);
  }
  detachTrailer() {
    if (this.id === -1) return;
    if (this.isTrailerAttached()) vehFunc.DetachTrailerFromVehicle(this.id);
  }
  getTrailer<V extends Vehicle>(vehicles: Array<V>): V | undefined {
    if (this.id === -1) return;
    return vehicles.find((v) => v.id === vehFunc.GetVehicleTrailer(this.id));
  }
  isValid(): boolean {
    return vehFunc.IsValidVehicle(this.id);
  }
  static isValid(id: number): boolean {
    return vehFunc.IsValidVehicle(id);
  }
  getMatrix() {
    if (this.id === -1) return;
    return GetVehicleMatrix(this.id);
  }
  getTrainSpeed(): number {
    if (this.id === -1) return 0;
    return GetVehicleTrainSpeed(this.id);
  }
  getHydraReactorAngle(): number {
    if (this.id === -1) return 0;
    return GetVehicleHydraReactorAngle(this.id);
  }
  getLandingGearState(): number {
    if (this.id === -1) return 0;
    return GetVehicleLandingGearState(this.id);
  }
  getSirenState(): number {
    if (this.id === -1) return 0;
    return GetVehicleSirenState(this.id);
  }
  static getModelsUsed = GetVehicleModelsUsed;
  getDriver<P extends Player>(players: Map<number, P>): P | undefined {
    if (this.id === -1) return;
    return players.get(GetVehicleDriver(this.id));
  }
  getLastDriver<P extends Player>(players: Map<number, P>): P | undefined {
    if (this.id === -1) return;
    return players.get(GetVehicleLastDriver(this.id));
  }
  static getModelCount = GetVehicleModelCount;
  isSirenEnabled(): boolean {
    return IsVehicleSirenEnabled(this.id);
  }
  toggleSirenEnabled(enabled: boolean): number {
    if (this.id === -1) return 0;
    return ToggleVehicleSirenEnabled(this.id, enabled);
  }
  isDead(): boolean {
    if (this.id === -1) return true;
    return IsVehicleDead(this.id);
  }
  getRespawnTick(): number {
    if (this.id === -1) return 0;
    return GetVehicleRespawnTick(this.id);
  }
  isOccupied(): boolean {
    if (this.id === -1) return false;
    return IsVehicleOccupied(this.id);
  }
  hasBeenOccupied(): boolean {
    if (this.id === -1) return false;
    return HasVehicleBeenOccupied(this.id);
  }
  getOccupiedTick(): number {
    if (this.id === -1) return 0;
    return GetVehicleOccupiedTick(this.id);
  }
  getCab(): number {
    if (this.id === -1) return 0;
    return GetVehicleCab(this.id);
  }
  getRespawnDelay(): number {
    if (this.id === -1) return 0;
    return GetVehicleRespawnDelay(this.id);
  }
  setRespawnDelay(delay: number): number {
    if (this.id === -1) return 0;
    return SetVehicleRespawnDelay(this.id, delay);
  }
  getNumberPlate(): string {
    if (this.id === -1) return "";
    return GetVehicleNumberPlate(this.id);
  }
  getInterior(): number {
    if (this.id === -1) return 0;
    return GetVehicleInterior(this.id);
  }
  getPaintjob(): number {
    if (this.id === -1) return -1;
    return GetVehiclePaintjob(this.id);
  }
  getColours() {
    if (this.id === -1) return;
    return GetVehicleColours(this.id);
  }
  setSpawnInfo(
    modelid: number,
    fX: number,
    fY: number,
    fZ: number,
    fAngle: number,
    colour1: string | number,
    colour2: string | number,
    respawntime = -2,
    interior = -2,
    ignoreRange = false
  ): number {
    if (this.id === -1) return 0;
    if (!ignoreRange && (modelid < 400 || modelid > 611)) return 0;
    return SetVehicleSpawnInfo(
      this.id,
      modelid,
      fX,
      fY,
      fZ,
      fAngle,
      rgba(colour1),
      rgba(colour2),
      respawntime,
      interior
    );
  }
  getSpawnInfo() {
    if (this.id === -1) return;
    return GetVehicleSpawnInfo(this.id);
  }
}
