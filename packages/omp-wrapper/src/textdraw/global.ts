import { ITextDrawCommonSize, ITextDrawRot } from "../interfaces/TextDraw";

export const IsValidTextDraw = (textdrawid: number): boolean => {
  return Boolean(samp.callNative("IsValidTextDraw", "i", textdrawid));
};

export const IsTextDrawVisibleForPlayer = (
  playerid: number,
  textdrawid: number
): boolean => {
  return Boolean(
    samp.callNative("IsTextDrawVisibleForPlayer", "ii", playerid, textdrawid)
  );
};

export const TextDrawGetString = (textdrawid: number): string => {
  return samp.callNative("TextDrawGetString", "iSi", textdrawid, 1024);
};

// You can change textdraw pos with it, but you need to use TextDrawShowForPlayer() after that
export const TextDrawSetPos = (
  textdrawid: number,
  fX: number,
  fY: number
): void => {
  samp.callNative("TextDrawSetPos", "iff", textdrawid, fX, fY);
};

export const TextDrawGetLetterSize = (
  textdrawid: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "TextDrawGetLetterSize",
    "iFF",
    textdrawid
  );
  return { fX, fY };
};

export const TextDrawGetTextSize = (
  textdrawid: number
): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "TextDrawGetTextSize",
    "iFF",
    textdrawid
  );
  return { fX, fY };
};

export const TextDrawGetPos = (textdrawid: number): ITextDrawCommonSize => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "TextDrawGetPos",
    "iFF",
    textdrawid
  );
  return { fX, fY };
};

export const TextDrawGetColour = (textdrawid: number): number => {
  return samp.callNative("TextDrawGetColour", "i", textdrawid);
};

export const TextDrawGetBoxColour = (textdrawid: number): number => {
  return samp.callNative("TextDrawGetBoxColour", "i", textdrawid);
};

export const TextDrawGetBackgroundColour = (textdrawid: number): number => {
  return samp.callNative("TextDrawGetBackgroundColour", "i", textdrawid);
};

export const TextDrawGetShadow = (textdrawid: number): number => {
  return samp.callNative("TextDrawGetShadow", "i", textdrawid);
};

export const TextDrawGetOutline = (textdrawid: number): number => {
  return samp.callNative("TextDrawGetOutline", "i", textdrawid);
};

export const TextDrawGetFont = (textdrawid: number): number => {
  return samp.callNative("TextDrawGetFont", "i", textdrawid);
};

export const TextDrawIsBox = (textdrawid: number): boolean => {
  return Boolean(samp.callNative("TextDrawIsBox", "i", textdrawid));
};

export const TextDrawIsProportional = (textdrawid: number): boolean => {
  return Boolean(samp.callNative("TextDrawIsProportional", "i", textdrawid));
};

export const TextDrawIsSelectable = (textdrawid: number): boolean => {
  return Boolean(samp.callNative("TextDrawIsSelectable", "i", textdrawid));
};

export const TextDrawGetAlignment = (textdrawid: number): number => {
  return samp.callNative("TextDrawGetAlignment", "i", textdrawid);
};

export const TextDrawGetPreviewModel = (textdrawid: number): number => {
  return samp.callNative("TextDrawGetPreviewModel", "i", textdrawid);
};

export const TextDrawGetPreviewRot = (textdrawid: number): ITextDrawRot => {
  const [fRotX = 0.0, fRotY = 0.0, fRotZ = 0.0, fZoom = 0.0]: number[] =
    samp.callNative("TextDrawGetPreviewRot", "iFFFF", textdrawid);
  return { fRotX, fRotY, fRotZ, fZoom };
};

export const TextDrawGetPreviewVehicleColours = (textdrawid: number) => {
  const [color1, color2]: number[] = samp.callNative(
    "TextDrawGetPreviewVehicleColours",
    "iII",
    textdrawid
  );
  return { color1, color2 };
};

export const TextDrawSetStringForPlayer = (
  textdrawid: number,
  playerid: number,
  fmat: string,
  ...args: Array<any>
): void => {
  samp.callNative(
    "TextDrawSetStringForPlayer",
    "iisa",
    textdrawid,
    playerid,
    fmat,
    args
  );
};
