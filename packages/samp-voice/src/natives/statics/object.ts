import { SampVoiceLocalStream } from "../local";
import { SV_NULL } from "../../constants";

export class StaticLocalObjectStream extends SampVoiceLocalStream {
  constructor(
    distance: number,
    objectId: number,
    color: number = SV_NULL,
    name: string,
  ) {
    const ptr = samp.callNative(
      "SvCreateSLStreamAtObject",
      "fiis",
      distance,
      objectId,
      color,
      name,
    );
    super(ptr, StaticLocalObjectStream.name);
  }

  static getInstance(ptr: number) {
    return super.getInstance(ptr) as StaticLocalObjectStream;
  }

  static getInstances() {
    return super.getInstances(
      StaticLocalObjectStream.name,
    ) as StaticLocalObjectStream[];
  }
}
