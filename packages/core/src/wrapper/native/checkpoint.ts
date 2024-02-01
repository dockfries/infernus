import type { ICheckPoint, IRaceCheckPoint } from "./interfaces/CheckPoint";

export const SetPlayerCheckpoint = (
  playerId: number,
  x: number,
  y: number,
  z: number,
  size: number
): number => {
  return samp.callNative(
    "SetPlayerCheckpoint",
    "iffff",
    playerId,
    x,
    y,
    z,
    size
  );
};

export const DisablePlayerCheckpoint = (playerId: number): number => {
  return samp.callNative("DisablePlayerCheckpoint", "i", playerId);
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
  size: number
): number => {
  return samp.callNative(
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
    size
  );
};

export const DisablePlayerRaceCheckpoint = (playerId: number): number => {
  return samp.callNative("DisablePlayerRaceCheckpoint", "i", playerId);
};

export const IsPlayerInCheckpoint = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerInCheckpoint", "i", playerId));
};

export const IsPlayerInRaceCheckpoint = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerInRaceCheckpoint", "i", playerId));
};

export const IsPlayerCheckpointActive = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerCheckpointActive", "i", playerId));
};

export const GetPlayerCheckpoint = (playerId: number): ICheckPoint => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0, fSize = 0.0]: number[] = samp.callNative(
    "GetPlayerCheckpoint",
    "iFFFF",
    playerId
  );
  return { fX, fY, fZ, fSize };
};

export const IsPlayerRaceCheckpointActive = (playerId: number): boolean => {
  return Boolean(
    samp.callNative("IsPlayerRaceCheckpointActive", "i", playerId)
  );
};

export const GetPlayerRaceCheckpoint = (playerId: number): IRaceCheckPoint => {
  const [
    fX = 0.0,
    fY = 0.0,
    fZ = 0.0,
    fNextX = 0.0,
    fNextY = 0.0,
    fNextZ = 0.0,
    fSize = 0.0,
  ]: number[] = samp.callNative(
    "GetPlayerRaceCheckpoint",
    "iFFFFFFF",
    playerId
  );
  return { fX, fY, fZ, fNextX, fNextY, fNextZ, fSize };
};
