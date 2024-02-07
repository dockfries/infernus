import type { CarModTypeEnum, VehicleModelInfoEnum } from "core/enums";
import { LimitsEnum } from "core/enums";
import type { TPos } from "core/types";
import type { IVehicle } from "core/interfaces";
import type { Player } from "../player/entity";
import { isValidPaintJob, isValidVehComponent } from "core/utils/vehicleUtils";
import { rgba } from "core/utils/colorUtils";
import * as v from "core/wrapper/native";
import { logger } from "core/logger";
import { GameMode } from "../gamemode";

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
  addComponent(componentId: number): number {
    if (this.id === -1) return 0;
    if (!isValidVehComponent(this.getModel(), componentId)) {
      logger.warn(
        `[Vehicle]: Invalid component id ${componentId} attempted to attach to the vehicle ${this}`
      );
      return 0;
    }
    return v.AddVehicleComponent(this.id, componentId);
  }
  removeComponent(componentId: number): number {
    if (this.getComponentInSlot(Vehicle.getComponentType(componentId)) === 0) {
      logger.warn(
        `[Vehicle]: component id ${componentId} does not exist on this vehicle`
      );
      return 0;
    }
    return v.RemoveVehicleComponent(this.id, componentId);
  }
  getComponentInSlot(slot: CarModTypeEnum) {
    return v.GetVehicleComponentInSlot(this.id, slot);
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
  isPlayerIn(player: Player): boolean {
    if (this.id === -1) return false;
    return v.IsPlayerInVehicle(player.id, this.id);
  }
  putPlayerIn(player: Player, seatId: number): number {
    if (this.id === -1) return 0;
    if (seatId < 0) return 0;
    if (seatId > 4) {
      logger.warn(
        "[Vehicle]: If the seat is invalid or is taken, will cause a crash when they EXIT the vehicle."
      );
    }
    return v.PutPlayerInVehicle(player.id, this.id, seatId);
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
  changeColors(color1: string | number, color2: string | number): number {
    if (this.id === -1) return 0;
    return v.ChangeVehicleColors(this.id, color1, color2);
  }
  setVelocity(X: number, Y: number, Z: number) {
    if (this.id === -1) return false;
    return v.SetVehicleVelocity(this.id, X, Y, Z);
  }
  getVelocity(): void | TPos {
    if (this.id === -1) return;
    const [x, y, z] = v.GetVehicleVelocity(this.id);
    return { x, y, z };
  }
  getSpeed(magic = 180.0) {
    if (this.id === -1) return 0.0;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { x, y, z } = this.getVelocity()!;
    return GameMode.vectorSize(x, y, z) * magic;
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
    vehicleModel: number,
    infoType: VehicleModelInfoEnum
  ): TPos {
    return v.GetVehicleModelInfo(vehicleModel, infoType);
  }
  getModelInfo(infoType: VehicleModelInfoEnum): void | TPos {
    if (this.id === -1) return;
    return Vehicle.getModelInfo(this.getModel(), infoType);
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
  isStreamedIn(forPlayer: Player): boolean {
    if (this.id === -1) return false;
    return v.IsVehicleStreamedIn(this.id, forPlayer.id);
  }
  setParamsCarDoors(
    driver: boolean,
    passenger: boolean,
    backLeft: boolean,
    backRight: boolean
  ): number {
    if (this.id === -1) return 0;
    return v.SetVehicleParamsCarDoors(
      this.id,
      driver,
      passenger,
      backLeft,
      backRight
    );
  }
  setParamsCarWindows(
    driver: boolean,
    passenger: boolean,
    backLeft: boolean,
    backRight: boolean
  ) {
    if (this.id === -1) return 0;
    return v.SetVehicleParamsCarWindows(
      this.id,
      driver,
      passenger,
      backLeft,
      backRight
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
  setParamsForPlayer(
    player: Player,
    objective: boolean,
    doorsLocked: boolean
  ): number {
    if (this.id === -1) return 0;
    return v.SetVehicleParamsForPlayer(
      this.id,
      player.id,
      objective,
      doorsLocked
    );
  }
  isTrailerAttached(): boolean {
    if (this.id === -1) return false;
    return v.IsTrailerAttachedToVehicle(this.id);
  }
  changePaintjob(paintjobId: 0 | 1 | 2): number {
    if (this.id === -1) return 0;
    if (!isValidPaintJob(this.getModel(), paintjobId)) return 0;
    this.changeColors("#fff", "#fff");
    v.ChangeVehiclePaintjob(this.id, paintjobId);
    return 1;
  }
  attachTrailer(trailer: Vehicle): number {
    if (this.id === -1) return 0;
    return v.AttachTrailerToVehicle(trailer.id, this.id);
  }
  detachTrailer() {
    if (this.id === -1) return;
    if (this.isTrailerAttached()) v.DetachTrailerFromVehicle(this.id);
  }
  getTrailer() {
    if (this.id === -1) return;
    return Vehicle.getInstances().find(
      (_v) => _v.id === v.GetVehicleTrailer(this.id)
    );
  }
  isValid(): boolean {
    return v.IsValidVehicle(this.id);
  }
  getMatrix() {
    if (this.id === -1) return;
    return v.GetVehicleMatrix(this.id);
  }
  getTrainSpeed(): number {
    if (this.id === -1) return 0;
    return v.GetVehicleTrainSpeed(this.id);
  }
  getHydraReactorAngle(): number {
    if (this.id === -1) return 0;
    return v.GetVehicleHydraReactorAngle(this.id);
  }
  getLandingGearState(): number {
    if (this.id === -1) return 0;
    return v.GetVehicleLandingGearState(this.id);
  }
  getSirenState(): number {
    if (this.id === -1) return 0;
    return v.GetVehicleSirenState(this.id);
  }
  getDriver(players: Map<number, Player>) {
    if (this.id === -1) return;
    return players.get(v.GetVehicleDriver(this.id));
  }
  getLastDriver(players: Map<number, Player>) {
    if (this.id === -1) return;
    return players.get(v.GetVehicleLastDriver(this.id));
  }
  isSirenEnabled(): boolean {
    return v.IsVehicleSirenEnabled(this.id);
  }
  toggleSirenEnabled(enabled: boolean): number {
    if (this.id === -1) return 0;
    return v.ToggleVehicleSirenEnabled(this.id, enabled);
  }
  setParamsSirenState(enabled: boolean): number {
    if (this.id === -1) return 0;
    return v.SetVehicleParamsSirenState(this.id, enabled);
  }
  isDead(): boolean {
    if (this.id === -1) return true;
    return v.IsVehicleDead(this.id);
  }
  setDead(dead: boolean): boolean {
    if (this.id === -1) return false;
    return v.SetVehicleDead(this.id, dead);
  }
  setBeenOccupied(occupied: boolean) {
    if (this.id === -1) return false;
    return v.SetVehicleBeenOccupied(this.id, occupied);
  }
  getRespawnTick(): number {
    if (this.id === -1) return 0;
    return v.GetVehicleRespawnTick(this.id);
  }
  setRespawnTick(ticks: number) {
    if (this.id === -1) return false;
    return v.SetVehicleRespawnTick(this.id, ticks);
  }
  isOccupied(): boolean {
    if (this.id === -1) return false;
    return v.IsVehicleOccupied(this.id);
  }
  hasBeenOccupied(): boolean {
    if (this.id === -1) return false;
    return v.HasVehicleBeenOccupied(this.id);
  }
  getOccupiedTick(): number {
    if (this.id === -1) return 0;
    return v.GetVehicleOccupiedTick(this.id);
  }
  setOccupiedTick(ticks: number): number {
    if (this.id === -1) return 0;
    return v.SetVehicleOccupiedTick(this.id, ticks);
  }
  getCab(): number {
    if (this.id === -1) return 0;
    return v.GetVehicleCab(this.id);
  }
  getRespawnDelay(): number {
    if (this.id === -1) return 0;
    return v.GetVehicleRespawnDelay(this.id);
  }
  setRespawnDelay(delay: number): number {
    if (this.id === -1) return 0;
    return v.SetVehicleRespawnDelay(this.id, delay);
  }
  getNumberPlate(): string {
    if (this.id === -1) return "";
    return v.GetVehicleNumberPlate(this.id);
  }
  getInterior(): number {
    if (this.id === -1) return 0;
    return v.GetVehicleInterior(this.id);
  }
  getPaintjob(): number {
    if (this.id === -1) return -1;
    return v.GetVehiclePaintjob(this.id);
  }
  getColors() {
    if (this.id === -1) return;
    return v.GetVehicleColors(this.id);
  }
  setSpawnInfo(
    modelId: number,
    fX: number,
    fY: number,
    fZ: number,
    fAngle: number,
    color1: string | number,
    color2: string | number,
    respawnTime = -2,
    interior = -2,
    ignoreRange = false
  ): number {
    if (this.id === -1) return 0;
    if (!ignoreRange && (modelId < 400 || modelId > 611)) return 0;
    return v.SetVehicleSpawnInfo(
      this.id,
      modelId,
      fX,
      fY,
      fZ,
      fAngle,
      rgba(color1),
      rgba(color2),
      respawnTime,
      interior
    );
  }
  getSpawnInfo() {
    if (this.id === -1) return;
    return v.GetVehicleSpawnInfo(this.id);
  }
  getRandomColorPair() {
    if (this.id === -1) return;
    return v.GetRandomVehicleColorPair(this.getModel());
  }
  show() {
    if (this.id === -1) return false;
    return v.ShowVehicle(this.id);
  }
  hide() {
    if (this.id === -1) return false;
    return v.HideVehicle(this.id);
  }
  isHidden() {
    if (this.id === -1) return false;
    return v.IsVehicleHidden(this.id);
  }

  static getRandomColorPair(modelId: number) {
    return v.GetRandomVehicleColorPair(modelId);
  }
  static getComponentType = v.GetVehicleComponentType;
  static colorIndexToColor = v.VehicleColorIndexToColor;
  static isValid(id: number): boolean {
    return v.IsValidVehicle(id);
  }
  static getModelsUsed = v.GetVehicleModelsUsed;
  static getModelCount = v.GetVehicleModelCount;

  static getInstance(id: number) {
    return this.vehicles.get(id);
  }
  static getInstances() {
    return [...this.vehicles.values()];
  }
}
