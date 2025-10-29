import type { Player } from "@infernus/core";
import { SampVoiceLocalStream } from "../local";
import { SV_NULL } from "../../constants";

export class StaticLocalPlayerStream extends SampVoiceLocalStream {
  constructor(
    distance: number,
    player: Player,
    color: number = SV_NULL,
    name: string,
  ) {
    const ptr = samp.callNative(
      "SvCreateSLStreamAtPlayer",
      "fiis",
      distance,
      player.id,
      color,
      name,
    );
    super(ptr, StaticLocalPlayerStream.name);
  }

  static getInstance(ptr: number) {
    return super.getInstance(ptr) as StaticLocalPlayerStream;
  }

  static getInstances() {
    return super.getInstances(
      StaticLocalPlayerStream.name,
    ) as StaticLocalPlayerStream[];
  }
}
