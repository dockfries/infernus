import { StreamerDistances } from "../definitions/Distances";
import type { StreamerItemTypes } from "../definitions/ItemTypes";

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
  worldId = -1,
  interiorId = -1,
  playerId = -1,
  streamDistance: number = StreamerDistances.MAP_ICON_SD,
  style: number = MapIconStyles.LOCAL,
  areaId = -1,
  priority = 0,
): number => {
  return samp.callNative(
    "CreateDynamicMapIcon",
    "fffiiiiifiii",
    x,
    y,
    z,
    type,
    color,
    worldId,
    interiorId,
    playerId,
    streamDistance,
    style,
    areaId,
    priority,
  );
};

export const DestroyDynamicMapIcon = (iconId: number): number => {
  return samp.callNative("DestroyDynamicMapIcon", "i", iconId);
};

export const IsValidDynamicMapIcon = (iconId: number): boolean => {
  return !!samp.callNative("IsValidDynamicMapIcon", "i", iconId);
};
