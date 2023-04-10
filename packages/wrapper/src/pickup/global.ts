import { IObjectPos } from "../interfaces/Object";

export const IsValidPickup = (pickupid: number): boolean => {
  return Boolean(samp.callNative("IsValidPickup", "i", pickupid));
};

export const IsPickupStreamedIn = (
  playerid: number,
  pickupid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPickupStreamedIn", "ii", playerid, pickupid)
  );
};

export const GetPickupPos = (pickupid: number): IObjectPos => {
  const [fX, fY, fZ]: number[] = samp.callNative(
    "GetPickupPos",
    "iFFF",
    pickupid
  );
  return { fX, fY, fZ };
};

export const GetPickupModel = (pickupid: number): number => {
  return samp.callNative("GetPickupModel", "i", pickupid);
};

export const GetPickupType = (pickupid: number): number => {
  return samp.callNative("GetPickupType", "i", pickupid);
};

export const GetPickupVirtualWorld = (pickupid: number): number => {
  return samp.callNative("GetPickupVirtualWorld", "i", pickupid);
};

export const SetPickupPos = (
  pickupid: number,
  X: number,
  Y: number,
  Z: number,
  update = true
): number => {
  return samp.callNative("SetPickupPos", "ifffi", pickupid, X, Y, Z, update);
};

export const SetPickupModel = (
  pickupid: number,
  model: number,
  update = true
): number => {
  return samp.callNative("SetPickupModel", "iii", pickupid, model, update);
};

export const SetPickupType = (
  pickupid: number,
  type: number,
  update = true
): number => {
  return samp.callNative("SetPickupType", "iii", pickupid, type, update);
};

export const SetPickupVirtualWorld = (
  pickupid: number,
  virtualworld: number
): number => {
  return samp.callNative("SetPickupVirtualWorld", "ii", pickupid, virtualworld);
};

export const ShowPickupForPlayer = (
  playerid: number,
  pickupid: number
): number => {
  return samp.callNative("ShowPickupForPlayer", "ii", playerid, pickupid);
};

export const HidePickupForPlayer = (
  playerid: number,
  pickupid: number
): number => {
  return samp.callNative("HidePickupForPlayer", "ii", playerid, pickupid);
};

export const IsPickupHiddenForPlayer = (
  playerid: number,
  pickupid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPickupHiddenForPlayer", "ii", playerid, pickupid)
  );
};
