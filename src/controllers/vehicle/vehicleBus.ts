import { EventBus } from "@/utils/eventBus";

export enum vehicleHooks {
  created = "OnVehicleCreate",
  destroyed = "OnVehicleDestroy",
}

export const vehicleBus = new EventBus();
