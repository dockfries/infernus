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
} from "core/utils/vehicle";
import { rgba } from "core/utils/color";
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
        this._id = Vehicle.__inject__.AddStaticVehicle(
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
      this._id = Vehicle.__inject__.AddStaticVehicleEx(
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
      this._id = Vehicle.__inject__.CreateVehicle(
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
      throw new Error("[Vehicle]: Unable to create vehicle");
    Vehicle.createdCount++;
    vehiclePool.set(this._id, this);
  }
  destroy(): void {
    if (this.id === InvalidEnum.VEHICLE_ID && !INTERNAL_FLAGS.skip) {
      throw new Error("[Vehicle]: Unable to destroy the vehicle before create");
    }
    if (!INTERNAL_FLAGS.skip) {
      Vehicle.__inject__.DestroyVehicle(this.id);
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
    return Vehicle.__inject__.AddVehicleComponent(this.id, componentId);
  }
  removeComponent(componentId: number): number {
    if (this.getComponentInSlot(Vehicle.getComponentType(componentId)) === 0) {
      throw new Error(
        `[Vehicle]: component id ${componentId} does not exist on this vehicle`,
      );
    }
    return Vehicle.__inject__.RemoveVehicleComponent(this.id, componentId);
  }
  getComponentInSlot(slot: CarModTypeEnum) {
    return Vehicle.__inject__.GetVehicleComponentInSlot(this.id, slot);
  }
  linkToInterior(interiorId: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.LinkVehicleToInterior(this.id, interiorId);
  }
  setVirtualWorld(worldId: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.SetVehicleVirtualWorld(this.id, worldId);
  }
  getVirtualWorld(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.GetVehicleVirtualWorld(this.id);
  }
  repair(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.RepairVehicle(this.id);
  }
  setPos(x: number, y: number, z: number): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.SetVehiclePos(this.id, x, y, z);
  }
  getPos() {
    return Vehicle.__inject__.GetVehiclePos(this.id);
  }
  getHealth() {
    return Vehicle.__inject__.GetVehicleHealth(this.id);
  }
  setHealth(health: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.SetVehicleHealth(this.id, health);
  }
  isPlayerIn(player: Player): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.IsPlayerInVehicle(player.id, this.id);
  }
  putPlayerIn(player: Player, seatId: number) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    if (seatId < 0) return 0;
    if (seatId > 4) {
      throw new Error(
        "[Vehicle]: If the seat is invalid or is taken, will cause a crash when they EXIT the vehicle.",
      );
    }
    return Vehicle.__inject__.PutPlayerInVehicle(player.id, this.id, seatId);
  }
  getZAngle() {
    return Vehicle.__inject__.GetVehicleZAngle(this.id);
  }
  setZAngle(zAngle: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.SetVehicleZAngle(this.id, zAngle);
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
    return Vehicle.__inject__.SetVehicleNumberPlate(this.id, numberplate);
  }
  changeColors(color1: string | number, color2: string | number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.ChangeVehicleColors(this.id, color1, color2);
  }
  setVelocity(X: number, Y: number, Z: number) {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.SetVehicleVelocity(this.id, X, Y, Z);
  }
  getVelocity() {
    return Vehicle.__inject__.GetVehicleVelocity(this.id);
  }
  getSpeed(magic = 180.0) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0.0;
    const { x, y, z } = this.getVelocity();
    return VectorSize(x, y, z) * magic;
  }
  setAngularVelocity(X: number, Y: number, Z: number): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.SetVehicleAngularVelocity(this.id, X, Y, Z);
  }
  getDamageStatus() {
    return Vehicle.__inject__.GetVehicleDamageStatus(this.id);
  }
  updateDamageStatus(
    panels: number,
    doors: number,
    lights: number,
    tires: number,
  ) {
    return Vehicle.__inject__.UpdateVehicleDamageStatus(
      this.id,
      panels,
      doors,
      lights,
      tires,
    );
  }
  getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return Vehicle.__inject__.GetVehicleDistanceFromPoint(this.id, X, Y, Z);
  }
  getModel(): number {
    return Vehicle.__inject__.GetVehicleModel(this.id);
  }
  static getModelInfo(vehicleModel: number, infoType: VehicleModelInfoEnum) {
    return Vehicle.__inject__.GetVehicleModelInfo(vehicleModel, infoType);
  }
  getModelInfo(infoType: VehicleModelInfoEnum) {
    return Vehicle.getModelInfo(this.getModel(), infoType);
  }
  getRotation() {
    return Vehicle.__inject__.GetVehicleRotation(this.id);
  }
  getRotationQuat() {
    return Vehicle.__inject__.GetVehicleRotationQuat(this.id);
  }
  setRespawn(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.SetVehicleToRespawn(this.id);
  }
  isStreamedIn(forPlayer: Player): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.IsVehicleStreamedIn(this.id, forPlayer.id);
  }
  setParamsCarDoors(
    driver: boolean,
    passenger: boolean,
    backLeft: boolean,
    backRight: boolean,
  ): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.SetVehicleParamsCarDoors(
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
    return Vehicle.__inject__.SetVehicleParamsCarWindows(
      this.id,
      driver,
      passenger,
      backLeft,
      backRight,
    );
  }
  getParamsCarDoors() {
    return Vehicle.__inject__.GetVehicleParamsCarDoors(this.id);
  }
  getParamsCarWindows() {
    return Vehicle.__inject__.GetVehicleParamsCarWindows(this.id);
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
    return Vehicle.__inject__.SetVehicleParamsEx(
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
      Vehicle.__inject__.GetVehicleParamsEx(this.id);
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
    return Vehicle.__inject__.GetVehicleParamsSirenState(this.id);
  }
  setParamsForPlayer(
    player: Player,
    objective: boolean,
    doorsLocked: boolean,
  ): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.SetVehicleParamsForPlayer(
      this.id,
      player.id,
      objective,
      doorsLocked,
    );
  }
  isTrailerAttached(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.IsTrailerAttachedToVehicle(this.id);
  }
  changePaintjob(paintjobId: 0 | 1 | 2): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    if (!isValidPaintJob(this.getModel(), paintjobId)) return 0;
    this.changeColors("#fff", "#fff");
    Vehicle.__inject__.ChangeVehiclePaintjob(this.id, paintjobId);
    return 1;
  }
  attachTrailer(trailer: Vehicle): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.AttachTrailerToVehicle(trailer.id, this.id);
  }
  detachTrailer() {
    if (this.isTrailerAttached())
      Vehicle.__inject__.DetachTrailerFromVehicle(this.id);
  }
  getTrailer() {
    return Vehicle.getInstance(v.GetVehicleTrailer(this.id));
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.VEHICLE_ID) return true;
    return Vehicle.isValid(this.id);
  }
  getMatrix() {
    return Vehicle.__inject__.GetVehicleMatrix(this.id);
  }
  getTrainSpeed(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.GetVehicleTrainSpeed(this.id);
  }
  getHydraReactorAngle(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.GetVehicleHydraReactorAngle(this.id);
  }
  getLandingGearState(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.GetVehicleLandingGearState(this.id);
  }
  getSirenState(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.GetVehicleSirenState(this.id);
  }
  getDriver() {
    return playerPool.get(v.GetVehicleDriver(this.id));
  }
  getLastDriver() {
    return playerPool.get(v.GetVehicleLastDriver(this.id));
  }
  isSirenEnabled(): boolean {
    return Vehicle.__inject__.IsVehicleSirenEnabled(this.id);
  }
  toggleSirenEnabled(enabled: boolean): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.ToggleVehicleSirenEnabled(this.id, enabled);
  }
  setParamsSirenState(enabled: boolean): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.SetVehicleParamsSirenState(this.id, enabled);
  }
  isDead(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return true;
    return Vehicle.__inject__.IsVehicleDead(this.id);
  }
  setDead(dead: boolean): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.SetVehicleDead(this.id, dead);
  }
  setBeenOccupied(occupied: boolean) {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.SetVehicleBeenOccupied(this.id, occupied);
  }
  getRespawnTick(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.GetVehicleRespawnTick(this.id);
  }
  setRespawnTick(ticks: number) {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.SetVehicleRespawnTick(this.id, ticks);
  }
  isOccupied(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.IsVehicleOccupied(this.id);
  }
  hasBeenOccupied(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.HasVehicleBeenOccupied(this.id);
  }
  getOccupiedTick(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.GetVehicleOccupiedTick(this.id);
  }
  setOccupiedTick(ticks: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.SetVehicleOccupiedTick(this.id, ticks);
  }
  getCab(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.GetVehicleCab(this.id);
  }
  getRespawnDelay(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.GetVehicleRespawnDelay(this.id);
  }
  setRespawnDelay(delay: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.SetVehicleRespawnDelay(this.id, delay);
  }
  getNumberPlate() {
    return Vehicle.__inject__.GetVehicleNumberPlate(this.id);
  }
  getInterior(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.GetVehicleInterior(this.id);
  }
  getPaintjob(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return InvalidEnum.VEHICLE_ID;
    return Vehicle.__inject__.GetVehiclePaintjob(this.id);
  }
  getColors() {
    return Vehicle.__inject__.GetVehicleColors(this.id);
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
    return Vehicle.__inject__.SetVehicleSpawnInfo(
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
    return Vehicle.__inject__.GetVehicleSpawnInfo(this.id);
  }
  getRandomColorPair() {
    return Vehicle.__inject__.GetRandomVehicleColorPair(this.getModel());
  }
  show() {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.ShowVehicle(this.id);
  }
  hide() {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.HideVehicle(this.id);
  }
  isHidden() {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.IsVehicleHidden(this.id);
  }
  getVehicleOccupant(seatId: number) {
    return Vehicle.__inject__.GetVehicleOccupant(this.id, seatId);
  }
  getVehicleMaxPassengers() {
    return Vehicle.__inject__.GetVehicleMaxPassengers(this.getModel());
  }
  countVehicleOccupants() {
    return Vehicle.__inject__.CountVehicleOccupants(this.getModel());
  }
  static getVehicleMaxPassengers(modelId: number) {
    return Vehicle.__inject__.GetVehicleMaxPassengers(modelId);
  }
  static getRandomColorPair(modelId: number) {
    return Vehicle.__inject__.GetRandomVehicleColorPair(modelId);
  }
  static getComponentType(component: number) {
    return Vehicle.__inject__.GetVehicleComponentType(component);
  }
  static colorIndexToColor(index: number, alpha = 0xff) {
    return Vehicle.__inject__.VehicleColorIndexToColor(index, alpha);
  }
  static isValid(vehicleId: number) {
    return Vehicle.__inject__.IsValidVehicle(vehicleId);
  }
  static getModelsUsed() {
    return Vehicle.__inject__.GetVehicleModelsUsed();
  }
  static getModelCount(modelId: number) {
    return Vehicle.__inject__.GetVehicleModelCount(modelId);
  }

  static getInstance(id: number) {
    return vehiclePool.get(id);
  }
  static getInstances() {
    return [...vehiclePool.values()];
  }

  static __inject__ = {
    AddStaticVehicle: v.AddStaticVehicle,
    AddStaticVehicleEx: v.AddStaticVehicleEx,
    CreateVehicle: v.CreateVehicle,
    DestroyVehicle: v.DestroyVehicle,
    AddVehicleComponent: v.AddVehicleComponent,
    RemoveVehicleComponent: v.RemoveVehicleComponent,
    GetVehicleComponentInSlot: v.GetVehicleComponentInSlot,
    LinkVehicleToInterior: v.LinkVehicleToInterior,
    SetVehicleVirtualWorld: v.SetVehicleVirtualWorld,
    GetVehicleVirtualWorld: v.GetVehicleVirtualWorld,
    RepairVehicle: v.RepairVehicle,
    SetVehiclePos: v.SetVehiclePos,
    GetVehiclePos: v.GetVehiclePos,
    GetVehicleHealth: v.GetVehicleHealth,
    SetVehicleHealth: v.SetVehicleHealth,
    IsPlayerInVehicle: v.IsPlayerInVehicle,
    PutPlayerInVehicle: v.PutPlayerInVehicle,
    GetVehicleZAngle: v.GetVehicleZAngle,
    SetVehicleZAngle: v.SetVehicleZAngle,
    SetVehicleNumberPlate: v.SetVehicleNumberPlate,
    ChangeVehicleColors: v.ChangeVehicleColors,
    SetVehicleVelocity: v.SetVehicleVelocity,
    GetVehicleVelocity: v.GetVehicleVelocity,
    SetVehicleAngularVelocity: v.SetVehicleAngularVelocity,
    GetVehicleDamageStatus: v.GetVehicleDamageStatus,
    UpdateVehicleDamageStatus: v.UpdateVehicleDamageStatus,
    GetVehicleDistanceFromPoint: v.GetVehicleDistanceFromPoint,
    GetVehicleModel: v.GetVehicleModel,
    GetVehicleModelInfo: v.GetVehicleModelInfo,
    GetVehicleRotation: v.GetVehicleRotation,
    GetVehicleRotationQuat: v.GetVehicleRotationQuat,
    SetVehicleToRespawn: v.SetVehicleToRespawn,
    IsVehicleStreamedIn: v.IsVehicleStreamedIn,
    SetVehicleParamsCarDoors: v.SetVehicleParamsCarDoors,
    SetVehicleParamsCarWindows: v.SetVehicleParamsCarWindows,
    GetVehicleParamsCarDoors: v.GetVehicleParamsCarDoors,
    GetVehicleParamsCarWindows: v.GetVehicleParamsCarWindows,
    SetVehicleParamsEx: v.SetVehicleParamsEx,
    GetVehicleParamsEx: v.GetVehicleParamsEx,
    GetVehicleParamsSirenState: v.GetVehicleParamsSirenState,
    SetVehicleParamsForPlayer: v.SetVehicleParamsForPlayer,
    IsTrailerAttachedToVehicle: v.IsTrailerAttachedToVehicle,
    ChangeVehiclePaintjob: v.ChangeVehiclePaintjob,
    AttachTrailerToVehicle: v.AttachTrailerToVehicle,
    DetachTrailerFromVehicle: v.DetachTrailerFromVehicle,
    GetVehicleTrailer: v.GetVehicleTrailer,
    GetVehicleMatrix: v.GetVehicleMatrix,
    GetVehicleTrainSpeed: v.GetVehicleTrainSpeed,
    GetVehicleHydraReactorAngle: v.GetVehicleHydraReactorAngle,
    GetVehicleLandingGearState: v.GetVehicleLandingGearState,
    GetVehicleSirenState: v.GetVehicleSirenState,
    GetVehicleDriver: v.GetVehicleDriver,
    GetVehicleLastDriver: v.GetVehicleLastDriver,
    IsVehicleSirenEnabled: v.IsVehicleSirenEnabled,
    ToggleVehicleSirenEnabled: v.ToggleVehicleSirenEnabled,
    SetVehicleParamsSirenState: v.SetVehicleParamsSirenState,
    IsVehicleDead: v.IsVehicleDead,
    SetVehicleDead: v.SetVehicleDead,
    SetVehicleBeenOccupied: v.SetVehicleBeenOccupied,
    GetVehicleRespawnTick: v.GetVehicleRespawnTick,
    SetVehicleRespawnTick: v.SetVehicleRespawnTick,
    IsVehicleOccupied: v.IsVehicleOccupied,
    HasVehicleBeenOccupied: v.HasVehicleBeenOccupied,
    GetVehicleOccupiedTick: v.GetVehicleOccupiedTick,
    SetVehicleOccupiedTick: v.SetVehicleOccupiedTick,
    GetVehicleCab: v.GetVehicleCab,
    GetVehicleRespawnDelay: v.GetVehicleRespawnDelay,
    SetVehicleRespawnDelay: v.SetVehicleRespawnDelay,
    GetVehicleNumberPlate: v.GetVehicleNumberPlate,
    GetVehicleInterior: v.GetVehicleInterior,
    GetVehiclePaintjob: v.GetVehiclePaintjob,
    GetVehicleColors: v.GetVehicleColors,
    SetVehicleSpawnInfo: v.SetVehicleSpawnInfo,
    GetVehicleSpawnInfo: v.GetVehicleSpawnInfo,
    GetRandomVehicleColorPair: v.GetRandomVehicleColorPair,
    ShowVehicle: v.ShowVehicle,
    HideVehicle: v.HideVehicle,
    IsVehicleHidden: v.IsVehicleHidden,
    GetVehicleOccupant: v.GetVehicleOccupant,
    GetVehicleMaxPassengers: v.GetVehicleMaxPassengers,
    CountVehicleOccupants: v.CountVehicleOccupants,
    GetVehicleComponentType: v.GetVehicleComponentType,
    VehicleColorIndexToColor: v.VehicleColorIndexToColor,
    IsValidVehicle: v.IsValidVehicle,
    GetVehicleModelsUsed: v.GetVehicleModelsUsed,
    GetVehicleModelCount: v.GetVehicleModelCount,
  };
}
