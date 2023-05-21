import { EventBus } from "core/utils/eventBus";

export enum areaHooks {
  created = "OnAreaCreate",
  destroyed = "OnAreaDestroy",
}

export const areaBus = new EventBus();
