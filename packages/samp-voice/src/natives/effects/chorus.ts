import { SampVoiceEffect } from "../effect";

export class ChorusEffect extends SampVoiceEffect {
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
      "SvEffectCreateChorus",
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
