import { ITextDrawCommonSize, ITextDrawRot } from "../interfaces/TextDraw";

export const IsValidPlayerTextDraw = (
  playerid: number,
  textdrawid: number
): boolean => {
  return Boolean(
    samp.callNative("IsValidPlayerTextDraw", "ii", playerid, textdrawid)
  );
};
export const IsPlayerTextDrawVisible = (
  playerid: number,
  textdrawid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerTextDrawVisible", "ii", playerid, textdrawid)
  );
};
export const PlayerTextDrawGetString = (
  playerid: number,
  textdrawid: number
): string => {
  return samp.callNative(
    "PlayerTextDrawGetString",
    "iiSi",
    playerid,
    textdrawid,
    1024
  );
};

export const PlayerTextDrawSetPos = (
  playerid: number,
  textdrawid: number,
  fX: number,
  fY: number
): void => {
  samp.callNative("PlayerTextDrawSetPos", "iiff", playerid, textdrawid, fX, fY);
};

export const PlayerTextDrawGetLetterSize = (
  playerid: number,
  textdrawid: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "PlayerTextDrawGetLetterSize",
    "iiFF",
    playerid,
    textdrawid
  );
  return { fX, fY };
};

export const PlayerTextDrawGetTextSize = (
  playerid: number,
  textdrawid: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "PlayerTextDrawGetTextSize",
    "iiFF",
    playerid,
    textdrawid
  );
  return { fX, fY };
};

export const PlayerTextDrawGetPos = (
  playerid: number,
  textdrawid: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "PlayerTextDrawGetPos",
    "iiFF",
    playerid,
    textdrawid
  );
  return { fX, fY };
};

export const PlayerTextDrawGetColour = (
  playerid: number,
  textdrawid: number
): number => {
  return samp.callNative("PlayerTextDrawGetColour", "ii", playerid, textdrawid);
};

export const PlayerTextDrawGetBoxColour = (
  playerid: number,
  textdrawid: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetBoxColour",
    "ii",
    playerid,
    textdrawid
  );
};

export const PlayerTextDrawGetBackgroundColour = (
  playerid: number,
  textdrawid: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetBackgroundColour",
    "ii",
    playerid,
    textdrawid
  );
};

export const PlayerTextDrawGetShadow = (
  playerid: number,
  textdrawid: number
): number => {
  return samp.callNative("PlayerTextDrawGetShadow", "ii", playerid, textdrawid);
};

export const PlayerTextDrawGetOutline = (
  playerid: number,
  textdrawid: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetOutline",
    "ii",
    playerid,
    textdrawid
  );
};

export const PlayerTextDrawGetFont = (
  playerid: number,
  textdrawid: number
): number => {
  return samp.callNative("PlayerTextDrawGetFont", "ii", playerid, textdrawid);
};

export const PlayerTextDrawIsBox = (
  playerid: number,
  textdrawid: number
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawIsBox", "ii", playerid, textdrawid)
  );
};

export const PlayerTextDrawIsProportional = (
  playerid: number,
  textdrawid: number
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawIsProportional", "ii", playerid, textdrawid)
  );
};

export const PlayerTextDrawIsSelectable = (
  playerid: number,
  textdrawid: number
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawIsSelectable", "ii", playerid, textdrawid)
  );
};

export const PlayerTextDrawGetAlignment = (
  playerid: number,
  textdrawid: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetAlignment",
    "ii",
    playerid,
    textdrawid
  );
};

export const PlayerTextDrawGetPreviewModel = (
  playerid: number,
  textdrawid: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetPreviewModel",
    "ii",
    playerid,
    textdrawid
  );
};

export const PlayerTextDrawGetPreviewRot = (
  playerid: number,
  textdrawid: number
): ITextDrawRot => {
  const [fRotX = 0.0, fRotY = 0.0, fRotZ = 0.0, fZoom = 0.0]: number[] =
    samp.callNative(
      "PlayerTextDrawGetPreviewRot",
      "iiFFFF",
      playerid,
      textdrawid
    );
  return { fRotX, fRotY, fRotZ, fZoom };
};

export const PlayerTextDrawGetPreviewVehicleColours = (
  playerid: number,
  textdrawid: number
) => {
  const [color1, color2]: number[] = samp.callNative(
    "PlayerTextDrawGetPreviewVehicleColours",
    "iiII",
    playerid,
    textdrawid
  );
  return { color1, color2 };
};
