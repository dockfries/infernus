import type { StreamerItemTypes } from "../definitions/ItemTypes";
import {
  SERVER_WIDE,
  DEFAULT_MAX_ITEMS,
  DEFAULT_RANGE,
  DEFAULT_WORLD_ID,
} from "../constants";

export const Streamer_GetDistanceToItem = (
  x: number,
  y: number,
  z: number,
  type: StreamerItemTypes,
  id: number,
  dimensions: 2 | 3 = 3,
) => {
  const [distance, ret] = samp.callNative(
    "Streamer_GetDistanceToItem",
    "fffiiFi",
    x,
    y,
    z,
    type,
    id,
    dimensions,
  ) as [number, number];
  return { distance, ret };
};

export const Streamer_ToggleItem = (
  playerId: number,
  type: StreamerItemTypes,
  id: number,
  toggle: boolean,
): number => {
  return samp.callNative(
    "Streamer_ToggleItem",
    "iiii",
    playerId,
    type,
    id,
    toggle,
  );
};

export const Streamer_IsToggleItem = (
  playerId: number,
  type: StreamerItemTypes,
  id: number,
): boolean => {
  return !!samp.callNative("Streamer_IsToggleItem", "iii", playerId, type, id);
};

export const Streamer_ToggleAllItems = (
  playerId: number,
  type: StreamerItemTypes,
  toggle: boolean,
  exceptions: number[] = [-1],
): number => {
  return samp.callNative(
    "Streamer_ToggleAllItems",
    "iiiai",
    playerId,
    type,
    toggle,
    exceptions,
    exceptions.length,
  );
};

export const Streamer_GetItemInternalID = (
  playerId: number,
  type: StreamerItemTypes,
  streamerId: number,
): number => {
  return samp.callNative(
    "Streamer_GetItemInternalID",
    "iii",
    playerId,
    type,
    streamerId,
  );
};

export const Streamer_GetItemStreamerID = (
  playerId: number,
  type: StreamerItemTypes,
  internalId: number,
): number => {
  return samp.callNative(
    "Streamer_GetItemStreamerID",
    "iii",
    playerId,
    type,
    internalId,
  );
};

export const Streamer_IsItemVisible = (
  playerId: number,
  type: StreamerItemTypes,
  id: number,
): boolean => {
  return !!samp.callNative("Streamer_IsItemVisible", "iii", playerId, type, id);
};

export const Streamer_DestroyAllVisibleItems = (
  playerId: number,
  type: StreamerItemTypes,
  serverWide = SERVER_WIDE,
): number => {
  return samp.callNative(
    "Streamer_DestroyAllVisibleItems",
    "iii",
    playerId,
    type,
    serverWide,
  );
};

export const Streamer_CountVisibleItems = (
  playerId: number,
  type: StreamerItemTypes,
  serverWide = SERVER_WIDE,
): number => {
  return samp.callNative(
    "Streamer_CountVisibleItems",
    "iii",
    playerId,
    type,
    serverWide,
  );
};

export const Streamer_DestroyAllItems = (
  type: StreamerItemTypes,
  serverWide = SERVER_WIDE,
): number => {
  return samp.callNative("Streamer_DestroyAllItems", "ii", type, serverWide);
};

export const Streamer_CountItems = (
  type: StreamerItemTypes,
  serverWide = SERVER_WIDE,
): number => {
  return samp.callNative("Streamer_CountItems", "ii", type, serverWide);
};

export const Streamer_GetNearbyItems = (
  x: number,
  y: number,
  z: number,
  type: StreamerItemTypes,
  maxItems = DEFAULT_MAX_ITEMS,
  range = DEFAULT_RANGE,
  worldId = DEFAULT_WORLD_ID,
): number[] => {
  const [items = [], found = 0] = samp.callNative(
    "Streamer_GetNearbyItems",
    "fffiAifi",
    x,
    y,
    z,
    type,
    maxItems,
    range,
    worldId,
  ) as [number[], number];
  return items.slice(0, found);
};

export const Streamer_GetAllVisibleItems = (
  playerId: number,
  type: StreamerItemTypes,
  maxItems: number = DEFAULT_MAX_ITEMS,
): number[] => {
  const [items_ = [], found = 0] = samp.callNative(
    "Streamer_GetAllVisibleItems",
    "iiAi",
    playerId,
    type,
    maxItems,
  ) as [number[], number];
  return items_.slice(0, found);
};

export const Streamer_GetItemPos = (type: StreamerItemTypes, id: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "Streamer_GetItemPos",
    "iiFFF",
    type,
    id,
  );
  return { x, y, z, ret };
};

export const Streamer_SetItemPos = (
  type: StreamerItemTypes,
  id: number,
  x: number,
  y: number,
  z: number,
) => {
  return samp.callNative(
    "Streamer_SetItemPos",
    "iifff",
    type,
    id,
    x,
    y,
    z,
  ) as number;
};

export const Streamer_GetItemOffset = (type: StreamerItemTypes, id: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "Streamer_GetItemOffset",
    "iiFFF",
    type,
    id,
  );
  return { x, y, z, ret };
};

export const Streamer_SetItemOffset = (
  type: StreamerItemTypes,
  id: number,
  x: number,
  y: number,
  z: number,
) => {
  return samp.callNative(
    "Streamer_SetItemOffset",
    "iifff",
    type,
    id,
    x,
    y,
    z,
  ) as number;
};
