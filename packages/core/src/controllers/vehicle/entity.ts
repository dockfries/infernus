import type { CarModTypeEnum, VehicleModelInfoEnum } from "core/enums";
import { LimitsEnum } from "core/enums";
import type { TPos } from "core/types";
import type { IVehicle } from "core/interfaces";
import type { Player } from "../player";
import { isValidPaintJob, isValidVehComponent } from "core/utils/vehicleUtils";
import * as v from "core/wrapper/native/functions";

import { rgba } from "core/utils/colorUtils";
import * as w from "@infernus/wrapper";
import { logger } from "core/logger";

export class Vehicle {
  static readonly vehicles = new Map<number, Vehicle>();

  private static createdCount = 0;
  private readonly sourceInfo: IVehicle;
  private readonly isStatic: boolean;

  private _id = -1;
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
    const { modelId, x, y, z, z_angle, color, respawn_delay, addSiren } =
      this.sourceInfo;
    if (!ignoreRange && (modelId < 400 || modelId > 611)) return;
    if (this.isStatic) {
      if (respawn_delay === undefined) {
        this._id = v.AddStaticVehicle(
          modelId,
          x,
          y,
          z,
          z_angle,
          color[0],
          color[1]
        );
        return;
      }
      this._id = v.AddStaticVehicleEx(
        modelId,
        x,
        y,
        z,
        z_angle,
        color[0],
        color[1],
        respawn_delay || -1,
        addSiren || false
      );
    } else {
      this._id = v.CreateVehicle(
        modelId,
        x,
        y,
        z,
        z_angle,
        color[0],
        color[1],
        respawn_delay || -1,
        addSiren || false
      );
    }
    Vehicle.createdCount++;
    Vehicle.vehicles.set(this._id, this);
  }
  destroy(): void {
    if (this.id === -1)
      return logger.warn(
        "[Vehicle]: Unable to destroy the vehicle before create"
      );
    v.DestroyVehicle(this.id);
    Vehicle.createdCount--;
    Vehicle.vehicles.delete(this._id);
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
    return v.AddVehicleComponent(this.id, componentid);
  }
  removeComponent(componentid: number): number {
    if (this.getComponentInSlot(Vehicle.getComponentType(componentid)) === 0) {
      logger.warn(
        `[Vehicle]: component id ${componentid} does not exist on this vehicle`
      );
      return 0;
    }
    return v.RemoveVehicleComponent(this.id, componentid);
  }
  getComponentInSlot(slot: CarModTypeEnum) {
    return v.GetVehicleComponentInSlot(this.id, slot);
  }
  static getComponentType(component: number) {
    return v.GetVehicleComponentType(component);
  }
  linkToInterior(interiorId: number): number {
    if (this.id === -1) return 0;
    return v.LinkVehicleToInterior(this.id, interiorId);
  }
  setVirtualWorld(worldId: number): number {
    if (this.id === -1) return 0;
    return v.SetVehicleVirtualWorld(this.id, worldId);
  }
  getVirtualWorld(): number {
    if (this.id === -1) return 0;
    return v.GetVehicleVirtualWorld(this.id);
  }
  repair(): number {
    if (this.id === -1) return 0;
    return v.RepairVehicle(this.id);
  }
  setPos(x: number, y: number, z: number): number {
    if (this.id === -1) return 0;
    return v.SetVehiclePos(this.id, x, y, z);
  }
  getPos(): void | TPos {
    if (this.id === -1) return;
    return v.GetVehiclePos(this.id);
  }
  getHealth(): number {
    if (this.id === -1) return 0;
    return v.GetVehicleHealth(this.id);
  }
  setHealth(health: number): number {
    if (this.id === -1) return 0;
    return v.SetVehicleHealth(this.id, health);
  }
  isPlayerIn<P extends Player>(player: P): boolean {
    if (this.id === -1) return false;
    return v.IsPlayerInVehicle(player.id, this.id);
  }
  putPlayerIn<P extends Player>(player: P, seatid: number): number {
    if (this.id === -1) return 0;
    if (seatid < 0) return 0;
    if (seatid > 4) {
      logger.warn(
        "[Vehicle]: If the seat is invalid or is taken, will cause a crash when they EXIT the vehicle."
      );
    }
    return v.PutPlayerInVehicle(player.id, this.id, seatid);
  }
  getZAngle(): number {
    if (this.id === -1) return 0;
    return v.GetVehicleZAngle(this.id);
  }
  setZAngle(z_angle: number): number {
    if (this.id === -1) return 0;
    return v.SetVehicleZAngle(this.id, z_angle);
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
    return v.SetVehicleNumberPlate(this.id, numberplate);
  }
  static getPoolSize(): number {
    return v.GetVehiclePoolSize();
  }
  changeColours(color1: string | number, color2: string | number): number {
    if (this.id === -1) return 0;
    return v.ChangeVehicleColours(this.id, color1, color2);
  }
  setVelocity(X: number, Y: number, Z: number): number {
    if (this.id === -1) return 0;
    return v.SetVehicleVelocity(this.id, X, Y, Z);
  }
  getVelocity(): void | TPos {
    if (this.id === -1) return;
    const [x, y, z] = v.GetVehicleVelocity(this.id);
    return { x, y, z };
  }
  setAngularVelocity(X: number, Y: number, Z: number): number {
    if (this.id === -1) return 0;
    return v.SetVehicleAngularVelocity(this.id, X, Y, Z);
  }
  getDamageStatus() {
    if (this.id === -1) return;
    return v.GetVehicleDamageStatus(this.id);
  }
  updateDamageStatus(
    panels: number,
    doors: number,
    lights: number,
    tires: number
  ): void {
    if (this.id === -1) return;
    v.UpdateVehicleDamageStatus(this.id, panels, doors, lights, tires);
  }
  getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return v.GetVehicleDistanceFromPoint(this.id, X, Y, Z);
  }
  getModel(): number {
    return v.GetVehicleModel(this.id);
  }
  static getModelInfo(
    vehiclemodel: number,
    infotype: VehicleModelInfoEnum
  ): TPos {
    return v.GetVehicleModelInfo(vehiclemodel, infotype);
  }
  getModelInfo(infotype: VehicleModelInfoEnum): void | TPos {
    if (this.id === -1) return;
    return Vehicle.getModelInfo(this.getModel(), infotype);
  }
  getRotationQuat() {
    if (this.id === -1) return;
    const [w, x, y, z] = v.GetVehicleRotationQuat(this.id);
    return { w, x, y, z };
  }
  setRespawn(): number {
    if (this.id === -1) return 0;
    return v.SetVehicleToRespawn(this.id);
  }
  isStreamedIn<P extends Player>(forplayer: P): boolean {
    if (this.id === -1) return false;
    return v.IsVehicleStreamedIn(this.id, forplayer.id);
  }
  setParamsCarDoors(
    driver: boolean,
    passenger: boolean,
    backleft: boolean,
    backright: boolean
  ): number {
    if (this.id === -1) return 0;
    return v.SetVehicleParamsCarDoors(
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
    return v.SetVehicleParamsCarWindows(
      this.id,
      driver,
      passenger,
      backleft,
      backright
    );
  }
  getParamsCarDoors() {
    if (this.id === -1) return undefined;
    return v.GetVehicleParamsCarDoors(this.id);
  }
  getParamsCarWindows() {
    if (this.id === -1) return undefined;
    return v.GetVehicleParamsCarWindows(this.id);
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
    return v.SetVehicleParamsEx(
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
      v.GetVehicleParamsEx(this.id);
    return { engine, lights, alarm, doors, bonnet, boot, objective };
  }
  getParamsSirenState(): number {
    if (this.id === -1) return -2;
    return v.GetVehicleParamsSirenState(this.id);
  }
  setParamsForPlayer<P extends Player>(
    player: P,
    objective: boolean,
    doorslocked: boolean
  ): number {
    if (this.id === -1) return 0;
    return v.SetVehicleParamsForPlayer(
      this.id,
      player.id,
      objective,
      doorslocked
    );
  }
  isTrailerAttached(): boolean {
    if (this.id === -1) return false;
    return v.IsTrailerAttachedToVehicle(this.id);
  }
  changePaintjob(paintjobid: 0 | 1 | 2): number {
    if (this.id === -1) return 0;
    if (!isValidPaintJob(this.getModel(), paintjobid)) return 0;
    this.changeColours("#fff", "#fff");
    v.ChangeVehiclePaintjob(this.id, paintjobid);
    return 1;
  }
  attachTrailer<V extends Vehicle>(trailer: V): number {
    if (this.id === -1) return 0;
    return v.AttachTrailerToVehicle(trailer.id, this.id);
  }
  detachTrailer() {
    if (this.id === -1) return;
    if (this.isTrailerAttached()) v.DetachTrailerFromVehicle(this.id);
  }
  getTrailer<V extends Vehicle>(vehicles: Array<V>): V | undefined {
    if (this.id === -1) return;
    return vehicles.find((_v) => _v.id === v.GetVehicleTrailer(this.id));
  }
  isValid(): boolean {
    return v.IsValidVehicle(this.id);
  }
  static isValid(id: number): boolean {
    return v.IsValidVehicle(id);
  }
  getMatrix() {
    if (this.id === -1) return;
    return w.GetVehicleMatrix(this.id);
  }
  getTrainSpeed(): number {
    if (this.id === -1) return 0;
    return w.GetVehicleTrainSpeed(this.id);
  }
  getHydraReactorAngle(): number {
    if (this.id === -1) return 0;
    return w.GetVehicleHydraReactorAngle(this.id);
  }
  getLandingGearState(): number {
    if (this.id === -1) return 0;
    return w.GetVehicleLandingGearState(this.id);
  }
  getSirenState(): number {
    if (this.id === -1) return 0;
    return w.GetVehicleSirenState(this.id);
  }
  static getModelsUsed = w.GetVehicleModelsUsed;
  getDriver<P extends Player>(players: Map<number, P>): P | undefined {
    if (this.id === -1) return;
    return players.get(w.GetVehicleDriver(this.id));
  }
  getLastDriver<P extends Player>(players: Map<number, P>): P | undefined {
    if (this.id === -1) return;
    return players.get(w.GetVehicleLastDriver(this.id));
  }
  static getModelCount = w.GetVehicleModelCount;
  isSirenEnabled(): boolean {
    return w.IsVehicleSirenEnabled(this.id);
  }
  toggleSirenEnabled(enabled: boolean): number {
    if (this.id === -1) return 0;
    return w.ToggleVehicleSirenEnabled(this.id, enabled);
  }
  isDead(): boolean {
    if (this.id === -1) return true;
    return w.IsVehicleDead(this.id);
  }
  getRespawnTick(): number {
    if (this.id === -1) return 0;
    return w.GetVehicleRespawnTick(this.id);
  }
  isOccupied(): boolean {
    if (this.id === -1) return false;
    return w.IsVehicleOccupied(this.id);
  }
  hasBeenOccupied(): boolean {
    if (this.id === -1) return false;
    return w.HasVehicleBeenOccupied(this.id);
  }
  getOccupiedTick(): number {
    if (this.id === -1) return 0;
    return w.GetVehicleOccupiedTick(this.id);
  }
  getCab(): number {
    if (this.id === -1) return 0;
    return w.GetVehicleCab(this.id);
  }
  getRespawnDelay(): number {
    if (this.id === -1) return 0;
    return w.GetVehicleRespawnDelay(this.id);
  }
  setRespawnDelay(delay: number): number {
    if (this.id === -1) return 0;
    return w.SetVehicleRespawnDelay(this.id, delay);
  }
  getNumberPlate(): string {
    if (this.id === -1) return "";
    return w.GetVehicleNumberPlate(this.id);
  }
  getInterior(): number {
    if (this.id === -1) return 0;
    return w.GetVehicleInterior(this.id);
  }
  getPaintjob(): number {
    if (this.id === -1) return -1;
    return w.GetVehiclePaintjob(this.id);
  }
  getColors() {
    if (this.id === -1) return;
    return w.GetVehicleColors(this.id);
  }
  setSpawnInfo(
    modelId: number,
    fX: number,
    fY: number,
    fZ: number,
    fAngle: number,
    color1: string | number,
    color2: string | number,
    respawntime = -2,
    interior = -2,
    ignoreRange = false
  ): number {
    if (this.id === -1) return 0;
    if (!ignoreRange && (modelId < 400 || modelId > 611)) return 0;
    return w.SetVehicleSpawnInfo(
      this.id,
      modelId,
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
  getSpawnInfo() {
    if (this.id === -1) return;
    return w.GetVehicleSpawnInfo(this.id);
  }

  static getInstance(id: number) {
    return this.vehicles.get(id);
  }
  static getInstances() {
    return [...this.vehicles.values()];
  }
}
