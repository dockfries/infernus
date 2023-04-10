import { StreamerDistances } from "../definitions/Distances";

export const CreateDynamicRaceCP = (
  type: number,
  x: number,
  y: number,
  z: number,
  nextx: number,
  nexty: number,
  nextz: number,
  size: number,
  worldid = -1,
  interiorid = -1,
  playerid = -1,
  streamdistance: number = StreamerDistances.RACE_CP_SD,
  areaid = -1,
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicRaceCP",
    "ifffffffiiifii",
    type,
    x,
    y,
    z,
    nextx,
    nexty,
    nextz,
    size,
    worldid,
    interiorid,
    playerid,
    streamdistance,
    areaid,
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
  playerid: number,
  checkpointid: number,
  toggle: boolean
): number => {
  return samp.callNative(
    "TogglePlayerDynamicRaceCP",
    "iii",
    playerid,
    checkpointid,
    toggle
  );
};

export const TogglePlayerAllDynamicRaceCPs = (
  playerid: number,
  toggle: boolean
): number => {
  return samp.callNative(
    "TogglePlayerAllDynamicRaceCPs",
    "ii",
    playerid,
    toggle
  );
};

export const IsPlayerInDynamicRaceCP = (
  playerid: number,
  checkpointid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInDynamicRaceCP", "ii", playerid, checkpointid)
  );
};

export const GetPlayerVisibleDynamicRaceCP = (playerid: number): number => {
  return samp.callNative("GetPlayerVisibleDynamicRaceCP", "i", playerid);
};
