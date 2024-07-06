import type { IFilterScript } from "@infernus/core";

export interface IGlActionsFSOptions {
  useBedAnim?: boolean;
}

export interface IGlActionsFS extends IFilterScript {
  load(options?: IGlActionsFSOptions): ReturnType<IFilterScript["load"]>;
}
