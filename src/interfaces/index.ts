import { BasePlayer } from "@/controllers/player";
import { MapIconStyles } from "omp-wrapper-streamer";
import { DialogStylesEnum } from "../enums";
import { TEventFunc, TEventName, TStreamerExtendable } from "../types";

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
  locale?: string;
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

export interface IBaseGangZone {
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

export interface IDynamicCommon {
  x: number;
  y: number;
  z: number;
  streamdistance?: number;
  worldid?: TStreamerExtendable;
  interiorid?: TStreamerExtendable;
  playerid?: TStreamerExtendable;
  areaid?: TStreamerExtendable;
  priority?: number;
  extended?: boolean;
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
