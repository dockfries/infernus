import { EventBus } from "core/utils/eventBus";

export enum pickupHooks {
  created = "OnPickupCreate",
  destroyed = "OnPickupDestroy",
}

export const pickupBus = new EventBus();
