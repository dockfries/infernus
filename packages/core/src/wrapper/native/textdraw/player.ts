import { rgba } from "core/utils/colorUtils";
import type { ITextDrawCommonSize, ITextDrawRot } from "../interfaces/TextDraw";
import type { TextDrawAlignEnum } from "core/enums";
import { ICommonRetVal } from "core/interfaces";

export const IsValidPlayerTextDraw = (
  playerId: number,
  textDrawId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsValidPlayerTextDraw", "ii", playerId, textDrawId),
  );
};
export const IsPlayerTextDrawVisible = (
  playerId: number,
  textDrawId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerTextDrawVisible", "ii", playerId, textDrawId),
  );
};
export const PlayerTextDrawGetString = (
  playerId: number,
  textDrawId: number,
) => {
  const [str, ret] = samp.callNative(
    "PlayerTextDrawGetString",
    "iiSi",
    playerId,
    textDrawId,
    1024,
  ) as [string, number];
  return { str, ret };
};

export const PlayerTextDrawSetPos = (
  playerId: number,
  textDrawId: number,
  fX: number,
  fY: number,
): void => {
  samp.callNative("PlayerTextDrawSetPos", "iiff", playerId, textDrawId, fX, fY);
};

export const PlayerTextDrawGetLetterSize = (
  playerId: number,
  textDrawId: number,
): ITextDrawCommonSize & ICommonRetVal => {
  const [fX = 0.0, fY = 0.0, ret]: number[] = samp.callNative(
    "PlayerTextDrawGetLetterSize",
    "iiFF",
    playerId,
    textDrawId,
  );
  return { fX, fY, ret };
};

export const PlayerTextDrawGetTextSize = (
  playerId: number,
  textDrawId: number,
): ITextDrawCommonSize & ICommonRetVal => {
  const [fX = 0.0, fY = 0.0, ret]: number[] = samp.callNative(
    "PlayerTextDrawGetTextSize",
    "iiFF",
    playerId,
    textDrawId,
  );
  return { fX, fY, ret };
};

export const PlayerTextDrawGetPos = (
  playerId: number,
  textDrawId: number,
): ITextDrawCommonSize & ICommonRetVal => {
  const [fX = 0.0, fY = 0.0, ret]: number[] = samp.callNative(
    "PlayerTextDrawGetPos",
    "iiFF",
    playerId,
    textDrawId,
  );
  return { fX, fY, ret };
};

export const PlayerTextDrawGetColor = (
  playerId: number,
  textDrawId: number,
): number => {
  return samp.callNative("PlayerTextDrawGetColor", "ii", playerId, textDrawId);
};

export const PlayerTextDrawGetBoxColor = (
  playerId: number,
  textDrawId: number,
): number => {
  return samp.callNative(
    "PlayerTextDrawGetBoxColor",
    "ii",
    playerId,
    textDrawId,
  );
};

export const PlayerTextDrawGetBackgroundColor = (
  playerId: number,
  textDrawId: number,
): number => {
  return samp.callNative(
    "PlayerTextDrawGetBackgroundColor",
    "ii",
    playerId,
    textDrawId,
  );
};

export const PlayerTextDrawGetShadow = (
  playerId: number,
  textDrawId: number,
): number => {
  return samp.callNative("PlayerTextDrawGetShadow", "ii", playerId, textDrawId);
};

export const PlayerTextDrawGetOutline = (
  playerId: number,
  textDrawId: number,
): number => {
  return samp.callNative(
    "PlayerTextDrawGetOutline",
    "ii",
    playerId,
    textDrawId,
  );
};

export const PlayerTextDrawGetFont = (
  playerId: number,
  textDrawId: number,
): number => {
  return samp.callNative("PlayerTextDrawGetFont", "ii", playerId, textDrawId);
};

export const PlayerTextDrawIsBox = (
  playerId: number,
  textDrawId: number,
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawIsBox", "ii", playerId, textDrawId),
  );
};

export const PlayerTextDrawIsProportional = (
  playerId: number,
  textDrawId: number,
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawIsProportional", "ii", playerId, textDrawId),
  );
};

export const PlayerTextDrawIsSelectable = (
  playerId: number,
  textDrawId: number,
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawIsSelectable", "ii", playerId, textDrawId),
  );
};

export const PlayerTextDrawGetAlignment = (
  playerId: number,
  textDrawId: number,
): number => {
  return samp.callNative(
    "PlayerTextDrawGetAlignment",
    "ii",
    playerId,
    textDrawId,
  );
};

export const PlayerTextDrawGetPreviewModel = (
  playerId: number,
  textDrawId: number,
): number => {
  return samp.callNative(
    "PlayerTextDrawGetPreviewModel",
    "ii",
    playerId,
    textDrawId,
  );
};

export const PlayerTextDrawGetPreviewRot = (
  playerId: number,
  textDrawId: number,
): ITextDrawRot => {
  const [fRotX = 0.0, fRotY = 0.0, fRotZ = 0.0, fZoom = 0.0]: number[] =
    samp.callNative(
      "PlayerTextDrawGetPreviewRot",
      "iiFFFF",
      playerId,
      textDrawId,
    );
  return { fRotX, fRotY, fRotZ, fZoom };
};

export const PlayerTextDrawGetPreviewVehicleColors = (
  playerId: number,
  textDrawId: number,
) => {
  const [color1, color2, ret]: number[] = samp.callNative(
    "PlayerTextDrawGetPreviewVehCol",
    "iiII",
    playerId,
    textDrawId,
  );
  return { color1, color2, ret };
};

export const CreatePlayerTextDraw = (
  playerId: number,
  x: number,
  y: number,
  text: number[],
): number => {
  return samp.callNative("CreatePlayerTextDraw", "iffa", playerId, x, y, text);
};

export const PlayerTextDrawDestroy = (playerId: number, text: number): void => {
  samp.callNative("PlayerTextDrawDestroy", "ii", playerId, text);
};

export const PlayerTextDrawLetterSize = (
  playerId: number,
  text: number,
  x: number,
  y: number,
): number => {
  return samp.callNative(
    "PlayerTextDrawLetterSize",
    "iiff",
    playerId,
    text,
    x,
    y,
  );
};

export const PlayerTextDrawTextSize = (
  playerId: number,
  text: number,
  x: number,
  y: number,
): number => {
  return samp.callNative(
    "PlayerTextDrawTextSize",
    "iiff",
    playerId,
    text,
    x,
    y,
  );
};

export const PlayerTextDrawAlignment = (
  playerId: number,
  text: number,
  alignment: TextDrawAlignEnum,
): number => {
  return samp.callNative(
    "PlayerTextDrawAlignment",
    "iii",
    playerId,
    text,
    alignment,
  );
};

export const PlayerTextDrawColor = (
  playerId: number,
  text: number,
  color: string | number,
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawColor", "iii", playerId, text, rgba(color)),
  );
};

export const PlayerTextDrawUseBox = (
  playerId: number,
  text: number,
  use: boolean,
): number => {
  return samp.callNative("PlayerTextDrawUseBox", "iii", playerId, text, use);
};

export const PlayerTextDrawBoxColor = (
  playerId: number,
  text: number,
  color: string | number,
): boolean => {
  return Boolean(
    samp.callNative(
      "PlayerTextDrawBoxColor",
      "iii",
      playerId,
      text,
      rgba(color),
    ),
  );
};

export const PlayerTextDrawSetShadow = (
  playerId: number,
  text: number,
  size: number,
): number => {
  return samp.callNative(
    "PlayerTextDrawSetShadow",
    "iii",
    playerId,
    text,
    size,
  );
};

export const PlayerTextDrawSetOutline = (
  playerId: number,
  text: number,
  size: number,
): number => {
  return samp.callNative(
    "PlayerTextDrawSetOutline",
    "iii",
    playerId,
    text,
    size,
  );
};

export const PlayerTextDrawBackgroundColor = (
  playerId: number,
  text: number,
  color: string | number,
): boolean => {
  return Boolean(
    samp.callNative(
      "PlayerTextDrawBackgroundColor",
      "iii",
      playerId,
      text,
      rgba(color),
    ),
  );
};

export const PlayerTextDrawFont = (
  playerId: number,
  text: number,
  font: number,
): number => {
  return samp.callNative("PlayerTextDrawFont", "iii", playerId, text, font);
};

export const PlayerTextDrawSetProportional = (
  playerId: number,
  text: number,
  set: boolean,
): number => {
  return samp.callNative(
    "PlayerTextDrawSetProportional",
    "iii",
    playerId,
    text,
    set,
  );
};

export const PlayerTextDrawSetSelectable = (
  playerId: number,
  text: number,
  set: boolean,
): number => {
  return samp.callNative(
    "PlayerTextDrawSetSelectable",
    "iii",
    playerId,
    text,
    set,
  );
};

export const PlayerTextDrawShow = (playerId: number, text: number): number => {
  return samp.callNative("PlayerTextDrawShow", "ii", playerId, text);
};

export const PlayerTextDrawHide = (playerId: number, text: number): number => {
  return samp.callNative("PlayerTextDrawHide", "ii", playerId, text);
};

export const PlayerTextDrawSetString = (
  playerId: number,
  text: number,
  string: number[],
): number => {
  return samp.callNative(
    "PlayerTextDrawSetString",
    "iia",
    playerId,
    text,
    string,
  );
};

export const PlayerTextDrawSetPreviewModel = (
  playerId: number,
  text: number,
  modelIndex: number,
): number => {
  return samp.callNative(
    "PlayerTextDrawSetPreviewModel",
    "iii",
    playerId,
    text,
    modelIndex,
  );
};

export const PlayerTextDrawSetPreviewRot = (
  playerId: number,
  text: number,
  fRotX: number,
  fRotY: number,
  fRotZ: number,
  fZoom: number,
): number => {
  return samp.callNative(
    "PlayerTextDrawSetPreviewRot",
    "iiffff",
    playerId,
    text,
    fRotX,
    fRotY,
    fRotZ,
    fZoom,
  );
};

export const PlayerTextDrawSetPreviewVehicleColors = (
  playerId: number,
  text: number,
  color1: string | number,
  color2: string | number,
): boolean => {
  return Boolean(
    samp.callNative(
      "PlayerTextDrawSetPreviewVehCol",
      "iiii",
      playerId,
      text,
      color1,
      color2,
    ),
  );
};
