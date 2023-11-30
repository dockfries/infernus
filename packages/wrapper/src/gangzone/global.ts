import type { GangZonePos } from "../interfaces/GangZone";

export const IsValidGangZone = (zoneid: number): boolean => {
  return Boolean(samp.callNative("IsValidGangZone", "i", zoneid));
};

export const IsPlayerInGangZone = (
  playerId: number,
  zoneid: number
): boolean => {
  return Boolean(samp.callNative("IsPlayerInGangZone", "ii", playerId, zoneid));
};

export const IsGangZoneVisibleForPlayer = (
  playerId: number,
  zoneid: number
): boolean => {
  return Boolean(
    samp.callNative("IsGangZoneVisibleForPlayer", "ii", playerId, zoneid)
  );
};

export const GangZoneGetColourForPlayer = (
  playerId: number,
  zoneid: number
): number => {
  return samp.callNative("GangZoneGetColourForPlayer", "ii", playerId, zoneid);
};

export const GangZoneGetFlashColourForPlayer = (
  playerId: number,
  zoneid: number
): number => {
  return samp.callNative(
    "GangZoneGetFlashColourForPlayer",
    "ii",
    playerId,
    zoneid
  );
};

export const IsGangZoneFlashingForPlayer = (
  playerId: number,
  zoneid: number
): boolean => {
  return Boolean(
    samp.callNative("IsGangZoneFlashingForPlayer", "ii", playerId, zoneid)
  );
};

export const GangZoneGetPos = (zoneid: number): GangZonePos => {
  const [fMinX = 0.0, fMinY = 0.0, fMaxX = 0.0, fMaxY = 0.0]: number[] =
    samp.callNative("GangZoneGetPos", "iFFFF", zoneid);
  return { fMinX, fMinY, fMaxX, fMaxY };
};

export const UseGangZoneCheck = (zoneid: number, toggle: boolean): void => {
  samp.callNative("UseGangZoneCheck", "ii", zoneid, toggle);
};
