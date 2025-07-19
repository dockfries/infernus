import { ensureLength } from "../utils/error";

export function materialConverter(line: string) {
  const funcMatch = line.match(/^.*Set(Dynamic)?ObjectMaterial\(/);

  if (!funcMatch) throw new Error("");

  const params = line
    .replace(/^.*Set(Dynamic)?ObjectMaterial\(|\);\s*(\w+)?/g, "")
    .split(",")
    .map((param) => param.trim().replace(/"/g, ""));

  ensureLength("materialConverter", params, 6, params.length);

  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    objectId,
    index,
    modelId,
    textureLib,
    textureName,
    color,
  ] = params;
  return {
    index: +index,
    modelId: +modelId,
    textureLib,
    textureName,
    color: +color,
  };
}
