export interface ICheckPoint {
  fX: number;
  fY: number;
  fZ: number;
  fSize: number;
}

export interface IRaceCheckPoint extends ICheckPoint {
  fNextX: number;
  fNextY: number;
  fNextZ: number;
}
