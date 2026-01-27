import { rgba } from "core/utils/color";
import type {
  IAttachedData,
  IAttachedObject,
  IMaterial,
  IObjectPos,
  IObjectRotPos,
} from "../interfaces/Object";
import type { BoneIdsEnum } from "core/enums/player";
import { ICommonRetVal } from "core/interfaces";

export const GetObjectDrawDistance = (objectId: number): number => {
  return samp.callNativeFloat("GetObjectDrawDistance", "i", objectId) as number;
};

export const GetObjectMoveSpeed = (objectId: number): number => {
  return samp.callNativeFloat("GetObjectMoveSpeed", "i", objectId) as number;
};

export const SetObjectMoveSpeed = (objectId: number, fSpeed: number) => {
  return !!samp.callNativeFloat("SetObjectMoveSpeed", "if", objectId, fSpeed);
};

export const GetObjectMovingTargetPos = (
  objectId: number,
): IObjectPos & ICommonRetVal => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0, ret]: [number, number, number, number] =
    samp.callNative("GetObjectMovingTargetPos", "iFFF", objectId);
  return { fX, fY, fZ, ret: !!ret };
};

export const GetObjectTarget = (
  objectId: number,
): IObjectPos & ICommonRetVal => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0, ret]: [number, number, number, number] =
    samp.callNative("GetObjectTarget", "iFFF", objectId);
  return { fX, fY, fZ, ret: !!ret };
};

export const GetObjectMovingTargetRot = (
  objectId: number,
): IObjectPos & ICommonRetVal => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0, ret]: [number, number, number, number] =
    samp.callNative("GetObjectMovingTargetRot", "iFFF", objectId);
  return { fX, fY, fZ, ret: !!ret };
};

export const GetObjectAttachedData = (
  objectId: number,
): IAttachedData & ICommonRetVal => {
  const [
    attachedVehicleId = 0,
    attachedObjectId = 0,
    attachedPlayerId = 0,
    ret,
  ]: number[] = samp.callNative("GetObjectAttachedData", "i", objectId);
  return { attachedVehicleId, attachedObjectId, attachedPlayerId, ret: !!ret };
};

export const GetObjectAttachedOffset = (
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
  ]: number[] = samp.callNative("GetObjectAttachedOffset", "i", objectId);
  return { fX, fY, fZ, fRotX, fRotY, fRotZ, ret: !!ret };
};

export const GetObjectSyncRotation = (objectId: number): boolean => {
  return !!samp.callNative("GetObjectSyncRotation", "i", objectId);
};

// Return values: 1 = material, 2 = material tex
export const IsObjectMaterialSlotUsed = (
  objectId: number,
  materialIndex: number,
): boolean => {
  return !!samp.callNative(
    "IsObjectMaterialSlotUsed",
    "ii",
    objectId,
    materialIndex,
  );
};

export const GetObjectMaterial = (
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
    "GetObjectMaterial",
    "iiISiSiI",
    objectId,
    materialIndex,
    64,
    64,
  );
  return { modelId, txdName, textureName, materialColor, ret: !!ret };
};

export const HasObjectCameraCollision = (objectId: number): boolean => {
  return !!samp.callNative("HasObjectCameraCollision", "i", objectId);
};

export const CreateObject = (
  modelId: number,
  x: number,
  y: number,
  z: number,
  rX: number,
  rY: number,
  rZ: number,
  drawDistance = 0.0,
): number => {
  return samp.callNative(
    "CreateObject",
    "ifffffff",
    modelId,
    x,
    y,
    z,
    rX,
    rY,
    rZ,
    drawDistance,
  );
};

export const AttachObjectToVehicle = (
  objectId: number,
  vehicleId: number,
  offsetX: number,
  offsetY: number,
  offsetZ: number,
  rotX: number,
  rotY: number,
  rotZ: number,
): boolean => {
  return !!samp.callNative(
    "AttachObjectToVehicle",
    "iiffffff",
    objectId,
    vehicleId,
    offsetX,
    offsetY,
    offsetZ,
    rotX,
    rotY,
    rotZ,
  );
};

export const AttachPlayerObjectToObject = (
  playerId: number,
  objectId: number,
  parentId: number,
  offsetX: number,
  offsetY: number,
  offsetZ: number,
  rotX: number,
  rotY: number,
  rotZ: number,
  syncRotation = true,
): boolean => {
  return !!samp.callNative(
    "AttachPlayerObjectToObject",
    "iiiffffffi",
    playerId,
    objectId,
    parentId,
    offsetX,
    offsetY,
    offsetZ,
    rotX,
    rotY,
    rotZ,
    syncRotation,
  );
};

export const AttachObjectToObject = (
  objectId: number,
  attachToId: number,
  offsetX: number,
  offsetY: number,
  offsetZ: number,
  rotX: number,
  rotY: number,
  rotZ: number,
  syncRotation = true,
): boolean => {
  return !!samp.callNative(
    "AttachObjectToObject",
    "iiffffffi",
    objectId,
    attachToId,
    offsetX,
    offsetY,
    offsetZ,
    rotX,
    rotY,
    rotZ,
    syncRotation,
  );
};

export const AttachObjectToPlayer = (
  objectId: number,
  playerId: number,
  offsetX: number,
  offsetY: number,
  offsetZ: number,
  rotX: number,
  rotY: number,
  rotZ: number,
): boolean => {
  return !!samp.callNative(
    "AttachObjectToPlayer",
    "iiffffff",
    objectId,
    playerId,
    offsetX,
    offsetY,
    offsetZ,
    rotX,
    rotY,
    rotZ,
  );
};

export const EditAttachedObject = (playerId: number, index: number) => {
  return !!samp.callNative("EditAttachedObject", "ii", playerId, index);
};

export const SetObjectPos = (
  objectId: number,
  x: number,
  y: number,
  z: number,
): boolean => {
  return !!samp.callNative("SetObjectPos", "ifff", objectId, x, y, z);
};

export const GetObjectPos = (objectId: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetObjectPos",
    "iFFF",
    objectId,
  );
  return { x, y, z, ret: !!ret };
};

export const SetObjectRot = (
  objectId: number,
  rotX: number,
  rotY: number,
  rotZ: number,
): boolean => {
  return !!samp.callNative("SetObjectRot", "ifff", objectId, rotX, rotY, rotZ);
};

export const GetObjectRot = (objectId: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetObjectRot",
    "iFFF",
    objectId,
  );
  return { x, y, z, ret: !!ret };
};

export const GetObjectModel = (objectId: number): number => {
  return samp.callNative("GetObjectModel", "i", objectId);
};

export const SetObjectNoCameraCollision = (objectId: number): boolean => {
  return !!samp.callNative("SetObjectNoCameraCol", "i", objectId);
};

export const IsObjectNoCameraCol = (objectId: number): boolean => {
  return !!samp.callNative("IsObjectNoCameraCol", "i", objectId);
};

export const IsValidObject = (objectId: number): boolean => {
  return !!samp.callNative("IsValidObject", "i", objectId);
};

export const DestroyObject = (objectId: number): boolean => {
  return !!samp.callNative("DestroyObject", "i", objectId);
};

export const MoveObject = (
  objectId: number,
  x: number,
  y: number,
  z: number,
  speed: number,
  rotX: number,
  rotY: number,
  rotZ: number,
): boolean => {
  return !!samp.callNative(
    "MoveObject",
    "ifffffff",
    objectId,
    x,
    y,
    z,
    speed,
    rotX,
    rotY,
    rotZ,
  );
};

export const StopObject = (objectId: number): boolean => {
  return !!samp.callNative("StopObject", "i", objectId);
};

export const IsObjectMoving = (objectId: number): boolean => {
  return !!samp.callNative("IsObjectMoving", "i", objectId);
};

export const BeginObjectEditing = (
  playerId: number,
  objectId: number,
): boolean => {
  return !!samp.callNative("BeginObjectEditing", "ii", playerId, objectId);
};

export const BeginObjectSelecting = (playerId: number): boolean => {
  return !!samp.callNative("BeginObjectSelecting", "i", playerId);
};

export const EndObjectEditing = (playerId: number): boolean => {
  return !!samp.callNative("EndObjectEditing", "i", playerId);
};

export const SetObjectMaterial = (
  objectId: number,
  materialIndex: number,
  modelId: number,
  txdName: string,
  textureName: string,
  materialColor: string | number,
): boolean => {
  return !!samp.callNative(
    "SetObjectMaterial",
    "iiissi",
    objectId,
    materialIndex,
    modelId,
    txdName,
    textureName,
    rgba(materialColor),
  );
};

export const SetObjectsDefaultCameraCollision = (disable: boolean): boolean => {
  return !!samp.callNative("SetObjectsDefaultCameraCol", "i", disable);
};

export const AddCharModel = (
  baseId: number,
  newid: number,
  dff: string,
  textureLibrary: string,
) => {
  return !!samp.callNative(
    "AddCharModel",
    "iiss",
    baseId,
    newid,
    dff,
    textureLibrary,
  );
};

export const AddSimpleModel = (
  virtualWorld: number,
  baseId: number,
  newId: number,
  dffName: string,
  txdName: string,
): boolean => {
  return !!samp.callNative(
    "AddSimpleModel",
    "iiiss",
    virtualWorld,
    baseId,
    newId,
    dffName,
    txdName,
  );
};

export const AddSimpleModelTimed = (
  virtualWorld: number,
  baseId: number,
  newId: number,
  dffName: string,
  txdName: string,
  timeOn: number,
  timeOff: number,
): boolean => {
  return !!samp.callNative(
    "AddSimpleModelTimed",
    "iiissii",
    virtualWorld,
    baseId,
    newId,
    dffName,
    txdName,
    timeOn,
    timeOff,
  );
};

export const RedirectDownload = (playerId: number, url: string): boolean => {
  return !!samp.callNative("RedirectDownload", "is", playerId, url);
};

export const GetCustomModelPath = (modelId: number) => {
  const [dffPath, txdPath, ret]: [number, number, number] = samp.callNative(
    "GetCustomModelPath",
    "iSiSi",
    modelId,
    255,
    255,
  );
  return {
    dffPath,
    txdPath,
    ret: !!ret,
  };
};

export const FindModelFileNameFromCRC = (crc: number) => {
  const [name, ret] = samp.callNative(
    "FindModelFileNameFromCRC",
    "iSi",
    crc,
    255,
  ) as [string, number];
  return { name, ret };
};

export const FindTextureFileNameFromCRC = (crc: number) => {
  const [name, ret] = samp.callNative(
    "FindTextureFileNameFromCRC",
    "iSi",
    crc,
    255,
  ) as [string, number];
  return { name, ret };
};

export const GetPlayerAttachedObject = (
  playerId: number,
  index: number,
): IAttachedObject & ICommonRetVal => {
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
    ret,
  ]: number[] = samp.callNative(
    "GetPlayerAttachedObject",
    "iiIIFFFFFFFFFII",
    playerId,
    index,
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
    ret: !!ret,
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
  materialColor2: string | number,
): boolean => {
  return !!samp.callNative(
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
    rgba(materialColor2),
  );
};

export const RemovePlayerAttachedObject = (
  playerId: number,
  index: number,
): boolean => {
  return !!samp.callNative("RemovePlayerAttachedObject", "ii", playerId, index);
};

export const IsPlayerAttachedObjectSlotUsed = (
  playerId: number,
  index: number,
): boolean => {
  return !!samp.callNative(
    "IsPlayerAttachedObjectSlotUsed",
    "ii",
    playerId,
    index,
  );
};

export const IsValidCustomModel = (modelId: number): boolean => {
  return !!samp.callNative("IsValidCustomModel", "i", modelId);
};

export const GetCustomModePath = (modelId: number) => {
  if (!IsValidCustomModel(modelId)) return null;
  const [dffPath, txdPath, ret]: [string, string, number] = samp.callNative(
    "GetCustomModePath",
    "iSiSi",
    modelId,
    255,
    255,
  );
  return { dffPath, txdPath, ret };
};

export const GetPlayerAnimationFlags = (playerId: number): number => {
  return samp.callNative("GetPlayerAnimationFlags", "i", playerId);
};

export const GetPlayerLastSyncedTrailerID = (playerId: number): number => {
  return samp.callNative("GetPlayerLastSyncedTrailerID", "i", playerId);
};

export const GetPlayerLastSyncedVehicleID = (playerId: number): number => {
  return samp.callNative("GetPlayerLastSyncedVehicleID", "i", playerId);
};
