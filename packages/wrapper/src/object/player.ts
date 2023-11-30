import type {
  IAttachedData,
  IMaterial,
  IMaterialText,
  IObjectPos,
  IObjectRotPos,
} from "../interfaces/Object";

export const GetPlayerObjectDrawDistance = (
  playerId: number,
  objectid: number
): number => {
  return samp.callNativeFloat(
    "GetPlayerObjectDrawDistance",
    "ii",
    playerId,
    objectid
  );
};

export const SetPlayerObjectMoveSpeed = (
  playerId: number,
  objectid: number,
  fSpeed: number
) => {
  return samp.callNativeFloat(
    "SetPlayerObjectMoveSpeed",
    "iif",
    playerId,
    objectid,
    fSpeed
  );
};

export const GetPlayerObjectMoveSpeed = (
  playerId: number,
  objectid: number
): number => {
  return samp.callNativeFloat(
    "GetPlayerObjectMoveSpeed",
    "ii",
    playerId,
    objectid
  );
};

export const GetPlayerObjectTarget = (
  playerId: number,
  objectid: number
): IObjectPos => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0]: number[] = samp.callNative(
    "GetPlayerObjectTarget",
    "iiFFF",
    playerId,
    objectid
  );
  return { fX, fY, fZ };
};

export const GetPlayerObjectMovingTargetPos = (
  playerId: number,
  objectid: number
): IObjectPos => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0]: number[] = samp.callNative(
    "GetPlayerObjectMovingTargetPos",
    "iiFFF",
    playerId,
    objectid
  );
  return { fX, fY, fZ };
};

export const GetPlayerObjectMovingTargetRot = (
  playerId: number,
  objectid: number
): IObjectPos => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0]: number[] = samp.callNative(
    "GetPlayerObjectMovingTargetRot",
    "iiFFF",
    playerId,
    objectid
  );
  return { fX, fY, fZ };
};

export const GetPlayerObjectAttachedData = (
  playerId: number,
  objectid: number
): IAttachedData => {
  const [
    attached_vehicleid = 0,
    attached_objectid = 0,
    attached_playerid = 0,
  ]: number[] = samp.callNative(
    "GetPlayerObjectAttachedData",
    "iiIII",
    playerId,
    objectid
  );
  return { attached_vehicleid, attached_objectid, attached_playerid };
};

export const GetPlayerObjectAttachedOffset = (
  playerId: number,
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
    playerId,
    objectid
  );
  return { fX, fY, fZ, fRotX, fRotY, fRotZ };
};

export const GetPlayerObjectSyncRotation = (
  playerId: number,
  objectid: number
): number => {
  return samp.callNative(
    "GetPlayerObjectSyncRotation",
    "ii",
    playerId,
    objectid
  );
};

// Return values: 1 = material, 2 = material text
export const IsPlayerObjectMaterialSlotUsed = (
  playerId: number,
  objectid: number,
  materialindex: number
): boolean => {
  return Boolean(
    samp.callNative(
      "IsPlayerObjectMaterialSlotUsed",
      "iii",
      playerId,
      objectid,
      materialindex
    )
  );
};

export const GetPlayerObjectMaterial = (
  playerId: number,
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
    playerId,
    objectid,
    materialindex,
    64,
    64
  );
  return { modelid, txdname, texturename, materialcolor };
};

export const GetPlayerObjectMaterialText = (
  playerId: number,
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
      playerId,
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
  playerId: number,
  objectid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerObjectNoCameraCol", "ii", playerId, objectid)
  );
};

export const GetPlayerSurfingPlayerObjectID = (playerId: number): number => {
  return samp.callNative("GetPlayerSurfingPlayerObjectID", "i", playerId);
};

export const GetPlayerCameraTargetPlayerObj = (playerId: number): number => {
  return samp.callNative("GetPlayerCameraTargetPlayerObj", "i", playerId);
};

export const GetObjectType = (playerId: number, objectid: number): number => {
  return samp.callNative("GetObjectType", "ii", playerId, objectid);
};
