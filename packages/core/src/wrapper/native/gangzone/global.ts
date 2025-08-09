import { rgba } from "core/utils/colorUtils";
import type { IGangZonePos } from "../interfaces/GangZone";
import { ICommonRetVal } from "core/interfaces";

export const IsValidGangZone = (zoneId: number): boolean => {
  return Boolean(samp.callNative("IsValidGangZone", "i", zoneId));
};

export const IsPlayerInGangZone = (
  playerId: number,
  zoneId: number,
): boolean => {
  return Boolean(samp.callNative("IsPlayerInGangZone", "ii", playerId, zoneId));
};

export const IsGangZoneVisibleForPlayer = (
  playerId: number,
  zoneId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsGangZoneVisibleForPlayer", "ii", playerId, zoneId),
  );
};

export const GangZoneGetColorForPlayer = (
  playerId: number,
  zoneId: number,
): number => {
  return samp.callNative("GangZoneGetColorForPlayer", "ii", playerId, zoneId);
};

export const GangZoneGetFlashColorForPlayer = (
  playerId: number,
  zoneId: number,
): number => {
  return samp.callNative(
    "GangZoneGetFlashColorForPlayer",
    "ii",
    playerId,
    zoneId,
  );
};

export const IsGangZoneFlashingForPlayer = (
  playerId: number,
  zoneId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsGangZoneFlashingForPlayer", "ii", playerId, zoneId),
  );
};

export const GangZoneGetPos = (
  zoneId: number,
): IGangZonePos & ICommonRetVal => {
  const [fMinX = 0.0, fMinY = 0.0, fMaxX = 0.0, fMaxY = 0.0, ret]: number[] =
    samp.callNative("GangZoneGetPos", "iFFFF", zoneId);
  return { fMinX, fMinY, fMaxX, fMaxY, ret };
};

export const UseGangZoneCheck = (zoneId: number, toggle: boolean): void => {
  samp.callNative("UseGangZoneCheck", "ii", zoneId, toggle);
};

export const GangZoneCreate = (
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
): number => {
  return samp.callNative("GangZoneCreate", "ffff", minX, minY, maxX, maxY);
};

export const GangZoneDestroy = (zone: number): number => {
  return samp.callNative("GangZoneDestroy", "i", zone);
};

export const GangZoneShowForPlayer = (
  playerId: number,
  zone: number,
  color: string | number,
): number => {
  return samp.callNative(
    "GangZoneShowForPlayer",
    "iii",
    playerId,
    zone,
    rgba(color),
  );
};

export const GangZoneShowForAll = (
  zone: number,
  color: string | number,
): number => {
  return samp.callNative("GangZoneShowForAll", "ii", zone, rgba(color));
};

export const GangZoneHideForPlayer = (
  playerId: number,
  zone: number,
): number => {
  return samp.callNative("GangZoneHideForPlayer", "ii", playerId, zone);
};

export const GangZoneHideForAll = (zone: number): number => {
  return samp.callNative("GangZoneHideForAll", "i", zone);
};

export const GangZoneFlashForPlayer = (
  playerId: number,
  zone: number,
  flashColor: string | number,
): number => {
  return samp.callNative(
    "GangZoneFlashForPlayer",
    "iii",
    playerId,
    zone,
    rgba(flashColor),
  );
};

export const GangZoneFlashForAll = (
  zone: number,
  flashColor: string | number,
): number => {
  return samp.callNative("GangZoneFlashForAll", "ii", zone, rgba(flashColor));
};

export const GangZoneStopFlashForPlayer = (
  playerId: number,
  zone: number,
): number => {
  return samp.callNative("GangZoneStopFlashForPlayer", "ii", playerId, zone);
};

export const GangZoneStopFlashForAll = (zone: number): number => {
  return samp.callNative("GangZoneStopFlashForAll", "i", zone);
};
