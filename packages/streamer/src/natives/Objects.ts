import { StreamerDistances } from "../definitions/Distances";

export const CreateDynamicObject = (
  modelid: number,
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
  drawdistance: number = StreamerDistances.OBJECT_DD,
  areaId = -1,
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicObject",
    "iffffffiiiffii",
    modelid,
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
    drawdistance,
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
  materialindex: number
): boolean => {
  return Boolean(
    samp.callNative(
      "IsDynamicObjectMaterialUsed",
      "ii",
      objectid,
      materialindex
    )
  );
};

export const RemoveDynamicObjectMaterial = (
  objectid: number,
  materialindex: number
): number => {
  return samp.callNative(
    "RemoveDynamicObjectMaterial",
    "ii",
    objectid,
    materialindex
  );
};

export const GetDynamicObjectMaterial = (
  objectid: number,
  materialindex: number,
  txdname: string,
  texturename: string
) => {
  const [modelid, materialcolor]: [number, string | number] = samp.callNative(
    "GetDynamicObjectMaterial",
    "iiIssIii",
    objectid,
    materialindex,
    txdname,
    texturename,
    64,
    64
  );
  return { modelid, materialcolor };
};

export const SetDynamicObjectMaterial = (
  objectid: number,
  materialindex: number,
  modelid: number,
  txdname: string,
  texturename: string,
  materialcolor = 0
): number => {
  return samp.callNative(
    "SetDynamicObjectMaterial",
    "iiissi",
    objectid,
    materialindex,
    modelid,
    txdname,
    texturename,
    materialcolor
  );
};

export const IsDynamicObjectMaterialTextUsed = (
  objectid: number,
  materialindex: number
): boolean => {
  return Boolean(
    samp.callNative(
      "IsDynamicObjectMaterialTextUsed",
      "ii",
      objectid,
      materialindex
    )
  );
};

export const RemoveDynamicObjectMaterialText = (
  objectid: number,
  materialindex: number
): number => {
  return samp.callNative(
    "RemoveDynamicObjectMaterialText",
    "ii",
    objectid,
    materialindex
  );
};

export const GetDynamicObjectMaterialText = (
  objectid: number,
  materialindex: number
) => {
  const [
    text,
    materialsize,
    fontface,
    bold,
    fontcolor,
    backcolor,
    textalignment,
  ]: [string, number, string, number, number, number, number] = samp.callNative(
    "GetDynamicObjectMaterialText",
    "iiSISIIIIIii",
    objectid,
    materialindex,
    2048,
    32
  );
  return {
    text,
    materialsize,
    fontface,
    bold,
    fontcolor,
    backcolor,
    textalignment,
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
  materialindex: number,
  text: string,
  materialsize: number = MaterialTextSizes.SIZE_256x128,
  fontface = "Arial",
  fontsize = 24,
  bold = 1,
  fontcolor = 0xffffffff,
  backcolor = 0,
  textalignment = 0
): number => {
  return samp.callNative(
    "SetDynamicObjectMaterialText",
    "iisisiiiii",
    objectid,
    materialindex,
    text,
    materialsize,
    fontface,
    fontsize,
    bold,
    fontcolor,
    backcolor,
    textalignment
  );
};

export const GetPlayerCameraTargetDynObject = (playerId: number): number => {
  return samp.callNative("GetPlayerCameraTargetDynObject", "i", playerId);
};
