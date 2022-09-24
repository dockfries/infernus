import { EventBus } from "@/utils/eventBus";

export enum areaHooks {
  created = "OnAreaCreate",
  destroyed = "OnAreaDestroy",
}

export const areaBus = new EventBus();
