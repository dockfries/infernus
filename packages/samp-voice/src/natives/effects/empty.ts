import { SampVoiceEffect } from "../effect";

export class EmptyEffect extends SampVoiceEffect {
  constructor() {
    const ptr = samp.callNative("SvEffectCreate", "");
    super(ptr);
  }
}
