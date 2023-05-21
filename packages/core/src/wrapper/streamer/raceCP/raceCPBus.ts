import { EventBus } from "core/utils/eventBus";

export enum raceCPHooks {
  created = "OnRaceCPCreate",
  destroyed = "OnRaceCPDestroy",
}

export const raceCPBus = new EventBus();
