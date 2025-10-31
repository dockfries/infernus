import type {
  CarModTypeEnum,
  VehicleModelInfoEnum,
  VehicleParamsEnum,
} from "core/enums";
import { InvalidEnum, LimitsEnum } from "core/enums";
import type { IVehicle } from "core/interfaces";
import type { Player } from "../player/entity";
import {
  isValidPaintJob,
  isValidVehComponent,
  isValidVehModelId,
} from "core/utils/vehicleUtils";
import { rgba } from "core/utils/colorUtils";
import * as v from "core/wrapper/native";
import { VectorSize } from "core/wrapper/native";
import { vehiclePool, playerPool } from "core/utils/pools";
import { INTERNAL_FLAGS } from "core/utils/flags";

export class Vehicle {
  private sourceInfo: IVehicle | null = null;
  private readonly isStatic: boolean = false;
  private static createdCount = 0;

  private _id: number = InvalidEnum.VEHICLE_ID;
  get id(): number {
    return this._id;
  }

  constructor(vehOrId: IVehicle | number, isStatic = false) {
    if (typeof vehOrId === "number") {
      const obj = Vehicle.getInstance(vehOrId);
      if (obj) {
        return obj;
      }
      this._id = vehOrId;
      vehiclePool.set(this._id, this);
      if (this.isValid()) {
        Vehicle.createdCount++;
      }
    } else {
      this.sourceInfo = vehOrId;
      this.isStatic = isStatic;
    }
  }
  create(ignoreRange = false): void {
    if (this.id !== InvalidEnum.VEHICLE_ID)
      throw new Error("[Vehicle]: Unable to create again");
    if (!this.sourceInfo)
      throw new Error("[Vehicle]: Unable to create with only id");
    const { modelId, x, y, z, zAngle, color, respawnDelay, addSiren } =
      this.sourceInfo;
    if (!ignoreRange && !isValidVehModelId(modelId)) return;
    if (this.isStatic) {
      if (typeof respawnDelay === "undefined") {
        this._id = Vehicle.__inject_AddStaticVehicle(
          modelId,
          x,
          y,
          z,
          zAngle,
          color[0],
          color[1],
        );
        return;
      }
      this._id = Vehicle.__inject_AddStaticVehicleEx(
        modelId,
        x,
        y,
        z,
        zAngle,
        color[0],
        color[1],
        respawnDelay || -1,
        addSiren || false,
      );
    } else {
      this._id = Vehicle.__inject_CreateVehicle(
        modelId,
        x,
        y,
        z,
        zAngle,
        color[0],
        color[1],
        respawnDelay || -1,
        addSiren || false,
      );
    }
    if (
      this._id === InvalidEnum.VEHICLE_ID ||
      Vehicle.createdCount === LimitsEnum.MAX_VEHICLES
    )
      throw new Error(
        "[Vehicle]: Unable to create vehicle, maximum has been reached",
      );
    Vehicle.createdCount++;
    vehiclePool.set(this._id, this);
  }
  destroy(): void {
    if (this.id === InvalidEnum.VEHICLE_ID && !INTERNAL_FLAGS.skip) {
      throw new Error("[Vehicle]: Unable to destroy the vehicle before create");
    }
    if (!INTERNAL_FLAGS.skip) {
      Vehicle.__inject_DestroyVehicle(this.id);
    }
    Vehicle.createdCount--;
    vehiclePool.delete(this._id);
    this._id = InvalidEnum.VEHICLE_ID;
    if (!Vehicle.getInstances().length) {
      Vehicle.createdCount = 0;
    }
  }
  addComponent(componentId: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    if (!isValidVehComponent(this.getModel(), componentId)) {
      throw new Error(
        `[Vehicle]: Invalid component id ${componentId} attempted to attach to the vehicle ${this}`,
      );
    }
    return v.AddVehicleComponent(this.id, componentId);
  }
  removeComponent(componentId: number): number {
    if (this.getComponentInSlot(Vehicle.getComponentType(componentId)) === 0) {
      throw new Error(
        `[Vehicle]: component id ${componentId} does not exist on this vehicle`,
      );
    }
    return v.RemoveVehicleComponent(this.id, componentId);
  }
  getComponentInSlot(slot: CarModTypeEnum) {
    return v.GetVehicleComponentInSlot(this.id, slot);
  }
  linkToInterior(interiorId: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.LinkVehicleToInterior(this.id, interiorId);
  }
  setVirtualWorld(worldId: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.SetVehicleVirtualWorld(this.id, worldId);
  }
  getVirtualWorld(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.GetVehicleVirtualWorld(this.id);
  }
  repair(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.RepairVehicle(this.id);
  }
  setPos(x: number, y: number, z: number): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.SetVehiclePos(this.id, x, y, z);
  }
  getPos() {
    return v.GetVehiclePos(this.id);
  }
  getHealth() {
    return v.GetVehicleHealth(this.id);
  }
  setHealth(health: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.SetVehicleHealth(this.id, health);
  }
  isPlayerIn(player: Player): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.IsPlayerInVehicle(player.id, this.id);
  }
  putPlayerIn(player: Player, seatId: number) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    if (seatId < 0) return 0;
    if (seatId > 4) {
      throw new Error(
        "[Vehicle]: If the seat is invalid or is taken, will cause a crash when they EXIT the vehicle.",
      );
    }
    return v.PutPlayerInVehicle(player.id, this.id, seatId);
  }
  getZAngle() {
    return v.GetVehicleZAngle(this.id);
  }
  setZAngle(zAngle: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.SetVehicleZAngle(this.id, zAngle);
  }
  setNumberPlate(numberplate: string): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    if (numberplate.length < 1 || numberplate.length > 32) {
      throw new Error(
        "[Vehicle]: The length of the number plate ranges up to 32 characters",
      );
    }
    if (!/^[a-zA-Z0-9]+$/.test(numberplate)) {
      throw new Error(
        "[Vehicle]: number plates only allow letters and numbers",
      );
    }
    return v.SetVehicleNumberPlate(this.id, numberplate);
  }
  changeColors(color1: string | number, color2: string | number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.ChangeVehicleColors(this.id, color1, color2);
  }
  setVelocity(X: number, Y: number, Z: number) {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.SetVehicleVelocity(this.id, X, Y, Z);
  }
  getVelocity() {
    return v.GetVehicleVelocity(this.id);
  }
  getSpeed(magic = 180.0) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0.0;
    const { x, y, z } = this.getVelocity();
    return VectorSize(x, y, z) * magic;
  }
  setAngularVelocity(X: number, Y: number, Z: number): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.SetVehicleAngularVelocity(this.id, X, Y, Z);
  }
  getDamageStatus() {
    return v.GetVehicleDamageStatus(this.id);
  }
  updateDamageStatus(
    panels: number,
    doors: number,
    lights: number,
    tires: number,
  ) {
    return v.UpdateVehicleDamageStatus(this.id, panels, doors, lights, tires);
  }
  getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return v.GetVehicleDistanceFromPoint(this.id, X, Y, Z);
  }
  getModel(): number {
    return v.GetVehicleModel(this.id);
  }
  static getModelInfo(vehicleModel: number, infoType: VehicleModelInfoEnum) {
    return v.GetVehicleModelInfo(vehicleModel, infoType);
  }
  getModelInfo(infoType: VehicleModelInfoEnum) {
    return Vehicle.getModelInfo(this.getModel(), infoType);
  }
  getRotation() {
    return v.GetVehicleRotation(this.id);
  }
  getRotationQuat() {
    return v.GetVehicleRotationQuat(this.id);
  }
  setRespawn(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.SetVehicleToRespawn(this.id);
  }
  isStreamedIn(forPlayer: Player): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.IsVehicleStreamedIn(this.id, forPlayer.id);
  }
  setParamsCarDoors(
    driver: boolean,
    passenger: boolean,
    backLeft: boolean,
    backRight: boolean,
  ): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.SetVehicleParamsCarDoors(
      this.id,
      driver,
      passenger,
      backLeft,
      backRight,
    );
  }
  setParamsCarWindows(
    driver: boolean,
    passenger: boolean,
    backLeft: boolean,
    backRight: boolean,
  ) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.SetVehicleParamsCarWindows(
      this.id,
      driver,
      passenger,
      backLeft,
      backRight,
    );
  }
  getParamsCarDoors() {
    return v.GetVehicleParamsCarDoors(this.id);
  }
  getParamsCarWindows() {
    return v.GetVehicleParamsCarWindows(this.id);
  }
  setParamsEx(
    engine: boolean | VehicleParamsEnum,
    lights: boolean | VehicleParamsEnum,
    alarm: boolean | VehicleParamsEnum,
    doors: boolean | VehicleParamsEnum,
    bonnet: boolean | VehicleParamsEnum,
    boot: boolean | VehicleParamsEnum,
    objective: boolean | VehicleParamsEnum,
  ): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.SetVehicleParamsEx(
      this.id,
      engine,
      lights,
      alarm,
      doors,
      bonnet,
      boot,
      objective,
    );
  }
  getParamsEx() {
    if (this.id === InvalidEnum.VEHICLE_ID)
      return {
        engine: -1,
        lights: -1,
        alarm: -1,
        doors: -1,
        bonnet: -1,
        boot: -1,
        objective: -1,
      };
    const [engine, lights, alarm, doors, bonnet, boot, objective] =
      v.GetVehicleParamsEx(this.id);
    return {
      engine,
      lights,
      alarm,
      doors,
      bonnet,
      boot,
      objective,
    };
  }
  toggleEngine(value: boolean | VehicleParamsEnum) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    const { lights, alarm, doors, bonnet, boot, objective } =
      this.getParamsEx();
    return this.setParamsEx(
      value,
      lights,
      alarm,
      doors,
      bonnet,
      boot,
      objective,
    );
  }
  toggleLights(value: boolean | VehicleParamsEnum) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    const { engine, alarm, doors, bonnet, boot, objective } =
      this.getParamsEx();
    return this.setParamsEx(
      engine,
      value,
      alarm,
      doors,
      bonnet,
      boot,
      objective,
    );
  }
  toggleAlarm(value: boolean | VehicleParamsEnum) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    const { engine, lights, doors, bonnet, boot, objective } =
      this.getParamsEx();
    return this.setParamsEx(
      engine,
      lights,
      value,
      doors,
      bonnet,
      boot,
      objective,
    );
  }
  toggleDoors(value: boolean | VehicleParamsEnum) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    const { engine, lights, alarm, bonnet, boot, objective } =
      this.getParamsEx();
    return this.setParamsEx(
      engine,
      lights,
      alarm,
      value,
      bonnet,
      boot,
      objective,
    );
  }
  toggleBonnet(value: boolean | VehicleParamsEnum) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    const { engine, lights, alarm, doors, boot, objective } =
      this.getParamsEx();
    return this.setParamsEx(
      engine,
      lights,
      alarm,
      doors,
      value,
      boot,
      objective,
    );
  }
  toggleBoot(value: boolean | VehicleParamsEnum) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    const { engine, lights, alarm, doors, bonnet, objective } =
      this.getParamsEx();
    return this.setParamsEx(
      engine,
      lights,
      alarm,
      doors,
      bonnet,
      value,
      objective,
    );
  }
  toggleObjective(value: boolean | VehicleParamsEnum) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    const { engine, lights, alarm, doors, bonnet, boot } = this.getParamsEx();
    return this.setParamsEx(engine, lights, alarm, doors, bonnet, boot, value);
  }
  getParamsSirenState(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return -2;
    return v.GetVehicleParamsSirenState(this.id);
  }
  setParamsForPlayer(
    player: Player,
    objective: boolean,
    doorsLocked: boolean,
  ): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.SetVehicleParamsForPlayer(
      this.id,
      player.id,
      objective,
      doorsLocked,
    );
  }
  isTrailerAttached(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.IsTrailerAttachedToVehicle(this.id);
  }
  changePaintjob(paintjobId: 0 | 1 | 2): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    if (!isValidPaintJob(this.getModel(), paintjobId)) return 0;
    this.changeColors("#fff", "#fff");
    v.ChangeVehiclePaintjob(this.id, paintjobId);
    return 1;
  }
  attachTrailer(trailer: Vehicle): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.AttachTrailerToVehicle(trailer.id, this.id);
  }
  detachTrailer() {
    if (this.isTrailerAttached()) v.DetachTrailerFromVehicle(this.id);
  }
  getTrailer() {
    return Vehicle.getInstance(v.GetVehicleTrailer(this.id));
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.VEHICLE_ID) return true;
    return Vehicle.isValid(this.id);
  }
  getMatrix() {
    return v.GetVehicleMatrix(this.id);
  }
  getTrainSpeed(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.GetVehicleTrainSpeed(this.id);
  }
  getHydraReactorAngle(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.GetVehicleHydraReactorAngle(this.id);
  }
  getLandingGearState(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.GetVehicleLandingGearState(this.id);
  }
  getSirenState(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.GetVehicleSirenState(this.id);
  }
  getDriver() {
    return playerPool.get(v.GetVehicleDriver(this.id));
  }
  getLastDriver() {
    return playerPool.get(v.GetVehicleLastDriver(this.id));
  }
  isSirenEnabled(): boolean {
    return v.IsVehicleSirenEnabled(this.id);
  }
  toggleSirenEnabled(enabled: boolean): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.ToggleVehicleSirenEnabled(this.id, enabled);
  }
  setParamsSirenState(enabled: boolean): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.SetVehicleParamsSirenState(this.id, enabled);
  }
  isDead(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return true;
    return v.IsVehicleDead(this.id);
  }
  setDead(dead: boolean): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.SetVehicleDead(this.id, dead);
  }
  setBeenOccupied(occupied: boolean) {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.SetVehicleBeenOccupied(this.id, occupied);
  }
  getRespawnTick(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.GetVehicleRespawnTick(this.id);
  }
  setRespawnTick(ticks: number) {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.SetVehicleRespawnTick(this.id, ticks);
  }
  isOccupied(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.IsVehicleOccupied(this.id);
  }
  hasBeenOccupied(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.HasVehicleBeenOccupied(this.id);
  }
  getOccupiedTick(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.GetVehicleOccupiedTick(this.id);
  }
  setOccupiedTick(ticks: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.SetVehicleOccupiedTick(this.id, ticks);
  }
  getCab(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.GetVehicleCab(this.id);
  }
  getRespawnDelay(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.GetVehicleRespawnDelay(this.id);
  }
  setRespawnDelay(delay: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.SetVehicleRespawnDelay(this.id, delay);
  }
  getNumberPlate() {
    return v.GetVehicleNumberPlate(this.id);
  }
  getInterior(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return v.GetVehicleInterior(this.id);
  }
  getPaintjob(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return InvalidEnum.VEHICLE_ID;
    return v.GetVehiclePaintjob(this.id);
  }
  getColors() {
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
    ignoreRange = false,
  ): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    if (!ignoreRange && !isValidVehModelId(modelId)) return 0;
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
      interior,
    );
  }
  getSpawnInfo() {
    return v.GetVehicleSpawnInfo(this.id);
  }
  getRandomColorPair() {
    return v.GetRandomVehicleColorPair(this.getModel());
  }
  show() {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.ShowVehicle(this.id);
  }
  hide() {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.HideVehicle(this.id);
  }
  isHidden() {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return v.IsVehicleHidden(this.id);
  }
  getVehicleOccupant(seatId: number) {
    return v.GetVehicleOccupant(this.id, seatId);
  }
  getVehicleMaxPassengers() {
    return v.GetVehicleMaxPassengers(this.getModel());
  }
  countVehicleOccupants() {
    return v.CountVehicleOccupants(this.getModel());
  }
  static getVehicleMaxPassengers = v.GetVehicleMaxPassengers;
  static getRandomColorPair = v.GetRandomVehicleColorPair;
  static getComponentType = v.GetVehicleComponentType;
  static colorIndexToColor = v.VehicleColorIndexToColor;
  static isValid = v.IsValidVehicle;
  static getModelsUsed = v.GetVehicleModelsUsed;
  static getModelCount = v.GetVehicleModelCount;

  static getInstance(id: number) {
    return vehiclePool.get(id);
  }
  static getInstances() {
    return [...vehiclePool.values()];
  }
  static __inject_AddStaticVehicle = v.AddStaticVehicle;
  static __inject_AddStaticVehicleEx = v.AddStaticVehicleEx;
  static __inject_CreateVehicle = v.CreateVehicle;
  static __inject_DestroyVehicle = v.DestroyVehicle;
}
