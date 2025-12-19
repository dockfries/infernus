import type { IAttachedData, IObjectPos } from "../interfaces/Object";
import { ICommonRetVal } from "core/interfaces";

export const IsValid3DTextLabel = (id: number): boolean => {
  return !!samp.callNative("IsValid3DTextLabel", "i", id);
};

export const Is3DTextLabelStreamedIn = (
  playerId: number,
  id: number,
): boolean => {
  return !!samp.callNative("Is3DTextLabelStreamedIn", "ii", playerId, id);
};

export const Get3DTextLabelColor = (id: number): number => {
  return samp.callNative("Get3DTextLabelColor", "i", id);
};

export const Get3DTextLabelPos = (id: number): IObjectPos & ICommonRetVal => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0, ret]: number[] = samp.callNative(
    "Get3DTextLabelPos",
    "iFFF",
    id,
  );
  return { fX, fY, fZ, ret: !!ret };
};

export const Set3DTextLabelDrawDistance = (
  id: number,
  dist: number,
): boolean => {
  return !!samp.callNative("Set3DTextLabelDrawDistance", "ii", id, dist);
};

export const Get3DTextLabelDrawDistance = (id: number): number => {
  return samp.callNativeFloat("Get3DTextLabelDrawDistance", "i", id);
};

export const Get3DTextLabelLOS = (id: number): boolean => {
  return !!samp.callNative("Get3DTextLabelLOS", "i", id);
};

export const Set3DTextLabelLOS = (id: number, status: boolean): boolean => {
  return !!samp.callNative("Set3DTextLabelLOS", "ii", id, status);
};

export const Set3DTextLabelVirtualWorld = (
  id: number,
  worldId: number,
): boolean => {
  return !!samp.callNative("Set3DTextLabelVirtualWorld", "ii", id, worldId);
};

export const Get3DTextLabelVirtualWorld = (id: number): number => {
  return samp.callNative("Get3DTextLabelVirtualWorld", "i", id);
};

export const Get3DTextLabelAttachedData = (
  id: number,
): IAttachedData & ICommonRetVal => {
  const [attachedPlayerId = 0, attachedVehicleId = 0, ret]: number[] =
    samp.callNative("Get3DTextLabelAttachedData", "i", id);
  return { attachedPlayerId, attachedVehicleId, ret: !!ret };
};

export const Delete3DTextLabel = (id: number): boolean => {
  return !!samp.callNative("Delete3DTextLabel", "i", id);
};

export const Attach3DTextLabelToPlayer = (
  id: number,
  playerId: number,
  offsetX: number,
  offsetY: number,
  offsetZ: number,
): boolean => {
  return !!samp.callNative(
    "Attach3DTextLabelToPlayer",
    "iifff",
    id,
    playerId,
    offsetX,
    offsetY,
    offsetZ,
  );
};

export const Attach3DTextLabelToVehicle = (
  id: number,
  vehicleId: number,
  offsetX: number,
  offsetY: number,
  offsetZ: number,
): boolean => {
  return !!samp.callNative(
    "Attach3DTextLabelToVehicle",
    "iifff",
    id,
    vehicleId,
    offsetX,
    offsetY,
    offsetZ,
  );
};
