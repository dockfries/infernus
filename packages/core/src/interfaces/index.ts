import type { Player } from "core/controllers/player";
import type { MapIconStyles } from "@infernus/streamer";
import type { DialogStylesEnum } from "../enums";
import type { TDynamicAreaTypes, TStreamerExtendable } from "../types";

export interface IDialog {
  style?: DialogStylesEnum;
  caption?: string;
  info?: string;
  button1?: string;
  button2?: string;
}

export interface IDialogResCommon {
  response: number;
  listitem: number;
}

export interface IDialogResRaw extends IDialogResCommon {
  inputbuf: number[];
}

export interface IDialogResResult extends IDialogResCommon {
  inputtext: string;
}

export interface ICmdErr {
  code: number;
  msg: string;
}

export interface IVehicle {
  modelid: number;
  x: number;
  y: number;
  z: number;
  z_angle: number;
  colour1: string | number;
  colour2: string | number;
  respawn_delay?: number;
  addsiren?: boolean;
}

export interface IAnimateInfo {
  n: string;
  d: number;
}

export interface IGangZone<P extends Player> {
  player?: P;
  minx: number;
  miny: number;
  maxx: number;
  maxy: number;
}

export interface ICommonTextDrawKey {
  id: number;
  global: boolean;
}

export interface ITextDraw<P extends Player> {
  player?: P;
  x: number;
  y: number;
  text: string;
}

export interface IDialogFuncQueue {
  showId: number;
  resolve: (value: IDialogResRaw | PromiseLike<IDialogResRaw>) => void;
  reject: (reason: string) => void;
}

export interface IDynamic {
  worldid?: TStreamerExtendable;
  interiorid?: TStreamerExtendable;
  playerid?: TStreamerExtendable;
  extended?: boolean;
}

export interface IDynamicCommon extends IDynamic {
  x: number;
  y: number;
  z: number;
  areaid?: TStreamerExtendable;
  streamdistance?: number;
  priority?: number;
}

export interface IDynamicMapIcon extends IDynamicCommon {
  type: number;
  colour: string | number;
  style?: MapIconStyles;
}

export interface IDynamicPickup extends IDynamicCommon {
  type: number;
  modelid: number;
}

export interface IDynamicCheckPoint extends IDynamicCommon {
  size: number;
}

export interface IDynamicRaceCp extends IDynamicCheckPoint {
  type: number;
  nextx: number;
  nexty: number;
  nextz: number;
}

export interface IDynamicActor extends IDynamicCommon {
  r: number;
  modelid: number;
  invulnerable: boolean;
  health: number;
}

export interface IDynamic3DTextLabel extends IDynamicCommon {
  charset?: string;
  text: string;
  colour: string | number;
  attachedplayer?: number;
  attachedvehicle?: number;
  testlos?: boolean;
  drawdistance: number;
}

export interface IDynamicObject extends IDynamicCommon {
  charset?: string;
  modelid: number;
  rx: number;
  ry: number;
  rz: number;
  drawdistance?: number;
}

export interface IClientResRaw {
  actionid: number;
  memaddr: number;
  retndata: number;
}

export interface IClientFuncQueue {
  resolve: (value: IClientResRaw | PromiseLike<IClientResRaw>) => void;
  reject: (reason: string) => void;
  timeout: NodeJS.Timeout;
}

export interface ICommonGangZoneKey {
  id: number;
  global: boolean;
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
  minz: number;
  maxz: number;
}

export interface IDynamicSphere extends IDynamicCircleCommon {
  type: "sphere";
  z: number;
}

export interface IDynamicRectangleCommon extends IDynamic {
  minx: number;
  miny: number;
  maxx: number;
  maxy: number;
}

export interface IDynamicRectangle extends IDynamicRectangleCommon {
  type: "rectangle";
}

export interface IDynamicCuboid extends IDynamicRectangleCommon {
  type: "cuboid";
  minz: number;
  maxz: number;
}

export interface IDynamicPolygon extends IDynamic {
  type: "polygon";
  points: number[];
  minz: number;
  maxz: number;
}

export interface IDynamicAreaKey {
  id: number;
  type: TDynamicAreaTypes;
}

export {
  IObjectPos,
  IObjectRotPos,
  IAttachedObject,
  IMaterial,
  IMaterialText,
  IAttachedData,
  IActorSpawn,
  IActorAnimation,
  IPlayerClass,
  GangZonePos,
  IBounds,
  ICheckPoint,
  IRaceCheckPoint,
  IOffsets,
  IQuat,
  ITextDrawCommonSize,
  ITextDrawRot,
  IVehColor,
  IVehSpawnInfo,
  IVehMatrix,
} from "@infernus/wrapper";

export interface IFilterScript {
  name: string;
  load: (...args: Array<any>) => any;
  unload: () => any;
  [propName: string | number | symbol]: any;
}
