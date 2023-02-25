import {
  IAttachedData,
  IMaterial,
  IMaterialText,
  IObjectPos,
  IObjectRotPos,
} from "../interfaces/Object";

export const GetPlayerObjectDrawDistance = (
  playerid: number,
  objectid: number
): number => {
  return samp.callNativeFloat(
    "GetPlayerObjectDrawDistance",
    "ii",
    playerid,
    objectid
  );
};

export const SetPlayerObjectMoveSpeed = (
  playerid: number,
  objectid: number,
  fSpeed: number
) => {
  return samp.callNativeFloat(
    "SetPlayerObjectMoveSpeed",
    "iif",
    playerid,
    objectid,
    fSpeed
  );
};

export const GetPlayerObjectMoveSpeed = (
  playerid: number,
  objectid: number
): number => {
  return samp.callNativeFloat(
    "GetPlayerObjectMoveSpeed",
    "ii",
    playerid,
    objectid
  );
};

export const GetPlayerObjectTarget = (
  playerid: number,
  objectid: number
): IObjectPos => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0]: number[] = samp.callNative(
    "GetPlayerObjectTarget",
    "iiFFF",
    playerid,
    objectid
  );
  return { fX, fY, fZ };
};

export const GetPlayerObjectMovingTargetPos = (
  playerid: number,
  objectid: number
): IObjectPos => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0]: number[] = samp.callNative(
    "GetPlayerObjectMovingTargetPos",
    "iiFFF",
    playerid,
    objectid
  );
  return { fX, fY, fZ };
};

export const GetPlayerObjectMovingTargetRot = (
  playerid: number,
  objectid: number
): IObjectPos => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0]: number[] = samp.callNative(
    "GetPlayerObjectMovingTargetRot",
    "iiFFF",
    playerid,
    objectid
  );
  return { fX, fY, fZ };
};

export const GetPlayerObjectAttachedData = (
  playerid: number,
  objectid: number
): IAttachedData => {
  const [
    attached_vehicleid = 0,
    attached_objectid = 0,
    attached_playerid = 0,
  ]: number[] = samp.callNative(
    "GetPlayerObjectAttachedData",
    "iiIII",
    playerid,
    objectid
  );
  return { attached_vehicleid, attached_objectid, attached_playerid };
};

export const GetPlayerObjectAttachedOffset = (
  playerid: number,
  objectid: number
): IObjectRotPos => {
  const [
    fX = 0.0,
    fY = 0.0,
    fZ = 0.0,
    fRotX = 0.0,
    fRotY = 0.0,
    fRotZ = 0.0,
  ]: number[] = samp.callNative(
    "GetPlayerObjectAttachedOffset",
    "iiFFFFFF",
    playerid,
    objectid
  );
  return { fX, fY, fZ, fRotX, fRotY, fRotZ };
};

export const GetPlayerObjectSyncRotation = (
  playerid: number,
  objectid: number
): number => {
  return samp.callNative(
    "GetPlayerObjectSyncRotation",
    "ii",
    playerid,
    objectid
  );
};

// Return values: 1 = material, 2 = material text
export const IsPlayerObjectMaterialSlotUsed = (
  playerid: number,
  objectid: number,
  materialindex: number
): boolean => {
  return Boolean(
    samp.callNative(
      "IsPlayerObjectMaterialSlotUsed",
      "iii",
      playerid,
      objectid,
      materialindex
    )
  );
};

export const GetPlayerObjectMaterial = (
  playerid: number,
  objectid: number,
  materialindex: number
): IMaterial => {
  const [modelid = 0, txdname, texturename, materialcolor = 0]: [
    number,
    string,
    string,
    number
  ] = samp.callNative(
    "GetPlayerObjectMaterial",
    "iiiISiSiI",
    playerid,
    objectid,
    materialindex,
    64,
    64
  );
  return { modelid, txdname, texturename, materialcolor };
};

export const GetPlayerObjectMaterialText = (
  playerid: number,
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
      "GetPlayerObjectMaterialText",
      "iiiSiISiIIIII",
      playerid,
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

export const IsPlayerObjectNoCameraCol = (
  playerid: number,
  objectid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerObjectNoCameraCol", "ii", playerid, objectid)
  );
};

export const GetPlayerSurfingPlayerObjectID = (playerid: number): number => {
  return samp.callNative("GetPlayerSurfingPlayerObjectID", "i", playerid);
};

export const GetPlayerCameraTargetPlayerObj = (playerid: number): number => {
  return samp.callNative("GetPlayerCameraTargetPlayerObj", "i", playerid);
};

export const GetObjectType = (playerid: number, objectid: number): number => {
  return samp.callNative("GetObjectType", "ii", playerid, objectid);
};
