import { IAttachedData, IObjectPos } from "../interfaces/Object";

export const IsValidPlayer3DTextLabel = (
  playerid: number,
  id: number
): boolean => {
  return Boolean(
    samp.callNative("IsValidPlayer3DTextLabel", "ii", playerid, id)
  );
};

export const GetPlayer3DTextLabelText = (
  playerid: number,
  id: number
): string => {
  return samp.callNative("GetPlayer3DTextLabelText", "iiSi", playerid, id, 144);
};

export const GetPlayer3DTextLabelColour = (
  playerid: number,
  id: number
): number => {
  return samp.callNative("GetPlayer3DTextLabelColour", "ii", playerid, id);
};

export const GetPlayer3DTextLabelPos = (
  playerid: number,
  id: number
): IObjectPos => {
  const [fX = 0.0, fY = 0.0, fZ = 0.0]: number[] = samp.callNative(
    "GetPlayer3DTextLabelPos",
    "iiFFF",
    playerid,
    id
  );
  return { fX, fY, fZ };
};

export const SetPlayer3DTextLabelDrawDistance = (
  playerid: number,
  id: number,
  dist: number
): void => {
  samp.callNative(
    "SetPlayer3DTextLabelDrawDistance",
    "iii",
    playerid,
    id,
    dist
  );
};

export const GetPlayer3DTextLabelDrawDistance = (
  playerid: number,
  id: number
): number => {
  return samp.callNativeFloat(
    "GetPlayer3DTextLabelDrawDistance",
    "ii",
    playerid,
    id
  );
};

export const GetPlayer3DTextLabelLOS = (
  playerid: number,
  id: number
): boolean => {
  return Boolean(
    samp.callNative("GetPlayer3DTextLabelLOS", "ii", playerid, id)
  );
};

export const SetPlayer3DTextLabelLOS = (
  playerid: number,
  id: number,
  status: boolean
): void => {
  samp.callNative("SetPlayer3DTextLabelLOS", "iii", playerid, id, status);
};

export const GetPlayer3DTextLabelVirtualWorld = (
  playerid: number,
  id: number
): number => {
  return samp.callNative(
    "GetPlayer3DTextLabelVirtualWorld",
    "ii",
    playerid,
    id
  );
};

export const GetPlayer3DTextLabelAttachedData = (
  playerid: number,
  id: number
): IAttachedData => {
  const [attached_playerid = 0, attached_vehicleid = 0]: number[] =
    samp.callNative("GetPlayer3DTextLabelAttachedData", "ii", playerid, id);
  return { attached_playerid, attached_vehicleid };
};
