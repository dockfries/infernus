import { EventBus } from "@/utils/eventBus";

export enum checkPointHooks {
  created = "OnCheckPointCreate",
  destroyed = "OnCheckPointDestroy",
}

export const checkPointBus = new EventBus();
