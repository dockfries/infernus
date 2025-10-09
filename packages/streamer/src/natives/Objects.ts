import { StreamerDistances } from "../definitions/Distances";
import { MaterialTextSizes } from "../enums";
import {
  DEFAULT_WORLD_ID,
  DEFAULT_INTERIOR_ID,
  DEFAULT_PLAYER_ID,
  DEFAULT_AREA_ID,
  DEFAULT_PRIORITY,
  DEFAULT_ROTATION_X,
  DEFAULT_ROTATION_Y,
  DEFAULT_ROTATION_Z,
  DEFAULT_SYNC_ROTATION,
  DEFAULT_FONT_FACE,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_BOLD,
  DEFAULT_MATERIAL_COLOR,
  DEFAULT_FONT_COLOR,
  DEFAULT_BACK_COLOR,
  DEFAULT_TEXT_ALIGNMENT,
} from "../constants";

export const CreateDynamicObject = (
  modelId: number,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  worldId = DEFAULT_WORLD_ID,
  interiorId = DEFAULT_INTERIOR_ID,
  playerId = DEFAULT_PLAYER_ID,
  streamDistance: number = StreamerDistances.OBJECT_SD,
  drawDistance: number = StreamerDistances.OBJECT_DD,
  areaId = DEFAULT_AREA_ID,
  priority = DEFAULT_PRIORITY,
): number => {
  return samp.callNative(
    "CreateDynamicObject",
    "iffffffiiiffii",
    modelId,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    worldId,
    interiorId,
    playerId,
    streamDistance,
    drawDistance,
    areaId,
    priority,
  );
};

export const DestroyDynamicObject = (objectId: number): number => {
  return samp.callNative("DestroyDynamicObject", "i", objectId);
};

export const IsValidDynamicObject = (objectId: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicObject", "i", objectId));
};

export const GetDynamicObjectPos = (objectId: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetDynamicObjectPos",
    "iFFF",
    objectId,
  );
  return { x, y, z, ret };
};

export const SetDynamicObjectPos = (
  objectId: number,
  x: number,
  y: number,
  z: number,
): number => {
  return samp.callNative("SetDynamicObjectPos", "ifff", objectId, x, y, z);
};

export const GetDynamicObjectRot = (objectId: number) => {
  const [rx, ry, rz, ret]: [number, number, number, number] = samp.callNative(
    "GetDynamicObjectRot",
    "iFFF",
    objectId,
  );
  return { rx, ry, rz, ret };
};

export const SetDynamicObjectRot = (
  objectId: number,
  rx: number,
  ry: number,
  rz: number,
): number => {
  return samp.callNative("SetDynamicObjectRot", "ifff", objectId, rx, ry, rz);
};

export const MoveDynamicObject = (
  objectId: number,
  x: number,
  y: number,
  z: number,
  speed: number,
  rx = DEFAULT_ROTATION_X,
  ry = DEFAULT_ROTATION_Y,
  rz = DEFAULT_ROTATION_Z,
): number => {
  return samp.callNative(
    "MoveDynamicObject",
    "ifffffff",
    objectId,
    x,
    y,
    z,
    speed,
    rx,
    ry,
    rz,
  );
};

export const StopDynamicObject = (objectId: number): number => {
  return samp.callNative("StopDynamicObject", "i", objectId);
};

export const IsDynamicObjectMoving = (objectId: number): boolean => {
  return Boolean(samp.callNative("IsDynamicObjectMoving", "i", objectId));
};

export const AttachCameraToDynamicObject = (
  playerId: number,
  objectId: number,
): number => {
  return samp.callNative(
    "AttachCameraToDynamicObject",
    "ii",
    playerId,
    objectId,
  );
};

export const AttachDynamicObjectToObject = (
  objectId: number,
  attachToId: number,
  offsetX: number,
  offsetY: number,
  offsetZ: number,
  rx: number,
  ry: number,
  rz: number,
  syncRotation = DEFAULT_SYNC_ROTATION,
): number => {
  return samp.callNative(
    "AttachDynamicObjectToObject",
    "iiffffffi",
    objectId,
    attachToId,
    offsetX,
    offsetY,
    offsetZ,
    rx,
    ry,
    rz,
    syncRotation,
  );
};

export const AttachDynamicObjectToPlayer = (
  objectId: number,
  playerId: number,
  offsetX: number,
  offsetY: number,
  offsetZ: number,
  rx: number,
  ry: number,
  rz: number,
): number => {
  return samp.callNative(
    "AttachDynamicObjectToPlayer",
    "iiffffff",
    objectId,
    playerId,
    offsetX,
    offsetY,
    offsetZ,
    rx,
    ry,
    rz,
  );
};

export const AttachDynamicObjectToVehicle = (
  objectId: number,
  vehicleId: number,
  offsetX: number,
  offsetY: number,
  offsetZ: number,
  rx: number,
  ry: number,
  rz: number,
): number => {
  return samp.callNative(
    "AttachDynamicObjectToVehicle",
    "iiffffff",
    objectId,
    vehicleId,
    offsetX,
    offsetY,
    offsetZ,
    rx,
    ry,
    rz,
  );
};

export const EditDynamicObject = (
  playerId: number,
  objectId: number,
): number => {
  return samp.callNative("EditDynamicObject", "ii", playerId, objectId);
};

export const IsDynamicObjectMaterialUsed = (
  objectId: number,
  materialIndex: number,
): boolean => {
  return Boolean(
    samp.callNative(
      "IsDynamicObjectMaterialUsed",
      "ii",
      objectId,
      materialIndex,
    ),
  );
};

export const RemoveDynamicObjectMaterial = (
  objectId: number,
  materialIndex: number,
): number => {
  return samp.callNative(
    "RemoveDynamicObjectMaterial",
    "ii",
    objectId,
    materialIndex,
  );
};

export const SetDynamicObjectMaterial = (
  objectId: number,
  materialIndex: number,
  modelId: number,
  txdName: string,
  textureName: string,
  materialColor = DEFAULT_MATERIAL_COLOR,
): number => {
  return samp.callNative(
    "SetDynamicObjectMaterial",
    "iiissi",
    objectId,
    materialIndex,
    modelId,
    txdName,
    textureName,
    materialColor,
  );
};

export const IsDynamicObjectMaterialTextUsed = (
  objectId: number,
  materialIndex: number,
): boolean => {
  return Boolean(
    samp.callNative(
      "IsDynamicObjectMaterialTextUsed",
      "ii",
      objectId,
      materialIndex,
    ),
  );
};

export const RemoveDynamicObjectMaterialText = (
  objectId: number,
  materialIndex: number,
): number => {
  return samp.callNative(
    "RemoveDynamicObjectMaterialText",
    "ii",
    objectId,
    materialIndex,
  );
};

export const SetDynamicObjectMaterialText = (
  objectId: number,
  materialIndex: number,
  text: string,
  materialSize: number = MaterialTextSizes.SIZE_256x128,
  fontFace = DEFAULT_FONT_FACE,
  fontsize = DEFAULT_FONT_SIZE,
  bold = DEFAULT_FONT_BOLD,
  fontColor = DEFAULT_FONT_COLOR,
  backColor = DEFAULT_BACK_COLOR,
  textAlignment = DEFAULT_TEXT_ALIGNMENT,
): number => {
  return samp.callNative(
    "SetDynamicObjectMaterialText",
    "iisisiiiii",
    objectId,
    materialIndex,
    text,
    materialSize,
    fontFace,
    fontsize,
    bold,
    fontColor,
    backColor,
    textAlignment,
  );
};

export const GetPlayerCameraTargetDynObject = (playerId: number): number => {
  return samp.callNative("GetPlayerCameraTargetDynObject", "i", playerId);
};

export const SetDynamicObjectNoCameraCol = (objectId: number) => {
  return Boolean(samp.callNative("SetDynamicObjectNoCameraCol", "i", objectId));
};

export const GetDynamicObjectNoCameraCol = (objectId: number) => {
  return Boolean(samp.callNative("GetDynamicObjectNoCameraCol", "i", objectId));
};
