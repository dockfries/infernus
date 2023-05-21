import { EventBus } from "core/utils/eventBus";

export enum actorHooks {
  created = "OnActorCreate",
  destroyed = "OnActorDestroy",
}

export const actorBus = new EventBus();
