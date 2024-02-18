import type { StreamerItemTypes } from "../definitions/ItemTypes";

export const Streamer_ProcessActiveItems = (): number => {
  return samp.callNative("Streamer_ProcessActiveItems", "");
};

export const Streamer_ToggleIdleUpdate = (
  playerId: number,
  toggle: boolean,
): number => {
  return samp.callNative("Streamer_ToggleIdleUpdate", "ii", playerId, toggle);
};

export const Streamer_IsToggleIdleUpdate = (playerId: number): boolean => {
  return Boolean(samp.callNative("Streamer_IsToggleIdleUpdate", "i", playerId));
};

export const Streamer_ToggleCameraUpdate = (
  playerId: number,
  toggle: boolean,
): number => {
  return samp.callNative("Streamer_ToggleCameraUpdate", "ii", playerId, toggle);
};

export const Streamer_IsToggleCameraUpdate = (playerId: number): boolean => {
  return Boolean(
    samp.callNative("Streamer_IsToggleCameraUpdate", "i", playerId),
  );
};

export const Streamer_ToggleItemUpdate = (
  playerId: number,
  type: StreamerItemTypes,
  toggle: boolean,
): number => {
  return samp.callNative(
    "Streamer_ToggleItemUpdate",
    "iii",
    playerId,
    type,
    toggle,
  );
};

export const Streamer_IsToggleItemUpdate = (
  playerId: number,
  type: StreamerItemTypes,
): boolean => {
  return Boolean(
    samp.callNative("Streamer_IsToggleItemUpdate", "ii", playerId, type),
  );
};

export const Streamer_GetLastUpdateTime = (): number => {
  return samp.callNative("Streamer_GetLastUpdateTime", "F");
};

export const Streamer_Update = (playerId: number, type = -1): number => {
  return samp.callNative("Streamer_Update", "ii", playerId, type);
};

export const Streamer_UpdateEx = (
  playerId: number,
  x: number,
  y: number,
  z: number,
  worldId = -1,
  interiorId = -1,
  type = -1,
  compensatedTime = -1,
  freezePlayer = true,
): number => {
  return samp.callNative(
    "Streamer_UpdateEx",
    "ifffiiiii",
    playerId,
    x,
    y,
    z,
    worldId,
    interiorId,
    type,
    compensatedTime,
    freezePlayer,
  );
};
