import type { MapAndreasMode } from "./enum";

export class MapAndreas {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  static init(mode: MapAndreasMode, name: string) {
    return Boolean(samp.callNative("MapAndreas_Init", "isi", mode, name));
  }
  static unload() {
    return Boolean(samp.callNative("MapAndreas_Unload", ""));
  }
  static saveCurrentHMap(name: string) {
    return Boolean(samp.callNative("MapAndreas_SaveCurrentHMap", "s", name));
  }
  static findZFor2DCoord(x: number, y: number): number {
    return samp.callNative("MapAndreas_FindZ_For2DCoord", "ffF", x, y);
  }
  static findAverageZ(x: number, y: number): number {
    return samp.callNative("MapAndreas_FindAverageZ", "ffF", x, y);
  }
  static setZFor2DCoord(x: number, y: number, z: number) {
    return Boolean(samp.callNative("setZFor2DCoord", "iii", x, y, z));
  }
}

export * from "./enum";
