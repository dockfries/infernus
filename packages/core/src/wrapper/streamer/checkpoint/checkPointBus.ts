import { EventBus } from "core/utils/eventBus";

export enum checkPointHooks {
  created = "OnCheckPointCreate",
  destroyed = "OnCheckPointDestroy",
}

export const checkPointBus = new EventBus();
