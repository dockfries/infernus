import type { IFilterScript } from "@infernus/core";

export interface IModularIsLandFSOptions {
  enableCommand?: boolean;
}

export interface IModularIsLandFS extends IFilterScript {
  load(options?: IModularIsLandFSOptions): ReturnType<IFilterScript["load"]>;
}
