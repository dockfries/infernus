export interface GangZonePos {
  fMinX: number;
  fMinY: number;
  fMaxX: number;
  fMaxY: number;
}

export type GangZoneCb = (playerid: number, zoneid: number) => void;
