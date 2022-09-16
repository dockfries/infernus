import { EventBus } from "@/utils/eventBus";

export enum raceCPHooks {
  created = "OnRaceCPCreate",
  destroyed = "OnRaceCPDestroy",
}

export const raceCPBus = new EventBus();
