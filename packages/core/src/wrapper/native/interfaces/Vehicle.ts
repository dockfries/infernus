export interface IVehColor {
  color1: number;
  color2: number;
}

export interface IVehSpawnInfo extends IVehColor {
  fX: number;
  fY: number;
  fZ: number;
  fRot: number;
}

export interface IVehMatrix {
  rightX: number;
  rightY: number;
  rightZ: number;
  upX: number;
  upY: number;
  upZ: number;
  atX: number;
  atY: number;
  atZ: number;
}
