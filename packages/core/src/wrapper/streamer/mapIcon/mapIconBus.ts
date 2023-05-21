import { EventBus } from "core/utils/eventBus";

export enum mapIconHooks {
  created = "OnMapIconCreate",
  destroyed = "OnMapIconDestroy",
}

export const mapIconBus = new EventBus();
