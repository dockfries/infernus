import type { Player } from "@infernus/core";

export interface CefCommonOptions {
  player: Player;
  url: string;
  width?: number;
  height?: number;
}

export interface CefBrowserOptions extends CefCommonOptions {
  type: "2dPlayer";
  focused: boolean;
  controlsChat?: boolean;
}

export interface CefWorldBrowserOptions extends CefCommonOptions {
  type: "3dWorld";
  textureName: string;
}

export interface CefWorld2DBrowserOptions extends CefCommonOptions {
  type: "2dWorld";
  worldX: number;
  worldY: number;
  worldZ: number;
  offsetZ?: number;
  pivotX?: number;
  pivotY?: number;
}

export type CefBrowserSourceInfo =
  | CefBrowserOptions
  | CefWorldBrowserOptions
  | CefWorld2DBrowserOptions;
