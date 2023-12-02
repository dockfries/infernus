import { StreamerDistances } from "../definitions/Distances";

export const CreateDynamic3DTextLabel = (
  text: string,
  color: number,
  x: number,
  y: number,
  z: number,
  drawDistance: number,
  attachedPlayer = 0xffff,
  attachedVehicle = 0xffff,
  testLos = false,
  worldId = -1,
  interiorId = -1,
  playerId = -1,
  streamDistance: number = StreamerDistances.TEXT_3D_LABEL_SD,
  areaId = -1,
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamic3DTextLabel",
    "siffffiiiiiifii",
    text,
    color,
    x,
    y,
    z,
    drawDistance,
    attachedPlayer,
    attachedVehicle,
    testLos,
    worldId,
    interiorId,
    playerId,
    streamDistance,
    areaId,
    priority
  );
};

export const DestroyDynamic3DTextLabel = (id: number): number => {
  return samp.callNative("DestroyDynamic3DTextLabel", "i", id);
};

export const IsValidDynamic3DTextLabel = (id: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamic3DTextLabel", "i", id));
};

export const GetDynamic3DTextLabelText = (id: number): string => {
  return samp.callNative("GetDynamic3DTextLabelText", "iSi", id, 1024);
};

export const UpdateDynamic3DTextLabelText = (
  id: number,
  color: number,
  text: string
): number => {
  return samp.callNative(
    "UpdateDynamic3DTextLabelText",
    "iis",
    id,
    color,
    text
  );
};
