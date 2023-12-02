import type { StreamerItemTypes } from "../definitions/ItemTypes";

export const Streamer_GetDistanceToItem = (
  x: number,
  y: number,
  z: number,
  type: StreamerItemTypes,
  id: number,
  dimensions: 2 | 3 = 3
): number => {
  return samp.callNative(
    "Streamer_GetDistanceToItem",
    "fffiiFi",
    x,
    y,
    z,
    type,
    id,
    dimensions
  );
};

export const Streamer_ToggleItem = (
  playerId: number,
  type: StreamerItemTypes,
  id: number,
  toggle: boolean
): number => {
  return samp.callNative(
    "Streamer_ToggleItem",
    "iiii",
    playerId,
    type,
    id,
    toggle
  );
};

export const Streamer_IsToggleItem = (
  playerId: number,
  type: StreamerItemTypes,
  id: number
): boolean => {
  return Boolean(
    samp.callNative("Streamer_IsToggleItem", "iii", playerId, type, id)
  );
};

export const Streamer_ToggleAllItems = (
  playerId: number,
  type: StreamerItemTypes,
  toggle: boolean,
  exceptions: number[] = [-1]
): number => {
  return samp.callNative(
    "Streamer_ToggleAllItems",
    "iiiai",
    playerId,
    type,
    toggle,
    exceptions,
    exceptions.length
  );
};

export const Streamer_GetItemInternalID = (
  playerId: number,
  type: StreamerItemTypes,
  streamerId: number
): number => {
  return samp.callNative(
    "Streamer_GetItemInternalID",
    "iii",
    playerId,
    type,
    streamerId
  );
};

export const Streamer_GetItemStreamerID = (
  playerId: number,
  type: StreamerItemTypes,
  internalId: number
): number => {
  return samp.callNative(
    "Streamer_GetItemStreamerID",
    "iii",
    playerId,
    type,
    internalId
  );
};

export const Streamer_IsItemVisible = (
  playerId: number,
  type: StreamerItemTypes,
  id: number
): boolean => {
  return Boolean(
    samp.callNative("Streamer_IsItemVisible", "iii", playerId, type, id)
  );
};

export const Streamer_DestroyAllVisibleItems = (
  playerId: number,
  type: StreamerItemTypes,
  serverWide = 1
): number => {
  return samp.callNative(
    "Streamer_DestroyAllVisibleItems",
    "iii",
    playerId,
    type,
    serverWide
  );
};

export const Streamer_CountVisibleItems = (
  playerId: number,
  type: StreamerItemTypes,
  serverWide = 1
): number => {
  return samp.callNative(
    "Streamer_CountVisibleItems",
    "iii",
    playerId,
    type,
    serverWide
  );
};

export const Streamer_DestroyAllItems = (
  type: StreamerItemTypes,
  serverWide = 1
): number => {
  return samp.callNative("Streamer_DestroyAllItems", "ii", type, serverWide);
};

export const Streamer_CountItems = (
  type: StreamerItemTypes,
  serverWide = 1
): number => {
  return samp.callNative("Streamer_CountItems", "ii", type, serverWide);
};

export const Streamer_GetNearbyItems = (
  x: number,
  y: number,
  z: number,
  type: StreamerItemTypes,
  items: number[],
  maxItems: number = items.length,
  range = 300.0,
  worldId = -1
): void => {
  items = samp.callNative(
    "Streamer_GetNearbyItems",
    "fffiAifi",
    x,
    y,
    z,
    type,
    maxItems,
    range,
    worldId
  );
};

export const Streamer_GetAllVisibleItems = (
  playerId: number,
  type: StreamerItemTypes,
  items: number[],
  maxItems: number = items.length
): void => {
  items = samp.callNative(
    "Streamer_GetAllVisibleItems",
    "iiAi",
    playerId,
    type,
    maxItems
  );
};

export const Streamer_GetItemPos = (type: StreamerItemTypes, id: number) => {
  const [x, y, z]: number[] = samp.callNative(
    "Streamer_GetItemPos",
    "iiFFF",
    type,
    id
  );
  return { x, y, z };
};

export const Streamer_SetItemPos = (
  type: StreamerItemTypes,
  id: number,
  x: number,
  y: number,
  z: number
) => {
  return samp.callNative("Streamer_SetItemPos", "iifff", type, id, x, y, z);
};

export const Streamer_GetItemOffset = (type: StreamerItemTypes, id: number) => {
  const [x, y, z]: number[] = samp.callNative(
    "Streamer_GetItemOffset",
    "iiFFF",
    type,
    id
  );
  return { x, y, z };
};

export const Streamer_SetItemOffset = (
  type: StreamerItemTypes,
  id: number,
  x: number,
  y: number,
  z: number
) => {
  return samp.callNative("Streamer_SetItemOffset", "iifff", type, id, x, y, z);
};
