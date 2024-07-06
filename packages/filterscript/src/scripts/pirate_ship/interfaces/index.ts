import type { IFilterScript } from "@infernus/core";

export interface IPirateShipFsOptions {
  debug?: boolean;
}

export interface IPirateShipFS extends IFilterScript {
  load(options?: IPirateShipFsOptions): ReturnType<IFilterScript["load"]>;
}
