import type {
  IVehColor,
  IVehMatrix,
  IVehSpawnInfo,
} from "./interfaces/Vehicle";

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
