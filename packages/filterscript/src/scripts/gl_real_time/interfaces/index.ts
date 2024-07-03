import type { IFilterScript } from "@infernus/core";

export interface IGlRealTimeFsOptions {
  updateWeather?: boolean;
}

export interface IGlRealTimeFs extends IFilterScript {
  load(options?: IGlRealTimeFsOptions): Array<() => void>;
}
