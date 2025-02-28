import type { Player } from "core/controllers/player/entity";
import type {
  IDynamicCircle,
  IDynamicCylinder,
  IDynamicSphere,
  IDynamicRectangle,
  IDynamicCuboid,
  IDynamicPolygon,
} from "core/interfaces";

export type TEventName = string | string[];
export type TEventFunc<EventInstance> = (
  this: EventInstance,
  player: Player,
  ...args: string[]
) => boolean | number | void | Promise<boolean | number | void>;

export type TLocales = Record<string, Record<string, any>>;

export type TPos = {
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
} from "@infernus/streamer";

export type THookFuncNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export type THookInterceptor<
  T extends new (...args: any[]) => any,
  K extends THookFuncNames<InstanceType<T>>,
> = InstanceType<T>[K] extends (...args: infer A) => infer R
  ? (this: InstanceType<T>, next: (...args: A) => R, ...args: A) => R
  : never;
