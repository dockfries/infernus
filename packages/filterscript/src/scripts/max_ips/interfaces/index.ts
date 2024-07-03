import type { IFilterScript } from "@infernus/core";

export interface IMaxIpsOptions {
  maxConnections?: number;
}

export interface IMaxIpsFS extends IFilterScript {
  load(options?: IMaxIpsOptions): ReturnType<IFilterScript["load"]>;
}
