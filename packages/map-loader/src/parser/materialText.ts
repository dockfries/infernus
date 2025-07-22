/* eslint-disable prefer-const */
import { DynamicObject } from "@infernus/core";
import { IMapLoadOptions } from "../interfaces";
import { ensureLength } from "../utils/error";
import assert from "node:assert";
import {
  FONT_SPACE_PLACEHOLDER,
  NEWLINE_PLACEHOLDER,
  TXT_SPACE_PLACEHOLDER,
} from "../constants";

export function materialTextParser(
  obj: DynamicObject,
  line: string[],
  options: IMapLoadOptions,
) {
  ensureLength("materialTextParser", line, 10, line.length);

  let [
    materialIndex,
    materialSize,
    fontFace,
    fontSize,
    bold,
    fontColor,
    backColor,
    textAlignment,
  ] = line.slice(1);

  assert(!Number.isNaN(+materialIndex));
  assert(!Number.isNaN(+materialSize));
  assert(!Number.isNaN(+bold));
  assert(!Number.isNaN(+fontColor));
  assert(!Number.isNaN(+textAlignment));

  fontFace = fontFace.replaceAll(FONT_SPACE_PLACEHOLDER, " ");
  const text = line
    .slice(9)
    .join(" ")
    .replaceAll(NEWLINE_PLACEHOLDER, "\n")
    .replaceAll(TXT_SPACE_PLACEHOLDER, " ");

  return obj.setMaterialText(
    options.charset,
    +materialIndex,
    text,
    +materialSize,
    fontFace,
    +fontSize,
    +bold,
    +fontColor,
    +backColor,
    +textAlignment,
  );
}
