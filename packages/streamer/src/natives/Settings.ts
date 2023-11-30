import type {
  StreamerItemTypes,
  StreamerItemTypeTuple,
} from "../definitions/ItemTypes";
import { StreamerMiscellaneous } from "../definitions/Miscellaneous";

export const Streamer_GetTickRate = (): number => {
  return samp.callNative("Streamer_GetTickRate", "");
};

export const Streamer_SetTickRate = (rate = 50): number => {
  return samp.callNative("Streamer_SetTickRate", "i", rate);
};

export const Streamer_GetPlayerTickRate = (playerId: number): number => {
  return samp.callNative("Streamer_GetPlayerTickRate", "i", playerId);
};

export const Streamer_SetPlayerTickRate = (
  playerId: number,
  rate = 50
): number => {
  return samp.callNative("Streamer_SetPlayerTickRate", "ii", playerId, rate);
};

export const Streamer_ToggleChunkStream = (toggle = false): number => {
  return samp.callNative("Streamer_ToggleChunkStream", "i", toggle);
};

export const Streamer_IsToggleChunkStream = (): boolean => {
  return Boolean(samp.callNative("Streamer_IsToggleChunkStream", ""));
};

export const Streamer_GetChunkTickRate = (
  type: StreamerItemTypes,
  playerId = -1
): number => {
  return samp.callNative("Streamer_GetChunkTickRate", "ii", type, playerId);
};

export const Streamer_SetChunkTickRate = (
  type: StreamerItemTypes,
  rate: number,
  playerId = -1
): number => {
  return samp.callNative(
    "Streamer_SetChunkTickRate",
    "iii",
    type,
    rate,
    playerId
  );
};

export const Streamer_GetChunkSize = (type: StreamerItemTypes): number => {
  return samp.callNative("Streamer_GetChunkSize", "i", type);
};

export const Streamer_SetChunkSize = (
  type: StreamerItemTypes,
  size: number
): number => {
  return samp.callNative("Streamer_SetChunkSize", "ii", type, size);
};

export const Streamer_GetMaxItems = (type: StreamerItemTypes): number => {
  return samp.callNative("Streamer_GetMaxItems", "i", type);
};

export const Streamer_SetMaxItems = (
  type: StreamerItemTypes,
  items: number
): number => {
  return samp.callNative("Streamer_SetMaxItems", "ii", type, items);
};

export const Streamer_GetVisibleItems = (
  type: StreamerItemTypes,
  playerId = -1
): number => {
  return samp.callNative("Streamer_GetVisibleItems", "ii", type, playerId);
};

export const Streamer_SetVisibleItems = (
  type: StreamerItemTypes,
  items: number,
  playerId = -1
): number => {
  return samp.callNative(
    "Streamer_SetVisibleItems",
    "iii",
    type,
    items,
    playerId
  );
};

export const Streamer_GetRadiusMultiplier = (
  type: StreamerItemTypes,
  playerId = -1
): number => {
  return samp.callNative("Streamer_GetRadiusMultiplier", "iFi", type, playerId);
};

export const Streamer_SetRadiusMultiplier = (
  type: StreamerItemTypes,
  multiplier: number,
  playerId = -1
): number => {
  return samp.callNative(
    "Streamer_SetRadiusMultiplier",
    "ifi",
    type,
    multiplier,
    playerId
  );
};

export const Streamer_GetTypePriority = (): StreamerItemTypeTuple | number => {
  return samp.callNative(
    "Streamer_GetTypePriority",
    "Ai",
    StreamerMiscellaneous.MAX_TYPES
  );
};

export const Streamer_SetTypePriority = (
  types: StreamerItemTypeTuple
): number => {
  return samp.callNative(
    "Streamer_SetTypePriority",
    "ai",
    types,
    StreamerMiscellaneous.MAX_TYPES
  );
};

export const Streamer_GetCellDistance = (): number => {
  return samp.callNative("Streamer_GetCellDistance", "F");
};

export const Streamer_SetCellDistance = (distance = 600.0): number => {
  return samp.callNative("Streamer_SetCellDistance", "f", distance);
};

export const Streamer_GetCellSize = (): number => {
  return samp.callNative("Streamer_GetCellSize", "F");
};

export const Streamer_SetCellSize = (size = 300.0): number => {
  return samp.callNative("Streamer_SetCellSize", "f", size);
};

export const Streamer_ToggleItemStatic = (
  type: StreamerItemTypes,
  id: number,
  toggle: boolean
): number => {
  return samp.callNative("Streamer_ToggleItemStatic", "iii", type, id, toggle);
};

export const Streamer_IsToggleItemStatic = (
  type: StreamerItemTypes,
  id: number
): boolean => {
  return Boolean(
    samp.callNative("Streamer_IsToggleItemStatic", "ii", type, id)
  );
};

export const Streamer_ToggleItemInvAreas = (
  type: StreamerItemTypes,
  id: number,
  toggle: boolean
): number => {
  return samp.callNative(
    "Streamer_ToggleItemInvAreas",
    "iii",
    type,
    id,
    toggle
  );
};

export const Streamer_IsToggleItemInvAreas = (
  type: StreamerItemTypes,
  id: number
): boolean => {
  return Boolean(
    samp.callNative("Streamer_IsToggleItemInvAreas", "ii", type, id)
  );
};

export const Streamer_ToggleItemCallbacks = (
  type: StreamerItemTypes,
  id: number,
  toggle: boolean
): number => {
  return samp.callNative(
    "Streamer_ToggleItemCallbacks",
    "iii",
    type,
    id,
    toggle
  );
};

export const Streamer_IsToggleItemCallbacks = (
  type: StreamerItemTypes,
  id: number
): boolean => {
  return Boolean(
    samp.callNative("Streamer_IsToggleItemCallbacks", "ii", type, id)
  );
};

export const Streamer_ToggleErrorCallback = (toggle: boolean): number => {
  return samp.callNative("Streamer_ToggleErrorCallback", "i", toggle);
};

export const Streamer_IsToggleErrorCallback = (): boolean => {
  return Boolean(samp.callNative("Streamer_IsToggleErrorCallback", ""));
};

export const Streamer_AmxUnloadDestroyItems = (toggle: boolean): number => {
  return samp.callNative("Streamer_AmxUnloadDestroyItems", "i", toggle);
};
