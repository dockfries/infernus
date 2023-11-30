export interface GangZonePos {
  fMinX: number;
  fMinY: number;
  fMaxX: number;
  fMaxY: number;
}

export type GangZoneCb = (playerId: number, zoneid: number) => void;
