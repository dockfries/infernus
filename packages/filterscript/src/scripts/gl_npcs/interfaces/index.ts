import type { IFilterScript } from "@infernus/core";

export interface IGlNpcsOptions {
  test?: boolean;
}

export interface IGlNpcsFS extends IFilterScript {
  load(options?: IGlNpcsOptions): ReturnType<IFilterScript["load"]>;
}
