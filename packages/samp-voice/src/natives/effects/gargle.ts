import { SampVoiceEffect } from "../effect";

export class GargleEffect extends SampVoiceEffect {
  constructor(priority: number, rateHz: number, waveShape: number) {
    const ptr = samp.callNative(
      "SvEffectCreateGargle",
      "iii",
      priority,
      rateHz,
      waveShape,
    );
    super(ptr);
  }
}
