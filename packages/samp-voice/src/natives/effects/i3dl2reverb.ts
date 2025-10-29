import { SampVoiceEffect } from "../effect";

export class I3dl2reverbEffect extends SampVoiceEffect {
  constructor(
    priority: number,
    room: number,
    roomHf: number,
    roomRollOffFactor: number,
    decayTime: number,
    decayHFratio: number,
    reflections: number,
    reflectionsDelay: number,
    reverb: number,
    reverbDelay: number,
    diffusion: number,
    density: number,
    hfReference: number,
  ) {
    const ptr = samp.callNative(
      "SvEffectCreateI3dl2reverb",
      "iiifffififfff",
      priority,
      room,
      roomHf,
      roomRollOffFactor,
      decayTime,
      decayHFratio,
      reflections,
      reflectionsDelay,
      reverb,
      reverbDelay,
      diffusion,
      density,
      hfReference,
    );
    super(ptr);
  }
}
