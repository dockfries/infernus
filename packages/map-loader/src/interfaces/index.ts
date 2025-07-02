import type { DynamicObject, Player } from "@infernus/core";

export interface InternalMapConfig {
  rmvs: Array<
    Array<Parameters<InstanceType<typeof Player>["removeBuilding"]>[]>
  >;
  uniqId: number;
  loadedMaps: Map<number, IMapInfo>;
}

export interface IMapInfo {
  filePath: string;
  objects: DynamicObject[];
  rmvIdx: number;
}

export interface IMapLoadOptions {
  filePath: string;
  xOffset?: number;
  yOffset?: number;
  zOffset?: number;
  worldId?: number | number[];
  areaId?: number | number[];
  // if someone wanna use Colandreas maybe useful?
  removeBuilding: (rmvs: InternalMapConfig["rmvs"][0]) => void;
}
