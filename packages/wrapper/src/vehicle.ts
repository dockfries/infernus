import { IVehColor, IVehMatrix, IVehSpawnInfo } from "./interfaces/Vehicle";

export const GetVehicleSpawnInfo = (vehicleid: number): IVehSpawnInfo => {
  const [fX = 0, fY = 0, fZ = 0, fRot = 0, color1 = 0, color2 = 0]: number[] =
    samp.callNative("GetVehicleSpawnInfo", "iFFFFII", vehicleid);
  return { fX, fY, fZ, fRot, color1, color2 };
};

export const SetVehicleSpawnInfo = (
  vehicleid: number,
  modelid: number,
  fX: number,
  fY: number,
  fZ: number,
  fAngle: number,
  color1: number,
  color2: number,
  respawntime = -2,
  interior = -2
): number => {
  return samp.callNative(
    "SetVehicleSpawnInfo",
    "iiFFFFiiii",
    vehicleid,
    modelid,
    fX,
    fY,
    fZ,
    fAngle,
    color1,
    color2,
    respawntime,
    interior
  );
};

export const GetVehicleColours = (vehicleid: number): IVehColor => {
  const [color1 = 0, color2 = 0]: number[] = samp.callNative(
    "GetVehicleColours",
    "i",
    vehicleid
  );
  return { color1, color2 };
};

export const GetVehiclePaintjob = (vehicleid: number): number => {
  return samp.callNative("GetVehiclePaintjob", "i", vehicleid);
};

export const GetVehicleInterior = (vehicleid: number): number => {
  return samp.callNative("GetVehicleInterior", "i", vehicleid);
};

export const GetVehicleNumberPlate = (vehicleid: number): string => {
  return samp.callNative("GetVehicleNumberPlate", "iSi", vehicleid, 33);
};

export const SetVehicleRespawnDelay = (
  vehicleid: number,
  delay: number
): number => {
  return samp.callNative("SetVehicleRespawnDelay", "ii", vehicleid, delay);
};

export const GetVehicleRespawnDelay = (vehicleid: number): number => {
  return samp.callNative("GetVehicleRespawnDelay", "i", vehicleid);
};

export const GetVehicleCab = (vehicleid: number): number => {
  return samp.callNative("GetVehicleCab", "i", vehicleid);
};

export const GetVehicleOccupiedTick = (vehicleid: number): number => {
  return samp.callNative("GetVehicleOccupiedTick", "i", vehicleid);
};

export const HasVehicleBeenOccupied = (vehicleid: number): boolean => {
  return Boolean(samp.callNative("HasVehicleBeenOccupied", "i", vehicleid));
};

export const IsVehicleOccupied = (vehicleid: number): boolean => {
  return Boolean(samp.callNative("IsVehicleOccupied", "i", vehicleid));
};

export const GetVehicleRespawnTick = (vehicleid: number): number => {
  return samp.callNative("GetVehicleRespawnTick", "i", vehicleid);
};

export const IsVehicleDead = (vehicleid: number): boolean => {
  return Boolean(samp.callNative("IsVehicleDead", "i", vehicleid));
};

export const ToggleVehicleSirenEnabled = (
  vehicleid: number,
  enabled: boolean
): number => {
  return samp.callNative("ToggleVehicleSirenEnabled", "ii", vehicleid, enabled);
};

export const IsVehicleSirenEnabled = (vehicleid: number): boolean => {
  return Boolean(samp.callNative("IsVehicleSirenEnabled", "i", vehicleid));
};

export const GetVehicleModelCount = (modelid: number): number => {
  return samp.callNative("GetVehicleModelCount", "i", modelid);
};

export const GetVehicleLastDriver = (vehicleid: number): number => {
  return samp.callNative("GetVehicleLastDriver", "i", vehicleid);
};

export const GetVehicleDriver = (vehicleid: number): number => {
  return samp.callNative("GetVehicleDriver", "i", vehicleid);
};

export const GetVehicleModelsUsed = (): number => {
  return samp.callNative("GetVehicleModelsUsed", "");
};

export const GetVehicleSirenState = (vehicleid: number): number => {
  return samp.callNative("GetVehicleSirenState", "i", vehicleid);
};

export const GetVehicleLandingGearState = (vehicleid: number): number => {
  return samp.callNative("GetVehicleLandingGearState", "i", vehicleid);
};

export const GetVehicleHydraReactorAngle = (vehicleid: number): number => {
  return samp.callNativeFloat("GetVehicleHydraReactorAngle", "i", vehicleid);
};

export const GetVehicleTrainSpeed = (vehicleid: number): number => {
  return samp.callNativeFloat("GetVehicleTrainSpeed", "i", vehicleid);
};

export const GetVehicleMatrix = (vehicleid: number): IVehMatrix => {
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
  ]: number[] = samp.callNative("GetVehicleMatrix", "iFFFFFFFFF", vehicleid);
  return { rightX, rightY, rightZ, upX, upY, upZ, atX, atY, atZ };
};
