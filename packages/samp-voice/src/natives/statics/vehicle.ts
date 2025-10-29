import type { Vehicle } from "@infernus/core";
import { SampVoiceLocalStream } from "../local";
import { SV_NULL } from "../../constants";

export class StaticLocalVehicleStream extends SampVoiceLocalStream {
  constructor(
    distance: number,
    vehicle: Vehicle,
    color: number = SV_NULL,
    name: string,
  ) {
    const ptr = samp.callNative(
      "SvCreateSLStreamAtVehicle",
      "fiis",
      distance,
      vehicle.id,
      color,
      name,
    );
    super(ptr, StaticLocalVehicleStream.name);
  }

  static getInstance(ptr: number) {
    return super.getInstance(ptr) as StaticLocalVehicleStream;
  }

  static getInstances() {
    return super.getInstances(
      StaticLocalVehicleStream.name,
    ) as StaticLocalVehicleStream[];
  }
}
