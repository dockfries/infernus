import { EventBus } from "@/utils/eventBus";

export enum gangZoneHooks {
  created = "OnGangZoneCreate",
  destroyed = "OnGangZoneDestroy",
}

export const gangZoneBus = new EventBus();
