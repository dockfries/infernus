import { StreamerDistances } from "../definitions/Distances";

export const CreateDynamicCP = (
  x: number,
  y: number,
  z: number,
  size: number,
  worldid = -1,
  interiorid = -1,
  playerid = -1,
  streamdistance: number = StreamerDistances.CP_SD,
  areaid = -1,
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicCP",
    "ffffiiifii",
    x,
    y,
    z,
    size,
    worldid,
    interiorid,
    playerid,
    streamdistance,
    areaid,
    priority
  );
};

export const DestroyDynamicCP = (checkpointid: number): number => {
  return samp.callNative("DestroyDynamicCP", "i", checkpointid);
};

export const IsValidDynamicCP = (checkpointid: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicCP", "i", checkpointid));
};

export const TogglePlayerDynamicCP = (
  playerid: number,
  checkpointid: number,
  toggle: boolean
): number => {
  return samp.callNative(
    "TogglePlayerDynamicCP",
    "iii",
    playerid,
    checkpointid,
    toggle
  );
};

export const TogglePlayerAllDynamicCPs = (
  playerid: number,
  toggle: boolean
): number => {
  return samp.callNative("TogglePlayerAllDynamicCPs", "ii", playerid, toggle);
};

export const IsPlayerInDynamicCP = (
  playerid: number,
  checkpointid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInDynamicCP", "ii", playerid, checkpointid)
  );
};

export const GetPlayerVisibleDynamicCP = (playerid: number): number => {
  return samp.callNative("GetPlayerVisibleDynamicCP", "i", playerid);
};
