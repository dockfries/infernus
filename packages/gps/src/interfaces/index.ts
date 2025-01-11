import { GangZone } from "@infernus/core";

export interface IWazeGps {
  timer: null | NodeJS.Timeout;
  color: string | number;
  routes: GangZone[];
  position: [number, number, number];
  tickPosition: [number, number, number];
}
