import type { StreamerItemTypes } from "../definitions/ItemTypes";
import type { E_STREAMER } from "../enum";

export type StreamerArrayData =
  | E_STREAMER.AREA_ID
  | E_STREAMER.EXTRA_ID
  | E_STREAMER.INTERIOR_ID
  | E_STREAMER.PLAYER_ID
  | E_STREAMER.WORLD_ID;

export const Streamer_GetFloatData = (
  type: StreamerItemTypes,
  id: number,
  data: E_STREAMER
): number => {
  const [ret] = samp.callNative(
    "Streamer_GetFloatData",
    "iiiF",
    type,
    id,
    data
  );
  return ret;
};

export const Streamer_SetFloatData = (
  type: StreamerItemTypes,
  id: number,
  data: E_STREAMER,
  value: number
): number => {
  return samp.callNative(
    "Streamer_SetFloatData",
    "iiif",
    type,
    id,
    data,
    value
  );
};

export const Streamer_GetIntData = (
  type: StreamerItemTypes,
  id: number,
  data: E_STREAMER
): number => {
  return samp.callNative("Streamer_GetIntData", "iii", type, id, data);
};

export const Streamer_SetIntData = (
  type: StreamerItemTypes,
  id: number,
  data: E_STREAMER,
  value: number
): number => {
  return samp.callNative("Streamer_SetIntData", "iiii", type, id, data, value);
};

export const Streamer_GetArrayData = (
  type: StreamerItemTypes,
  id: number,
  data: StreamerArrayData
): number[] => {
  return samp.callNative(
    "Streamer_GetArrayData",
    "iiiAi",
    type,
    id,
    data,
    Streamer_GetArrayDataLength(type, id, data)
  );
};

export const Streamer_SetArrayData = (
  type: StreamerItemTypes,
  id: number,
  data: StreamerArrayData,
  dest: number[]
): number => {
  return samp.callNative(
    "Streamer_SetArrayData",
    "iiiai",
    type,
    id,
    data,
    dest,
    dest.length
  );
};

export const Streamer_IsInArrayData = (
  type: StreamerItemTypes,
  id: number,
  data: StreamerArrayData,
  value: number
): boolean => {
  return Boolean(
    samp.callNative("Streamer_IsInArrayData", "iiii", type, id, data, value)
  );
};

export const Streamer_AppendArrayData = (
  type: StreamerItemTypes,
  id: number,
  data: StreamerArrayData,
  value: number
): number => {
  return samp.callNative(
    "Streamer_AppendArrayData",
    "iiii",
    type,
    id,
    data,
    value
  );
};

export const Streamer_RemoveArrayData = (
  type: StreamerItemTypes,
  id: number,
  data: StreamerArrayData,
  value: number
): number => {
  return samp.callNative(
    "Streamer_RemoveArrayData",
    "iiii",
    type,
    id,
    data,
    value
  );
};

export const Streamer_GetArrayDataLength = (
  type: StreamerItemTypes,
  id: number,
  data: StreamerArrayData
): number => {
  return samp.callNative("Streamer_GetArrayDataLength", "iii", type, id, data);
};

export const Streamer_GetUpperBound = (type: StreamerItemTypes): number => {
  return samp.callNative("Streamer_GetUpperBound", "i", type);
};
