/* eslint-disable prefer-const */
import { ensureLength } from "../utils/error";

export function materialConverter(line: string) {
  const params = line
    .replace(/^.*Set(Dynamic)?ObjectMaterial\(|\);\s*(\w+)?/g, "")
    .split(",")
    .map((param) => param.trim().replace(/"/g, ""));

  ensureLength("materialConverter", params, 6, params.length);

  let [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    objectId,
    index,
    modelId,
    textureLib,
    textureName,
    color,
  ] = params;

  if (
    modelId === "16644" &&
    textureLib == "a51_detailstuff" &&
    textureName == "roucghstonebrtb"
  ) {
    modelId = "18888";
    textureLib = "forcefields";
    textureName = "white";
  }

  return {
    index: +index,
    modelId: +modelId,
    textureLib,
    textureName,
    color: +color,
  };
}
