import { rgba } from "core/utils/colorUtils";
import type { IAttachedData, IObjectPos } from "../interfaces/Object";
import { ICommonRetVal } from "core/interfaces";

export const IsValid3DTextLabel = (id: number): boolean => {
  return Boolean(samp.callNative("IsValid3DTextLabel", "i", id));
};

export const Is3DTextLabelStreamedIn = (
  playerId: number,
  id: number,
): boolean => {
  return Boolean(
    samp.callNative("Is3DTextLabelStreamedIn", "ii", playerId, id),
  );
};

export const Get3DTextLabelText = (id: number) => {
  const [text, ret] = samp.callNative("Get3DTextLabelText", "iSi", id, 144);
  return { text, ret };
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
  return { fX, fY, fZ, ret };
};

export const Set3DTextLabelDrawDistance = (id: number, dist: number): void => {
  samp.callNative("Set3DTextLabelDrawDistance", "ii", id, dist);
};

export const Get3DTextLabelDrawDistance = (id: number): number => {
  return samp.callNativeFloat("Get3DTextLabelDrawDistance", "i", id);
};

export const Get3DTextLabelLOS = (id: number): boolean => {
  return Boolean(samp.callNative("Get3DTextLabelLOS", "i", id));
};

export const Set3DTextLabelLOS = (id: number, status: boolean): void => {
  samp.callNative("Set3DTextLabelLOS", "ii", id, status);
};

export const Set3DTextLabelVirtualWorld = (
  id: number,
  worldId: number,
): void => {
  samp.callNative("Set3DTextLabelVirtualWorld", "ii", id, worldId);
};

export const Get3DTextLabelVirtualWorld = (id: number): number => {
  return samp.callNative("Get3DTextLabelVirtualWorld", "i", id);
};

export const Get3DTextLabelAttachedData = (id: number): IAttachedData => {
  const [attachedPlayerId = 0, attachedVehicleId = 0]: number[] =
    samp.callNative("Get3DTextLabelAttachedData", "i", id);
  return { attachedPlayerId, attachedVehicleId };
};

export const Create3DTextLabel = (
  text: string,
  color: string | number,
  x: number,
  y: number,
  z: number,
  drawDistance: number,
  virtualWorld: number,
  testLOS = false,
): number => {
  return samp.callNative(
    "Create3DTextLabel",
    "siffffii",
    text,
    rgba(color),
    x,
    y,
    z,
    drawDistance,
    virtualWorld,
    testLOS,
  );
};

export const Delete3DTextLabel = (id: number): number => {
  return samp.callNative("Delete3DTextLabel", "i", id);
};

export const Attach3DTextLabelToPlayer = (
  id: number,
  playerId: number,
  offsetX: number,
  offsetY: number,
  offsetZ: number,
): number => {
  return samp.callNative(
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
): number => {
  return samp.callNative(
    "Attach3DTextLabelToVehicle",
    "iifff",
    id,
    vehicleId,
    offsetX,
    offsetY,
    offsetZ,
  );
};

export const Update3DTextLabelText = (
  id: number,
  color: string | number,
  text: string,
): number => {
  return samp.callNative("Update3DTextLabelText", "iis", id, rgba(color), text);
};
