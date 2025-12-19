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

export function CreatePlayerPickup(
  playerId: number,
  model: number,
  type: number,
  x: number,
  y: number,
  z: number,
  virtualWorld = 0,
) {
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
  );
}

export function DestroyPlayerPickup(playerId: number, pickupId: number) {
  return !!samp.callNative("DestroyPlayerPickup", "ii", playerId, pickupId);
}

export function IsValidPlayerPickup(playerId: number, pickupId: number) {
  return !!samp.callNative("IsValidPlayerPickup", "ii", playerId, pickupId);
}

export function IsPlayerPickupStreamedIn(playerId: number, pickupId: number) {
  return !!samp.callNative(
    "IsPlayerPickupStreamedIn",
    "ii",
    playerId,
    pickupId,
  );
}

export function GetPlayerPickupPos(playerId: number, pickupId: number) {
  const [x, y, z, ret] = samp.callNative(
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
}

export function SetPlayerPickupPos(
  playerId: number,
  pickupId: number,
  x: number,
  y: number,
  z: number,
  update = true,
) {
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
}

export function SetPlayerPickupModel(
  playerId: number,
  pickupId: number,
  model: number,
  update = true,
) {
  return !!samp.callNative(
    "SetPlayerPickupModel",
    "iiii",
    playerId,
    pickupId,
    model,
    update,
  );
}

export function SetPlayerPickupType(
  playerId: number,
  pickupId: number,
  type: number,
  update = true,
) {
  return !!samp.callNative(
    "SetPlayerPickupType",
    "iiii",
    playerId,
    pickupId,
    type,
    update,
  );
}

export function SetPlayerPickupVirtualWorld(
  playerId: number,
  pickupId: number,
  virtualWorld: number,
) {
  return !!samp.callNative(
    "SetPlayerPickupVirtualWorld",
    "iii",
    playerId,
    pickupId,
    virtualWorld,
  );
}

export function GetPlayerPickupModel(playerId: number, pickupId: number) {
  return samp.callNative(
    "GetPlayerPickupModel",
    "ii",
    playerId,
    pickupId,
  ) as number;
}

export function GetPlayerPickupType(playerId: number, pickupId: number) {
  return samp.callNative(
    "GetPlayerPickupType",
    "ii",
    playerId,
    pickupId,
  ) as number;
}

export function GetPlayerPickupVirtualWorld(
  playerId: number,
  pickupId: number,
) {
  return samp.callNative(
    "GetPlayerPickupVirtualWorld",
    "ii",
    playerId,
    pickupId,
  ) as number;
}
