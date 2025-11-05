export * from "../wrapper/native/interfaces";

import type { MapIconStyles } from "@infernus/streamer";
import type { DialogStylesEnum } from "../enums";
import type { TDynamicAreaTypes, TStreamerExtendable } from "../types";
import type { Player } from "../components/player/entity";
import type { Vehicle } from "../components/vehicle/entity";

export interface IDialog {
  style?: DialogStylesEnum;
  caption?: string;
  info?: string;
  button1?: string;
  button2?: string;
}

export interface IDialogResCommon {
  buffer: number[];
  inputText: string;
  response: number;
  listItem: number;
}

export interface IVehicle {
  modelId: number;
  x: number;
  y: number;
  z: number;
  zAngle: number;
  color: [string | number, string | number];
  respawnDelay?: number;
  addSiren?: boolean;
}

export interface IAnimateInfo {
  n: string;
  d: number;
}

export interface IGangZone {
  player?: Player;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface ICommonTextDrawKey {
  id: number;
  global: boolean;
}

export interface ITextDraw {
  player?: Player;
  x: number;
  y: number;
  text: string;
  charset?: string;
}

export interface IDialogFuncQueue {
  showId: number;
  resolve: (value: IDialogResCommon | PromiseLike<IDialogResCommon>) => void;
  reject: (reason: string) => void;
}

export interface IDynamic {
  worldId?: TStreamerExtendable;
  interiorId?: TStreamerExtendable;
  playerId?: TStreamerExtendable;
  extended?: boolean;
  priority?: number;
}

export interface IDynamicCommon extends IDynamic {
  x: number;
  y: number;
  z: number;
  areaId?: TStreamerExtendable;
  streamDistance?: number;
}

export interface IDynamicMapIcon extends IDynamicCommon {
  type: number;
  color: string | number;
  style?: MapIconStyles;
}

export interface IDynamicPickup extends IDynamicCommon {
  type: number;
  modelId: number;
}

export interface IDynamicCheckPoint extends IDynamicCommon {
  size: number;
}

export interface IDynamicRaceCp extends IDynamicCheckPoint {
  type: number;
  nextX: number;
  nextY: number;
  nextZ: number;
}

export interface IDynamicActor extends IDynamicCommon {
  r: number;
  modelId: number;
  invulnerable: boolean;
  health: number;
}

export interface IDynamic3DTextLabel extends IDynamicCommon {
  charset?: string;
  text: string;
  color: string | number;
  attachedPlayer?: number;
  attachedVehicle?: number;
  testLOS?: boolean;
  drawDistance: number;
}

export interface IDynamicObject extends IDynamicCommon {
  charset?: string;
  modelId: number;
  rx: number;
  ry: number;
  rz: number;
  drawDistance?: number;
}

export interface IClientResRaw {
  actionId: number;
  memAddr: number;
  data: number;
}

export interface IDynamicCircleCommon extends IDynamic {
  x: number;
  y: number;
  size: number;
}

export interface IDynamicCircle extends IDynamicCircleCommon {
  type: "circle";
}

export interface IDynamicCylinder extends IDynamicCircleCommon {
  type: "cylinder";
  minZ: number;
  maxZ: number;
}

export interface IDynamicSphere extends IDynamicCircleCommon {
  type: "sphere";
  z: number;
}

export interface IDynamicRectangleCommon extends IDynamic {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface IDynamicRectangle extends IDynamicRectangleCommon {
  type: "rectangle";
}

export interface IDynamicCuboid extends IDynamicRectangleCommon {
  type: "cuboid";
  minZ: number;
  maxZ: number;
}

export interface IDynamicPolygon extends IDynamic {
  type: "polygon";
  points: number[];
  minZ: number;
  maxZ: number;
}

export interface IDynamicAreaKey {
  id: number;
  type: TDynamicAreaTypes;
}

export interface IFilterScript {
  name: string;
  load: (...args: Array<any>) => Array<() => void> | Promise<Array<() => void>>;
  unload: () => any;
  [propName: string | number | symbol]: any;
}

export interface ICommonRetVal {
  ret: number;
}

export interface IObjectMp {
  modelId: number;
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  drawDistance?: number;
  charset?: string;
  player?: Player;
}

export interface IActor {
  skin: number;
  x: number;
  y: number;
  z: number;
  rotation: number;
}

export interface IPickup {
  model: number;
  type: number;
  x: number;
  y: number;
  z: number;
  virtualWorld: number;
  isStatic?: boolean;
}

export interface IInnerPlayerProps {
  isAndroid: boolean;
  lastDrunkLevel: number;
  lastFps: number;
  lastUpdateTick: number;
  lastUpdateFpsTick: number;
  isPaused: boolean;
  isRecording: boolean;
}

export interface ITextLabel {
  text: string;
  color: string | number;
  x: number;
  y: number;
  z: number;
  drawDistance: number;
  virtualWorld: number;
  testLOS: boolean;
  charset?: string;
  player?: Player;
  attachedPlayer?: Player;
  attachedVehicle?: Vehicle;
}

export interface IClassInjections {
  __inject__: Record<string, (...args: any[]) => any>;
}
