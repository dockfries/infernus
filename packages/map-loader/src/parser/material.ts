import { DynamicObject } from "@infernus/core";
import { ensureLength } from "../utils/error";

export function materialParser(obj: DynamicObject, line: string[]) {
  ensureLength("materialParser", line, 6, line.length);

  const [index, modelId, textureLib, textureName, color] = line.slice(1);

  return obj.setMaterial(+index, +modelId, textureLib, textureName, +color);
}
