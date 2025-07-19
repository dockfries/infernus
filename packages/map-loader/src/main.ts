import { GameMode } from "@infernus/core";
import "./parser/removeBuilding";
import { mapReader } from "./parser/reader";
import { INTERNAL_MAP } from "./constants";
import type { IMapLoadOptions } from "./interfaces";
import { uniqId } from "./utils";
import { MapLoaderError } from "./utils/error";

export async function loadMap(options: IMapLoadOptions) {
  const { objects, removedBuilding, removedBuildingIdx } =
    await mapReader(options);

  const id = uniqId();

  INTERNAL_MAP.loadedMaps.set(id, {
    options,
    objects,
    removedBuildingIdx,
  });

  const { onLoaded } = options;

  if (onLoaded) {
    onLoaded(removedBuilding);
  }

  return id;
}

export function unloadMap(mapId: number) {
  if (!INTERNAL_MAP.loadedMaps.has(mapId)) {
    throw new MapLoaderError({ msg: `invalid mapId ${mapId}` });
  }

  const map = INTERNAL_MAP.loadedMaps.get(mapId)!;

  const { onUnloaded } = map.options;

  map.objects.forEach((obj) => {
    if (obj.isValid()) {
      obj.destroy();
    }
  });

  const removedBuilding =
    map.removedBuildingIdx > -1
      ? INTERNAL_MAP.removedBuilding[map.removedBuildingIdx]
      : [];

  if (map.removedBuildingIdx > -1) {
    INTERNAL_MAP.removedBuilding.splice(map.removedBuildingIdx, 1);
  }

  INTERNAL_MAP.loadedMaps.delete(mapId);

  if (onUnloaded) {
    onUnloaded(removedBuilding);
  }

  return mapId;
}

export function reloadMap(mapId: number) {
  const mapInfo = INTERNAL_MAP.loadedMaps.get(mapId);
  if (!mapInfo) {
    throw new MapLoaderError({ msg: `invalid mapId ${mapId}` });
  }
  loadMap(mapInfo.options);
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
