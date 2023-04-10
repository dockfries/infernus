import { GangZonePos } from "../interfaces/GangZone";

export const CreatePlayerGangZone = (
  playerid: number,
  minx: number,
  miny: number,
  maxx: number,
  maxy: number
): number => {
  return samp.callNative(
    "CreatePlayerGangZone",
    "iffff",
    playerid,
    minx,
    miny,
    maxx,
    maxy
  );
};

export const PlayerGangZoneDestroy = (
  playerid: number,
  zoneid: number
): number => {
  return samp.callNative("PlayerGangZoneDestroy", "ii", playerid, zoneid);
};

export const PlayerGangZoneShow = (
  playerid: number,
  zoneid: number,
  color: number
): number => {
  return samp.callNative("PlayerGangZoneShow", "iii", playerid, zoneid, color);
};

export const PlayerGangZoneHide = (
  playerid: number,
  zoneid: number
): number => {
  return samp.callNative("PlayerGangZoneHide", "ii", playerid, zoneid);
};

export const PlayerGangZoneFlash = (
  playerid: number,
  zoneid: number,
  color: number
): number => {
  return samp.callNative("PlayerGangZoneFlash", "iii", playerid, zoneid, color);
};

export const PlayerGangZoneStopFlash = (
  playerid: number,
  zoneid: number
): number => {
  return samp.callNative("PlayerGangZoneStopFlash", "ii", playerid, zoneid);
};

export const IsValidPlayerGangZone = (
  playerid: number,
  zoneid: number
): boolean => {
  return Boolean(
    samp.callNative("IsValidPlayerGangZone", "ii", playerid, zoneid)
  );
};

export const IsPlayerInPlayerGangZone = (
  playerid: number,
  zoneid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInPlayerGangZone", "ii", playerid, zoneid)
  );
};

export const IsPlayerGangZoneVisible = (
  playerid: number,
  zoneid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerGangZoneVisible", "ii", playerid, zoneid)
  );
};

export const PlayerGangZoneGetColour = (
  playerid: number,
  zoneid: number
): number => {
  return samp.callNative("PlayerGangZoneGetColour", "ii", playerid, zoneid);
};

export const PlayerGangZoneGetFlashColour = (
  playerid: number,
  zoneid: number
): number => {
  return samp.callNative(
    "PlayerGangZoneGetFlashColour",
    "ii",
    playerid,
    zoneid
  );
};

export const IsPlayerGangZoneFlashing = (
  playerid: number,
  zoneid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerGangZoneFlashing", "ii", playerid, zoneid)
  );
};

export const PlayerGangZoneGetPos = (
  playerid: number,
  zoneid: number
): GangZonePos => {
  const [fMinX = 0.0, fMinY = 0.0, fMaxX = 0.0, fMaxY = 0.0]: number[] =
    samp.callNative("PlayerGangZoneGetPos", "iiFFFF", playerid, zoneid);
  return { fMinX, fMinY, fMaxX, fMaxY };
};

export const UsePlayerGangZoneCheck = (
  playerid: number,
  zoneid: number,
  use: boolean
): void => {
  samp.callNative("UsePlayerGangZoneCheck", "iii", playerid, zoneid, use);
};
