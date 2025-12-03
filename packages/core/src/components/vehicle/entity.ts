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
      if (vehOrId === InvalidEnum.VEHICLE_ID) {
        throw new Error("[Vehicle]: Invalid id");
      }

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
      throw new Error("[Vehicle]: Cannot create again");
    if (!this.sourceInfo)
      throw new Error("[Vehicle]: Cannot create with only id");
    const { modelId, x, y, z, zAngle, color, respawnDelay, addSiren } =
      this.sourceInfo;
    if (!ignoreRange && !isValidVehModelId(modelId)) return;
    if (this.isStatic) {
      if (typeof respawnDelay === "undefined") {
        this._id = Vehicle.__inject__.addStatic(
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
      this._id = Vehicle.__inject__.addStaticEx(
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
      this._id = Vehicle.__inject__.create(
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
      throw new Error("[Vehicle]: Cannot create vehicle");
    Vehicle.createdCount++;
    vehiclePool.set(this._id, this);
  }
  destroy(): void {
    if (this.id === InvalidEnum.VEHICLE_ID && !INTERNAL_FLAGS.skip) {
      throw new Error("[Vehicle]: Cannot destroy the vehicle before create");
    }
    if (!INTERNAL_FLAGS.skip) {
      Vehicle.__inject__.destroy(this._id);
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
    return Vehicle.__inject__.addComponent(this.id, componentId);
  }
  removeComponent(componentId: number): number {
    if (this.getComponentInSlot(Vehicle.getComponentType(componentId)) === 0) {
      throw new Error(
        `[Vehicle]: component id ${componentId} does not exist on this vehicle`,
      );
    }
    return Vehicle.__inject__.removeComponent(this.id, componentId);
  }
  getComponentInSlot(slot: CarModTypeEnum) {
    return Vehicle.__inject__.getComponentInSlot(this.id, slot);
  }
  linkToInterior(interiorId: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.linkToInterior(this.id, interiorId);
  }
  setVirtualWorld(worldId: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.setVirtualWorld(this.id, worldId);
  }
  getVirtualWorld(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.getVirtualWorld(this.id);
  }
  repair(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.repair(this.id);
  }
  setPos(x: number, y: number, z: number): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.setPos(this.id, x, y, z);
  }
  getPos() {
    return Vehicle.__inject__.getPos(this.id);
  }
  getHealth() {
    return Vehicle.__inject__.getHealth(this.id);
  }
  setHealth(health: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.setHealth(this.id, health);
  }
  isPlayerIn(player: Player): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.isPlayerIn(player.id, this.id);
  }
  putPlayerIn(player: Player, seatId: number) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    if (seatId < 0) return 0;
    if (seatId > 4) {
      throw new Error(
        "[Vehicle]: If the seat is invalid or is taken, will cause a crash when they EXIT the vehicle.",
      );
    }
    return Vehicle.__inject__.putPlayerIn(player.id, this.id, seatId);
  }
  getZAngle() {
    return Vehicle.__inject__.getZAngle(this.id);
  }
  setZAngle(zAngle: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.setZAngle(this.id, zAngle);
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
    return Vehicle.__inject__.setNumberPlate(this.id, numberplate);
  }
  changeColors(color1: string | number, color2: string | number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.changeColors(this.id, color1, color2);
  }
  setVelocity(X: number, Y: number, Z: number) {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.setVelocity(this.id, X, Y, Z);
  }
  getVelocity() {
    return Vehicle.__inject__.getVelocity(this.id);
  }
  getSpeed(magic = 180.0) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0.0;
    const { x, y, z } = this.getVelocity();
    return VectorSize(x, y, z) * magic;
  }
  setAngularVelocity(X: number, Y: number, Z: number): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.setAngularVelocity(this.id, X, Y, Z);
  }
  getDamageStatus() {
    return Vehicle.__inject__.getDamageStatus(this.id);
  }
  updateDamageStatus(
    panels: number,
    doors: number,
    lights: number,
    tires: number,
  ) {
    return Vehicle.__inject__.updateDamageStatus(
      this.id,
      panels,
      doors,
      lights,
      tires,
    );
  }
  getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return Vehicle.__inject__.getDistanceFromPoint(this.id, X, Y, Z);
  }
  getModel(): number {
    return Vehicle.__inject__.getModel(this.id);
  }
  static getModelInfo(vehicleModel: number, infoType: VehicleModelInfoEnum) {
    return Vehicle.__inject__.getModelInfo(vehicleModel, infoType);
  }
  getModelInfo(infoType: VehicleModelInfoEnum) {
    return Vehicle.getModelInfo(this.getModel(), infoType);
  }
  getRotation() {
    return Vehicle.__inject__.getRotation(this.id);
  }
  getRotationQuat() {
    return Vehicle.__inject__.getRotationQuat(this.id);
  }
  setRespawn(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.setRespawn(this.id);
  }
  isStreamedIn(forPlayer: Player): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.isStreamedIn(this.id, forPlayer.id);
  }
  setParamsCarDoors(
    driver: boolean,
    passenger: boolean,
    backLeft: boolean,
    backRight: boolean,
  ): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.setParamsCarDoors(
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
    return Vehicle.__inject__.setParamsCarWindows(
      this.id,
      driver,
      passenger,
      backLeft,
      backRight,
    );
  }
  getParamsCarDoors() {
    return Vehicle.__inject__.getParamsCarDoors(this.id);
  }
  getParamsCarWindows() {
    return Vehicle.__inject__.getParamsCarWindows(this.id);
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
    return Vehicle.__inject__.setParamsEx(
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
      Vehicle.__inject__.getParamsEx(this.id);
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
    return Vehicle.__inject__.getParamsSirenState(this.id);
  }
  setParamsForPlayer(
    player: Player,
    objective: boolean,
    doorsLocked: boolean,
  ): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.setParamsForPlayer(
      this.id,
      player.id,
      objective,
      doorsLocked,
    );
  }
  isTrailerAttached(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.isTrailerAttached(this.id);
  }
  changePaintjob(paintjobId: 0 | 1 | 2): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    if (!isValidPaintJob(this.getModel(), paintjobId)) return 0;
    this.changeColors("#fff", "#fff");
    Vehicle.__inject__.changePaintjob(this.id, paintjobId);
    return 1;
  }
  attachTrailer(trailer: Vehicle): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.attachTrailer(trailer.id, this.id);
  }
  detachTrailer() {
    if (this.isTrailerAttached()) Vehicle.__inject__.detachTrailer(this.id);
  }
  getTrailer() {
    return Vehicle.getInstance(v.GetVehicleTrailer(this.id));
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.VEHICLE_ID) return true;
    return Vehicle.isValid(this.id);
  }
  getMatrix() {
    return Vehicle.__inject__.getMatrix(this.id);
  }
  getTrainSpeed(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.getTrainSpeed(this.id);
  }
  getHydraReactorAngle(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.getHydraReactorAngle(this.id);
  }
  getLandingGearState(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.getLandingGearState(this.id);
  }
  getSirenState(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.getSirenState(this.id);
  }
  getDriver() {
    return playerPool.get(v.GetVehicleDriver(this.id));
  }
  getLastDriver() {
    return playerPool.get(v.GetVehicleLastDriver(this.id));
  }
  isSirenEnabled(): boolean {
    return Vehicle.__inject__.isSirenEnabled(this.id);
  }
  toggleSirenEnabled(enabled: boolean): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.toggleSirenEnabled(this.id, enabled);
  }
  setParamsSirenState(enabled: boolean): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.setParamsSirenState(this.id, enabled);
  }
  isDead(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return true;
    return Vehicle.__inject__.isDead(this.id);
  }
  setDead(dead: boolean): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.setDead(this.id, dead);
  }
  setBeenOccupied(occupied: boolean) {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.setBeenOccupied(this.id, occupied);
  }
  getRespawnTick(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.getRespawnTick(this.id);
  }
  setRespawnTick(ticks: number) {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.setRespawnTick(this.id, ticks);
  }
  isOccupied(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.isOccupied(this.id);
  }
  hasBeenOccupied(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.hasBeenOccupied(this.id);
  }
  getOccupiedTick(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.getOccupiedTick(this.id);
  }
  setOccupiedTick(ticks: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.setOccupiedTick(this.id, ticks);
  }
  getCab(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.getCab(this.id);
  }
  getRespawnDelay(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.getRespawnDelay(this.id);
  }
  setRespawnDelay(delay: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.setRespawnDelay(this.id, delay);
  }
  getNumberPlate() {
    return Vehicle.__inject__.getNumberPlate(this.id);
  }
  getInterior(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__.getInterior(this.id);
  }
  getPaintjob(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return InvalidEnum.VEHICLE_ID;
    return Vehicle.__inject__.getPaintjob(this.id);
  }
  getColors() {
    return Vehicle.__inject__.getColors(this.id);
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
    return Vehicle.__inject__.setSpawnInfo(
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
    return Vehicle.__inject__.getSpawnInfo(this.id);
  }
  getRandomColorPair() {
    return Vehicle.__inject__.getRandomColorPair(this.getModel());
  }
  show() {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.show(this.id);
  }
  hide() {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.hide(this.id);
  }
  isHidden() {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__.isHidden(this.id);
  }
  getOccupant(seatId: number) {
    return Vehicle.__inject__.getOccupant(this.id, seatId);
  }
  getMaxPassengers() {
    return Vehicle.__inject__.getMaxPassengers(this.getModel());
  }
  countOccupants() {
    return Vehicle.__inject__.countOccupants(this.getModel());
  }
  static getMaxPassengers(modelId: number) {
    return Vehicle.__inject__.getMaxPassengers(modelId);
  }
  static getRandomColorPair(modelId: number) {
    return Vehicle.__inject__.getRandomColorPair(modelId);
  }
  static getComponentType(component: number) {
    return Vehicle.__inject__.getComponentType(component);
  }
  static colorIndexToColor(index: number, alpha = 0xff) {
    return Vehicle.__inject__.colorIndexToColor(index, alpha);
  }
  static isValid(vehicleId: number) {
    return Vehicle.__inject__.isValid(vehicleId);
  }
  static getModelsUsed() {
    return Vehicle.__inject__.getModelsUsed();
  }
  static getModelCount(modelId: number) {
    return Vehicle.__inject__.getModelCount(modelId);
  }

  static getInstance(id: number) {
    return vehiclePool.get(id);
  }
  static getInstances() {
    return [...vehiclePool.values()];
  }

  static __inject__ = {
    addStatic: v.AddStaticVehicle,
    addStaticEx: v.AddStaticVehicleEx,
    create: v.CreateVehicle,
    destroy: v.DestroyVehicle,
    addComponent: v.AddVehicleComponent,
    removeComponent: v.RemoveVehicleComponent,
    getComponentInSlot: v.GetVehicleComponentInSlot,
    linkToInterior: v.LinkVehicleToInterior,
    setVirtualWorld: v.SetVehicleVirtualWorld,
    getVirtualWorld: v.GetVehicleVirtualWorld,
    repair: v.RepairVehicle,
    setPos: v.SetVehiclePos,
    getPos: v.GetVehiclePos,
    getHealth: v.GetVehicleHealth,
    setHealth: v.SetVehicleHealth,
    isPlayerIn: v.IsPlayerInVehicle,
    putPlayerIn: v.PutPlayerInVehicle,
    getZAngle: v.GetVehicleZAngle,
    setZAngle: v.SetVehicleZAngle,
    setNumberPlate: v.SetVehicleNumberPlate,
    changeColors: v.ChangeVehicleColors,
    setVelocity: v.SetVehicleVelocity,
    getVelocity: v.GetVehicleVelocity,
    setAngularVelocity: v.SetVehicleAngularVelocity,
    getDamageStatus: v.GetVehicleDamageStatus,
    updateDamageStatus: v.UpdateVehicleDamageStatus,
    getDistanceFromPoint: v.GetVehicleDistanceFromPoint,
    getModel: v.GetVehicleModel,
    getModelInfo: v.GetVehicleModelInfo,
    getRotation: v.GetVehicleRotation,
    getRotationQuat: v.GetVehicleRotationQuat,
    setRespawn: v.SetVehicleToRespawn,
    isStreamedIn: v.IsVehicleStreamedIn,
    setParamsCarDoors: v.SetVehicleParamsCarDoors,
    setParamsCarWindows: v.SetVehicleParamsCarWindows,
    getParamsCarDoors: v.GetVehicleParamsCarDoors,
    getParamsCarWindows: v.GetVehicleParamsCarWindows,
    setParamsEx: v.SetVehicleParamsEx,
    getParamsEx: v.GetVehicleParamsEx,
    getParamsSirenState: v.GetVehicleParamsSirenState,
    setParamsForPlayer: v.SetVehicleParamsForPlayer,
    isTrailerAttached: v.IsTrailerAttachedToVehicle,
    changePaintjob: v.ChangeVehiclePaintjob,
    attachTrailer: v.AttachTrailerToVehicle,
    detachTrailer: v.DetachTrailerFromVehicle,
    getMatrix: v.GetVehicleMatrix,
    getTrainSpeed: v.GetVehicleTrainSpeed,
    getHydraReactorAngle: v.GetVehicleHydraReactorAngle,
    getLandingGearState: v.GetVehicleLandingGearState,
    getSirenState: v.GetVehicleSirenState,
    getDriver: v.GetVehicleDriver,
    getLastDriver: v.GetVehicleLastDriver,
    isSirenEnabled: v.IsVehicleSirenEnabled,
    toggleSirenEnabled: v.ToggleVehicleSirenEnabled,
    setParamsSirenState: v.SetVehicleParamsSirenState,
    isDead: v.IsVehicleDead,
    setDead: v.SetVehicleDead,
    setBeenOccupied: v.SetVehicleBeenOccupied,
    getRespawnTick: v.GetVehicleRespawnTick,
    setRespawnTick: v.SetVehicleRespawnTick,
    isOccupied: v.IsVehicleOccupied,
    hasBeenOccupied: v.HasVehicleBeenOccupied,
    getOccupiedTick: v.GetVehicleOccupiedTick,
    setOccupiedTick: v.SetVehicleOccupiedTick,
    getCab: v.GetVehicleCab,
    getRespawnDelay: v.GetVehicleRespawnDelay,
    setRespawnDelay: v.SetVehicleRespawnDelay,
    getNumberPlate: v.GetVehicleNumberPlate,
    getInterior: v.GetVehicleInterior,
    getPaintjob: v.GetVehiclePaintjob,
    getColors: v.GetVehicleColors,
    setSpawnInfo: v.SetVehicleSpawnInfo,
    getSpawnInfo: v.GetVehicleSpawnInfo,
    getRandomColorPair: v.GetRandomVehicleColorPair,
    show: v.ShowVehicle,
    hide: v.HideVehicle,
    isHidden: v.IsVehicleHidden,
    getOccupant: v.GetVehicleOccupant,
    getMaxPassengers: v.GetVehicleMaxPassengers,
    countOccupants: v.CountVehicleOccupants,
    getComponentType: v.GetVehicleComponentType,
    colorIndexToColor: v.VehicleColorIndexToColor,
    isValid: v.IsValidVehicle,
    getModelsUsed: v.GetVehicleModelsUsed,
    getModelCount: v.GetVehicleModelCount,
  };
}
