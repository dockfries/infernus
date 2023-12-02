import { StreamerDistances } from "../definitions/Distances";

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
  priority = 0
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
    priority
  );
};

export const DestroyDynamicObject = (objectid: number): number => {
  return samp.callNative("DestroyDynamicObject", "i", objectid);
};

export const IsValidDynamicObject = (objectid: number): boolean => {
  return Boolean(samp.callNative("IsValidDynamicObject", "i", objectid));
};

export const GetDynamicObjectPos = (objectid: number) => {
  const [x, y, z]: number[] = samp.callNative(
    "GetDynamicObjectPos",
    "iFFF",
    objectid
  );
  return { x, y, z };
};

export const SetDynamicObjectPos = (
  objectid: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative("SetDynamicObjectPos", "ifff", objectid, x, y, z);
};

export const GetDynamicObjectRot = (objectid: number) => {
  const [rx, ry, rz]: number[] = samp.callNative(
    "GetDynamicObjectRot",
    "iFFF",
    objectid
  );
  return { rx, ry, rz };
};

export const SetDynamicObjectRot = (
  objectid: number,
  rx: number,
  ry: number,
  rz: number
): number => {
  return samp.callNative("SetDynamicObjectRot", "ifff", objectid, rx, ry, rz);
};

export const MoveDynamicObject = (
  objectid: number,
  x: number,
  y: number,
  z: number,
  speed: number,
  rx = -1000.0,
  ry = -1000.0,
  rz = -1000.0
): number => {
  return samp.callNative(
    "MoveDynamicObject",
    "ifffffff",
    objectid,
    x,
    y,
    z,
    speed,
    rx,
    ry,
    rz
  );
};

export const StopDynamicObject = (objectid: number): number => {
  return samp.callNative("StopDynamicObject", "i", objectid);
};

export const IsDynamicObjectMoving = (objectid: number): boolean => {
  return Boolean(samp.callNative("IsDynamicObjectMoving", "i", objectid));
};

export const AttachCameraToDynamicObject = (
  playerId: number,
  objectid: number
): number => {
  return samp.callNative(
    "AttachCameraToDynamicObject",
    "ii",
    playerId,
    objectid
  );
};

export const AttachDynamicObjectToObject = (
  objectid: number,
  attachtoid: number,
  offsetx: number,
  offsety: number,
  offsetz: number,
  rx: number,
  ry: number,
  rz: number,
  syncrotation = true
): number => {
  return samp.callNative(
    "AttachDynamicObjectToObject",
    "iiffffffi",
    objectid,
    attachtoid,
    offsetx,
    offsety,
    offsetz,
    rx,
    ry,
    rz,
    syncrotation
  );
};

export const AttachDynamicObjectToPlayer = (
  objectid: number,
  playerId: number,
  offsetx: number,
  offsety: number,
  offsetz: number,
  rx: number,
  ry: number,
  rz: number
): number => {
  return samp.callNative(
    "AttachDynamicObjectToPlayer",
    "iiffffff",
    objectid,
    playerId,
    offsetx,
    offsety,
    offsetz,
    rx,
    ry,
    rz
  );
};

export const AttachDynamicObjectToVehicle = (
  objectid: number,
  vehicleid: number,
  offsetx: number,
  offsety: number,
  offsetz: number,
  rx: number,
  ry: number,
  rz: number
): number => {
  return samp.callNative(
    "AttachDynamicObjectToVehicle",
    "iiffffff",
    objectid,
    vehicleid,
    offsetx,
    offsety,
    offsetz,
    rx,
    ry,
    rz
  );
};

export const EditDynamicObject = (
  playerId: number,
  objectid: number
): number => {
  return samp.callNative("EditDynamicObject", "ii", playerId, objectid);
};

export const IsDynamicObjectMaterialUsed = (
  objectid: number,
  materialIndex: number
): boolean => {
  return Boolean(
    samp.callNative(
      "IsDynamicObjectMaterialUsed",
      "ii",
      objectid,
      materialIndex
    )
  );
};

export const RemoveDynamicObjectMaterial = (
  objectid: number,
  materialIndex: number
): number => {
  return samp.callNative(
    "RemoveDynamicObjectMaterial",
    "ii",
    objectid,
    materialIndex
  );
};

export const GetDynamicObjectMaterial = (
  objectid: number,
  materialIndex: number,
  txdName: string,
  textureName: string
) => {
  const [modelId, materialColor]: [number, string | number] = samp.callNative(
    "GetDynamicObjectMaterial",
    "iiIssIii",
    objectid,
    materialIndex,
    txdName,
    textureName,
    64,
    64
  );
  return { modelId, materialColor };
};

export const SetDynamicObjectMaterial = (
  objectid: number,
  materialIndex: number,
  modelId: number,
  txdName: string,
  textureName: string,
  materialColor = 0
): number => {
  return samp.callNative(
    "SetDynamicObjectMaterial",
    "iiissi",
    objectid,
    materialIndex,
    modelId,
    txdName,
    textureName,
    materialColor
  );
};

export const IsDynamicObjectMaterialTextUsed = (
  objectid: number,
  materialIndex: number
): boolean => {
  return Boolean(
    samp.callNative(
      "IsDynamicObjectMaterialTextUsed",
      "ii",
      objectid,
      materialIndex
    )
  );
};

export const RemoveDynamicObjectMaterialText = (
  objectid: number,
  materialIndex: number
): number => {
  return samp.callNative(
    "RemoveDynamicObjectMaterialText",
    "ii",
    objectid,
    materialIndex
  );
};

export const GetDynamicObjectMaterialText = (
  objectid: number,
  materialIndex: number
) => {
  const [
    text,
    materialSize,
    fontFace,
    bold,
    fontColor,
    backColor,
    textAlignment,
  ]: [string, number, string, number, number, number, number] = samp.callNative(
    "GetDynamicObjectMaterialText",
    "iiSISIIIIIii",
    objectid,
    materialIndex,
    2048,
    32
  );
  return {
    text,
    materialSize,
    fontFace,
    bold,
    fontColor,
    backColor,
    textAlignment,
  };
};

export enum MaterialTextSizes {
  SIZE_32x32 = 10,
  SIZE_64x32 = 20,
  SIZE_64x64 = 30,
  SIZE_128x32 = 40,
  SIZE_128x64 = 50,
  SIZE_128x128 = 60,
  SIZE_256x32 = 70,
  SIZE_256x64 = 80,
  SIZE_256x128 = 90,
  SIZE_256x256 = 100,
  SIZE_512x64 = 110,
  SIZE_512x128 = 120,
  SIZE_512x256 = 130,
  SIZE_512x512 = 140,
}

export const SetDynamicObjectMaterialText = (
  objectid: number,
  materialIndex: number,
  text: string,
  materialSize: number = MaterialTextSizes.SIZE_256x128,
  fontFace = "Arial",
  fontsize = 24,
  bold = 1,
  fontColor = 0xffffffff,
  backColor = 0,
  textAlignment = 0
): number => {
  return samp.callNative(
    "SetDynamicObjectMaterialText",
    "iisisiiiii",
    objectid,
    materialIndex,
    text,
    materialSize,
    fontFace,
    fontsize,
    bold,
    fontColor,
    backColor,
    textAlignment
  );
};

export const GetPlayerCameraTargetDynObject = (playerId: number): number => {
  return samp.callNative("GetPlayerCameraTargetDynObject", "i", playerId);
};
