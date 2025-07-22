import { DynamicObject } from "@infernus/core";
import { ensureLength } from "../utils/error";
import assert from "node:assert";
import { TXT_SPACE_PLACEHOLDER } from "../constants";

export function materialParser(obj: DynamicObject, line: string[]) {
  ensureLength("materialParser", line, 6, line.length);

  // eslint-disable-next-line prefer-const
  let [index, modelId, textureLib, textureName, color] = line.slice(1);

  assert(!Number.isNaN(+index));
  assert(!Number.isNaN(+modelId));
  assert(!Number.isNaN(+color));

  if (textureName.includes(TXT_SPACE_PLACEHOLDER)) {
    textureName = textureName.replaceAll(TXT_SPACE_PLACEHOLDER, " ");
  }

  return obj.setMaterial(+index, +modelId, textureLib, textureName, +color);
}
