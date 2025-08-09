import { rgba } from "core/utils/colorUtils";
import type {
  IAttachedData,
  IMaterial,
  IMaterialText,
  IObjectPos,
  IObjectRotPos,
} from "../interfaces/Object";
import { ICommonRetVal } from "core/interfaces";

export const GetPlayerObjectDrawDistance = (
  playerId: number,
  objectId: number,
): number => {
  return samp.callNativeFloat(
    "GetPlayerObjectDrawDistance",
    "ii",
    playerId,
    objectId,
  );
};

export const SetPlayerObjectMoveSpeed = (
  playerId: number,
  objectId: number,
  fSpeed: number,
) => {
  return samp.callNativeFloat(
    "SetPlayerObjectMoveSpeed",
    "iif",
    playerId,
    objectId,
    fSpeed,
  );
};

export const GetPlayerObjectMoveSpeed = (
  playerId: number,
  objectId: number,
): number => {
  return samp.callNativeFloat(
    "GetPlayerObjectMoveSpeed",
    "ii",
    playerId,
    objectId,
  );
};

export const GetPlayerObjectTarget = (
  playerId: number,
  objectId: number,
): IObjectPos & ICommonRetVal => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0, ret]: [number, number, number, number] =
    samp.callNative("GetPlayerObjectTarget", "iiFFF", playerId, objectId);
  return { fX, fY, fZ, ret };
};

export const GetPlayerObjectMovingTargetPos = (
  playerId: number,
  objectId: number,
): IObjectPos & ICommonRetVal => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0, ret]: [number, number, number, number] =
    samp.callNative(
      "GetPlayerObjectMovingTargetPos",
      "iiFFF",
      playerId,
      objectId,
    );
  return { fX, fY, fZ, ret };
};

export const GetPlayerObjectMovingTargetRot = (
  playerId: number,
  objectId: number,
): IObjectPos & ICommonRetVal => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0, ret]: [number, number, number, number] =
    samp.callNative(
      "GetPlayerObjectMovingTargetRot",
      "iiFFF",
      playerId,
      objectId,
    );
  return { fX, fY, fZ, ret };
};

export const GetPlayerObjectAttachedData = (
  playerId: number,
  objectId: number,
): IAttachedData & ICommonRetVal => {
  const [
    attachedVehicleId = 0,
    attachedObjectId = 0,
    attachedPlayerId = 0,
    ret,
  ]: [number, number, number, number] = samp.callNative(
    "GetPlayerObjectAttachedData",
    "iiIII",
    playerId,
    objectId,
  );
  return { attachedVehicleId, attachedObjectId, attachedPlayerId, ret };
};

export const GetPlayerObjectAttachedOffset = (
  playerId: number,
  objectId: number,
): IObjectRotPos & ICommonRetVal => {
  const [
    fX = 0.0,
    fY = 0.0,
    fZ = 0.0,
    fRotX = 0.0,
    fRotY = 0.0,
    fRotZ = 0.0,
    ret,
  ]: number[] = samp.callNative(
    "GetPlayerObjectAttachedOffset",
    "iiFFFFFF",
    playerId,
    objectId,
  );
  return { fX, fY, fZ, fRotX, fRotY, fRotZ, ret };
};

export const GetPlayerObjectSyncRotation = (
  playerId: number,
  objectId: number,
): number => {
  return samp.callNative(
    "GetPlayerObjectSyncRotation",
    "ii",
    playerId,
    objectId,
  );
};

// Return values: 1 = material, 2 = material text
export const IsPlayerObjectMaterialSlotUsed = (
  playerId: number,
  objectId: number,
  materialIndex: number,
): boolean => {
  return Boolean(
    samp.callNative(
      "IsPlayerObjectMaterialSlotUsed",
      "iii",
      playerId,
      objectId,
      materialIndex,
    ),
  );
};

export const GetPlayerObjectMaterial = (
  playerId: number,
  objectId: number,
  materialIndex: number,
): IMaterial & ICommonRetVal => {
  const [modelId = 0, txdName, textureName, materialColor = 0, ret]: [
    number,
    string,
    string,
    number,
    number,
  ] = samp.callNative(
    "GetPlayerObjectMaterial",
    "iiiISiSiI",
    playerId,
    objectId,
    materialIndex,
    64,
    64,
  );
  return { modelId, txdName, textureName, materialColor, ret };
};

export const GetPlayerObjectMaterialText = (
  playerId: number,
  objectId: number,
  materialIndex: number,
): IMaterialText & ICommonRetVal => {
  const [
    text,
    materialSize = 0,
    fontFace,
    fontsize = 0,
    bold = 0,
    fontColor = 0,
    backColor = 0,
    textAlignment = 0,
    ret,
  ]: [string, number, string, number, number, number, number, number, number] =
    samp.callNative(
      "GetPlayerObjectMaterialText",
      "iiiSiISiIIIII",
      playerId,
      objectId,
      materialIndex,
      2048,
      32,
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
    ret,
  };
};

export const IsPlayerObjectNoCameraCol = (
  playerId: number,
  objectId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerObjectNoCameraCol", "ii", playerId, objectId),
  );
};

export const GetPlayerCameraTargetPlayerObj = (playerId: number): number => {
  return samp.callNative("GetPlayerCameraTargetPlayerObj", "i", playerId);
};

export const GetObjectType = (playerId: number, objectId: number): number => {
  return samp.callNative("GetObjectType", "ii", playerId, objectId);
};

export const BeginPlayerObjectEditing = (
  playerId: number,
  objectId: number,
): boolean => {
  return Boolean(
    samp.callNative("BeginPlayerObjectEditing", "ii", playerId, objectId),
  );
};

export const CreatePlayerObject = (
  playerId: number,
  modelId: number,
  X: number,
  Y: number,
  Z: number,
  rX: number,
  rY: number,
  rZ: number,
  drawDistance: number,
): number => {
  return samp.callNative(
    "CreatePlayerObject",
    "iifffffff",
    playerId,
    modelId,
    X,
    Y,
    Z,
    rX,
    rY,
    rZ,
    drawDistance,
  );
};

export const AttachPlayerObjectToVehicle = (
  playerId: number,
  objectId: number,
  vehicleId: number,
  fOffsetX: number,
  fOffsetY: number,
  fOffsetZ: number,
  fRotX: number,
  fRotY: number,
  RotZ: number,
): number => {
  return samp.callNative(
    "AttachPlayerObjectToVehicle",
    "iiiffffff",
    playerId,
    objectId,
    vehicleId,
    fOffsetX,
    fOffsetY,
    fOffsetZ,
    fRotX,
    fRotY,
    RotZ,
  );
};

export const SetPlayerObjectPos = (
  playerId: number,
  objectId: number,
  X: number,
  Y: number,
  Z: number,
): number => {
  return samp.callNative(
    "SetPlayerObjectPos",
    "iifff",
    playerId,
    objectId,
    X,
    Y,
    Z,
  );
};

export const GetPlayerObjectPos = (playerId: number, objectId: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetPlayerObjectPos",
    "iiFFF",
    playerId,
    objectId,
  );
  return { x, y, z, ret };
};

export const SetPlayerObjectRot = (
  playerId: number,
  objectId: number,
  rotX: number,
  rotY: number,
  rotZ: number,
): number => {
  return samp.callNative(
    "SetPlayerObjectRot",
    "iifff",
    playerId,
    objectId,
    rotX,
    rotY,
    rotZ,
  );
};

export const GetPlayerObjectRot = (playerId: number, objectId: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetPlayerObjectRot",
    "iiFFF",
    playerId,
    objectId,
  );
  return { x, y, z, ret };
};

export const GetPlayerObjectModel = (
  playerId: number,
  objectId: number,
): number => {
  return samp.callNative("GetPlayerObjectModel", "ii", playerId, objectId);
};

export const SetPlayerObjectNoCameraCollision = (
  playerId: number,
  objectId: number,
): boolean => {
  return Boolean(
    samp.callNative(
      "SetPlayerObjectNoCameraCollision",
      "ii",
      playerId,
      objectId,
    ),
  );
};

export const IsValidPlayerObject = (
  playerId: number,
  objectId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsValidPlayerObject", "ii", playerId, objectId),
  );
};

export const DestroyPlayerObject = (
  playerId: number,
  objectId: number,
): number => {
  return samp.callNative("DestroyPlayerObject", "ii", playerId, objectId);
};

export const MovePlayerObject = (
  playerId: number,
  objectId: number,
  X: number,
  Y: number,
  Z: number,
  speed: number,
  rotX: number,
  rotY: number,
  rotZ: number,
): number => {
  return samp.callNative(
    "MovePlayerObject",
    "iifffffff",
    playerId,
    objectId,
    X,
    Y,
    Z,
    speed,
    rotX,
    rotY,
    rotZ,
  );
};

export const StopPlayerObject = (
  playerId: number,
  objectId: number,
): number => {
  return samp.callNative("StopPlayerObject", "ii", playerId, objectId);
};

export const IsPlayerObjectMoving = (
  playerId: number,
  objectId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerObjectMoving", "ii", playerId, objectId),
  );
};

export const AttachPlayerObjectToPlayer = (
  objectPlayer: number,
  objectId: number,
  attachPlayer: number,
  offsetX: number,
  offsetY: number,
  offsetZ: number,
  rX: number,
  rY: number,
  rZ: number,
): number => {
  return samp.callNative(
    "AttachPlayerObjectToPlayer",
    "iiiffffff",
    objectPlayer,
    objectId,
    attachPlayer,
    offsetX,
    offsetY,
    offsetZ,
    rX,
    rY,
    rZ,
  );
};

export const SetPlayerObjectMaterialText = (
  playerId: number,
  objectId: number,
  text: string,
  materialIndex: number,
  materialSize: number,
  fontFace: string,
  fontsize: number,
  bold = true,
  fontColor: string | number,
  backColor: string | number,
  textAlignment: number,
): number => {
  return samp.callNative(
    "SetPlayerObjectMaterialText",
    "iisiisiiiii",
    playerId,
    objectId,
    text,
    materialIndex,
    materialSize,
    fontFace,
    fontsize,
    bold,
    rgba(fontColor),
    rgba(backColor),
    textAlignment,
  );
};

export const SetPlayerObjectMaterial = (
  playerId: number,
  objectId: number,
  materialIndex: number,
  modelId: number,
  txdName: string,
  textureName: string,
  materialColor: string | number,
): number => {
  return samp.callNative(
    "SetPlayerObjectMaterial",
    "iiiissi",
    playerId,
    objectId,
    materialIndex,
    modelId,
    txdName,
    textureName,
    rgba(materialColor),
  );
};
