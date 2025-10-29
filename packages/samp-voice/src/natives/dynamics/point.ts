import { SV_NULL } from "../../constants";
import { SampVoiceLocalStream } from "../local";

export class DynamicLocalPointStream extends SampVoiceLocalStream {
  constructor(
    distance: number,
    maxPlayers: number,
    posX: number,
    posY: number,
    posZ: number,
    color: number = SV_NULL,
    name: string,
  ) {
    const ptr = samp.callNative(
      "SvCreateDLStreamAtPoint",
      "fifffis",
      distance,
      maxPlayers,
      posX,
      posY,
      posZ,
      color,
      name,
    );
    super(ptr, DynamicLocalPointStream.name);
  }

  static getInstance(ptr: number) {
    return super.getInstance(ptr) as DynamicLocalPointStream;
  }

  static getInstances() {
    return super.getInstances(
      DynamicLocalPointStream.name,
    ) as DynamicLocalPointStream[];
  }
}
