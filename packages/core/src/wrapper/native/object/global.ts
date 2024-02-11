import { rgba } from "core/utils/colorUtils";
import type {
  IAttachedData,
  IAttachedObject,
  IMaterial,
  IMaterialText,
  IObjectPos,
  IObjectRotPos,
} from "../interfaces/Object";
import type { BoneIdsEnum } from "core/enums/player";

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

export const CreateObject = (
  modelId: number,
  X: number,
  Y: number,
  Z: number,
  rX: number,
  rY: number,
  rZ: number,
  DrawDistance: number
): number => {
  return samp.callNative(
    "CreateObject",
    "ifffffff",
    modelId,
    X,
    Y,
    Z,
    rX,
    rY,
    rZ,
    DrawDistance
  );
};

export const AttachObjectToVehicle = (
  objectId: number,
  vehicleId: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return samp.callNative(
    "AttachObjectToVehicle",
    "iiffffff",
    objectId,
    vehicleId,
    OffsetX,
    OffsetY,
    OffsetZ,
    RotX,
    RotY,
    RotZ
  );
};

export const AttachObjectToObject = (
  objectId: number,
  attachToId: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number,
  RotX: number,
  RotY: number,
  RotZ: number,
  SyncRotation = true
): number => {
  return samp.callNative(
    "AttachObjectToObject",
    "iiffffffi",
    objectId,
    attachToId,
    OffsetX,
    OffsetY,
    OffsetZ,
    RotX,
    RotY,
    RotZ,
    SyncRotation
  );
};

export const AttachObjectToPlayer = (
  objectId: number,
  playerId: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return samp.callNative(
    "AttachObjectToPlayer",
    "iiffffff",
    objectId,
    playerId,
    OffsetX,
    OffsetY,
    OffsetZ,
    RotX,
    RotY,
    RotZ
  );
};

export const EditAttachedObject = (playerId: number, index: number): number => {
  return samp.callNative("EditAttachedObject", "ii", playerId, index);
};

export const SetObjectPos = (
  objectId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNative("SetObjectPos", "ifff", objectId, X, Y, Z);
};

export const GetObjectPos = (objectId: number): Array<number> => {
  return samp.callNative("GetObjectPos", "iFFF", objectId);
};

export const SetObjectRot = (
  objectId: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return samp.callNative("SetObjectRot", "ifff", objectId, RotX, RotY, RotZ);
};

export const GetObjectRot = (objectId: number): Array<number> => {
  return samp.callNative("GetObjectRot", "iFFF", objectId);
};

export const GetObjectModel = (objectId: number): number => {
  return samp.callNative("GetObjectModel", "i", objectId);
};

export const SetObjectNoCameraCollision = (objectId: number): boolean => {
  return Boolean(samp.callNative("SetObjectNoCameraCollision", "i", objectId));
};

export const IsValidObject = (objectId: number): boolean => {
  return Boolean(samp.callNative("IsValidObject", "i", objectId));
};

export const DestroyObject = (objectId: number): number => {
  return samp.callNative("DestroyObject", "i", objectId);
};

export const MoveObject = (
  objectId: number,
  X: number,
  Y: number,
  Z: number,
  Speed: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return samp.callNative(
    "MoveObject",
    "ifffffff",
    objectId,
    X,
    Y,
    Z,
    Speed,
    RotX,
    RotY,
    RotZ
  );
};

export const StopObject = (objectId: number): number => {
  return samp.callNative("StopObject", "i", objectId);
};

export const IsObjectMoving = (objectId: number): boolean => {
  return Boolean(samp.callNative("IsObjectMoving", "i", objectId));
};

export const BeginObjectEditing = (
  playerId: number,
  objectId: number
): boolean => {
  return Boolean(
    samp.callNative("BeginObjectEditing", "ii", playerId, objectId)
  );
};

export const BeginObjectSelecting = (playerId: number): boolean => {
  return Boolean(samp.callNative("BeginObjectSelecting", "i", playerId));
};

export const EndObjectEditing = (playerId: number): boolean => {
  return Boolean(samp.callNative("EndObjectEditing", "i", playerId));
};

export const SetObjectMaterial = (
  objectId: number,
  materialIndex: number,
  modelId: number,
  txdName: string,
  textureName: string,
  materialColor: string | number
): number => {
  return samp.callNative(
    "SetObjectMaterial",
    "iiissi",
    objectId,
    materialIndex,
    modelId,
    txdName,
    textureName,
    rgba(materialColor)
  );
};

export const SetObjectMaterialText = (
  objectId: number,
  text: string,
  materialIndex: number,
  materialSize: number,
  fontFace: string,
  fontsize: number,
  bold = true,
  fontColor: string | number,
  backColor: string | number,
  textAlignment: number
): number => {
  return samp.callNative(
    "SetObjectMaterialText",
    "isiisiiiii",
    objectId,
    text,
    materialIndex,
    materialSize,
    fontFace,
    fontsize,
    bold,
    rgba(fontColor),
    rgba(backColor),
    textAlignment
  );
};

export const SetObjectsDefaultCameraCollision = (disable: boolean): boolean => {
  return Boolean(samp.callNative("SetObjectsDefaultCameraCol", "i", disable));
};

export const AddSimpleModel = (
  virtualWorld: number,
  baseId: number,
  newId: number,
  dffName: string,
  txdName: string
): number => {
  return samp.callNative(
    "AddSimpleModel",
    "iiiss",
    virtualWorld,
    baseId,
    newId,
    dffName,
    txdName
  );
};

export const AddSimpleModelTimed = (
  virtualWorld: number,
  baseId: number,
  newId: number,
  dffName: string,
  txdName: string,
  timeOn: number,
  timeOff: number
): number => {
  return samp.callNative(
    "AddSimpleModelTimed",
    "iiissii",
    virtualWorld,
    baseId,
    newId,
    dffName,
    txdName,
    timeOn,
    timeOff
  );
};

export const RedirectDownload = (playerId: number, url: string): number => {
  return samp.callNative("RedirectDownload", "is", playerId, url);
};

export const FindModelFileNameFromCRC = (crc: number): string => {
  const [name] = samp.callNative("FindModelFileNameFromCRC", "iSi", crc, 255);
  return name;
};

export const FindTextureFileNameFromCRC = (crc: number): string => {
  const [name] = samp.callNative("FindTextureFileNameFromCRC", "iSi", crc, 255);
  return name;
};

export const GetPlayerAttachedObject = (
  playerId: number,
  index: number
): IAttachedObject => {
  const [
    modelId = 0,
    bone = 0,
    fX = 0.0,
    fY = 0.0,
    fZ = 0.0,
    fRotX = 0.0,
    fRotY = 0.0,
    fRotZ = 0.0,
    fScaleX = 0.0,
    fScaleY = 0.0,
    fScaleZ = 0.0,
    materialColor1 = 0,
    materialColor2 = 0,
  ]: number[] = samp.callNative(
    "GetPlayerAttachedObject",
    "iiIIFFFFFFFFFII",
    playerId,
    index
  );
  return {
    modelId,
    bone,
    fX,
    fY,
    fZ,
    fRotX,
    fRotY,
    fRotZ,
    fScaleX,
    fScaleY,
    fScaleZ,
    materialColor1,
    materialColor2,
  };
};

export const SetPlayerAttachedObject = (
  playerId: number,
  index: number,
  modelId: number,
  bone: BoneIdsEnum,
  fOffsetX: number,
  fOffsetY: number,
  fOffsetZ: number,
  fRotX: number,
  fRotY: number,
  fRotZ: number,
  fScaleX: number,
  fScaleY: number,
  fScaleZ: number,
  materialColor1: string | number,
  materialColor2: string | number
): number => {
  return samp.callNative(
    "SetPlayerAttachedObject",
    "iiiifffffffffii",
    playerId,
    index,
    modelId,
    bone,
    fOffsetX,
    fOffsetY,
    fOffsetZ,
    fRotX,
    fRotY,
    fRotZ,
    fScaleX,
    fScaleY,
    fScaleZ,
    rgba(materialColor1),
    rgba(materialColor2)
  );
};

export const RemovePlayerAttachedObject = (
  playerId: number,
  index: number
): number => {
  return samp.callNative("RemovePlayerAttachedObject", "ii", playerId, index);
};

export const IsPlayerAttachedObjectSlotUsed = (
  playerId: number,
  index: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerAttachedObjectSlotUsed", "ii", playerId, index)
  );
};

export const IsValidCustomModel = (modelId: number): boolean => {
  return Boolean(samp.callNative("IsValidCustomModel", "i", modelId));
};

export const GetCustomModePath = (modelId: number) => {
  if (!IsValidCustomModel(modelId)) return null;
  const [dffPath, txdPath] = samp.callNative(
    "GetCustomModePath",
    "iSiSi",
    modelId,
    255,
    255
  );
  return { dffPath, txdPath };
};
