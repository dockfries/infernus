import { StreamerItemTypes } from "../definitions/ItemTypes";

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
  playerid: number,
  type: StreamerItemTypes,
  id: number,
  toggle: boolean
): number => {
  return samp.callNative(
    "Streamer_ToggleItem",
    "iiii",
    playerid,
    type,
    id,
    toggle
  );
};

export const Streamer_IsToggleItem = (
  playerid: number,
  type: StreamerItemTypes,
  id: number
): boolean => {
  return Boolean(
    samp.callNative("Streamer_IsToggleItem", "iii", playerid, type, id)
  );
};

export const Streamer_ToggleAllItems = (
  playerid: number,
  type: StreamerItemTypes,
  toggle: boolean,
  exceptions: number[] = [-1]
): number => {
  return samp.callNative(
    "Streamer_ToggleAllItems",
    "iiiai",
    playerid,
    type,
    toggle,
    exceptions,
    exceptions.length
  );
};

export const Streamer_GetItemInternalID = (
  playerid: number,
  type: StreamerItemTypes,
  streamerid: number
): number => {
  return samp.callNative(
    "Streamer_GetItemInternalID",
    "iii",
    playerid,
    type,
    streamerid
  );
};

export const Streamer_GetItemStreamerID = (
  playerid: number,
  type: StreamerItemTypes,
  internalid: number
): number => {
  return samp.callNative(
    "Streamer_GetItemStreamerID",
    "iii",
    playerid,
    type,
    internalid
  );
};

export const Streamer_IsItemVisible = (
  playerid: number,
  type: StreamerItemTypes,
  id: number
): boolean => {
  return Boolean(
    samp.callNative("Streamer_IsItemVisible", "iii", playerid, type, id)
  );
};

export const Streamer_DestroyAllVisibleItems = (
  playerid: number,
  type: StreamerItemTypes,
  serverwide = 1
): number => {
  return samp.callNative(
    "Streamer_DestroyAllVisibleItems",
    "iii",
    playerid,
    type,
    serverwide
  );
};

export const Streamer_CountVisibleItems = (
  playerid: number,
  type: StreamerItemTypes,
  serverwide = 1
): number => {
  return samp.callNative(
    "Streamer_CountVisibleItems",
    "iii",
    playerid,
    type,
    serverwide
  );
};

export const Streamer_DestroyAllItems = (
  type: StreamerItemTypes,
  serverwide = 1
): number => {
  return samp.callNative("Streamer_DestroyAllItems", "ii", type, serverwide);
};

export const Streamer_CountItems = (
  type: StreamerItemTypes,
  serverwide = 1
): number => {
  return samp.callNative("Streamer_CountItems", "ii", type, serverwide);
};

export const Streamer_GetNearbyItems = (
  x: number,
  y: number,
  z: number,
  type: StreamerItemTypes,
  items: number[],
  maxitems: number = items.length,
  range = 300.0,
  worldid = -1
): void => {
  items = samp.callNative(
    "Streamer_GetNearbyItems",
    "fffiAifi",
    x,
    y,
    z,
    type,
    maxitems,
    range,
    worldid
  );
};

export const Streamer_GetAllVisibleItems = (
  playerid: number,
  type: StreamerItemTypes,
  items: number[],
  maxitems: number = items.length
): void => {
  items = samp.callNative(
    "Streamer_GetAllVisibleItems",
    "iiAi",
    playerid,
    type,
    maxitems
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
