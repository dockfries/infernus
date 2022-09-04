import EventBus from "@/utils/EventBus";

export enum vehicleHooks {
  created = "OnVehicleCreate",
  destroyed = "OnVehicleDestroy",
}

export const vehicleBus = new EventBus();
