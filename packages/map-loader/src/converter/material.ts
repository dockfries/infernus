/* eslint-disable prefer-const */
import { TXT_SPACE_PLACEHOLDER } from "../constants";
import { paramsSplit, replaceTexture } from "../utils";
import { ensureLength } from "../utils/error";

export function materialConverter(line: string) {
  const params = paramsSplit(
    line.replace(/^.*Set(Dynamic)?ObjectMaterial\(|\);\s*\/?\*?\w*.*$/g, ""),
  );

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

  const replaced = replaceTexture(modelId, textureLib, textureName);
  let _modelId = replaced.modelId;
  textureLib = replaced.textureLib;
  textureName = replaced.textureName;

  if (textureName.includes(" ")) {
    textureName = textureName.replaceAll(" ", TXT_SPACE_PLACEHOLDER);
  }

  return {
    index: +index,
    modelId: _modelId,
    textureLib,
    textureName,
    color: +color,
  };
}
