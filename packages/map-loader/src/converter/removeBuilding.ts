import { ensureLength } from "../utils/error";

export function removeBuildingConverter(line: string) {
  const params = line
    .replace(/^.*RemoveBuildingForPlayer\(|\);\s*(\w+)?/g, "")
    .split(",")
    .map((param) => param.trim());

  ensureLength("removeBuildingConverter", params, 6, params.length);

  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    playerId,
    modelId,
    centerX,
    centerY,
    centerZ,
    radius,
  ] = params;
  return {
    modelId: +modelId,
    centerX: +centerX,
    centerY: +centerY,
    centerZ: +centerZ,
    radius: +radius,
  };
}
