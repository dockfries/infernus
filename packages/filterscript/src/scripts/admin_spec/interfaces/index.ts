import type { IFilterScript } from "@infernus/core";
import type { ICommonOptions } from "filterscript/interfaces";

export interface IAdminSpecOptions extends ICommonOptions {
  command?: {
    player?: string;
    vehicle?: string;
    off?: string;
  };
}

export interface IAdminSpecFS extends IFilterScript {
  load(options: IAdminSpecOptions): ReturnType<IFilterScript["load"]>;
}
