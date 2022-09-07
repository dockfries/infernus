import EventBus from "@/utils/EventBus";

export enum menuHooks {
  created = "OnMenuCreate",
  destroyed = "OnMenuDestroy",
}

export const menuBus = new EventBus();
