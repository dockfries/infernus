import { SampVoiceEffect } from "../effect";

export class CompressorEffect extends SampVoiceEffect {
  constructor(
    priority: number,
    gain: number,
    attack: number,
    release: number,
    threshold: number,
    ratio: number,
    preDelay: number,
  ) {
    const ptr = samp.callNative(
      "SvEffectCreateCompressor",
      "iffffff",
      priority,
      gain,
      attack,
      release,
      threshold,
      ratio,
      preDelay,
    );
    super(ptr);
  }
}
