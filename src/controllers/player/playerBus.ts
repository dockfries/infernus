import { EventBus } from "@/utils/eventBus";

export enum playerHooks {
  pause = "OnPlayerPause",
  create = "OnPlayerEventCreate",
}

export const playerBus = new EventBus();
