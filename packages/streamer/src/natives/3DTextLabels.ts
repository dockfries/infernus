import { StreamerDistances } from "../definitions/Distances";
import {
  INVALID_PLAYER_ID,
  INVALID_VEHICLE_ID,
  DEFAULT_WORLD_ID,
  DEFAULT_INTERIOR_ID,
  DEFAULT_PLAYER_ID,
  DEFAULT_AREA_ID,
  DEFAULT_PRIORITY,
  DEFAULT_TEST_LOS,
  MAX_STRING_LENGTH,
} from "../constants";

export const CreateDynamic3DTextLabel = (
  text: string,
  color: number,
  x: number,
  y: number,
  z: number,
  drawDistance: number,
  attachedPlayer = INVALID_PLAYER_ID,
  attachedVehicle = INVALID_VEHICLE_ID,
  testLOS = DEFAULT_TEST_LOS,
  worldId = DEFAULT_WORLD_ID,
  interiorId = DEFAULT_INTERIOR_ID,
  playerId = DEFAULT_PLAYER_ID,
  streamDistance: number = StreamerDistances.TEXT_3D_LABEL_SD,
  areaId = DEFAULT_AREA_ID,
  priority = DEFAULT_PRIORITY,
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
    testLOS,
    worldId,
    interiorId,
    playerId,
    streamDistance,
    areaId,
    priority,
  );
};

export const DestroyDynamic3DTextLabel = (id: number): number => {
  return samp.callNative("DestroyDynamic3DTextLabel", "i", id);
};

export const IsValidDynamic3DTextLabel = (id: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamic3DTextLabel", "i", id));
};

export const GetDynamic3DTextLabelText = (id: number) => {
  const [text, ret]: [string, number] = samp.callNative(
    "GetDynamic3DTextLabelText",
    "iSi",
    id,
    MAX_STRING_LENGTH,
  );
  return { text, ret };
};

export const UpdateDynamic3DTextLabelText = (
  id: number,
  color: number,
  text: string,
): number => {
  return samp.callNative(
    "UpdateDynamic3DTextLabelText",
    "iis",
    id,
    color,
    text,
  );
};
