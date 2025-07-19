import type { DynamicObject, Player } from "@infernus/core";

export type RemoveBuildingArgs = Array<
  Parameters<InstanceType<typeof Player>["removeBuilding"]>
>;

export interface IMapLoadOptions {
  source: string | ((done: () => void) => Promise<string[]>);
  xOffset?: number;
  yOffset?: number;
  zOffset?: number;
  playerId?: number | number[];
  worldId?: number | number[];
  areaId?: number | number[];
  interiorId?: number | number[];
  priority?: number;
  streamDistance?: number;
  drawDistance?: number;
  overwrite?: boolean;
  charset?: string;
  // if someone wanna use Colandreas maybe useful?
  afterRemoveBuilding?: (removeBuilding: RemoveBuildingArgs) => void;
}

export interface IMapInfo {
  options: IMapLoadOptions;
  objects: DynamicObject[];
  removeBuildingIdx: number;
}

export interface InternalMapConfig {
  removeBuilding: RemoveBuildingArgs[];
  loadedMaps: Map<number, IMapInfo>;
}
