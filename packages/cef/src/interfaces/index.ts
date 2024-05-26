import type { Player } from "@infernus/core";

export interface CefCommonOptions {
  player: Player | number;
  browserId?: number;
  url: string;
}

export interface CefOptions extends CefCommonOptions {
  hidden: boolean;
  focused: boolean;
}

export interface CefExtOptions extends CefCommonOptions {
  texture: string;
  scale: number;
}
