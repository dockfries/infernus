import type { MapAndreasMode } from "./enum";

export class MapAndreas {
  private constructor() {
    throw new Error("This is a static class and cannot be instantiated.");
  }

  static init(mode: MapAndreasMode, name: string) {
    return !!samp.callNative("MapAndreas_Init", "isi", mode, name);
  }
  static unload() {
    return !!samp.callNative("MapAndreas_Unload", "");
  }
  static saveCurrentHMap(name: string) {
    return !!samp.callNative("MapAndreas_SaveCurrentHMap", "s", name);
  }
  static findZFor2DCoord(x: number, y: number) {
    const [z, ret]: [number, number] = samp.callNative(
      "MapAndreas_FindZ_For2DCoord",
      "ffF",
      x,
      y,
    );
    return { z, ret };
  }
  static findAverageZ(x: number, y: number) {
    const [z, ret]: [number, number] = samp.callNative(
      "MapAndreas_FindAverageZ",
      "ffF",
      x,
      y,
    );
    return { z, ret };
  }
  static setZFor2DCoord(x: number, y: number, z: number) {
    return !!samp.callNative("setZFor2DCoord", "iii", x, y, z);
  }
}

export * from "./enum";
