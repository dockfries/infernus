import type { GangZonePos } from "../interfaces/GangZone";

export const IsValidGangZone = (zoneId: number): boolean => {
  return Boolean(samp.callNative("IsValidGangZone", "i", zoneId));
};

export const IsPlayerInGangZone = (
  playerId: number,
  zoneId: number
): boolean => {
  return Boolean(samp.callNative("IsPlayerInGangZone", "ii", playerId, zoneId));
};

export const IsGangZoneVisibleForPlayer = (
  playerId: number,
  zoneId: number
): boolean => {
  return Boolean(
    samp.callNative("IsGangZoneVisibleForPlayer", "ii", playerId, zoneId)
  );
};

export const GangZoneGetColorForPlayer = (
  playerId: number,
  zoneId: number
): number => {
  return samp.callNative("GangZoneGetColorForPlayer", "ii", playerId, zoneId);
};

export const GangZoneGetFlashColorForPlayer = (
  playerId: number,
  zoneId: number
): number => {
  return samp.callNative(
    "GangZoneGetFlashColorForPlayer",
    "ii",
    playerId,
    zoneId
  );
};

export const IsGangZoneFlashingForPlayer = (
  playerId: number,
  zoneId: number
): boolean => {
  return Boolean(
    samp.callNative("IsGangZoneFlashingForPlayer", "ii", playerId, zoneId)
  );
};

export const GangZoneGetPos = (zoneId: number): GangZonePos => {
  const [fMinX = 0.0, fMinY = 0.0, fMaxX = 0.0, fMaxY = 0.0]: number[] =
    samp.callNative("GangZoneGetPos", "iFFFF", zoneId);
  return { fMinX, fMinY, fMaxX, fMaxY };
};

export const UseGangZoneCheck = (zoneId: number, toggle: boolean): void => {
  samp.callNative("UseGangZoneCheck", "ii", zoneId, toggle);
};
