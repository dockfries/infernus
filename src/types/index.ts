import { BasePlayer } from "@/controllers/player";
import {
  ILocale,
  IDynamicCircle,
  IDynamicCylinder,
  IDynamicSphere,
  IDynamicRectangle,
  IDynamicCuboid,
  IDynamicPolygon,
} from "@/interfaces";

export type TEventName = string | string[];
export type TEventFunc = <T extends BasePlayer>(
  this: T,
  ...args: string[]
) => boolean | number;

export type TLocales = Record<string | number, ILocale>;

export type TBasePos = {
  x: number;
  y: number;
  z: number;
};

export type TStreamerExtendable = number | number[];

export type TUsePlugin = (...args: Array<any>) => void;

export type TDynamicArea =
  | IDynamicCircle
  | IDynamicCylinder
  | IDynamicSphere
  | IDynamicRectangle
  | IDynamicCuboid
  | IDynamicPolygon;

export type TDynamicAreaTypes =
  | "circle"
  | "cylinder"
  | "sphere"
  | "rectangle"
  | "cuboid"
  | "polygon";
