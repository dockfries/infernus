import type { GangZonePos } from "../interfaces/GangZone";

export const CreatePlayerGangZone = (
  playerId: number,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
): number => {
  return samp.callNative(
    "CreatePlayerGangZone",
    "iffff",
    playerId,
    minX,
    minY,
    maxX,
    maxY,
  );
};

export const PlayerGangZoneDestroy = (
  playerId: number,
  zoneId: number,
): number => {
  return samp.callNative("PlayerGangZoneDestroy", "ii", playerId, zoneId);
};

export const PlayerGangZoneShow = (
  playerId: number,
  zoneId: number,
  color: number,
): number => {
  return samp.callNative("PlayerGangZoneShow", "iii", playerId, zoneId, color);
};

export const PlayerGangZoneHide = (
  playerId: number,
  zoneId: number,
): number => {
  return samp.callNative("PlayerGangZoneHide", "ii", playerId, zoneId);
};

export const PlayerGangZoneFlash = (
  playerId: number,
  zoneId: number,
  color: number,
): number => {
  return samp.callNative("PlayerGangZoneFlash", "iii", playerId, zoneId, color);
};

export const PlayerGangZoneStopFlash = (
  playerId: number,
  zoneId: number,
): number => {
  return samp.callNative("PlayerGangZoneStopFlash", "ii", playerId, zoneId);
};

export const IsValidPlayerGangZone = (
  playerId: number,
  zoneId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsValidPlayerGangZone", "ii", playerId, zoneId),
  );
};

export const IsPlayerInPlayerGangZone = (
  playerId: number,
  zoneId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInPlayerGangZone", "ii", playerId, zoneId),
  );
};

export const IsPlayerGangZoneVisible = (
  playerId: number,
  zoneId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerGangZoneVisible", "ii", playerId, zoneId),
  );
};

export const PlayerGangZoneGetColor = (
  playerId: number,
  zoneId: number,
): number => {
  return samp.callNative("PlayerGangZoneGetColor", "ii", playerId, zoneId);
};

export const PlayerGangZoneGetFlashColor = (
  playerId: number,
  zoneId: number,
): number => {
  return samp.callNative("PlayerGangZoneGetFlashColor", "ii", playerId, zoneId);
};

export const IsPlayerGangZoneFlashing = (
  playerId: number,
  zoneId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerGangZoneFlashing", "ii", playerId, zoneId),
  );
};

export const PlayerGangZoneGetPos = (
  playerId: number,
  zoneId: number,
): GangZonePos => {
  const [fMinX = 0.0, fMinY = 0.0, fMaxX = 0.0, fMaxY = 0.0]: number[] =
    samp.callNative("PlayerGangZoneGetPos", "iiFFFF", playerId, zoneId);
  return { fMinX, fMinY, fMaxX, fMaxY };
};

export const UsePlayerGangZoneCheck = (
  playerId: number,
  zoneId: number,
  use: boolean,
): void => {
  samp.callNative("UsePlayerGangZoneCheck", "iii", playerId, zoneId, use);
};
