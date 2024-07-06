import type { IFilterScript } from "@infernus/core";

export interface IGlRealTimeFSOptions {
  updateWeather?: boolean;
}

export interface IGlRealTimeFS extends IFilterScript {
  load(options?: IGlRealTimeFSOptions): ReturnType<IFilterScript["load"]>;
}
