import type { IFilterScript } from "@infernus/core";

export interface IStuntIsLandFSOptions {
  enableFlip?: boolean;
}

export interface IStuntIsLandFS extends IFilterScript {
  load(options?: IStuntIsLandFSOptions): ReturnType<IFilterScript["load"]>;
}
