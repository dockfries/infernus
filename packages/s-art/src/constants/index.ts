import type { IArtType } from "../types";

export const ART_TYPES: Record<number, IArtType> = {
  0: { modelId: 19464, ws: 5.875, hs: 5.075 },
  1: { modelId: 19372, ws: 3.18, hs: 3.48 },
  2: { modelId: 2814, ws: 0.51, hs: 0.51 },
  3: { modelId: 18887, ws: 1.48, hs: 1.48 },
};

export const ART_CHUNK = 15;
export const MAX_ART_BLOCKS = 1000;
export const INVALID_ART_ID = -1;
export const MAX_ART_ID = 65536;
