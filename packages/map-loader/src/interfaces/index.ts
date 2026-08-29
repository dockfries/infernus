import type { DynamicObject, IDynamicObject, Player } from "@infernus/core";

export type RemoveBuildingArgs = Array<Parameters<InstanceType<typeof Player>["removeBuilding"]>>;

export interface IMapLoadOptions {
  source: string | ((done: () => void) => Promise<string[]>);
  xOffset?: number;
  yOffset?: number;
  zOffset?: number;
  playerId?: IDynamicObject["playerId"];
  worldId?: IDynamicObject["worldId"];
  areaId?: IDynamicObject["areaId"];
  interiorId?: IDynamicObject["interiorId"];
  priority?: number;
  streamDistance?: number;
  drawDistance?: number;
  overwrite?: boolean;
  charset?: string;
  extended?: IDynamicObject["extended"];
  // if someone wanna use Colandreas maybe useful?
  onLoaded?: (objects: DynamicObject[], removedBuilding: RemoveBuildingArgs) => void;
  onUnloaded?: (removedBuilding: RemoveBuildingArgs) => void;
}

export interface IMapInfo {
  options: IMapLoadOptions;
  objects: DynamicObject[];
  _rmvBuildingIdx: number;
}

export interface InternalMapConfig {
  removedBuilding: RemoveBuildingArgs[];
  loadedMaps: Map<number, IMapInfo>;
}

export interface IMapExporterOptions {
  output: string;
  removeOutput?: boolean;
}

export interface IMapConverterOptions extends IMapExporterOptions {
  input: string;
}
