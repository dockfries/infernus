import type { IFilterScript } from "@infernus/core";

export interface ILSApartments1FSOptions {
  enableCommand?: boolean;
}

export interface ILSApartments1FS extends IFilterScript {
  load(options?: ILSApartments1FSOptions): ReturnType<IFilterScript["load"]>;
}
