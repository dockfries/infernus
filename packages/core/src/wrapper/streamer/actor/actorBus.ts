import { EventBus } from "@/utils/eventBus";

export enum actorHooks {
  created = "OnActorCreate",
  destroyed = "OnActorDestroy",
}

export const actorBus = new EventBus();
