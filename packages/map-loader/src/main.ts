import { GameMode } from "@infernus/core";
import "./parser/removeBuilding";
import { mapReader } from "./parser/reader";
import { INTERNAL_MAP } from "./constants";
import type { IMapLoadOptions } from "./interfaces";
import { uniqId } from "./utils";
import { MapLoaderError } from "./utils/error";

export async function loadMap(options: IMapLoadOptions) {
  const { objects, removeBuilding, removeBuildingIdx } =
    await mapReader(options);

  INTERNAL_MAP.loadedMaps.set(uniqId(), {
    options,
    objects,
    removeBuildingIdx,
  });

  const { afterRemoveBuilding } = options;

  if (afterRemoveBuilding) {
    afterRemoveBuilding(removeBuilding);
  }

  return objects;
}

export function unloadMap(mapId: number) {
  if (!INTERNAL_MAP.loadedMaps.has(mapId)) {
    throw new MapLoaderError({ msg: `invalid mapId ${mapId}` });
  }

  const map = INTERNAL_MAP.loadedMaps.get(mapId)!;

  map.objects.forEach((obj) => {
    if (obj.isValid()) {
      obj.destroy();
    }
  });

  if (map.removeBuildingIdx > -1) {
    INTERNAL_MAP.removeBuilding.splice(map.removeBuildingIdx, 1);
  }

  INTERNAL_MAP.loadedMaps.delete(mapId);

  return map.options;
}

export function reloadMap(mapId: number) {
  loadMap(unloadMap(mapId));
}

export function reloadMaps() {
  INTERNAL_MAP.loadedMaps.keys().forEach((mapId) => {
    reloadMap(mapId);
  });
}

GameMode.onExit(({ next }) => {
  INTERNAL_MAP.loadedMaps.clear();
  return next();
});
