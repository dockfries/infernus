import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { MapAndreasMode } from "./enum";
import { MapAndreasError } from "./enum";
import { MapAndreasException } from "./exceptions";

const RAW_GRID_CELLS = 6000;

function getModeInfo(mode: MapAndreasMode) {
  switch (mode) {
    case MapAndreasMode.Full:
    case MapAndreasMode.NoBuffer:
      return { cells: 6000, resolution: 1 };
    case MapAndreasMode.Medium:
      return { cells: 3000, resolution: 2 };
    case MapAndreasMode.Minimal:
      return { cells: 2000, resolution: 3 };
    default:
      throw new MapAndreasException(`Unknown MapAndreasMode: ${mode}`);
  }
}

interface State {
  data: Uint16Array;
  mode: MapAndreasMode;
}

let state: State | null = null;

function assertInit(): State {
  if (!state) {
    throw new MapAndreasException("Not initialized. Call MapAndreas.init() first.");
  }
  return state;
}

function findZ(s: State, x: number, y: number): { z: number; ret: MapAndreasError } {
  const { cells, resolution } = getModeInfo(s.mode);

  const gridX = Math.trunc(x) + 3000;
  const gridY = (Math.trunc(y) - 3000) * -1;

  if (gridX < 0 || gridX >= RAW_GRID_CELLS || gridY < 0 || gridY >= RAW_GRID_CELLS) {
    return { z: 0, ret: MapAndreasError.InvalidArea };
  }

  const idx = Math.trunc(gridY / resolution) * cells + Math.trunc(gridX / resolution);
  return { z: s.data[idx] / 100, ret: MapAndreasError.Success };
}

export class MapAndreas {
  private constructor() {
    throw new MapAndreasException("This is a static class and cannot be instantiated.");
  }

  static async init(mode: MapAndreasMode, name: string): Promise<void> {
    if (state) return;

    const { cells } = getModeInfo(mode);
    const expectedBytes = cells * cells * 2;

    let buffer: Buffer;
    try {
      buffer = await readFile(resolve(name));
    } catch {
      throw new MapAndreasException(`Failed to read heightmap file: ${name}`);
    }

    if (buffer.length !== expectedBytes) {
      throw new MapAndreasException(
        `Invalid heightmap file size for mode ${mode}: expected ${expectedBytes} bytes, got ${buffer.length}`,
      );
    }

    state = {
      data: new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2),
      mode,
    };
  }

  static unload(): void {
    state = null;
  }

  static findZFor2DCoord(x: number, y: number): { z: number; ret: MapAndreasError } {
    return findZ(assertInit(), x, y);
  }

  static findAverageZ(x: number, y: number): { z: number; ret: MapAndreasError } {
    const s = assertInit();
    const { resolution } = getModeInfo(s.mode);

    const p1 = findZ(s, x, y);
    if (p1.ret !== MapAndreasError.Success) return p1;

    const nx = x < 0 ? x + resolution : x - resolution;
    const ny = y < 0 ? y + resolution : y - resolution;

    const p2 = findZ(s, nx, y);
    const p3 = findZ(s, x, ny);

    const xx = Math.abs(x - Math.trunc(x));
    const yy = Math.abs(y - Math.trunc(y));

    const z = p1.z + xx * (p1.z - p2.z) + yy * (p1.z - p3.z);
    return { z, ret: MapAndreasError.Success };
  }

  static setZFor2DCoord(x: number, y: number, z: number): boolean {
    const s = assertInit();
    const { cells, resolution } = getModeInfo(s.mode);

    const gridX = Math.trunc(x) + 3000;
    const gridY = (Math.trunc(y) - 3000) * -1;

    if (gridX < 0 || gridX >= RAW_GRID_CELLS || gridY < 0 || gridY >= RAW_GRID_CELLS) {
      return false;
    }

    const idx = Math.trunc(gridY / resolution) * cells + Math.trunc(gridX / resolution);
    s.data[idx] = Math.trunc(z * 100 + 0.5);
    return true;
  }

  static async saveCurrentHMap(name: string): Promise<boolean> {
    const s = assertInit();
    try {
      await writeFile(resolve(name), new Uint8Array(s.data.buffer));
      return true;
    } catch {
      return false;
    }
  }
}

export * from "./enum";
export * from "./exceptions";
