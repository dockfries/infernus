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
    attached_vehicleId = 0,
    attached_objectId = 0,
    attached_playerId = 0,
  ]: number[] = samp.callNative(
    "GetPlayerObjectAttachedData",
    "iiIII",
    playerId,
    objectid
  );
  return { attached_vehicleId, attached_objectId, attached_playerId };
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
  materialIndex: number
): boolean => {
  return Boolean(
    samp.callNative(
      "IsPlayerObjectMaterialSlotUsed",
      "iii",
      playerId,
      objectid,
      materialIndex
    )
  );
};

export const GetPlayerObjectMaterial = (
  playerId: number,
  objectid: number,
  materialIndex: number
): IMaterial => {
  const [modelId = 0, txdName, textureName, materialColor = 0]: [
    number,
    string,
    string,
    number
  ] = samp.callNative(
    "GetPlayerObjectMaterial",
    "iiiISiSiI",
    playerId,
    objectid,
    materialIndex,
    64,
    64
  );
  return { modelId, txdName, textureName, materialColor };
};

export const GetPlayerObjectMaterialText = (
  playerId: number,
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
      "GetPlayerObjectMaterialText",
      "iiiSiISiIIIII",
      playerId,
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
