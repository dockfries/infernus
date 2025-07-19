import { DynamicObject } from "@infernus/core";
import { IMapLoadOptions } from "../interfaces";
import { ensureLength, MapLoaderError } from "../utils/error";

export function objParser(line: string[], options: IMapLoadOptions) {
  ensureLength("objParser", line, 8, line.length);

  const objInfo = line.map((item) => {
    const num = Number(item);
    if (Number.isNaN(num)) {
      throw new MapLoaderError({ msg: `invalid value ${item}` });
    }
    return num;
  });

  const [
    modelId,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    worldId,
    interiorId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    playerId,
    streamDistance,
    drawDistance,
    areaId,
    priority,
  ] = objInfo;

  const {
    xOffset = 0,
    yOffset = 0,
    zOffset = 0,
    playerId: overwritePlayerId,
    worldId: defaultWorldId,
    interiorId: defaultInteriorId,
    areaId: defaultAreaId,
    priority: defaultPriority,
    streamDistance: defaultStreamDistance,
    drawDistance: defaultDrawDistance,
    overwrite,
  } = options;

  return new DynamicObject({
    modelId,
    x: x + xOffset,
    y: y + yOffset,
    z: z + zOffset,
    rx,
    ry,
    rz,
    worldId: overwrite ? defaultWorldId : (worldId ?? defaultWorldId),
    areaId: overwrite ? defaultAreaId : (areaId ?? defaultAreaId),
    interiorId: overwrite
      ? defaultInteriorId
      : (interiorId ?? defaultInteriorId),
    streamDistance: overwrite
      ? defaultStreamDistance
      : (streamDistance ?? defaultStreamDistance),
    drawDistance: overwrite
      ? defaultDrawDistance
      : (drawDistance ?? defaultDrawDistance),
    playerId: overwritePlayerId,
    priority: overwrite ? defaultPriority : (priority ?? defaultPriority),
  }).create();
}
