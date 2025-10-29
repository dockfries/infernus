import { SampVoiceEffect } from "../effect";

export class FlangerEffect extends SampVoiceEffect {
  constructor(
    priority: number,
    wetDryMix: number,
    depth: number,
    feedback: number,
    frequency: number,
    waveform: number,
    delay: number,
    phase: number,
  ) {
    const ptr = samp.callNative(
      "SvEffectCreateFlanger",
      "iffffifi",
      priority,
      wetDryMix,
      depth,
      feedback,
      frequency,
      waveform,
      delay,
      phase,
    );
    super(ptr);
  }
}
