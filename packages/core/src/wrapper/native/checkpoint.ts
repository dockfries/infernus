import { ICommonRetVal } from "core/interfaces";
import type { ICheckPoint, IRaceCheckPoint } from "./interfaces/CheckPoint";

export const SetPlayerCheckpoint = (
  playerId: number,
  x: number,
  y: number,
  z: number,
  radius: number,
): boolean => {
  return !!samp.callNative(
    "SetPlayerCheckpoint",
    "iffff",
    playerId,
    x,
    y,
    z,
    radius,
  );
};

export const DisablePlayerCheckpoint = (playerId: number): boolean => {
  return !!samp.callNative("DisablePlayerCheckpoint", "i", playerId);
};

export const SetPlayerRaceCheckpoint = (
  playerId: number,
  type: number,
  x: number,
  y: number,
  z: number,
  nextX: number,
  nextY: number,
  nextZ: number,
  radius: number,
): boolean => {
  return !!samp.callNative(
    "SetPlayerRaceCheckpoint",
    "iifffffff",
    playerId,
    type,
    x,
    y,
    z,
    nextX,
    nextY,
    nextZ,
    radius,
  );
};

export const DisablePlayerRaceCheckpoint = (playerId: number): boolean => {
  return !!samp.callNative("DisablePlayerRaceCheckpoint", "i", playerId);
};

export const IsPlayerInCheckpoint = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerInCheckpoint", "i", playerId);
};

export const IsPlayerInRaceCheckpoint = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerInRaceCheckpoint", "i", playerId);
};

export const IsPlayerCheckpointActive = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerCheckpointActive", "i", playerId);
};

export const GetPlayerCheckpoint = (
  playerId: number,
): ICheckPoint & ICommonRetVal => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0, fSize = 0.0, ret]: number[] =
    samp.callNative("GetPlayerCheckpoint", "iFFFF", playerId);
  return { fX, fY, fZ, fSize, ret: !!ret };
};

export const IsPlayerRaceCheckpointActive = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerRaceCheckpointActive", "i", playerId);
};

export const GetPlayerRaceCheckpoint = (
  playerId: number,
): IRaceCheckPoint & ICommonRetVal => {
  const [
    fX = 0.0,
    fY = 0.0,
    fZ = 0.0,
    fNextX = 0.0,
    fNextY = 0.0,
    fNextZ = 0.0,
    fSize = 0.0,
    ret,
  ]: number[] = samp.callNative(
    "GetPlayerRaceCheckpoint",
    "iFFFFFFF",
    playerId,
  );
  return { fX, fY, fZ, fNextX, fNextY, fNextZ, fSize, ret: !!ret };
};
