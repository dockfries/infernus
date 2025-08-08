import { DynamicObject, GameMode } from "@infernus/core";
import { createRequire } from "node:module";
import "./parser/removeBuilding";
import { mapReader } from "./parser/reader";
import { INTERNAL_MAP, INVALID_MAP_ID } from "./constants";
import type { IMapLoadOptions } from "./interfaces";
import { uniqId } from "./utils";
import { MapLoaderError } from "./utils/error";

GameMode.onExit(({ next }) => {
  INTERNAL_MAP.loadedMaps.clear();
  return next();
});

export async function loadMap(options: IMapLoadOptions) {
  const { objects, removedBuilding, removedBuildingIdx } =
    await mapReader(options);

  const id = uniqId();

  INTERNAL_MAP.loadedMaps.set(id, {
    options,
    objects,
    _rmvBuildingIdx: removedBuildingIdx,
  });

  const { onLoaded } = options;

  if (onLoaded) {
    onLoaded(objects, removedBuilding);
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
    map._rmvBuildingIdx > -1
      ? INTERNAL_MAP.removedBuilding[map._rmvBuildingIdx]
      : [];

  if (map._rmvBuildingIdx > -1) {
    INTERNAL_MAP.removedBuilding.splice(map._rmvBuildingIdx, 1);
  }

  INTERNAL_MAP.loadedMaps.delete(mapId);

  if (samp.defined && samp.defined._colandreas_included) {
    try {
      const require =
        typeof global.require !== "undefined"
          ? global.require
          : createRequire(import.meta.url);
      const colandreas: typeof import("@infernus/colandreas") = require("@infernus/colandreas");
      removedBuilding.forEach((rmv) => {
        colandreas.restoreBuilding(...rmv);
      });
    } catch {
      /* empty */
    }
  }

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

export function getMapCount() {
  return INTERNAL_MAP.loadedMaps.size;
}

export function getMapIDFromObject(obj: DynamicObject) {
  const mapInfo = INTERNAL_MAP.loadedMaps
    .entries()
    .find(([, item]) => item.objects.find((target) => target === obj));
  if (!mapInfo) return INVALID_MAP_ID;
  return mapInfo[0];
}

export function getMapInfoFromID(id: number) {
  return INTERNAL_MAP.loadedMaps.get(id);
}

export { mapConverter } from "./converter";
export { mapExporter } from "./exporter";
export { INVALID_MAP_ID };
export * from "./interfaces";
