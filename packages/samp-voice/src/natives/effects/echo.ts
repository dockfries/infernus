import { SampVoiceEffect } from "../effect";

export class EchoEffect extends SampVoiceEffect {
  constructor(
    priority: number,
    wetDryMix: number,
    feedback: number,
    leftDelay: number,
    rightDelay: number,
    panDelay: boolean,
  ) {
    const ptr = samp.callNative(
      "SvEffectCreateEcho",
      "iffffi",
      priority,
      wetDryMix,
      feedback,
      leftDelay,
      rightDelay,
      +panDelay,
    );
    super(ptr);
  }
}
