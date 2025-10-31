import { rgba } from "core/utils/color";
import type { IAttachedData, IObjectPos } from "../interfaces/Object";
import { ICommonRetVal } from "core/interfaces";

export const IsValidPlayer3DTextLabel = (
  playerId: number,
  id: number,
): boolean => {
  return Boolean(
    samp.callNative("IsValidPlayer3DTextLabel", "ii", playerId, id),
  );
};

export const GetPlayer3DTextLabelText = (playerId: number, id: number) => {
  const [text, ret]: [string, number] = samp.callNative(
    "GetPlayer3DTextLabelText",
    "iiSi",
    playerId,
    id,
    144,
  );
  return { text, ret };
};

export const GetPlayer3DTextLabelColor = (
  playerId: number,
  id: number,
): number => {
  return samp.callNative("GetPlayer3DTextLabelColor", "ii", playerId, id);
};

export const GetPlayer3DTextLabelPos = (
  playerId: number,
  id: number,
): IObjectPos & ICommonRetVal => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0, ret]: [number, number, number, number] =
    samp.callNative("GetPlayer3DTextLabelPos", "iiFFF", playerId, id);
  return { fX, fY, fZ, ret };
};

export const SetPlayer3DTextLabelDrawDistance = (
  playerId: number,
  id: number,
  dist: number,
): void => {
  samp.callNative(
    "SetPlayer3DTextLabelDrawDistance",
    "iii",
    playerId,
    id,
    dist,
  );
};

export const GetPlayer3DTextLabelDrawDistance = (
  playerId: number,
  id: number,
): number => {
  return samp.callNativeFloat(
    "GetPlayer3DTextLabelDrawDistance",
    "ii",
    playerId,
    id,
  );
};

export const GetPlayer3DTextLabelLOS = (
  playerId: number,
  id: number,
): boolean => {
  return Boolean(
    samp.callNative("GetPlayer3DTextLabelLOS", "ii", playerId, id),
  );
};

export const SetPlayer3DTextLabelLOS = (
  playerId: number,
  id: number,
  status: boolean,
): void => {
  samp.callNative("SetPlayer3DTextLabelLOS", "iii", playerId, id, status);
};

export const GetPlayer3DTextLabelVirtualWorld = (
  playerId: number,
  id: number,
): number => {
  return samp.callNative(
    "GetPlayer3DTextLabelVirtualWorld",
    "ii",
    playerId,
    id,
  );
};

export const GetPlayer3DTextLabelAttachedData = (
  playerId: number,
  id: number,
): IAttachedData => {
  const [attachedPlayerId = 0, attachedVehicleId = 0]: number[] =
    samp.callNative("GetPlayer3DTextLabelAttachedData", "ii", playerId, id);
  return { attachedPlayerId, attachedVehicleId };
};

export const CreatePlayer3DTextLabel = (
  playerId: number,
  text: string,
  color: string | number,
  x: number,
  y: number,
  z: number,
  drawDistance: number,
  attachedPlayer: number,
  attachedVehicle: number,
  testLOS: boolean,
): number => {
  return samp.callNative(
    "CreatePlayer3DTextLabel",
    "isiffffiii",
    playerId,
    text,
    rgba(color),
    x,
    y,
    z,
    drawDistance,
    attachedPlayer,
    attachedVehicle,
    testLOS,
  );
};

export const DeletePlayer3DTextLabel = (
  playerId: number,
  id: number,
): number => {
  return samp.callNative("DeletePlayer3DTextLabel", "ii", playerId, id);
};

export const UpdatePlayer3DTextLabelText = (
  playerId: number,
  id: number,
  color: string | number,
  text: string,
): number => {
  return samp.callNative(
    "UpdatePlayer3DTextLabelText",
    "iiis",
    playerId,
    id,
    rgba(color),
    text,
  );
};
