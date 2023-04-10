import {
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
    attached_vehicleid = 0,
    attached_objectid = 0,
    attached_playerid = 0,
  ]: number[] = samp.callNative("GetObjectAttachedData", "i", objectid);
  return { attached_vehicleid, attached_objectid, attached_playerid };
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
  materialindex: number
): boolean => {
  return Boolean(
    samp.callNative("IsObjectMaterialSlotUsed", "ii", objectid, materialindex)
  );
};

export const GetObjectMaterial = (
  objectid: number,
  materialindex: number
): IMaterial => {
  const [modelid = 0, txdname, texturename, materialcolor = 0]: [
    number,
    string,
    string,
    number
  ] = samp.callNative(
    "GetObjectMaterial",
    "iiISiSiI",
    objectid,
    materialindex,
    64,
    64
  );
  return { modelid, txdname, texturename, materialcolor };
};

export const GetObjectMaterialText = (
  objectid: number,
  materialindex: number
): IMaterialText => {
  const [
    text,
    materialsize = 0,
    fontface,
    fontsize = 0,
    bold = 0,
    fontcolor = 0,
    backcolor = 0,
    textalignment = 0,
  ]: [string, number, string, number, number, number, number, number] =
    samp.callNative(
      "GetObjectMaterialText",
      "iiSiISiIIIII",
      objectid,
      materialindex,
      2048,
      32
    );
  return {
    text,
    materialsize,
    fontface,
    fontsize,
    bold,
    fontcolor,
    backcolor,
    textalignment,
  };
};

export const HasObjectCameraCollision = (objectid: number): boolean => {
  return Boolean(samp.callNative("HasObjectCameraCollision", "i", objectid));
};
