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
        this._id = Vehicle.__inject__AddStaticVehicle(
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
      this._id = Vehicle.__inject__AddStaticVehicleEx(
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
      this._id = Vehicle.__inject__CreateVehicle(
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
      Vehicle.__inject__DestroyVehicle(this.id);
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
    return Vehicle.__inject__AddVehicleComponent(this.id, componentId);
  }
  removeComponent(componentId: number): number {
    if (this.getComponentInSlot(Vehicle.getComponentType(componentId)) === 0) {
      throw new Error(
        `[Vehicle]: component id ${componentId} does not exist on this vehicle`,
      );
    }
    return Vehicle.__inject__RemoveVehicleComponent(this.id, componentId);
  }
  getComponentInSlot(slot: CarModTypeEnum) {
    return Vehicle.__inject__GetVehicleComponentInSlot(this.id, slot);
  }
  linkToInterior(interiorId: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__LinkVehicleToInterior(this.id, interiorId);
  }
  setVirtualWorld(worldId: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__SetVehicleVirtualWorld(this.id, worldId);
  }
  getVirtualWorld(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__GetVehicleVirtualWorld(this.id);
  }
  repair(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__RepairVehicle(this.id);
  }
  setPos(x: number, y: number, z: number): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__SetVehiclePos(this.id, x, y, z);
  }
  getPos() {
    return Vehicle.__inject__GetVehiclePos(this.id);
  }
  getHealth() {
    return Vehicle.__inject__GetVehicleHealth(this.id);
  }
  setHealth(health: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__SetVehicleHealth(this.id, health);
  }
  isPlayerIn(player: Player): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__IsPlayerInVehicle(player.id, this.id);
  }
  putPlayerIn(player: Player, seatId: number) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    if (seatId < 0) return 0;
    if (seatId > 4) {
      throw new Error(
        "[Vehicle]: If the seat is invalid or is taken, will cause a crash when they EXIT the vehicle.",
      );
    }
    return Vehicle.__inject__PutPlayerInVehicle(player.id, this.id, seatId);
  }
  getZAngle() {
    return Vehicle.__inject__GetVehicleZAngle(this.id);
  }
  setZAngle(zAngle: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__SetVehicleZAngle(this.id, zAngle);
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
    return Vehicle.__inject__SetVehicleNumberPlate(this.id, numberplate);
  }
  changeColors(color1: string | number, color2: string | number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__ChangeVehicleColors(this.id, color1, color2);
  }
  setVelocity(X: number, Y: number, Z: number) {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__SetVehicleVelocity(this.id, X, Y, Z);
  }
  getVelocity() {
    return Vehicle.__inject__GetVehicleVelocity(this.id);
  }
  getSpeed(magic = 180.0) {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0.0;
    const { x, y, z } = this.getVelocity();
    return VectorSize(x, y, z) * magic;
  }
  setAngularVelocity(X: number, Y: number, Z: number): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__SetVehicleAngularVelocity(this.id, X, Y, Z);
  }
  getDamageStatus() {
    return Vehicle.__inject__GetVehicleDamageStatus(this.id);
  }
  updateDamageStatus(
    panels: number,
    doors: number,
    lights: number,
    tires: number,
  ) {
    return Vehicle.__inject__UpdateVehicleDamageStatus(
      this.id,
      panels,
      doors,
      lights,
      tires,
    );
  }
  getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return Vehicle.__inject__GetVehicleDistanceFromPoint(this.id, X, Y, Z);
  }
  getModel(): number {
    return Vehicle.__inject__GetVehicleModel(this.id);
  }
  static getModelInfo(vehicleModel: number, infoType: VehicleModelInfoEnum) {
    return Vehicle.__inject__GetVehicleModelInfo(vehicleModel, infoType);
  }
  getModelInfo(infoType: VehicleModelInfoEnum) {
    return Vehicle.getModelInfo(this.getModel(), infoType);
  }
  getRotation() {
    return Vehicle.__inject__GetVehicleRotation(this.id);
  }
  getRotationQuat() {
    return Vehicle.__inject__GetVehicleRotationQuat(this.id);
  }
  setRespawn(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__SetVehicleToRespawn(this.id);
  }
  isStreamedIn(forPlayer: Player): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__IsVehicleStreamedIn(this.id, forPlayer.id);
  }
  setParamsCarDoors(
    driver: boolean,
    passenger: boolean,
    backLeft: boolean,
    backRight: boolean,
  ): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__SetVehicleParamsCarDoors(
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
    return Vehicle.__inject__SetVehicleParamsCarWindows(
      this.id,
      driver,
      passenger,
      backLeft,
      backRight,
    );
  }
  getParamsCarDoors() {
    return Vehicle.__inject__GetVehicleParamsCarDoors(this.id);
  }
  getParamsCarWindows() {
    return Vehicle.__inject__GetVehicleParamsCarWindows(this.id);
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
    return Vehicle.__inject__SetVehicleParamsEx(
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
      Vehicle.__inject__GetVehicleParamsEx(this.id);
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
    return Vehicle.__inject__GetVehicleParamsSirenState(this.id);
  }
  setParamsForPlayer(
    player: Player,
    objective: boolean,
    doorsLocked: boolean,
  ): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__SetVehicleParamsForPlayer(
      this.id,
      player.id,
      objective,
      doorsLocked,
    );
  }
  isTrailerAttached(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__IsTrailerAttachedToVehicle(this.id);
  }
  changePaintjob(paintjobId: 0 | 1 | 2): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    if (!isValidPaintJob(this.getModel(), paintjobId)) return 0;
    this.changeColors("#fff", "#fff");
    Vehicle.__inject__ChangeVehiclePaintjob(this.id, paintjobId);
    return 1;
  }
  attachTrailer(trailer: Vehicle): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__AttachTrailerToVehicle(trailer.id, this.id);
  }
  detachTrailer() {
    if (this.isTrailerAttached())
      Vehicle.__inject__DetachTrailerFromVehicle(this.id);
  }
  getTrailer() {
    return Vehicle.getInstance(v.GetVehicleTrailer(this.id));
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.VEHICLE_ID) return true;
    return Vehicle.isValid(this.id);
  }
  getMatrix() {
    return Vehicle.__inject__GetVehicleMatrix(this.id);
  }
  getTrainSpeed(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__GetVehicleTrainSpeed(this.id);
  }
  getHydraReactorAngle(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__GetVehicleHydraReactorAngle(this.id);
  }
  getLandingGearState(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__GetVehicleLandingGearState(this.id);
  }
  getSirenState(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__GetVehicleSirenState(this.id);
  }
  getDriver() {
    return playerPool.get(v.GetVehicleDriver(this.id));
  }
  getLastDriver() {
    return playerPool.get(v.GetVehicleLastDriver(this.id));
  }
  isSirenEnabled(): boolean {
    return Vehicle.__inject__IsVehicleSirenEnabled(this.id);
  }
  toggleSirenEnabled(enabled: boolean): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__ToggleVehicleSirenEnabled(this.id, enabled);
  }
  setParamsSirenState(enabled: boolean): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__SetVehicleParamsSirenState(this.id, enabled);
  }
  isDead(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return true;
    return Vehicle.__inject__IsVehicleDead(this.id);
  }
  setDead(dead: boolean): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__SetVehicleDead(this.id, dead);
  }
  setBeenOccupied(occupied: boolean) {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__SetVehicleBeenOccupied(this.id, occupied);
  }
  getRespawnTick(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__GetVehicleRespawnTick(this.id);
  }
  setRespawnTick(ticks: number) {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__SetVehicleRespawnTick(this.id, ticks);
  }
  isOccupied(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__IsVehicleOccupied(this.id);
  }
  hasBeenOccupied(): boolean {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__HasVehicleBeenOccupied(this.id);
  }
  getOccupiedTick(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__GetVehicleOccupiedTick(this.id);
  }
  setOccupiedTick(ticks: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__SetVehicleOccupiedTick(this.id, ticks);
  }
  getCab(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__GetVehicleCab(this.id);
  }
  getRespawnDelay(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__GetVehicleRespawnDelay(this.id);
  }
  setRespawnDelay(delay: number): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__SetVehicleRespawnDelay(this.id, delay);
  }
  getNumberPlate() {
    return Vehicle.__inject__GetVehicleNumberPlate(this.id);
  }
  getInterior(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return 0;
    return Vehicle.__inject__GetVehicleInterior(this.id);
  }
  getPaintjob(): number {
    if (this.id === InvalidEnum.VEHICLE_ID) return InvalidEnum.VEHICLE_ID;
    return Vehicle.__inject__GetVehiclePaintjob(this.id);
  }
  getColors() {
    return Vehicle.__inject__GetVehicleColors(this.id);
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
    return Vehicle.__inject__SetVehicleSpawnInfo(
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
    return Vehicle.__inject__GetVehicleSpawnInfo(this.id);
  }
  getRandomColorPair() {
    return Vehicle.__inject__GetRandomVehicleColorPair(this.getModel());
  }
  show() {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__ShowVehicle(this.id);
  }
  hide() {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__HideVehicle(this.id);
  }
  isHidden() {
    if (this.id === InvalidEnum.VEHICLE_ID) return false;
    return Vehicle.__inject__IsVehicleHidden(this.id);
  }
  getVehicleOccupant(seatId: number) {
    return Vehicle.__inject__GetVehicleOccupant(this.id, seatId);
  }
  getVehicleMaxPassengers() {
    return Vehicle.__inject__GetVehicleMaxPassengers(this.getModel());
  }
  countVehicleOccupants() {
    return Vehicle.__inject__CountVehicleOccupants(this.getModel());
  }
  static getVehicleMaxPassengers(modelId: number) {
    return Vehicle.__inject__GetVehicleMaxPassengers(modelId);
  }
  static getRandomColorPair(modelId: number) {
    return Vehicle.__inject__GetRandomVehicleColorPair(modelId);
  }
  static getComponentType(component: number) {
    return Vehicle.__inject__GetVehicleComponentType(component);
  }
  static colorIndexToColor(index: number, alpha = 0xff) {
    return Vehicle.__inject__VehicleColorIndexToColor(index, alpha);
  }
  static isValid(vehicleId: number) {
    return Vehicle.__inject__IsValidVehicle(vehicleId);
  }
  static getModelsUsed() {
    return Vehicle.__inject__GetVehicleModelsUsed();
  }
  static getModelCount(modelId: number) {
    return Vehicle.__inject__GetVehicleModelCount(modelId);
  }

  static getInstance(id: number) {
    return vehiclePool.get(id);
  }
  static getInstances() {
    return [...vehiclePool.values()];
  }

  static __inject__AddStaticVehicle = v.AddStaticVehicle;
  static __inject__AddStaticVehicleEx = v.AddStaticVehicleEx;
  static __inject__CreateVehicle = v.CreateVehicle;
  static __inject__DestroyVehicle = v.DestroyVehicle;
  static __inject__AddVehicleComponent = v.AddVehicleComponent;
  static __inject__RemoveVehicleComponent = v.RemoveVehicleComponent;
  static __inject__GetVehicleComponentInSlot = v.GetVehicleComponentInSlot;
  static __inject__LinkVehicleToInterior = v.LinkVehicleToInterior;
  static __inject__SetVehicleVirtualWorld = v.SetVehicleVirtualWorld;
  static __inject__GetVehicleVirtualWorld = v.GetVehicleVirtualWorld;
  static __inject__RepairVehicle = v.RepairVehicle;
  static __inject__SetVehiclePos = v.SetVehiclePos;
  static __inject__GetVehiclePos = v.GetVehiclePos;
  static __inject__GetVehicleHealth = v.GetVehicleHealth;
  static __inject__SetVehicleHealth = v.SetVehicleHealth;
  static __inject__IsPlayerInVehicle = v.IsPlayerInVehicle;
  static __inject__PutPlayerInVehicle = v.PutPlayerInVehicle;
  static __inject__GetVehicleZAngle = v.GetVehicleZAngle;
  static __inject__SetVehicleZAngle = v.SetVehicleZAngle;
  static __inject__SetVehicleNumberPlate = v.SetVehicleNumberPlate;
  static __inject__ChangeVehicleColors = v.ChangeVehicleColors;
  static __inject__SetVehicleVelocity = v.SetVehicleVelocity;
  static __inject__GetVehicleVelocity = v.GetVehicleVelocity;
  static __inject__SetVehicleAngularVelocity = v.SetVehicleAngularVelocity;
  static __inject__GetVehicleDamageStatus = v.GetVehicleDamageStatus;
  static __inject__UpdateVehicleDamageStatus = v.UpdateVehicleDamageStatus;
  static __inject__GetVehicleDistanceFromPoint = v.GetVehicleDistanceFromPoint;
  static __inject__GetVehicleModel = v.GetVehicleModel;
  static __inject__GetVehicleModelInfo = v.GetVehicleModelInfo;
  static __inject__GetVehicleRotation = v.GetVehicleRotation;
  static __inject__GetVehicleRotationQuat = v.GetVehicleRotationQuat;
  static __inject__SetVehicleToRespawn = v.SetVehicleToRespawn;
  static __inject__IsVehicleStreamedIn = v.IsVehicleStreamedIn;
  static __inject__SetVehicleParamsCarDoors = v.SetVehicleParamsCarDoors;
  static __inject__SetVehicleParamsCarWindows = v.SetVehicleParamsCarWindows;
  static __inject__GetVehicleParamsCarDoors = v.GetVehicleParamsCarDoors;
  static __inject__GetVehicleParamsCarWindows = v.GetVehicleParamsCarWindows;
  static __inject__SetVehicleParamsEx = v.SetVehicleParamsEx;
  static __inject__GetVehicleParamsEx = v.GetVehicleParamsEx;
  static __inject__GetVehicleParamsSirenState = v.GetVehicleParamsSirenState;
  static __inject__SetVehicleParamsForPlayer = v.SetVehicleParamsForPlayer;
  static __inject__IsTrailerAttachedToVehicle = v.IsTrailerAttachedToVehicle;
  static __inject__ChangeVehiclePaintjob = v.ChangeVehiclePaintjob;
  static __inject__AttachTrailerToVehicle = v.AttachTrailerToVehicle;
  static __inject__DetachTrailerFromVehicle = v.DetachTrailerFromVehicle;
  static __inject__GetVehicleTrailer = v.GetVehicleTrailer;
  static __inject__GetVehicleMatrix = v.GetVehicleMatrix;
  static __inject__GetVehicleTrainSpeed = v.GetVehicleTrainSpeed;
  static __inject__GetVehicleHydraReactorAngle = v.GetVehicleHydraReactorAngle;
  static __inject__GetVehicleLandingGearState = v.GetVehicleLandingGearState;
  static __inject__GetVehicleSirenState = v.GetVehicleSirenState;
  static __inject__GetVehicleDriver = v.GetVehicleDriver;
  static __inject__GetVehicleLastDriver = v.GetVehicleLastDriver;
  static __inject__IsVehicleSirenEnabled = v.IsVehicleSirenEnabled;
  static __inject__ToggleVehicleSirenEnabled = v.ToggleVehicleSirenEnabled;
  static __inject__SetVehicleParamsSirenState = v.SetVehicleParamsSirenState;
  static __inject__IsVehicleDead = v.IsVehicleDead;
  static __inject__SetVehicleDead = v.SetVehicleDead;
  static __inject__SetVehicleBeenOccupied = v.SetVehicleBeenOccupied;
  static __inject__GetVehicleRespawnTick = v.GetVehicleRespawnTick;
  static __inject__SetVehicleRespawnTick = v.SetVehicleRespawnTick;
  static __inject__IsVehicleOccupied = v.IsVehicleOccupied;
  static __inject__HasVehicleBeenOccupied = v.HasVehicleBeenOccupied;
  static __inject__GetVehicleOccupiedTick = v.GetVehicleOccupiedTick;
  static __inject__SetVehicleOccupiedTick = v.SetVehicleOccupiedTick;
  static __inject__GetVehicleCab = v.GetVehicleCab;
  static __inject__GetVehicleRespawnDelay = v.GetVehicleRespawnDelay;
  static __inject__SetVehicleRespawnDelay = v.SetVehicleRespawnDelay;
  static __inject__GetVehicleNumberPlate = v.GetVehicleNumberPlate;
  static __inject__GetVehicleInterior = v.GetVehicleInterior;
  static __inject__GetVehiclePaintjob = v.GetVehiclePaintjob;
  static __inject__GetVehicleColors = v.GetVehicleColors;
  static __inject__SetVehicleSpawnInfo = v.SetVehicleSpawnInfo;
  static __inject__GetVehicleSpawnInfo = v.GetVehicleSpawnInfo;
  static __inject__GetRandomVehicleColorPair = v.GetRandomVehicleColorPair;
  static __inject__ShowVehicle = v.ShowVehicle;
  static __inject__HideVehicle = v.HideVehicle;
  static __inject__IsVehicleHidden = v.IsVehicleHidden;
  static __inject__GetVehicleOccupant = v.GetVehicleOccupant;
  static __inject__GetVehicleMaxPassengers = v.GetVehicleMaxPassengers;
  static __inject__CountVehicleOccupants = v.CountVehicleOccupants;
  static __inject__GetVehicleComponentType = v.GetVehicleComponentType;
  static __inject__VehicleColorIndexToColor = v.VehicleColorIndexToColor;
  static __inject__IsValidVehicle = v.IsValidVehicle;
  static __inject__GetVehicleModelsUsed = v.GetVehicleModelsUsed;
  static __inject__GetVehicleModelCount = v.GetVehicleModelCount;
}
