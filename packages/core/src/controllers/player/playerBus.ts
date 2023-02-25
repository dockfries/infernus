import { EventBus } from "@/utils/eventBus";

export enum playerHooks {
  pause = "OnPlayerPause",
  create = "OnPlayerEventCreate",
  setCommonProp = "OnPlayerSetCommonProp",
}

export const playerBus = new EventBus();
