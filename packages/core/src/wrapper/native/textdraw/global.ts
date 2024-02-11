import { rgba } from "core/utils/colorUtils";
import type { ITextDrawCommonSize, ITextDrawRot } from "../interfaces/TextDraw";
import type { TextDrawAlignEnum } from "core/enums";

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
  const [str] = samp.callNative("TextDrawGetString", "iSi", textDrawId, 1024);
  return str;
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
  string: string
): void => {
  samp.callNative(
    "TextDrawSetStringForPlayer",
    "iis",
    textDrawId,
    playerId,
    string
  );
};

export const TextDrawCreate = (x: number, y: number, text: string): number => {
  return samp.callNative("TextDrawCreate", "ffs", x, y, text);
};

export const TextDrawDestroy = (text: number): number => {
  return samp.callNative("TextDrawDestroy", "i", text);
};

export const TextDrawLetterSize = (
  text: number,
  x: number,
  y: number
): number => {
  return samp.callNative("TextDrawLetterSize", "iff", text, x, y);
};

export const TextDrawTextSize = (
  text: number,
  x: number,
  y: number
): number => {
  return samp.callNative("TextDrawTextSize", "iff", text, x, y);
};

export const TextDrawAlignment = (
  text: number,
  alignment: TextDrawAlignEnum
): number => {
  return samp.callNative("TextDrawAlignment", "ii", text, alignment);
};

export const TextDrawColor = (
  text: number,
  color: string | number
): boolean => {
  return Boolean(samp.callNative("TextDrawColor", "ii", text, rgba(color)));
};

export const TextDrawUseBox = (text: number, use: boolean): number => {
  return samp.callNative("TextDrawUseBox", "ii", text, use);
};

export const TextDrawBoxColor = (
  text: number,
  color: string | number
): boolean => {
  return Boolean(samp.callNative("TextDrawBoxColor", "ii", text, rgba(color)));
};

export const TextDrawSetShadow = (text: number, size: number): number => {
  return samp.callNative("TextDrawSetShadow", "ii", text, size);
};

export const TextDrawSetOutline = (text: number, size: number): number => {
  return samp.callNative("TextDrawSetOutline", "ii", text, size);
};

export const TextDrawBackgroundColor = (
  text: number,
  color: string | number
): boolean => {
  return Boolean(
    samp.callNative("TextDrawBackgroundColor", "ii", text, rgba(color))
  );
};

export const TextDrawFont = (text: number, font: number): number => {
  return samp.callNative("TextDrawFont", "ii", text, font);
};

export const TextDrawSetProportional = (text: number, set: boolean): number => {
  return samp.callNative("TextDrawSetProportional", "ii", text, set);
};

export const TextDrawSetSelectable = (text: number, set: boolean): number => {
  return samp.callNative("TextDrawSetSelectable", "ii", text, set);
};

export const TextDrawShowForPlayer = (
  playerId: number,
  text: number
): number => {
  return samp.callNative("TextDrawShowForPlayer", "ii", playerId, text);
};

export const TextDrawHideForPlayer = (
  playerId: number,
  text: number
): number => {
  return samp.callNative("TextDrawHideForPlayer", "ii", playerId, text);
};

export const TextDrawShowForAll = (text: number): number => {
  return samp.callNative("TextDrawShowForAll", "i", text);
};

export const TextDrawHideForAll = (text: number): number => {
  return samp.callNative("TextDrawHideForAll", "i", text);
};

export const TextDrawSetString = (text: number, string: string): number => {
  return samp.callNative("TextDrawSetString", "is", text, string);
};

export const TextDrawSetPreviewModel = (
  text: number,
  modelIndex: number
): number => {
  return samp.callNative("TextDrawSetPreviewModel", "ii", text, modelIndex);
};

export const TextDrawSetPreviewRot = (
  text: number,
  fRotX: number,
  fRotY: number,
  fRotZ: number,
  fZoom = 1
): void => {
  samp.callNative(
    "TextDrawSetPreviewRot",
    "iffff",
    text,
    fRotX,
    fRotY,
    fRotZ,
    fZoom
  );
};

export const TextDrawSetPreviewVehicleColors = (
  text: number,
  color1: string | number,
  color2: string | number
): boolean => {
  return Boolean(
    samp.callNative(
      "TextDrawSetPreviewVehCol",
      "iii",
      text,
      rgba(color1),
      rgba(color2)
    )
  );
};

export const SelectTextDraw = (
  playerId: number,
  hovercolor: string | number
): void => {
  samp.callNative("SelectTextDraw", "ii", playerId, rgba(hovercolor));
};

export const CancelSelectTextDraw = (playerId: number): void => {
  samp.callNative("CancelSelectTextDraw", "i", playerId);
};
