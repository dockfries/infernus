import type { ITextDrawCommonSize, ITextDrawRot } from "../interfaces/TextDraw";

export const IsValidPlayerTextDraw = (
  playerId: number,
  textdrawid: number
): boolean => {
  return Boolean(
    samp.callNative("IsValidPlayerTextDraw", "ii", playerId, textdrawid)
  );
};
export const IsPlayerTextDrawVisible = (
  playerId: number,
  textdrawid: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerTextDrawVisible", "ii", playerId, textdrawid)
  );
};
export const PlayerTextDrawGetString = (
  playerId: number,
  textdrawid: number
): string => {
  return samp.callNative(
    "PlayerTextDrawGetString",
    "iiSi",
    playerId,
    textdrawid,
    1024
  );
};

export const PlayerTextDrawSetPos = (
  playerId: number,
  textdrawid: number,
  fX: number,
  fY: number
): void => {
  samp.callNative("PlayerTextDrawSetPos", "iiff", playerId, textdrawid, fX, fY);
};

export const PlayerTextDrawGetLetterSize = (
  playerId: number,
  textdrawid: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "PlayerTextDrawGetLetterSize",
    "iiFF",
    playerId,
    textdrawid
  );
  return { fX, fY };
};

export const PlayerTextDrawGetTextSize = (
  playerId: number,
  textdrawid: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "PlayerTextDrawGetTextSize",
    "iiFF",
    playerId,
    textdrawid
  );
  return { fX, fY };
};

export const PlayerTextDrawGetPos = (
  playerId: number,
  textdrawid: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "PlayerTextDrawGetPos",
    "iiFF",
    playerId,
    textdrawid
  );
  return { fX, fY };
};

export const PlayerTextDrawGetColour = (
  playerId: number,
  textdrawid: number
): number => {
  return samp.callNative("PlayerTextDrawGetColor", "ii", playerId, textdrawid);
};

export const PlayerTextDrawGetBoxColour = (
  playerId: number,
  textdrawid: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetBoxColour",
    "ii",
    playerId,
    textdrawid
  );
};

export const PlayerTextDrawGetBackgroundColour = (
  playerId: number,
  textdrawid: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetBackgroundColour",
    "ii",
    playerId,
    textdrawid
  );
};

export const PlayerTextDrawGetShadow = (
  playerId: number,
  textdrawid: number
): number => {
  return samp.callNative("PlayerTextDrawGetShadow", "ii", playerId, textdrawid);
};

export const PlayerTextDrawGetOutline = (
  playerId: number,
  textdrawid: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetOutline",
    "ii",
    playerId,
    textdrawid
  );
};

export const PlayerTextDrawGetFont = (
  playerId: number,
  textdrawid: number
): number => {
  return samp.callNative("PlayerTextDrawGetFont", "ii", playerId, textdrawid);
};

export const PlayerTextDrawIsBox = (
  playerId: number,
  textdrawid: number
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawIsBox", "ii", playerId, textdrawid)
  );
};

export const PlayerTextDrawIsProportional = (
  playerId: number,
  textdrawid: number
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawIsProportional", "ii", playerId, textdrawid)
  );
};

export const PlayerTextDrawIsSelectable = (
  playerId: number,
  textdrawid: number
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawIsSelectable", "ii", playerId, textdrawid)
  );
};

export const PlayerTextDrawGetAlignment = (
  playerId: number,
  textdrawid: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetAlignment",
    "ii",
    playerId,
    textdrawid
  );
};

export const PlayerTextDrawGetPreviewModel = (
  playerId: number,
  textdrawid: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetPreviewModel",
    "ii",
    playerId,
    textdrawid
  );
};

export const PlayerTextDrawGetPreviewRot = (
  playerId: number,
  textdrawid: number
): ITextDrawRot => {
  const [fRotX = 0.0, fRotY = 0.0, fRotZ = 0.0, fZoom = 0.0]: number[] =
    samp.callNative(
      "PlayerTextDrawGetPreviewRot",
      "iiFFFF",
      playerId,
      textdrawid
    );
  return { fRotX, fRotY, fRotZ, fZoom };
};

export const PlayerTextDrawGetPreviewVehicleColours = (
  playerId: number,
  textdrawid: number
) => {
  const [color1, color2]: number[] = samp.callNative(
    "PlayerTextDrawGetPreviewVehCol",
    "iiII",
    playerId,
    textdrawid
  );
  return { color1, color2 };
};
