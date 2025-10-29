import type { Vehicle } from "@infernus/core";
import { SampVoiceLocalStream } from "../local";
import { SV_NULL } from "../../constants";

export class DynamicLocalVehicleStream extends SampVoiceLocalStream {
  constructor(
    distance: number,
    maxPlayers: number,
    vehicle: Vehicle,
    color: number = SV_NULL,
    name: string,
  ) {
    const ptr = samp.callNative(
      "SvCreateDLStreamAtVehicle",
      "fiiis",
      distance,
      maxPlayers,
      vehicle.id,
      color,
      name,
    );
    super(ptr, DynamicLocalVehicleStream.name);
  }

  static getInstance(ptr: number) {
    return super.getInstance(ptr) as DynamicLocalVehicleStream;
  }

  static getInstances() {
    return super.getInstances(
      DynamicLocalVehicleStream.name,
    ) as DynamicLocalVehicleStream[];
  }
}
