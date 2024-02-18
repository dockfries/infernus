import { StreamerDistances } from "../definitions/Distances";

export const CreateDynamicPickup = (
  modelId: number,
  type: number,
  x: number,
  y: number,
  z: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1,
  streamDistance: number = StreamerDistances.PICKUP_SD,
  areaId = -1,
  priority = 0,
): number => {
  return samp.callNative(
    "CreateDynamicPickup",
    "iifffiiifii",
    modelId,
    type,
    x,
    y,
    z,
    worldId,
    interiorId,
    playerId,
    streamDistance,
    areaId,
    priority,
  );
};

export const DestroyDynamicPickup = (pickupId: number): number => {
  return samp.callNative("DestroyDynamicPickup", "i", pickupId);
};

export const IsValidDynamicPickup = (pickupId: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicPickup", "i", pickupId));
};
