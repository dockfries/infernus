import { BasePlayer } from "@/controllers/player";
import { ILocale } from "@/interfaces";

export type TEventName = string | string[];
export type TEventFunc = <T extends BasePlayer>(
  this: T,
  ...args: string[]
) => any;

export type TLocales = Record<string, ILocale>;

export type TBasePos = {
  x: number;
  y: number;
  z: number;
};

export type TStreamerExtendable = number | number[];
