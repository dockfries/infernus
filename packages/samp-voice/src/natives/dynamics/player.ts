import type { Player } from "@infernus/core";
import { SampVoiceLocalStream } from "../local";
import { SV_NULL } from "../../constants";

export class DynamicLocalPlayerStream extends SampVoiceLocalStream {
  constructor(
    distance: number,
    maxPlayers: number,
    player: Player,
    color: number = SV_NULL,
    name: string,
  ) {
    const ptr = samp.callNative(
      "SvCreateDLStreamAtPlayer",
      "fiiis",
      distance,
      maxPlayers,
      player.id,
      color,
      name,
    );
    super(ptr, DynamicLocalPlayerStream.name);
  }

  static getInstance(ptr: number) {
    return super.getInstance(ptr) as DynamicLocalPlayerStream;
  }

  static getInstances() {
    return super.getInstances(
      DynamicLocalPlayerStream.name,
    ) as DynamicLocalPlayerStream[];
  }
}
