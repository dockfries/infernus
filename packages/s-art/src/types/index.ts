import type { IDynamicObject } from "@infernus/core";

export interface IArtType {
  modelId: number;
  ws: number;
  hs: number;
}

export interface CreateArtParams {
  image: string | Buffer;
  type: number;
  pos: [number, number, number];
  rot: [number, number, number];
  worldId?: IDynamicObject["worldId"];
  interiorId?: IDynamicObject["interiorId"];
  playerId?: IDynamicObject["playerId"];
  streamDistance?: IDynamicObject["streamDistance"];
  drawDistance?: IDynamicObject["drawDistance"];
  resize?: { width: number; height: number };
}
