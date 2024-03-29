import type { IObjectPos } from "../interfaces/Object";

export const IsValidPickup = (pickupId: number): boolean => {
  return Boolean(samp.callNative("IsValidPickup", "i", pickupId));
};

export const IsPickupStreamedIn = (
  playerId: number,
  pickupId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsPickupStreamedIn", "ii", playerId, pickupId),
  );
};

export const GetPickupPos = (pickupId: number): IObjectPos => {
  const [fX, fY, fZ]: number[] = samp.callNative(
    "GetPickupPos",
    "iFFF",
    pickupId,
  );
  return { fX, fY, fZ };
};

export const GetPickupModel = (pickupId: number): number => {
  return samp.callNative("GetPickupModel", "i", pickupId);
};

export const GetPickupType = (pickupId: number): number => {
  return samp.callNative("GetPickupType", "i", pickupId);
};

export const GetPickupVirtualWorld = (pickupId: number): number => {
  return samp.callNative("GetPickupVirtualWorld", "i", pickupId);
};

export const SetPickupPos = (
  pickupId: number,
  X: number,
  Y: number,
  Z: number,
  update = true,
): number => {
  return samp.callNative("SetPickupPos", "ifffi", pickupId, X, Y, Z, update);
};

export const SetPickupModel = (
  pickupId: number,
  model: number,
  update = true,
): number => {
  return samp.callNative("SetPickupModel", "iii", pickupId, model, update);
};

export const SetPickupType = (
  pickupId: number,
  type: number,
  update = true,
): number => {
  return samp.callNative("SetPickupType", "iii", pickupId, type, update);
};

export const SetPickupVirtualWorld = (
  pickupId: number,
  virtualWorld: number,
): number => {
  return samp.callNative("SetPickupVirtualWorld", "ii", pickupId, virtualWorld);
};

export const ShowPickupForPlayer = (
  playerId: number,
  pickupId: number,
): number => {
  return samp.callNative("ShowPickupForPlayer", "ii", playerId, pickupId);
};

export const HidePickupForPlayer = (
  playerId: number,
  pickupId: number,
): number => {
  return samp.callNative("HidePickupForPlayer", "ii", playerId, pickupId);
};

export const IsPickupHiddenForPlayer = (
  playerId: number,
  pickupId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsPickupHiddenForPlayer", "ii", playerId, pickupId),
  );
};

export const AddStaticPickup = (
  model: number,
  type: number,
  X: number,
  Y: number,
  Z: number,
  virtualWorld: number,
): number => {
  return samp.callNative(
    "AddStaticPickup",
    "iifffi",
    model,
    type,
    X,
    Y,
    Z,
    virtualWorld,
  );
};

export const CreatePickup = (
  model: number,
  type: number,
  X: number,
  Y: number,
  Z: number,
  virtualWorld: number,
): number => {
  return samp.callNative(
    "CreatePickup",
    "iifffi",
    model,
    type,
    X,
    Y,
    Z,
    virtualWorld,
  );
};

export const DestroyPickup = (pickup: number): number => {
  return samp.callNative("DestroyPickup", "i", pickup);
};
