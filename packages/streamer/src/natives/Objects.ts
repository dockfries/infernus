import { StreamerDistances } from "../definitions/Distances";
import { MaterialTextSizes } from "../enums";

export const CreateDynamicObject = (
  modelId: number,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  worldId = -1,
  interiorId = -1,
  playerId = -1,
  streamDistance: number = StreamerDistances.OBJECT_SD,
  drawDistance: number = StreamerDistances.OBJECT_DD,
  areaId = -1,
  priority = 0,
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
  const [x, y, z]: number[] = samp.callNative(
    "GetDynamicObjectPos",
    "iFFF",
    objectId,
  );
  return { x, y, z };
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
  const [rx, ry, rz]: number[] = samp.callNative(
    "GetDynamicObjectRot",
    "iFFF",
    objectId,
  );
  return { rx, ry, rz };
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
  rx = -1000.0,
  ry = -1000.0,
  rz = -1000.0,
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
  syncRotation = true,
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
  materialColor = 0,
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
  fontFace = "Arial",
  fontsize = 24,
  bold = 1,
  fontColor = 0xffffffff,
  backColor = 0,
  textAlignment = 0,
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
