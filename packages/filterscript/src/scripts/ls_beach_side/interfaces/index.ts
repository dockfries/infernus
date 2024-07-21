import type { IFilterScript } from "@infernus/core";

export interface ILSBeachSideFSOptions {
  enableCommand?: boolean;
}

export interface ILSBeachSideFS extends IFilterScript {
  load(options?: ILSBeachSideFSOptions): ReturnType<IFilterScript["load"]>;
}
