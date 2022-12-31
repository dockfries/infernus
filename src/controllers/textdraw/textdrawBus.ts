import { EventBus } from "@/utils/eventBus";

export enum textDrawHooks {
  created = "OnTextDrawCreate",
  destroyed = "OnTextDrawDestroy",
}

export const textDrawBus = new EventBus();
