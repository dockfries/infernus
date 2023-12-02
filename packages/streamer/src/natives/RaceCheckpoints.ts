import { StreamerDistances } from "../definitions/Distances";

export const CreateDynamicRaceCP = (
  type: number,
  x: number,
  y: number,
  z: number,
  nextX: number,
  nextY: number,
  nextZ: number,
  size: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1,
  streamDistance: number = StreamerDistances.RACE_CP_SD,
  areaId = -1,
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicRaceCP",
    "ifffffffiiifii",
    type,
    x,
    y,
    z,
    nextX,
    nextY,
    nextZ,
    size,
    worldId,
    interiorId,
    playerId,
    streamDistance,
    areaId,
    priority
  );
};

export const DestroyDynamicRaceCP = (checkpointId: number): number => {
  return samp.callNative("DestroyDynamicRaceCP", "i", checkpointId);
};

export const IsValidDynamicRaceCP = (checkpointId: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicRaceCP", "i", checkpointId));
};

export const TogglePlayerDynamicRaceCP = (
  playerId: number,
  checkpointId: number,
  toggle: boolean
): number => {
  return samp.callNative(
    "TogglePlayerDynamicRaceCP",
    "iii",
    playerId,
    checkpointId,
    toggle
  );
};

export const TogglePlayerAllDynamicRaceCPs = (
  playerId: number,
  toggle: boolean
): number => {
  return samp.callNative(
    "TogglePlayerAllDynamicRaceCPs",
    "ii",
    playerId,
    toggle
  );
};

export const IsPlayerInDynamicRaceCP = (
  playerId: number,
  checkpointId: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInDynamicRaceCP", "ii", playerId, checkpointId)
  );
};

export const GetPlayerVisibleDynamicRaceCP = (playerId: number): number => {
  return samp.callNative("GetPlayerVisibleDynamicRaceCP", "i", playerId);
};
