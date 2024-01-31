import type { CarModTypeEnum, VehicleModelInfoEnum } from "core/enums";
import type {
  IVehColor,
  IVehMatrix,
  IVehSpawnInfo,
} from "./interfaces/Vehicle";
import { rgba } from "core/utils/colorUtils";

export const GetVehicleSpawnInfo = (vehicleId: number): IVehSpawnInfo => {
  const [fX = 0, fY = 0, fZ = 0, fRot = 0, color1 = 0, color2 = 0]: number[] =
    samp.callNative("GetVehicleSpawnInfo", "iFFFFII", vehicleId);
  return { fX, fY, fZ, fRot, color1, color2 };
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
  interior = -2
): number => {
  return samp.callNative(
    "SetVehicleSpawnInfo",
    "iiFFFFiiii",
    vehicleId,
    modelId,
    fX,
    fY,
    fZ,
    fAngle,
    color1,
    color2,
    respawnTime,
    interior
  );
};

export const GetVehicleColors = (vehicleId: number): IVehColor => {
  const [color1 = 0, color2 = 0]: number[] = samp.callNative(
    "GetVehicleColor",
    "i",
    vehicleId
  );
  return { color1, color2 };
};

export const GetVehiclePaintjob = (vehicleId: number): number => {
  return samp.callNative("GetVehiclePaintjob", "i", vehicleId);
};

export const GetVehicleInterior = (vehicleId: number): number => {
  return samp.callNative("GetVehicleInterior", "i", vehicleId);
};

export const GetVehicleNumberPlate = (vehicleId: number): string => {
  return samp.callNative("GetVehicleNumberPlate", "iSi", vehicleId, 33);
};

export const SetVehicleRespawnDelay = (
  vehicleId: number,
  delay: number
): number => {
  return samp.callNative("SetVehicleRespawnDelay", "ii", vehicleId, delay);
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
  ticks: number
): number => {
  return samp.callNative("SetVehicleOccupiedTick", "ii", vehicleId, ticks);
};

export const HasVehicleBeenOccupied = (vehicleId: number): boolean => {
  return Boolean(samp.callNative("HasVehicleBeenOccupied", "i", vehicleId));
};

export const IsVehicleOccupied = (vehicleId: number): boolean => {
  return Boolean(samp.callNative("IsVehicleOccupied", "i", vehicleId));
};

export const GetVehicleRespawnTick = (vehicleId: number): number => {
  return samp.callNative("GetVehicleRespawnTick", "i", vehicleId);
};

export const SetVehicleRespawnTick = (
  vehicleId: number,
  ticks: number
): number => {
  return samp.callNative("SetVehicleRespawnTick", "ii", vehicleId, ticks);
};

export const IsVehicleDead = (vehicleId: number): boolean => {
  return Boolean(samp.callNative("IsVehicleDead", "i", vehicleId));
};

export const SetVehicleDead = (vehicleId: number, dead: boolean) => {
  return Boolean(samp.callNative("SetVehicleDead", "ii", vehicleId, dead));
};

export const SetVehicleBeenOccupied = (
  vehicleId: number,
  occupied: boolean
) => {
  return Boolean(
    samp.callNative("SetVehicleBeenOccupied", "ii", vehicleId, occupied)
  );
};

export const ToggleVehicleSirenEnabled = (
  vehicleId: number,
  enabled: boolean
): number => {
  return samp.callNative("ToggleVehicleSirenEnabled", "ii", vehicleId, enabled);
};

export const SetVehicleParamsSirenState = (
  vehicleId: number,
  enabled: boolean
): number => {
  return samp.callNative(
    "SetVehicleParamsSirenState",
    "ii",
    vehicleId,
    enabled
  );
};

export const IsVehicleSirenEnabled = (vehicleId: number): boolean => {
  return Boolean(samp.callNative("IsVehicleSirenEnabled", "i", vehicleId));
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

export const GetVehicleSirenState = (vehicleId: number): number => {
  return samp.callNative("GetVehicleSirenState", "i", vehicleId);
};

export const GetVehicleLandingGearState = (vehicleId: number): number => {
  return samp.callNative("GetVehicleLandingGearState", "i", vehicleId);
};

export const GetVehicleHydraReactorAngle = (vehicleId: number): number => {
  return samp.callNativeFloat("GetVehicleHydraReactorAngle", "i", vehicleId);
};

export const GetVehicleTrainSpeed = (vehicleId: number): number => {
  return samp.callNativeFloat("GetVehicleTrainSpeed", "i", vehicleId);
};

export const GetVehicleMatrix = (vehicleId: number): IVehMatrix => {
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
  ]: number[] = samp.callNative("GetVehicleMatrix", "iFFFFFFFFF", vehicleId);
  return { rightX, rightY, rightZ, upX, upY, upZ, atX, atY, atZ };
};

export const GetRandomVehicleColorPair = (modelId: number) => {
  const [color1 = 0, color2 = 0, color3 = 0, color4 = 0]: number[] =
    samp.callNative("GetRandomCarColPair", "iIIII", modelId);
  return {
    color: [color1, color2, color3, color4] as [number, number, number, number],
  };
};

export const CreateVehicle = (
  vehicleType: number,
  x: number,
  y: number,
  z: number,
  rotation: number,
  color1: string | number,
  color2: string | number,
  respawn_delay: number,
  addSiren: boolean
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
    respawn_delay,
    addSiren
  );
};

export const DestroyVehicle = (vehicleId: number): number => {
  return samp.callNative("DestroyVehicle", "i", vehicleId);
};

export const IsVehicleStreamedIn = (
  vehicleId: number,
  forPlayerId: number
): boolean => {
  return Boolean(
    samp.callNative("IsVehicleStreamedIn", "ii", vehicleId, forPlayerId)
  );
};

export const GetVehiclePos = (vehicleId: number) => {
  const values: number[] = samp.callNative("GetVehiclePos", "iFFF", vehicleId);
  if (values.length < 3) {
    throw new Error("VehicleID " + vehicleId + " not found");
  }
  return {
    x: values[0],
    y: values[1],
    z: values[2],
  };
};

export const SetVehiclePos = (
  vehicleId: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative("SetVehiclePos", "ifff", vehicleId, x, y, z);
};

export const GetVehicleZAngle = (vehicleId: number): number => {
  return samp.callNative("GetVehicleZAngle", "iF", vehicleId);
};

export const GetVehicleRotationQuat = (vehicleId: number): Array<number> => {
  return samp.callNative("GetVehicleRotationQuat", "iFFFF", vehicleId);
};

export const GetVehicleDistanceFromPoint = (
  vehicleId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNativeFloat(
    "GetVehicleDistanceFromPoint",
    "ifff",
    vehicleId,
    X,
    Y,
    Z
  );
};

export const SetVehicleZAngle = (
  vehicleId: number,
  z_angle: number
): number => {
  return samp.callNative("SetVehicleZAngle", "if", vehicleId, z_angle);
};

export const SetVehicleParamsForPlayer = (
  vehicleId: number,
  playerId: number,
  objective: boolean,
  doorsLocked: boolean
): number => {
  return samp.callNative(
    "SetVehicleParamsForPlayer",
    "iiii",
    vehicleId,
    playerId,
    objective,
    doorsLocked
  );
};

export const ManualVehicleEngineAndLights = (): number => {
  return samp.callNative("ManualVehicleEngineAndLights", "");
};

export const SetVehicleParamsEx = (
  vehicleId: number,
  engine: boolean,
  lights: boolean,
  alarm: boolean,
  doors: boolean,
  bonnet: boolean,
  boot: boolean,
  objective: boolean
): number => {
  return samp.callNative(
    "SetVehicleParamsEx",
    "iiiiiiii",
    vehicleId,
    engine,
    lights,
    alarm,
    doors,
    bonnet,
    boot,
    objective
  );
};

export const GetVehicleParamsEx = (vehicleId: number): Array<number> => {
  return samp.callNative("GetVehicleParamsEx", "iIIIIIII", vehicleId);
};

export const GetVehicleParamsSirenState = (vehicleId: number): number => {
  return samp.callNative("GetVehicleParamsSirenState", "i", vehicleId);
};

export const SetVehicleParamsCarDoors = (
  vehicleId: number,
  driver: boolean,
  passenger: boolean,
  backLeft: boolean,
  backRight: boolean
): number => {
  return samp.callNative(
    "SetVehicleParamsCarDoors",
    "iiiii",
    vehicleId,
    driver,
    passenger,
    backLeft,
    backRight
  );
};

export const GetVehicleParamsCarDoors = (
  vehicleId: number
): {
  driver: -1 | 0 | 1;
  passenger: -1 | 0 | 1;
  backLeft: -1 | 0 | 1;
  backRight: -1 | 0 | 1;
} => {
  const values = samp.callNative(
    "GetVehicleParamsCarDoors",
    "iIIII",
    vehicleId
  );
  return {
    driver: values[0],
    passenger: values[1],
    backLeft: values[2],
    backRight: values[3],
  };
};

export const SetVehicleParamsCarWindows = (
  vehicleId: number,
  driver: boolean,
  passenger: boolean,
  backLeft: boolean,
  backRight: boolean
): number => {
  return samp.callNative(
    "SetVehicleParamsCarWindows",
    "iiiii",
    vehicleId,
    driver,
    passenger,
    backLeft,
    backRight
  );
};

export const GetVehicleParamsCarWindows = (
  vehicleId: number
): {
  driver: -1 | 0 | 1;
  passenger: -1 | 0 | 1;
  backLeft: -1 | 0 | 1;
  backRight: -1 | 0 | 1;
} => {
  const values = samp.callNative(
    "GetVehicleParamsCarWindows",
    "iIIII",
    vehicleId
  );
  return {
    driver: values[0],
    passenger: values[1],
    backLeft: values[2],
    backRight: values[3],
  };
};

export const SetVehicleToRespawn = (vehicleId: number): number => {
  return samp.callNative("SetVehicleToRespawn", "i", vehicleId);
};

export const LinkVehicleToInterior = (
  vehicleId: number,
  interiorId: number
): number => {
  return samp.callNative("LinkVehicleToInterior", "ii", vehicleId, interiorId);
};

export const AddVehicleComponent = (
  vehicleId: number,
  componentId: number
): number => {
  return samp.callNative("AddVehicleComponent", "ii", vehicleId, componentId);
};

export const RemoveVehicleComponent = (
  vehicleId: number,
  componentId: number
): number => {
  return samp.callNative(
    "RemoveVehicleComponent",
    "ii",
    vehicleId,
    componentId
  );
};

export const ChangeVehicleColors = (
  vehicleId: number,
  color1: string | number,
  color2: string | number
): number => {
  return samp.callNative(
    "ChangeVehicleColor",
    "iii",
    vehicleId,
    rgba(color1),
    rgba(color2)
  );
};

export const ChangeVehiclePaintjob = (
  vehicleId: number,
  paintjobId: number
): number => {
  return samp.callNative("ChangeVehiclePaintjob", "ii", vehicleId, paintjobId);
};

export const SetVehicleHealth = (vehicleId: number, health: number): number => {
  return samp.callNative("SetVehicleHealth", "if", vehicleId, health);
};

export const GetVehicleHealth = (vehicleId: number): number => {
  return samp.callNative("GetVehicleHealth", "iF", vehicleId);
};

export const AttachTrailerToVehicle = (
  trailerid: number,
  vehicleId: number
): number => {
  return samp.callNative("AttachTrailerToVehicle", "ii", trailerid, vehicleId);
};

export const DetachTrailerFromVehicle = (vehicleId: number): number => {
  return samp.callNative("DetachTrailerFromVehicle", "i", vehicleId);
};

export const IsTrailerAttachedToVehicle = (vehicleId: number): boolean => {
  return Boolean(samp.callNative("IsTrailerAttachedToVehicle", "i", vehicleId));
};

export const GetVehicleTrailer = (vehicleId: number): number => {
  return samp.callNative("GetVehicleTrailer", "i", vehicleId);
};

export const SetVehicleNumberPlate = (
  vehicleId: number,
  numberplate: string
): number => {
  return samp.callNative("SetVehicleNumberPlate", "is", vehicleId, numberplate);
};

export const GetVehicleModel = (vehicleId: number): number => {
  return samp.callNative("GetVehicleModel", "i", vehicleId);
};

export const GetVehicleComponentInSlot = (
  vehicleId: number,
  slot: CarModTypeEnum
): number => {
  return samp.callNative("GetVehicleComponentInSlot", "ii", vehicleId, slot);
};

export const GetVehicleComponentType = (component: number): CarModTypeEnum => {
  return samp.callNative("GetVehicleComponentType", "i", component);
};

export const RepairVehicle = (vehicleId: number): number => {
  return samp.callNative("RepairVehicle", "i", vehicleId);
};

export const GetVehicleVelocity = (vehicleId: number): Array<number> => {
  return samp.callNative("GetVehicleVelocity", "iFFF", vehicleId);
};

export const SetVehicleVelocity = (
  vehicleId: number,
  X: number,
  Y: number,
  Z: number
) => {
  return Boolean(
    samp.callNative("SetVehicleVelocity", "ifff", vehicleId, X, Y, Z)
  );
};

export const SetVehicleAngularVelocity = (
  vehicleId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNative(
    "SetVehicleAngularVelocity",
    "ifff",
    vehicleId,
    X,
    Y,
    Z
  );
};

export const GetVehicleDamageStatus = (vehicleId: number) => {
  const values: number[] = samp.callNative(
    "GetVehicleDamageStatus",
    "iIIII",
    vehicleId
  );
  if (values.length < 4) {
    throw new Error("VehicleID " + vehicleId + " not found");
  }
  return {
    panels: values[0],
    doors: values[1],
    lights: values[2],
    tires: values[3],
  };
};

export const UpdateVehicleDamageStatus = (
  vehicleId: number,
  panels: number,
  doors: number,
  lights: number,
  tires: number
): number => {
  return samp.callNative(
    "UpdateVehicleDamageStatus",
    "iiiii",
    vehicleId,
    panels,
    doors,
    lights,
    tires
  );
};

export const GetVehicleModelInfo = (
  vehicleModel: number,
  infoType: VehicleModelInfoEnum
) => {
  const values: number[] = samp.callNative(
    "GetVehicleModelInfo",
    "iiFFF",
    vehicleModel,
    infoType
  );
  if (values.length < 3) {
    throw new Error("ModelID " + vehicleModel + " not found");
  }
  return {
    x: values[0],
    y: values[1],
    z: values[2],
  };
};

export const SetVehicleVirtualWorld = (
  vehicleId: number,
  worldId: number
): number => {
  return samp.callNative("SetVehicleVirtualWorld", "ii", vehicleId, worldId);
};

export const GetVehicleVirtualWorld = (vehicleId: number): number => {
  return samp.callNative("GetVehicleVirtualWorld", "i", vehicleId);
};

export const IsValidVehicle = (vehicleId: number): boolean => {
  return Boolean(samp.callNative("IsValidVehicle", "i", vehicleId));
};

export const AddStaticVehicle = (
  modelId: number,
  spawn_x: number,
  spawn_y: number,
  spawn_z: number,
  z_angle: number,
  color1: string | number,
  color2: string | number
): number => {
  return samp.callNative(
    "AddStaticVehicle",
    "iffffii",
    modelId,
    spawn_x,
    spawn_y,
    spawn_z,
    z_angle,
    color1,
    color2
  );
};

export const AddStaticVehicleEx = (
  modelId: number,
  spawn_x: number,
  spawn_y: number,
  spawn_z: number,
  z_angle: number,
  color1: string | number,
  color2: string | number,
  respawn_delay: number,
  addSiren: boolean
): number => {
  return samp.callNative(
    "AddStaticVehicleEx",
    "iffffiiii",
    modelId,
    spawn_x,
    spawn_y,
    spawn_z,
    z_angle,
    color1,
    color2,
    respawn_delay,
    addSiren
  );
};
