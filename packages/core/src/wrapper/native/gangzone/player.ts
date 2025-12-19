import { ICommonRetVal } from "core/interfaces";
import type { IGangZonePos } from "../interfaces/GangZone";

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
): boolean => {
  return !!samp.callNative("PlayerGangZoneDestroy", "ii", playerId, zoneId);
};

export const PlayerGangZoneShow = (
  playerId: number,
  zoneId: number,
  color: number,
): boolean => {
  return !!samp.callNative(
    "PlayerGangZoneShow",
    "iii",
    playerId,
    zoneId,
    color,
  );
};

export const PlayerGangZoneHide = (
  playerId: number,
  zoneId: number,
): boolean => {
  return !!samp.callNative("PlayerGangZoneHide", "ii", playerId, zoneId);
};

export const PlayerGangZoneFlash = (
  playerId: number,
  zoneId: number,
  color: number,
): boolean => {
  return !!samp.callNative(
    "PlayerGangZoneFlash",
    "iii",
    playerId,
    zoneId,
    color,
  );
};

export const PlayerGangZoneStopFlash = (
  playerId: number,
  zoneId: number,
): boolean => {
  return !!samp.callNative("PlayerGangZoneStopFlash", "ii", playerId, zoneId);
};

export const IsValidPlayerGangZone = (
  playerId: number,
  zoneId: number,
): boolean => {
  return !!samp.callNative("IsValidPlayerGangZone", "ii", playerId, zoneId);
};

export const IsPlayerInPlayerGangZone = (
  playerId: number,
  zoneId: number,
): boolean => {
  return !!samp.callNative("IsPlayerInPlayerGangZone", "ii", playerId, zoneId);
};

export const IsPlayerGangZoneVisible = (
  playerId: number,
  zoneId: number,
): boolean => {
  return !!samp.callNative("IsPlayerGangZoneVisible", "ii", playerId, zoneId);
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
  return !!samp.callNative("IsPlayerGangZoneFlashing", "ii", playerId, zoneId);
};

export const PlayerGangZoneGetPos = (
  playerId: number,
  zoneId: number,
): IGangZonePos & ICommonRetVal => {
  const [fMinX = 0.0, fMinY = 0.0, fMaxX = 0.0, fMaxY = 0.0, ret]: [
    number,
    number,
    number,
    number,
    number,
  ] = samp.callNative("PlayerGangZoneGetPos", "iiFFFF", playerId, zoneId);
  return { fMinX, fMinY, fMaxX, fMaxY, ret: !!ret };
};

export const UsePlayerGangZoneCheck = (
  playerId: number,
  zoneId: number,
  use: boolean,
): boolean => {
  return !!samp.callNative(
    "UsePlayerGangZoneCheck",
    "iii",
    playerId,
    zoneId,
    use,
  );
};
