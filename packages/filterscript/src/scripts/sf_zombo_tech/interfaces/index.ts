import type { IFilterScript } from "@infernus/core";

export interface ISFZomboTechFSOptions {
  enableCommand?: boolean;
}

export interface ISFZomboTechFS extends IFilterScript {
  load(options?: ISFZomboTechFSOptions): ReturnType<IFilterScript["load"]>;
}
