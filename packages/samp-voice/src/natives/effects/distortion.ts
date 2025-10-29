import { SampVoiceEffect } from "../effect";

export class DistortionEffect extends SampVoiceEffect {
  constructor(
    priority: number,
    gain: number,
    edge: number,
    postEQCenterFrequency: number,
    postEQBandwidth: number,
    preLowpassCutoff: number,
  ) {
    const ptr = samp.callNative(
      "SvEffectCreateDistortion",
      "ifffff",
      priority,
      gain,
      edge,
      postEQCenterFrequency,
      postEQBandwidth,
      preLowpassCutoff,
    );
    super(ptr);
  }
}
