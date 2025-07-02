import { GameMode } from "@infernus/core";
import "./parser/removeBuilding";
import { mapReader } from "./parser/reader";
import { INTERNAL_MAP } from "./constants";
import type { IMapLoadOptions } from "./interfaces";

export async function loadMap(options: IMapLoadOptions) {
  const { filePath, removeBuilding } = options;

  const { objects, rmvs, rmvIdx } = await mapReader(options);

  INTERNAL_MAP.uniqId++;
  INTERNAL_MAP.loadedMaps.set(INTERNAL_MAP.uniqId, {
    filePath,
    objects,
    rmvIdx,
  });

  removeBuilding(rmvs);

  return objects;
}

export function unloadMap(mapId: number) {
  if (!INTERNAL_MAP.loadedMaps.has(mapId)) {
    throw new Error("");
  }
  const map = INTERNAL_MAP.loadedMaps.get(mapId)!;

  map.objects.forEach((obj) => {
    if (obj.isValid()) {
      obj.destroy();
    }
  });

  if (map.rmvIdx > -1) {
    INTERNAL_MAP.rmvs.splice(map.rmvIdx, 1);
  }

  INTERNAL_MAP.loadedMaps.delete(mapId);
}

export function reloadMaps() {}

// when exit, clear loadedMaps, no need unloadMap manual
GameMode.onExit(({ next }) => {
  INTERNAL_MAP.loadedMaps.clear();
  INTERNAL_MAP.uniqId = 0;
  return next();
});
