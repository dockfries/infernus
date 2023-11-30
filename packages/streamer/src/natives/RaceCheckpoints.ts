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

export const DestroyDynamicRaceCP = (checkpointid: number): number => {
  return samp.callNative("DestroyDynamicRaceCP", "i", checkpointid);
};

export const IsValidDynamicRaceCP = (checkpointid: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicRaceCP", "i", checkpointid));
};

export const TogglePlayerDynamicRaceCP = (
  playerId: number,
  checkpointid: number,
  toggle: boolean
): number => {
  return samp.callNative(
    "TogglePlayerDynamicRaceCP",
    "iii",
    playerId,
    checkpointid,
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
  checkpointid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInDynamicRaceCP", "ii", playerId, checkpointid)
  );
};

export const GetPlayerVisibleDynamicRaceCP = (playerId: number): number => {
  return samp.callNative("GetPlayerVisibleDynamicRaceCP", "i", playerId);
};
