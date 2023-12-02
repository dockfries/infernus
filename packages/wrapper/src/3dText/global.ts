import type { IAttachedData, IObjectPos } from "../interfaces/Object";

export const IsValid3DTextLabel = (id: number): boolean => {
  return Boolean(samp.callNative("IsValid3DTextLabel", "i", id));
};

export const Is3DTextLabelStreamedIn = (
  playerId: number,
  id: number
): boolean => {
  return Boolean(
    samp.callNative("Is3DTextLabelStreamedIn", "ii", playerId, id)
  );
};

export const Get3DTextLabelText = (id: number): string => {
  return samp.callNative("Get3DTextLabelText", "iSi", id, 144);
};

export const Get3DTextLabelColor = (id: number): number => {
  return samp.callNative("Get3DTextLabelColor", "i", id);
};

export const Get3DTextLabelPos = (id: number): IObjectPos => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0]: number[] = samp.callNative(
    "Get3DTextLabelPos",
    "iFFF",
    id
  );
  return { fX, fY, fZ };
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
  worldId: number
): void => {
  samp.callNative("Set3DTextLabelVirtualWorld", "ii", id, worldId);
};

export const Get3DTextLabelVirtualWorld = (id: number): number => {
  return samp.callNative("Get3DTextLabelVirtualWorld", "i", id);
};

export const Get3DTextLabelAttachedData = (id: number): IAttachedData => {
  const [attached_playerId = 0, attached_vehicleId = 0]: number[] =
    samp.callNative("Get3DTextLabelAttachedData", "i", id);
  return { attached_playerId, attached_vehicleId };
};
