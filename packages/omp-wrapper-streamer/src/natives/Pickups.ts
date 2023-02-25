import { StreamerDistances } from "../definitions/Distances";

export const CreateDynamicPickup = (
  modelid: number,
  type: number,
  x: number,
  y: number,
  z: number,
  worldid = -1,
  interiorid = -1,
  playerid = -1,
  streamdistance: number = StreamerDistances.PICKUP_SD,
  areaid = -1,
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicPickup",
    "iifffiiifii",
    modelid,
    type,
    x,
    y,
    z,
    worldid,
    interiorid,
    playerid,
    streamdistance,
    areaid,
    priority
  );
};

export const DestroyDynamicPickup = (pickupid: number): number => {
  return samp.callNative("DestroyDynamicPickup", "i", pickupid);
};

export const IsValidDynamicPickup = (pickupid: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicPickup", "i", pickupid));
};
