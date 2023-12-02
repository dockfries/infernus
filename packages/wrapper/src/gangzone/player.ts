import type { GangZonePos } from "../interfaces/GangZone";

export const CreatePlayerGangZone = (
  playerId: number,
  minx: number,
  miny: number,
  maxx: number,
  maxy: number
): number => {
  return samp.callNative(
    "CreatePlayerGangZone",
    "iffff",
    playerId,
    minx,
    miny,
    maxx,
    maxy
  );
};

export const PlayerGangZoneDestroy = (
  playerId: number,
  zoneid: number
): number => {
  return samp.callNative("PlayerGangZoneDestroy", "ii", playerId, zoneid);
};

export const PlayerGangZoneShow = (
  playerId: number,
  zoneid: number,
  color: number
): number => {
  return samp.callNative("PlayerGangZoneShow", "iii", playerId, zoneid, color);
};

export const PlayerGangZoneHide = (
  playerId: number,
  zoneid: number
): number => {
  return samp.callNative("PlayerGangZoneHide", "ii", playerId, zoneid);
};

export const PlayerGangZoneFlash = (
  playerId: number,
  zoneid: number,
  color: number
): number => {
  return samp.callNative("PlayerGangZoneFlash", "iii", playerId, zoneid, color);
};

export const PlayerGangZoneStopFlash = (
  playerId: number,
  zoneid: number
): number => {
  return samp.callNative("PlayerGangZoneStopFlash", "ii", playerId, zoneid);
};

export const IsValidPlayerGangZone = (
  playerId: number,
  zoneid: number
): boolean => {
  return Boolean(
    samp.callNative("IsValidPlayerGangZone", "ii", playerId, zoneid)
  );
};

export const IsPlayerInPlayerGangZone = (
  playerId: number,
  zoneid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInPlayerGangZone", "ii", playerId, zoneid)
  );
};

export const IsPlayerGangZoneVisible = (
  playerId: number,
  zoneid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerGangZoneVisible", "ii", playerId, zoneid)
  );
};

export const PlayerGangZoneGetColor = (
  playerId: number,
  zoneid: number
): number => {
  return samp.callNative("PlayerGangZoneGetColor", "ii", playerId, zoneid);
};

export const PlayerGangZoneGetFlashColor = (
  playerId: number,
  zoneid: number
): number => {
  return samp.callNative("PlayerGangZoneGetFlashColor", "ii", playerId, zoneid);
};

export const IsPlayerGangZoneFlashing = (
  playerId: number,
  zoneid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerGangZoneFlashing", "ii", playerId, zoneid)
  );
};

export const PlayerGangZoneGetPos = (
  playerId: number,
  zoneid: number
): GangZonePos => {
  const [fMinX = 0.0, fMinY = 0.0, fMaxX = 0.0, fMaxY = 0.0]: number[] =
    samp.callNative("PlayerGangZoneGetPos", "iiFFFF", playerId, zoneid);
  return { fMinX, fMinY, fMaxX, fMaxY };
};

export const UsePlayerGangZoneCheck = (
  playerId: number,
  zoneid: number,
  use: boolean
): void => {
  samp.callNative("UsePlayerGangZoneCheck", "iii", playerId, zoneid, use);
};
