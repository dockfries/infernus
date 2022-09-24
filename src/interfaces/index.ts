import { BasePlayer } from "@/controllers/player";
import { MapIconStyles } from "omp-wrapper-streamer";
import { DialogStylesEnum } from "../enums";
import {
  TDynamicAreaTypes,
  TEventFunc,
  TEventName,
  TStreamerExtendable,
} from "../types";

export interface ICmd {
  name: TEventName;
  fn: TEventFunc;
}

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

export interface ILocale {
  label: string;
  value: { [key: string]: any };
}

export interface ICmdErr {
  code: number;
  msg: string;
}

export interface IPlayerSettings {
  locale?: string | number;
  charset: string;
}

export interface IVehicle {
  modelid: number;
  x: number;
  y: number;
  z: number;
  z_angle: number;
  color1: string;
  color2: string;
  respawn_delay?: number;
  addsiren?: boolean;
}

export interface IAnimateInfo {
  n: string;
  d: number;
}

export interface IBaseGangZone<P extends BasePlayer> {
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

export interface IBaseTextDraw<P extends BasePlayer> {
  player?: P;
  x: number;
  y: number;
  text: string;
}

export interface IDialogFuncQueue {
  resolve: (value: IDialogResRaw | PromiseLike<IDialogResRaw>) => void;
  reject: (reason: string) => void;
}

export interface IDynamicBase {
  worldid?: TStreamerExtendable;
  interiorid?: TStreamerExtendable;
  playerid?: TStreamerExtendable;
  extended?: boolean;
}

export interface IDynamicCommon extends IDynamicBase {
  x: number;
  y: number;
  z: number;
  areaid?: TStreamerExtendable;
  streamdistance?: number;
  priority?: number;
}

export interface IDynamicMapIcon extends IDynamicCommon {
  type: number;
  color: string;
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
  charset: string;
  text: string;
  color: string;
  attachedplayer?: number;
  attachedvehicle?: number;
  testlos?: boolean;
  drawdistance: number;
}

export interface IDynamicObject extends IDynamicCommon {
  charset: string;
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

export interface IDynamicCircleBase extends IDynamicBase {
  x: number;
  y: number;
  size: number;
}

export interface IDynamicCircle extends IDynamicCircleBase {
  type: "circle";
}

export interface IDynamicCylinder extends IDynamicCircleBase {
  type: "cylinder";
  minz: number;
  maxz: number;
}

export interface IDynamicSphere extends IDynamicCircleBase {
  type: "sphere";
  z: number;
}

export interface IDynamicRectangleBase extends IDynamicBase {
  minx: number;
  miny: number;
  maxx: number;
  maxy: number;
}

export interface IDynamicRectangle extends IDynamicRectangleBase {
  type: "rectangle";
}

export interface IDynamicCuboid extends IDynamicRectangleBase {
  type: "cuboid";
  minz: number;
  maxz: number;
}

export interface IDynamicPolygon extends IDynamicBase {
  type: "polygon";
  points: number[];
  minz: number;
  maxz: number;
}

export interface IDynamicAreaKey {
  id: number;
  type: TDynamicAreaTypes;
}
