import { EventBus } from "core/utils/eventBus";

export enum vehicleHooks {
  created = "OnVehicleCreate",
  destroyed = "OnVehicleDestroy",
}

export const vehicleBus = new EventBus();
