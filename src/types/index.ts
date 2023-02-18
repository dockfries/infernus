import {
  IDynamicCircle,
  IDynamicCylinder,
  IDynamicSphere,
  IDynamicRectangle,
  IDynamicCuboid,
  IDynamicPolygon,
} from "@/interfaces";

export type TEventName = string | string[];
export type TEventFunc<EventInstance, P> = (
  this: EventInstance,
  player: P,
  ...args: string[]
) => boolean | number | void | Promise<boolean | number | void>;

export type TLocales = Record<string, Record<string, any>>;

export type TBasePos = {
  x: number;
  y: number;
  z: number;
};

export type TStreamerExtendable = number | number[];

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

export type TCommonCallback = number | boolean | Promise<number | boolean>;

export type {
  StreamerArrayData,
  StreamerItemTypeTuple,
} from "omp-wrapper-streamer";
