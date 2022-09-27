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
export type TEventFunc<P> = (
  player: P,
  ...args: string[]
) => boolean | number | void | Promise<boolean | number | void>;

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
