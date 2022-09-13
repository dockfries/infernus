import { DialogStylesEnum } from "../enums";
import { EventFunc, EventName } from "../types";

export interface ICmd {
  name: EventName;
  fn: EventFunc;
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
  locale: string;
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
