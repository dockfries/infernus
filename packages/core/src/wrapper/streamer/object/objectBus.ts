import { EventBus } from "core/utils/eventBus";

export enum objectHooks {
  created = "OnObjectCreate",
  destroyed = "OnObjectDestroy",
}

export const objectBus = new EventBus();
