import type {
  IAttachedData,
  IMaterial,
  IMaterialText,
  IObjectPos,
  IObjectRotPos,
} from "../interfaces/Object";

export const GetObjectDrawDistance = (objectId: number): number => {
  return samp.callNativeFloat("GetObjectDrawDistance", "i", objectId);
};

export const GetObjectMoveSpeed = (objectId: number): number => {
  return samp.callNativeFloat("GetObjectMoveSpeed", "i", objectId);
};

export const GetObjectMovingTargetPos = (objectId: number): IObjectPos => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0]: number[] = samp.callNative(
    "GetObjectMovingTargetPos",
    "i",
    objectId
  );
  return { fX, fY, fZ };
};

export const GetObjectMovingTargetRot = (objectId: number): IObjectPos => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0]: number[] = samp.callNative(
    "GetObjectMovingTargetRot",
    "i",
    objectId
  );
  return { fX, fY, fZ };
};

export const GetObjectAttachedData = (objectId: number): IAttachedData => {
  const [
    attached_vehicleId = 0,
    attached_objectId = 0,
    attached_playerId = 0,
  ]: number[] = samp.callNative("GetObjectAttachedData", "i", objectId);
  return { attached_vehicleId, attached_objectId, attached_playerId };
};

export const GetObjectAttachedOffset = (objectId: number): IObjectRotPos => {
  const [
    fX = 0.0,
    fY = 0.0,
    fZ = 0.0,
    fRotX = 0.0,
    fRotY = 0.0,
    fRotZ = 0.0,
  ]: number[] = samp.callNative("GetObjectAttachedOffset", "i", objectId);
  return { fX, fY, fZ, fRotX, fRotY, fRotZ };
};

export const GetObjectSyncRotation = (objectId: number): number => {
  return samp.callNative("GetObjectSyncRotation", "i", objectId);
};

// Return values: 1 = material, 2 = material tex
export const IsObjectMaterialSlotUsed = (
  objectId: number,
  materialIndex: number
): boolean => {
  return Boolean(
    samp.callNative("IsObjectMaterialSlotUsed", "ii", objectId, materialIndex)
  );
};

export const GetObjectMaterial = (
  objectId: number,
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
    objectId,
    materialIndex,
    64,
    64
  );
  return { modelId, txdName, textureName, materialColor };
};

export const GetObjectMaterialText = (
  objectId: number,
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
      objectId,
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

export const HasObjectCameraCollision = (objectId: number): boolean => {
  return Boolean(samp.callNative("HasObjectCameraCollision", "i", objectId));
};
