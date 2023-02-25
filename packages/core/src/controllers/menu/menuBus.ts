import { EventBus } from "@/utils/eventBus";

export enum menuHooks {
  created = "OnMenuCreate",
  destroyed = "OnMenuDestroy",
}

export const menuBus = new EventBus();
