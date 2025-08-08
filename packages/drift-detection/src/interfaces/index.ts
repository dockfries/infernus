import { DriftOptionsEnum, DriftStateEnum } from "../enums";

export interface IDriftPlayer {
  vHealth: number;
  startPosX: number;
  startPosY: number;
  startPosZ: number;

  driftState: DriftStateEnum;
  startTimestamp: number;
  lastTimestamp: number;
  timeoutTicks: number;

  playerFlags: DriftOptionsEnum;
}
