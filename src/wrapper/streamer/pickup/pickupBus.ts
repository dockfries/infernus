import { EventBus } from "@/utils/eventBus";

export enum pickupHooks {
  created = "OnPickupCreate",
  destroyed = "OnPickupDestroy",
}

export const pickupBus = new EventBus();
