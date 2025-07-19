import { DynamicObject } from "@infernus/core";
import { IMapLoadOptions } from "../interfaces";
import { ensureLength } from "../utils/error";

export function materialTextParser(
  obj: DynamicObject,
  line: string[],
  options: IMapLoadOptions,
) {
  ensureLength("materialTextParser", line, 10, line.length);

  const [
    materialIndex,
    materialSize,
    fontFace = "Arial",
    fontSize = 24,
    bold = 1,
    fontColor = 0xffffffff,
    backColor = 0,
    textAlignment = 0,
    text,
  ] = line.slice(1);

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
