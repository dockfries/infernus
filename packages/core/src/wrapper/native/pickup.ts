import { ICommonRetVal } from "core/interfaces";
import type { IObjectPos } from "./interfaces/Object";

export const IsValidPickup = (pickupId: number): boolean => {
  return !!samp.callNative("IsValidPickup", "i", pickupId);
};

export const IsPickupStreamedIn = (
  playerId: number,
  pickupId: number,
): boolean => {
  return !!samp.callNative("IsPickupStreamedIn", "ii", playerId, pickupId);
};

export const GetPickupPos = (pickupId: number): IObjectPos & ICommonRetVal => {
  const [fX, fY, fZ, ret]: [number, number, number, number] = samp.callNative(
    "GetPickupPos",
    "iFFF",
    pickupId,
  );
  return { fX, fY, fZ, ret: !!ret };
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
  x: number,
  y: number,
  z: number,
  update = true,
): boolean => {
  return !!samp.callNative("SetPickupPos", "ifffi", pickupId, x, y, z, update);
};

export const SetPickupModel = (
  pickupId: number,
  model: number,
  update = true,
): boolean => {
  return !!samp.callNative("SetPickupModel", "iii", pickupId, model, update);
};

export const SetPickupType = (
  pickupId: number,
  type: number,
  update = true,
): boolean => {
  return !!samp.callNative("SetPickupType", "iii", pickupId, type, update);
};

export const SetPickupVirtualWorld = (
  pickupId: number,
  virtualWorld: number,
): boolean => {
  return !!samp.callNative(
    "SetPickupVirtualWorld",
    "ii",
    pickupId,
    virtualWorld,
  );
};

export const ShowPickupForPlayer = (
  playerId: number,
  pickupId: number,
): boolean => {
  return !!samp.callNative("ShowPickupForPlayer", "ii", playerId, pickupId);
};

export const HidePickupForPlayer = (
  playerId: number,
  pickupId: number,
): boolean => {
  return !!samp.callNative("HidePickupForPlayer", "ii", playerId, pickupId);
};

export const IsPickupHiddenForPlayer = (
  playerId: number,
  pickupId: number,
): boolean => {
  return !!samp.callNative("IsPickupHiddenForPlayer", "ii", playerId, pickupId);
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
  x: number,
  y: number,
  z: number,
  virtualWorld: number,
): number => {
  return samp.callNative(
    "CreatePickup",
    "iifffi",
    model,
    type,
    x,
    y,
    z,
    virtualWorld,
  );
};

export const DestroyPickup = (pickup: number): boolean => {
  return !!samp.callNative("DestroyPickup", "i", pickup);
};

export const CreatePlayerPickup = (
  playerId: number,
  model: number,
  type: number,
  x: number,
  y: number,
  z: number,
  virtualWorld = 0,
): number => {
  return samp.callNative(
    "CreatePlayerPickup",
    "iiifffi",
    playerId,
    model,
    type,
    x,
    y,
    z,
    virtualWorld,
  ) as number;
};

export const DestroyPlayerPickup = (playerId: number, pickupId: number) => {
  return !!samp.callNative("DestroyPlayerPickup", "ii", playerId, pickupId);
};

export const IsValidPlayerPickup = (playerId: number, pickupId: number) => {
  return !!samp.callNative("IsValidPlayerPickup", "ii", playerId, pickupId);
};

export const IsPlayerPickupStreamedIn = (
  playerId: number,
  pickupId: number,
) => {
  return !!samp.callNative(
    "IsPlayerPickupStreamedIn",
    "ii",
    playerId,
    pickupId,
  );
};

export const GetPlayerPickupPos = (playerId: number, pickupId: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetPlayerPickupPos",
    "iiFFF",
    playerId,
    pickupId,
  );
  return {
    x,
    y,
    z,
    ret: !!ret,
  };
};

export const SetPlayerPickupPos = (
  playerId: number,
  pickupId: number,
  x: number,
  y: number,
  z: number,
  update = true,
) => {
  return !!samp.callNative(
    "SetPlayerPickupPos",
    "iifffi",
    playerId,
    pickupId,
    x,
    y,
    z,
    update,
  );
};

export const SetPlayerPickupModel = (
  playerId: number,
  pickupId: number,
  model: number,
  update = true,
) => {
  return !!samp.callNative(
    "SetPlayerPickupModel",
    "iiii",
    playerId,
    pickupId,
    model,
    update,
  );
};

export const SetPlayerPickupType = (
  playerId: number,
  pickupId: number,
  type: number,
  update = true,
) => {
  return !!samp.callNative(
    "SetPlayerPickupType",
    "iiii",
    playerId,
    pickupId,
    type,
    update,
  );
};

export const SetPlayerPickupVirtualWorld = (
  playerId: number,
  pickupId: number,
  virtualWorld: number,
) => {
  return !!samp.callNative(
    "SetPlayerPickupVirtualWorld",
    "iii",
    playerId,
    pickupId,
    virtualWorld,
  );
};

export const GetPlayerPickupModel = (playerId: number, pickupId: number) => {
  return samp.callNative(
    "GetPlayerPickupModel",
    "ii",
    playerId,
    pickupId,
  ) as number;
};

export const GetPlayerPickupType = (playerId: number, pickupId: number) => {
  return samp.callNative(
    "GetPlayerPickupType",
    "ii",
    playerId,
    pickupId,
  ) as number;
};

export const GetPlayerPickupVirtualWorld = (
  playerId: number,
  pickupId: number,
) => {
  return samp.callNative(
    "GetPlayerPickupVirtualWorld",
    "ii",
    playerId,
    pickupId,
  ) as number;
};
