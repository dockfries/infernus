import type { ITextDrawCommonSize, ITextDrawRot } from "../interfaces/TextDraw";

export const IsValidTextDraw = (textDrawId: number): boolean => {
  return Boolean(samp.callNative("IsValidTextDraw", "i", textDrawId));
};

export const IsTextDrawVisibleForPlayer = (
  playerId: number,
  textDrawId: number
): boolean => {
  return Boolean(
    samp.callNative("IsTextDrawVisibleForPlayer", "ii", playerId, textDrawId)
  );
};

export const TextDrawGetString = (textDrawId: number): string => {
  return samp.callNative("TextDrawGetString", "iSi", textDrawId, 1024);
};

// You can change textdraw pos with it, but you need to use TextDrawShowForPlayer() after that
export const TextDrawSetPos = (
  textDrawId: number,
  fX: number,
  fY: number
): void => {
  samp.callNative("TextDrawSetPos", "iff", textDrawId, fX, fY);
};

export const TextDrawGetLetterSize = (
  textDrawId: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "TextDrawGetLetterSize",
    "iFF",
    textDrawId
  );
  return { fX, fY };
};

export const TextDrawGetTextSize = (
  textDrawId: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "TextDrawGetTextSize",
    "iFF",
    textDrawId
  );
  return { fX, fY };
};

export const TextDrawGetPos = (textDrawId: number): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "TextDrawGetPos",
    "iFF",
    textDrawId
  );
  return { fX, fY };
};

export const TextDrawGetColor = (textDrawId: number): number => {
  return samp.callNative("TextDrawGetColor", "i", textDrawId);
};

export const TextDrawGetBoxColor = (textDrawId: number): number => {
  return samp.callNative("TextDrawGetBoxColor", "i", textDrawId);
};

export const TextDrawGetBackgroundColor = (textDrawId: number): number => {
  return samp.callNative("TextDrawGetBackgroundColor", "i", textDrawId);
};

export const TextDrawGetShadow = (textDrawId: number): number => {
  return samp.callNative("TextDrawGetShadow", "i", textDrawId);
};

export const TextDrawGetOutline = (textDrawId: number): number => {
  return samp.callNative("TextDrawGetOutline", "i", textDrawId);
};

export const TextDrawGetFont = (textDrawId: number): number => {
  return samp.callNative("TextDrawGetFont", "i", textDrawId);
};

export const TextDrawIsBox = (textDrawId: number): boolean => {
  return Boolean(samp.callNative("TextDrawIsBox", "i", textDrawId));
};

export const TextDrawIsProportional = (textDrawId: number): boolean => {
  return Boolean(samp.callNative("TextDrawIsProportional", "i", textDrawId));
};

export const TextDrawIsSelectable = (textDrawId: number): boolean => {
  return Boolean(samp.callNative("TextDrawIsSelectable", "i", textDrawId));
};

export const TextDrawGetAlignment = (textDrawId: number): number => {
  return samp.callNative("TextDrawGetAlignment", "i", textDrawId);
};

export const TextDrawGetPreviewModel = (textDrawId: number): number => {
  return samp.callNative("TextDrawGetPreviewModel", "i", textDrawId);
};

export const TextDrawGetPreviewRot = (textDrawId: number): ITextDrawRot => {
  const [fRotX = 0.0, fRotY = 0.0, fRotZ = 0.0, fZoom = 0.0]: number[] =
    samp.callNative("TextDrawGetPreviewRot", "iFFFF", textDrawId);
  return { fRotX, fRotY, fRotZ, fZoom };
};

export const TextDrawGetPreviewVehicleColors = (textDrawId: number) => {
  const [color1, color2]: number[] = samp.callNative(
    "TextDrawGetPreviewVehCol",
    "iII",
    textDrawId
  );
  return { color1, color2 };
};

export const TextDrawSetStringForPlayer = (
  textDrawId: number,
  playerId: number,
  fmat: string,
  ...args: Array<any>
): void => {
  samp.callNative(
    "TextDrawSetStringForPlayer",
    "iisa",
    textDrawId,
    playerId,
    fmat,
    args
  );
};
