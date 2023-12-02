import type {
  IAttachedData,
  IMaterial,
  IMaterialText,
  IObjectPos,
  IObjectRotPos,
} from "../interfaces/Object";

export const GetObjectDrawDistance = (objectid: number): number => {
  return samp.callNativeFloat("GetObjectDrawDistance", "i", objectid);
};

export const GetObjectMoveSpeed = (objectid: number): number => {
  return samp.callNativeFloat("GetObjectMoveSpeed", "i", objectid);
};

export const GetObjectMovingTargetPos = (objectid: number): IObjectPos => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0]: number[] = samp.callNative(
    "GetObjectMovingTargetPos",
    "i",
    objectid
  );
  return { fX, fY, fZ };
};

export const GetObjectMovingTargetRot = (objectid: number): IObjectPos => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0]: number[] = samp.callNative(
    "GetObjectMovingTargetRot",
    "i",
    objectid
  );
  return { fX, fY, fZ };
};

export const GetObjectAttachedData = (objectid: number): IAttachedData => {
  const [
    attached_vehicleId = 0,
    attached_objectId = 0,
    attached_playerId = 0,
  ]: number[] = samp.callNative("GetObjectAttachedData", "i", objectid);
  return { attached_vehicleId, attached_objectId, attached_playerId };
};

export const GetObjectAttachedOffset = (objectid: number): IObjectRotPos => {
  const [
    fX = 0.0,
    fY = 0.0,
    fZ = 0.0,
    fRotX = 0.0,
    fRotY = 0.0,
    fRotZ = 0.0,
  ]: number[] = samp.callNative("GetObjectAttachedOffset", "i", objectid);
  return { fX, fY, fZ, fRotX, fRotY, fRotZ };
};

export const GetObjectSyncRotation = (objectid: number): number => {
  return samp.callNative("GetObjectSyncRotation", "i", objectid);
};

// Return values: 1 = material, 2 = material tex
export const IsObjectMaterialSlotUsed = (
  objectid: number,
  materialIndex: number
): boolean => {
  return Boolean(
    samp.callNative("IsObjectMaterialSlotUsed", "ii", objectid, materialIndex)
  );
};

export const GetObjectMaterial = (
  objectid: number,
  materialIndex: number
): IMaterial => {
  const [modelId = 0, txdName, textureName, materialColor = 0]: [
    number,
    string,
    string,
    number
  ] = samp.callNative(
    "GetObjectMaterial",
    "iiISiSiI",
    objectid,
    materialIndex,
    64,
    64
  );
  return { modelId, txdName, textureName, materialColor };
};

export const GetObjectMaterialText = (
  objectid: number,
  materialIndex: number
): IMaterialText => {
  const [
    text,
    materialSize = 0,
    fontFace,
    fontsize = 0,
    bold = 0,
    fontColor = 0,
    backColor = 0,
    textAlignment = 0,
  ]: [string, number, string, number, number, number, number, number] =
    samp.callNative(
      "GetObjectMaterialText",
      "iiSiISiIIIII",
      objectid,
      materialIndex,
      2048,
      32
    );
  return {
    text,
    materialSize,
    fontFace,
    fontsize,
    bold,
    fontColor,
    backColor,
    textAlignment,
  };
};

export const HasObjectCameraCollision = (objectid: number): boolean => {
  return Boolean(samp.callNative("HasObjectCameraCollision", "i", objectid));
};
