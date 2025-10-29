import { SampVoiceLocalStream } from "../local";
import { SV_NULL } from "../../constants";

export class DynamicLocalObjectStream extends SampVoiceLocalStream {
  constructor(
    distance: number,
    maxPlayers: number,
    objectId: number,
    color: number = SV_NULL,
    name: string,
  ) {
    const ptr = samp.callNative(
      "SvCreateDLStreamAtObject",
      "fiiis",
      distance,
      maxPlayers,
      objectId,
      color,
      name,
    );
    super(ptr, DynamicLocalObjectStream.name);
  }

  static getInstance(ptr: number) {
    return super.getInstance(ptr) as DynamicLocalObjectStream;
  }

  static getInstances() {
    return super.getInstances(
      DynamicLocalObjectStream.name,
    ) as DynamicLocalObjectStream[];
  }
}
