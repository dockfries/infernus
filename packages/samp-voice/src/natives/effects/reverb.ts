import { SampVoiceEffect } from "../effect";

export class ReverbEffect extends SampVoiceEffect {
  constructor(
    priority: number,
    inGain: number,
    reverbMix: number,
    reverbTime: number,
    highFreqRtRatio: number,
  ) {
    const ptr = samp.callNative(
      "SvEffectCreateReverb",
      "iffff",
      priority,
      inGain,
      reverbMix,
      reverbTime,
      highFreqRtRatio,
    );
    super(ptr);
  }
}
