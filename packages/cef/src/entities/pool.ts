import { Player } from "@infernus/core";
import { CefBrowser } from "./cef";

export const playerBrowserPool = new Map<Player, Map<number, CefBrowser>>();
