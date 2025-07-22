/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectMaterialAlignmentEnum } from "@infernus/core";
import { ensureLength } from "../utils/error";
import {
  FONT_SPACE_PLACEHOLDER,
  MAT_SIZE_VALUE,
  NEWLINE_PLACEHOLDER,
} from "../constants";
import { paramsSplit } from "../utils";

export function materialTextConverter(
  funcMatch: RegExpMatchArray,
  line: string,
) {
  let funcName = "SetObjectMaterialText";

  if (funcMatch[1]) {
    funcName = "SetDynamicObjectMaterialText";
  }

  const params = paramsSplit(
    line.replace(
      /^.*Set(Dynamic)?ObjectMaterialText\(|\);\s*\/?\*?\w*.*$/g,
      "",
    ),
  );

  ensureLength("materialTextConverter", params, 9, params.length);

  let [
    objectId,
    materialIndex,
    text,
    materialSize,
    fontFace,
    fontSize,
    bold,
    fontColor,
    backColor,
    textAlignment = ObjectMaterialAlignmentEnum.LEFT,
  ] = params;

  if (funcName === "SetObjectMaterialText") {
    [materialIndex, text] = [text, materialIndex];
  }

  text = text.replace(/\n|\\n/g, NEWLINE_PLACEHOLDER);
  fontFace = fontFace.replaceAll(" ", FONT_SPACE_PLACEHOLDER);

  let _materialSize = +materialSize;

  if (materialSize in MAT_SIZE_VALUE) {
    _materialSize =
      MAT_SIZE_VALUE[materialSize as unknown as keyof typeof MAT_SIZE_VALUE];
  }

  let _textAlignment = +textAlignment;

  if (textAlignment in MAT_SIZE_VALUE) {
    _textAlignment =
      MAT_SIZE_VALUE[textAlignment as unknown as keyof typeof MAT_SIZE_VALUE];
  }

  return {
    materialIndex: +materialIndex,
    text,
    materialSize: _materialSize,
    fontFace,
    fontSize: +fontSize,
    bold: +Boolean(bold),
    fontColor,
    backColor,
    textAlignment: _textAlignment,
  };
}
