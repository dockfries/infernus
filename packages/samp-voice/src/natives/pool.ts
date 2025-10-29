import { GameMode } from "@infernus/core";
import type { SampVoiceStream } from "./stream";
import { SampVoiceEffect } from "./effect";

export const streamPools = new Map<number, SampVoiceStream>();
export const effectPools = new Map<number, SampVoiceEffect>();

GameMode.onExit(({ next }) => {
  streamPools.clear();
  effectPools.clear();
  return next();
});
