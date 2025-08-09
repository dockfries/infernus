export interface IGangZonePos {
  fMinX: number;
  fMinY: number;
  fMaxX: number;
  fMaxY: number;
}

export type GangZoneCb = (playerId: number, zoneId: number) => void;
