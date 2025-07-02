import { DynamicObject } from "packages/core/dist/bundle";
import { IMapLoadOptions } from "../interfaces";

export function objParser(line: string[], options: IMapLoadOptions) {
  if (line.length <= 7) {
    throw new Error("object parser error");
  }

  const objInfo = line.map((item) => {
    const num = Number(item);
    if (Number.isNaN(num)) {
      throw new Error(`invalid value ${item}`);
    }
    return num;
  });

  const [modelId, x, y, z, rx, ry, rz, interiorId] = objInfo;

  const { xOffset = 0, yOffset = 0, zOffset = 0, worldId, areaId } = options;

  return new DynamicObject({
    modelId,
    x: x + xOffset,
    y: y + yOffset,
    z: z + zOffset,
    rx,
    ry,
    rz,
    worldId,
    areaId,
    interiorId,
  }).create();
}
