import { StreamerDistances } from "../definitions/Distances";

export const CreateDynamicCP = (
  x: number,
  y: number,
  z: number,
  size: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1,
  streamDistance: number = StreamerDistances.CP_SD,
  areaId = -1,
  priority = 0,
): number => {
  return samp.callNative(
    "CreateDynamicCP",
    "ffffiiifii",
    x,
    y,
    z,
    size,
    worldId,
    interiorId,
    playerId,
    streamDistance,
    areaId,
    priority,
  );
};

export const DestroyDynamicCP = (checkpointId: number): number => {
  return samp.callNative("DestroyDynamicCP", "i", checkpointId);
};

export const IsValidDynamicCP = (checkpointId: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicCP", "i", checkpointId));
};

export const TogglePlayerDynamicCP = (
  playerId: number,
  checkpointId: number,
  toggle: boolean,
): number => {
  return samp.callNative(
    "TogglePlayerDynamicCP",
    "iii",
    playerId,
    checkpointId,
    toggle,
  );
};

export const TogglePlayerAllDynamicCPs = (
  playerId: number,
  toggle: boolean,
): number => {
  return samp.callNative("TogglePlayerAllDynamicCPs", "ii", playerId, toggle);
};

export const IsPlayerInDynamicCP = (
  playerId: number,
  checkpointId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInDynamicCP", "ii", playerId, checkpointId),
  );
};

export const GetPlayerVisibleDynamicCP = (playerId: number): number => {
  return samp.callNative("GetPlayerVisibleDynamicCP", "i", playerId);
};
