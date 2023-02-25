import { GangZonePos } from "../interfaces/GangZone";

export const IsValidGangZone = (zoneid: number): boolean => {
  return Boolean(samp.callNative("IsValidGangZone", "i", zoneid));
};

export const IsPlayerInGangZone = (
  playerid: number,
  zoneid: number
): boolean => {
  return Boolean(samp.callNative("IsPlayerInGangZone", "ii", playerid, zoneid));
};

export const IsGangZoneVisibleForPlayer = (
  playerid: number,
  zoneid: number
): boolean => {
  return Boolean(
    samp.callNative("IsGangZoneVisibleForPlayer", "ii", playerid, zoneid)
  );
};

export const GangZoneGetColourForPlayer = (
  playerid: number,
  zoneid: number
): number => {
  return samp.callNative("GangZoneGetColourForPlayer", "ii", playerid, zoneid);
};

export const GangZoneGetFlashColourForPlayer = (
  playerid: number,
  zoneid: number
): number => {
  return samp.callNative(
    "GangZoneGetFlashColourForPlayer",
    "ii",
    playerid,
    zoneid
  );
};

export const IsGangZoneFlashingForPlayer = (
  playerid: number,
  zoneid: number
): boolean => {
  return Boolean(
    samp.callNative("IsGangZoneFlashingForPlayer", "ii", playerid, zoneid)
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
