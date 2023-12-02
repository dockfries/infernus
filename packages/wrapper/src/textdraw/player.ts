import type { ITextDrawCommonSize, ITextDrawRot } from "../interfaces/TextDraw";

export const IsValidPlayerTextDraw = (
  playerId: number,
  textDrawId: number
): boolean => {
  return Boolean(
    samp.callNative("IsValidPlayerTextDraw", "ii", playerId, textDrawId)
  );
};
export const IsPlayerTextDrawVisible = (
  playerId: number,
  textDrawId: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerTextDrawVisible", "ii", playerId, textDrawId)
  );
};
export const PlayerTextDrawGetString = (
  playerId: number,
  textDrawId: number
): string => {
  return samp.callNative(
    "PlayerTextDrawGetString",
    "iiSi",
    playerId,
    textDrawId,
    1024
  );
};

export const PlayerTextDrawSetPos = (
  playerId: number,
  textDrawId: number,
  fX: number,
  fY: number
): void => {
  samp.callNative("PlayerTextDrawSetPos", "iiff", playerId, textDrawId, fX, fY);
};

export const PlayerTextDrawGetLetterSize = (
  playerId: number,
  textDrawId: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "PlayerTextDrawGetLetterSize",
    "iiFF",
    playerId,
    textDrawId
  );
  return { fX, fY };
};

export const PlayerTextDrawGetTextSize = (
  playerId: number,
  textDrawId: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "PlayerTextDrawGetTextSize",
    "iiFF",
    playerId,
    textDrawId
  );
  return { fX, fY };
};

export const PlayerTextDrawGetPos = (
  playerId: number,
  textDrawId: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "PlayerTextDrawGetPos",
    "iiFF",
    playerId,
    textDrawId
  );
  return { fX, fY };
};

export const PlayerTextDrawGetColor = (
  playerId: number,
  textDrawId: number
): number => {
  return samp.callNative("PlayerTextDrawGetColor", "ii", playerId, textDrawId);
};

export const PlayerTextDrawGetBoxColor = (
  playerId: number,
  textDrawId: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetBoxColor",
    "ii",
    playerId,
    textDrawId
  );
};

export const PlayerTextDrawGetBackgroundColor = (
  playerId: number,
  textDrawId: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetBackgroundColor",
    "ii",
    playerId,
    textDrawId
  );
};

export const PlayerTextDrawGetShadow = (
  playerId: number,
  textDrawId: number
): number => {
  return samp.callNative("PlayerTextDrawGetShadow", "ii", playerId, textDrawId);
};

export const PlayerTextDrawGetOutline = (
  playerId: number,
  textDrawId: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetOutline",
    "ii",
    playerId,
    textDrawId
  );
};

export const PlayerTextDrawGetFont = (
  playerId: number,
  textDrawId: number
): number => {
  return samp.callNative("PlayerTextDrawGetFont", "ii", playerId, textDrawId);
};

export const PlayerTextDrawIsBox = (
  playerId: number,
  textDrawId: number
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawIsBox", "ii", playerId, textDrawId)
  );
};

export const PlayerTextDrawIsProportional = (
  playerId: number,
  textDrawId: number
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawIsProportional", "ii", playerId, textDrawId)
  );
};

export const PlayerTextDrawIsSelectable = (
  playerId: number,
  textDrawId: number
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawIsSelectable", "ii", playerId, textDrawId)
  );
};

export const PlayerTextDrawGetAlignment = (
  playerId: number,
  textDrawId: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetAlignment",
    "ii",
    playerId,
    textDrawId
  );
};

export const PlayerTextDrawGetPreviewModel = (
  playerId: number,
  textDrawId: number
): number => {
  return samp.callNative(
    "PlayerTextDrawGetPreviewModel",
    "ii",
    playerId,
    textDrawId
  );
};

export const PlayerTextDrawGetPreviewRot = (
  playerId: number,
  textDrawId: number
): ITextDrawRot => {
  const [fRotX = 0.0, fRotY = 0.0, fRotZ = 0.0, fZoom = 0.0]: number[] =
    samp.callNative(
      "PlayerTextDrawGetPreviewRot",
      "iiFFFF",
      playerId,
      textDrawId
    );
  return { fRotX, fRotY, fRotZ, fZoom };
};

export const PlayerTextDrawGetPreviewVehicleColors = (
  playerId: number,
  textDrawId: number
) => {
  const [color1, color2]: number[] = samp.callNative(
    "PlayerTextDrawGetPreviewVehCol",
    "iiII",
    playerId,
    textDrawId
  );
  return { color1, color2 };
};
