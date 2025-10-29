import { SV_NULL } from "../../constants";
import { SampVoiceLocalStream } from "../local";

export class StaticLocalPointStream extends SampVoiceLocalStream {
  constructor(
    distance: number,
    posX: number,
    posY: number,
    posZ: number,
    color: number = SV_NULL,
    name: string,
  ) {
    const ptr = samp.callNative(
      "SvCreateSLStreamAtPoint",
      "ffffis",
      distance,
      posX,
      posY,
      posZ,
      color,
      name,
    );
    super(ptr, StaticLocalPointStream.name);
  }

  static getInstance(ptr: number) {
    return super.getInstance(ptr) as StaticLocalPointStream;
  }

  static getInstances() {
    return super.getInstances(
      StaticLocalPointStream.name,
    ) as StaticLocalPointStream[];
  }
}
