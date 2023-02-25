import { StreamerDistances } from "../definitions/Distances";
import { StreamerItemTypes } from "../definitions/ItemTypes";

export enum MapIconStyles {
  LOCAL,
  GLOBAL,
  LOCAL_CHECKPOINT,
  GLOBAL_CHECKPOINT,
}

export const CreateDynamicMapIcon = (
  x: number,
  y: number,
  z: number,
  type: StreamerItemTypes,
  color: number,
  worldid = -1,
  interiorid = -1,
  playerid = -1,
  streamdistance: number = StreamerDistances.MAP_ICON_SD,
  style: number = MapIconStyles.LOCAL,
  areaid = -1,
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicMapIcon",
    "fffiiiiifiii",
    x,
    y,
    z,
    type,
    color,
    worldid,
    interiorid,
    playerid,
    streamdistance,
    style,
    areaid,
    priority
  );
};

export const DestroyDynamicMapIcon = (iconid: number): number => {
  return samp.callNative("DestroyDynamicMapIcon", "i", iconid);
};

export const IsValidDynamicMapIcon = (iconid: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicMapIcon", "i", iconid));
};
