import { SampVoiceEffect } from "../effect";

export class ParamEqEffect extends SampVoiceEffect {
  constructor(
    priority: number,
    center: number,
    bandwidth: number,
    gain: number,
  ) {
    const ptr = samp.callNative(
      "SvEffectCreateParameq",
      "ifff",
      priority,
      center,
      bandwidth,
      gain,
    );
    super(ptr);
  }
}
