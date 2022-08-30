import { BasePlayer } from "@/controllers";
import { ILocale } from "@/interfaces";

export type EventName = string | string[];
export type EventFunc = <T extends BasePlayer>(
  this: T,
  ...args: string[]
) => any;

export type ILocales = Record<string, ILocale>;
