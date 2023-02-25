import { EventBus } from "@/utils/eventBus";

export enum mapIconHooks {
  created = "OnMapIconCreate",
  destroyed = "OnMapIconDestroy",
}

export const mapIconBus = new EventBus();
