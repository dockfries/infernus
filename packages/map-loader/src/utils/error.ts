export class MapLoaderError extends Error {
  constructor(
    public readonly context: {
      type?: string;
      msg?: string;
      source?: string;
      details?: string;
    },
  ) {
    super(`[MapLoader] ${JSON.stringify(context)}`);
  }
}

export function ensureLength(
  type: string,
  details: unknown,
  minLength: number,
  length: number,
) {
  if (length < minLength) {
    throw new MapLoaderError({
      type,
      msg: `Expected ${minLength} elements, got ${length}`,
      details: JSON.stringify(details),
    });
  }
}
