import {
  CarModTypeEnum,
  LandingGearStateEnum,
  VehicleModelInfoEnum,
  VehicleParamsEnum,
} from "core/enums";
import type {
  IVehColor,
  IVehMatrix,
  IVehSpawnInfo,
} from "./interfaces/Vehicle";
import { rgba } from "core/utils/color";
import { ICommonRetVal } from "core/interfaces";

export const GetVehicleSpawnInfo = (
  vehicleId: number,
): IVehSpawnInfo & ICommonRetVal => {
  const [
    fX = 0,
    fY = 0,
    fZ = 0,
    fRot = 0,
    color1 = 0,
    color2 = 0,
    ret,
  ]: number[] = samp.callNative("GetVehicleSpawnInfo", "iFFFFII", vehicleId);
  return { fX, fY, fZ, fRot, color1, color2, ret: !!ret };
};

export const SetVehicleSpawnInfo = (
  vehicleId: number,
  modelId: number,
  fX: number,
  fY: number,
  fZ: number,
  fAngle: number,
  color1: number,
  color2: number,
  respawnTime = -2,
  interior = -2,
): boolean => {
  return !!samp.callNative(
    "SetVehicleSpawnInfo",
    "iiffffiiii",
    vehicleId,
    modelId,
    fX,
    fY,
    fZ,
    fAngle,
    color1,
    color2,
    respawnTime,
    interior,
  );
};

export const GetVehicleColors = (
  vehicleId: number,
): IVehColor & ICommonRetVal => {
  const [color1 = 0, color2 = 0, ret]: [number, number, number] =
    samp.callNative("GetVehicleColor", "iII", vehicleId);
  return { color1, color2, ret: !!ret };
};

export const GetVehiclePaintjob = (vehicleId: number): number => {
  return samp.callNative("GetVehiclePaintjob", "i", vehicleId);
};

export const GetVehicleInterior = (vehicleId: number): number => {
  return samp.callNative("GetVehicleInterior", "i", vehicleId);
};

export const GetVehicleNumberPlate = (vehicleId: number) => {
  const [plate, ret]: [string, number] = samp.callNative(
    "GetVehicleNumberPlate",
    "iSi",
    vehicleId,
    33,
  );
  return { plate, ret: !!ret };
};

export const SetVehicleRespawnDelay = (
  vehicleId: number,
  delay: number,
): boolean => {
  return !!samp.callNative("SetVehicleRespawnDelay", "ii", vehicleId, delay);
};

export const GetVehicleRespawnDelay = (vehicleId: number): number => {
  return samp.callNative("GetVehicleRespawnDelay", "i", vehicleId);
};

export const GetVehicleCab = (vehicleId: number): number => {
  return samp.callNative("GetVehicleCab", "i", vehicleId);
};

export const GetVehicleOccupiedTick = (vehicleId: number): number => {
  return samp.callNative("GetVehicleOccupiedTick", "i", vehicleId);
};

export const SetVehicleOccupiedTick = (
  vehicleId: number,
  ticks: number,
): number => {
  return samp.callNative("SetVehicleOccupiedTick", "ii", vehicleId, ticks);
};

export const HasVehicleBeenOccupied = (vehicleId: number): boolean => {
  return !!samp.callNative("HasVehicleBeenOccupied", "i", vehicleId);
};

export const IsVehicleOccupied = (vehicleId: number): boolean => {
  return !!samp.callNative("IsVehicleOccupied", "i", vehicleId);
};

export const GetVehicleRespawnTick = (vehicleId: number): number => {
  return samp.callNative("GetVehicleRespawnTick", "i", vehicleId);
};

export const SetVehicleRespawnTick = (
  vehicleId: number,
  ticks: number,
): number => {
  return samp.callNative("SetVehicleRespawnTick", "ii", vehicleId, ticks);
};

export const IsVehicleDead = (vehicleId: number): boolean => {
  return !!samp.callNative("IsVehicleDead", "i", vehicleId);
};

export const SetVehicleDead = (vehicleId: number, dead: boolean) => {
  return !!samp.callNative("SetVehicleDead", "ii", vehicleId, dead);
};

export const SetVehicleBeenOccupied = (
  vehicleId: number,
  occupied: boolean,
) => {
  return !!samp.callNative("SetVehicleBeenOccupied", "ii", vehicleId, occupied);
};

export const ToggleVehicleSirenEnabled = (
  vehicleId: number,
  enabled: boolean,
): boolean => {
  return !!samp.callNative(
    "ToggleVehicleSirenEnabled",
    "ii",
    vehicleId,
    enabled,
  );
};

export const SetVehicleParamsSirenState = (
  vehicleId: number,
  enabled: boolean | VehicleParamsEnum,
): boolean => {
  return !!samp.callNative(
    "SetVehicleParamsSirenState",
    "ii",
    vehicleId,
    +enabled,
  );
};

export const IsVehicleSirenEnabled = (vehicleId: number): boolean => {
  return !!samp.callNative("IsVehicleSirenEnabled", "i", vehicleId);
};

export const GetVehicleModelCount = (modelId: number): number => {
  return samp.callNative("GetVehicleModelCount", "i", modelId);
};

export const GetVehicleLastDriver = (vehicleId: number): number => {
  return samp.callNative("GetVehicleLastDriver", "i", vehicleId);
};

export const GetVehicleDriver = (vehicleId: number): number => {
  return samp.callNative("GetVehicleDriver", "i", vehicleId);
};

export const GetVehicleModelsUsed = (): number => {
  return samp.callNative("GetVehicleModelsUsed", "");
};

export const GetVehicleSirenState = (vehicleId: number): boolean => {
  return !!samp.callNative("GetVehicleSirenState", "i", vehicleId);
};

export const GetVehicleLandingGearState = (
  vehicleId: number,
): LandingGearStateEnum => {
  return samp.callNative("GetVehicleLandingGearState", "i", vehicleId);
};

export const GetVehicleHydraReactorAngle = (vehicleId: number): number => {
  return samp.callNativeFloat("GetVehicleHydraReactorAngle", "i", vehicleId);
};

export const GetVehicleTrainSpeed = (vehicleId: number): number => {
  return samp.callNativeFloat("GetVehicleTrainSpeed", "i", vehicleId);
};

export const GetVehicleMatrix = (
  vehicleId: number,
): IVehMatrix & ICommonRetVal => {
  const [
    rightX = 0,
    rightY = 0,
    rightZ = 0,
    upX = 0,
    upY = 0,
    upZ = 0,
    atX = 0,
    atY = 0,
    atZ = 0,
    ret,
  ]: number[] = samp.callNative("GetVehicleMatrix", "iFFFFFFFFF", vehicleId);
  return { rightX, rightY, rightZ, upX, upY, upZ, atX, atY, atZ, ret: !!ret };
};

export const GetRandomVehicleColorPair = (modelId: number) => {
  const [color1 = 0, color2 = 0, color3 = 0, color4 = 0, ret]: number[] =
    samp.callNative("GetRandomCarColPair", "iIIII", modelId);
  return {
    color: [color1, color2, color3, color4] as [number, number, number, number],
    ret: !!ret,
  };
};

export const VehicleColorIndexToColor = (
  index: number,
  alpha = 0xff,
): number => {
  return samp.callNative("CarColIndexToColour", "ii", index, alpha);
};

export const CreateVehicle = (
  vehicleType: number,
  x: number,
  y: number,
  z: number,
  rotation: number,
  color1: string | number,
  color2: string | number,
  respawnDelay: number,
  addSiren: boolean,
): number => {
  return samp.callNative(
    "CreateVehicle",
    "iffffiiii",
    vehicleType,
    x,
    y,
    z,
    rotation,
    rgba(color1),
    rgba(color2),
    respawnDelay,
    addSiren,
  );
};

export const DestroyVehicle = (vehicleId: number): boolean => {
  return !!samp.callNative("DestroyVehicle", "i", vehicleId);
};

export const IsVehicleStreamedIn = (
  vehicleId: number,
  forPlayerId: number,
): boolean => {
  return !!samp.callNative("IsVehicleStreamedIn", "ii", vehicleId, forPlayerId);
};

export const GetVehiclePos = (vehicleId: number) => {
  const [x, y, z, ret] = samp.callNative(
    "GetVehiclePos",
    "iFFF",
    vehicleId,
  ) as [number, number, number, number];
  return {
    x,
    y,
    z,
    ret: !!ret,
  };
};

export const SetVehiclePos = (
  vehicleId: number,
  x: number,
  y: number,
  z: number,
): boolean => {
  return !!samp.callNative("SetVehiclePos", "ifff", vehicleId, x, y, z);
};

export const GetVehicleZAngle = (vehicleId: number) => {
  const [angle, ret]: [number, number] = samp.callNative(
    "GetVehicleZAngle",
    "iF",
    vehicleId,
  );
  return { angle, ret: !!ret };
};

export const GetVehicleRotation = (vehicleId: number) => {
  const [x, y, z, ret]: [number, number, number, number, number] =
    samp.callNative("GetVehicleRotation", "iFFF", vehicleId);
  return { x, y, z, ret };
};

export const GetVehicleRotationQuat = (vehicleId: number) => {
  const [w, x, y, z, ret]: [number, number, number, number, number] =
    samp.callNative("GetVehicleRotationQuat", "iFFFF", vehicleId);
  return { w, x, y, z, ret: !!ret };
};

export const GetVehicleDistanceFromPoint = (
  vehicleId: number,
  x: number,
  y: number,
  z: number,
): number => {
  return samp.callNativeFloat(
    "GetVehicleDistanceFromPoint",
    "ifff",
    vehicleId,
    x,
    y,
    z,
  );
};

export const SetVehicleZAngle = (
  vehicleId: number,
  zAngle: number,
): boolean => {
  return !!samp.callNative("SetVehicleZAngle", "if", vehicleId, zAngle);
};

export const SetVehicleParamsForPlayer = (
  vehicleId: number,
  playerId: number,
  objective: boolean | VehicleParamsEnum = VehicleParamsEnum.UNSET,
  doorsLocked: boolean | VehicleParamsEnum = VehicleParamsEnum.UNSET,
): boolean => {
  return !!samp.callNative(
    "SetVehicleParamsForPlayer",
    "iiii",
    vehicleId,
    playerId,
    objective,
    doorsLocked,
  );
};

export const ManualVehicleEngineAndLights = (): void => {
  samp.callNative("ManualVehicleEngineAndLights", "");
};

export const SetVehicleParamsEx = (
  vehicleId: number,
  engine: boolean | VehicleParamsEnum,
  lights: boolean | VehicleParamsEnum,
  alarm: boolean | VehicleParamsEnum,
  doors: boolean | VehicleParamsEnum,
  bonnet: boolean | VehicleParamsEnum,
  boot: boolean | VehicleParamsEnum,
  objective: boolean | VehicleParamsEnum,
): boolean => {
  return !!samp.callNative(
    "SetVehicleParamsEx",
    "iiiiiiii",
    vehicleId,
    engine,
    lights,
    alarm,
    doors,
    bonnet,
    boot,
    objective,
  );
};

export const GetVehicleParamsEx = (
  vehicleId: number,
): [
  VehicleParamsEnum,
  VehicleParamsEnum,
  VehicleParamsEnum,
  VehicleParamsEnum,
  VehicleParamsEnum,
  VehicleParamsEnum,
  VehicleParamsEnum,
  number,
] => {
  return samp.callNative("GetVehicleParamsEx", "iIIIIIII", vehicleId);
};

export const GetVehicleParamsSirenState = (
  vehicleId: number,
): VehicleParamsEnum => {
  return samp.callNative("GetVehicleParamsSirenState", "i", vehicleId);
};

export const SetVehicleParamsCarDoors = (
  vehicleId: number,
  driver: boolean | VehicleParamsEnum = VehicleParamsEnum.UNSET,
  passenger: boolean | VehicleParamsEnum = VehicleParamsEnum.UNSET,
  backLeft: boolean | VehicleParamsEnum = VehicleParamsEnum.UNSET,
  backRight: boolean | VehicleParamsEnum = VehicleParamsEnum.UNSET,
): boolean => {
  return !!samp.callNative(
    "SetVehicleParamsCarDoors",
    "iiiii",
    vehicleId,
    +driver,
    +passenger,
    +backLeft,
    +backRight,
  );
};

export const GetVehicleParamsCarDoors = (vehicleId: number) => {
  const [driver, passenger, backLeft, backRight, ret]: [
    VehicleParamsEnum,
    VehicleParamsEnum,
    VehicleParamsEnum,
    VehicleParamsEnum,
    number,
  ] = samp.callNative("GetVehicleParamsCarDoors", "iIIII", vehicleId);
  return {
    driver,
    passenger,
    backLeft,
    backRight,
    ret: !!ret,
  };
};

export const SetVehicleParamsCarWindows = (
  vehicleId: number,
  driver: boolean | VehicleParamsEnum = VehicleParamsEnum.UNSET,
  passenger: boolean | VehicleParamsEnum = VehicleParamsEnum.UNSET,
  backLeft: boolean | VehicleParamsEnum = VehicleParamsEnum.UNSET,
  backRight: boolean | VehicleParamsEnum = VehicleParamsEnum.UNSET,
): boolean => {
  return !!samp.callNative(
    "SetVehicleParamsCarWindows",
    "iiiii",
    vehicleId,
    driver,
    passenger,
    backLeft,
    backRight,
  );
};

export const GetVehicleParamsCarWindows = (vehicleId: number) => {
  const [driver, passenger, backLeft, backRight, ret]: [
    VehicleParamsEnum,
    VehicleParamsEnum,
    VehicleParamsEnum,
    VehicleParamsEnum,
    number,
  ] = samp.callNative("GetVehicleParamsCarWindows", "iIIII", vehicleId);
  return {
    driver,
    passenger,
    backLeft,
    backRight,
    ret: !!ret,
  };
};

export const SetVehicleToRespawn = (vehicleId: number): boolean => {
  return !!samp.callNative("SetVehicleToRespawn", "i", vehicleId);
};

export const LinkVehicleToInterior = (
  vehicleId: number,
  interiorId: number,
) => {
  return !!samp.callNative(
    "LinkVehicleToInterior",
    "ii",
    vehicleId,
    interiorId,
  );
};

export const AddVehicleComponent = (vehicleId: number, componentId: number) => {
  return !!samp.callNative("AddVehicleComponent", "ii", vehicleId, componentId);
};

export const RemoveVehicleComponent = (
  vehicleId: number,
  componentId: number,
) => {
  return !!samp.callNative(
    "RemoveVehicleComponent",
    "ii",
    vehicleId,
    componentId,
  );
};

export const ChangeVehicleColors = (
  vehicleId: number,
  color1: string | number,
  color2: string | number,
): boolean => {
  return !!samp.callNative(
    "ChangeVehicleColor",
    "iii",
    vehicleId,
    rgba(color1),
    rgba(color2),
  );
};

export const ChangeVehiclePaintjob = (
  vehicleId: number,
  paintjobId: number,
): boolean => {
  return !!samp.callNative(
    "ChangeVehiclePaintjob",
    "ii",
    vehicleId,
    paintjobId,
  );
};

export const SetVehicleHealth = (
  vehicleId: number,
  health: number,
): boolean => {
  return !!samp.callNative("SetVehicleHealth", "if", vehicleId, health);
};

export const GetVehicleHealth = (vehicleId: number) => {
  const [health, ret]: [number, number] = samp.callNative(
    "GetVehicleHealth",
    "iF",
    vehicleId,
  );
  return { health, ret: !!ret };
};

export const AttachTrailerToVehicle = (
  trailerid: number,
  vehicleId: number,
): boolean => {
  return !!samp.callNative(
    "AttachTrailerToVehicle",
    "ii",
    trailerid,
    vehicleId,
  );
};

export const DetachTrailerFromVehicle = (vehicleId: number): boolean => {
  return !!samp.callNative("DetachTrailerFromVehicle", "i", vehicleId);
};

export const IsTrailerAttachedToVehicle = (vehicleId: number): boolean => {
  return !!samp.callNative("IsTrailerAttachedToVehicle", "i", vehicleId);
};

export const GetVehicleTrailer = (vehicleId: number): number => {
  return samp.callNative("GetVehicleTrailer", "i", vehicleId);
};

export const SetVehicleNumberPlate = (
  vehicleId: number,
  numberplate: string,
): boolean => {
  return !!samp.callNative(
    "SetVehicleNumberPlate",
    "is",
    vehicleId,
    numberplate,
  );
};

export const GetVehicleModel = (vehicleId: number): number => {
  return samp.callNative("GetVehicleModel", "i", vehicleId);
};

export const GetVehicleComponentInSlot = (
  vehicleId: number,
  slot: CarModTypeEnum,
): number => {
  return samp.callNative("GetVehicleComponentInSlot", "ii", vehicleId, slot);
};

export const GetVehicleComponentType = (component: number): CarModTypeEnum => {
  return samp.callNative("GetVehicleComponentType", "i", component);
};

export const RepairVehicle = (vehicleId: number) => {
  return !!samp.callNative("RepairVehicle", "i", vehicleId);
};

export const GetVehicleVelocity = (vehicleId: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetVehicleVelocity",
    "iFFF",
    vehicleId,
  );
  return { x, y, z, ret: !!ret };
};

export const SetVehicleVelocity = (
  vehicleId: number,
  x: number,
  y: number,
  z: number,
) => {
  return !!samp.callNative("SetVehicleVelocity", "ifff", vehicleId, x, y, z);
};

export const SetVehicleAngularVelocity = (
  vehicleId: number,
  x: number,
  y: number,
  z: number,
): boolean => {
  return !!samp.callNative(
    "SetVehicleAngularVelocity",
    "ifff",
    vehicleId,
    x,
    y,
    z,
  );
};

export const GetVehicleDamageStatus = (vehicleId: number) => {
  const [panels, doors, lights, tires, ret]: [
    number,
    number,
    number,
    number,
    number,
  ] = samp.callNative("GetVehicleDamageStatus", "iIIII", vehicleId);
  return {
    panels,
    doors,
    lights,
    tires,
    ret: !!ret,
  };
};

export const UpdateVehicleDamageStatus = (
  vehicleId: number,
  panels: number,
  doors: number,
  lights: number,
  tires: number,
): boolean => {
  return !!samp.callNative(
    "UpdateVehicleDamageStatus",
    "iiiii",
    vehicleId,
    panels,
    doors,
    lights,
    tires,
  );
};

export const GetVehicleModelInfo = (
  vehicleModel: number,
  infoType: VehicleModelInfoEnum,
) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetVehicleModelInfo",
    "iiFFF",
    vehicleModel,
    infoType,
  );
  return {
    x,
    y,
    z,
    ret: !!ret,
  };
};

export const SetVehicleVirtualWorld = (
  vehicleId: number,
  worldId: number,
): boolean => {
  return !!samp.callNative("SetVehicleVirtualWorld", "ii", vehicleId, worldId);
};

export const GetVehicleVirtualWorld = (vehicleId: number): number => {
  return samp.callNative("GetVehicleVirtualWorld", "i", vehicleId);
};

export const IsValidVehicle = (vehicleId: number): boolean => {
  return !!samp.callNative("IsValidVehicle", "i", vehicleId);
};

export const AddStaticVehicle = (
  modelId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  color1: string | number,
  color2: string | number,
): number => {
  return samp.callNative(
    "AddStaticVehicle",
    "iffffii",
    modelId,
    spawnX,
    spawnY,
    spawnZ,
    zAngle,
    rgba(color1),
    rgba(color2),
  );
};

export const AddStaticVehicleEx = (
  modelId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  color1: string | number,
  color2: string | number,
  respawnDelay: number,
  addSiren: boolean,
): number => {
  return samp.callNative(
    "AddStaticVehicleEx",
    "iffffiiii",
    modelId,
    spawnX,
    spawnY,
    spawnZ,
    zAngle,
    rgba(color1),
    rgba(color2),
    respawnDelay,
    addSiren,
  );
};

export const ShowVehicle = (vehicleId: number) => {
  return !!samp.callNative("ShowVehicle", "i", vehicleId);
};

export const HideVehicle = (vehicleId: number) => {
  return !!samp.callNative("HideVehicle", "i", vehicleId);
};

export const IsVehicleHidden = (vehicleId: number) => {
  return !!samp.callNative("IsVehicleHidden", "i", vehicleId);
};

export const IsPlayerInModShop = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerInModShop", "i", playerId);
};

export const GetPlayerSirenState = (playerId: number): boolean => {
  return !!samp.callNative("GetPlayerSirenState", "i", playerId);
};

export const GetPlayerLandingGearState = (
  playerId: number,
): LandingGearStateEnum => {
  return samp.callNative("GetPlayerLandingGearState", "i", playerId);
};

export const GetPlayerHydraReactorAngle = (playerId: number): number => {
  return samp.callNative("GetPlayerHydraReactorAngle", "i", playerId);
};

export const GetPlayerTrainSpeed = (playerId: number): number => {
  return samp.callNativeFloat("GetPlayerTrainSpeed", "i", playerId);
};

export const GetVehicleOccupant = (
  vehicleId: number,
  seatId: number,
): number => {
  return samp.callNative("GetVehicleOccupant", "ii", vehicleId, seatId);
};

export const GetVehicleMaxPassengers = (modelId: number): number => {
  return samp.callNative("GetVehicleMaxPassengers", "i", modelId);
};

export const CountVehicleOccupants = (vehicleId: number): number => {
  return samp.callNative("CountVehicleOccupants", "i", vehicleId);
};

export const VehicleCanHaveComponent = (
  modelId: number,
  componentId: number,
) => {
  return !!samp.callNative(
    "VehicleCanHaveComponent",
    "ii",
    modelId,
    componentId,
  );
};

export const GetVehicleSeats = (modelId: number): number => {
  return samp.callNative("GetVehicleSeats", "i", modelId);
};
