import { StreamerItemTypes } from "../definitions/ItemTypes";

export const Streamer_ProcessActiveItems = (): number => {
  return samp.callNative("Streamer_ProcessActiveItems", "");
};

export const Streamer_ToggleIdleUpdate = (
  playerid: number,
  toggle: boolean
): number => {
  return samp.callNative("Streamer_ToggleIdleUpdate", "ii", playerid, toggle);
};

export const Streamer_IsToggleIdleUpdate = (playerid: number): boolean => {
  return Boolean(samp.callNative("Streamer_IsToggleIdleUpdate", "i", playerid));
};

export const Streamer_ToggleCameraUpdate = (
  playerid: number,
  toggle: boolean
): number => {
  return samp.callNative("Streamer_ToggleCameraUpdate", "ii", playerid, toggle);
};

export const Streamer_IsToggleCameraUpdate = (playerid: number): boolean => {
  return Boolean(
    samp.callNative("Streamer_IsToggleCameraUpdate", "i", playerid)
  );
};

export const Streamer_ToggleItemUpdate = (
  playerid: number,
  type: StreamerItemTypes,
  toggle: boolean
): number => {
  return samp.callNative(
    "Streamer_ToggleItemUpdate",
    "iii",
    playerid,
    type,
    toggle
  );
};

export const Streamer_IsToggleItemUpdate = (
  playerid: number,
  type: StreamerItemTypes
): boolean => {
  return Boolean(
    samp.callNative("Streamer_IsToggleItemUpdate", "ii", playerid, type)
  );
};

export const Streamer_GetLastUpdateTime = (): number => {
  return samp.callNative("Streamer_GetLastUpdateTime", "F");
};

export const Streamer_Update = (playerid: number, type = -1): number => {
  return samp.callNative("Streamer_Update", "ii", playerid, type);
};

export const Streamer_UpdateEx = (
  playerid: number,
  x: number,
  y: number,
  z: number,
  worldid = -1,
  interiorid = -1,
  type = -1,
  compensatedtime = -1,
  freezeplayer = true
): number => {
  return samp.callNative(
    "Streamer_UpdateEx",
    "ifffiiiii",
    playerid,
    x,
    y,
    z,
    worldid,
    interiorid,
    type,
    compensatedtime,
    freezeplayer
  );
};
