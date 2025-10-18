import { Player } from "@infernus/core";
import {
  MIN_DRIFT_ANGLE,
  MIN_DRIFT_SPEED,
  DRIFT_TIMEOUT_INTERVAL,
} from "../constants";
import { DriftStateEnum, DriftOptionsEnum } from "../enums";
import { IDriftPlayer } from "../interfaces";
import { SafetyMap } from "shared/utils/safetyMap";

export const internalVar = {
  g_DriftPlayers: new SafetyMap<Player, IDriftPlayer>(() => {
    return {
      vHealth: 0,
      startPosX: 0,
      startPosY: 0,
      startPosZ: 0,
      driftState: DriftStateEnum.NONE,
      startTimestamp: 0,
      lastTimestamp: 0,
      timeoutTicks: 0,
      playerFlags:
        DriftOptionsEnum.DRIFT_CHECK_ENABLED |
        DriftOptionsEnum.DAMAGE_CHECK_ENABLED,
    };
  }),

  g_DriftFlags:
    DriftOptionsEnum.DRIFT_CHECK_ENABLED |
    DriftOptionsEnum.DAMAGE_CHECK_ENABLED,

  g_MinDriftAngle: MIN_DRIFT_ANGLE,
  g_MinDriftSpeed: MIN_DRIFT_SPEED,
  g_DriftTimeoutTicks: DRIFT_TIMEOUT_INTERVAL,
};

export function isModelACar(modelId: number) {
  if ([430, 446, 452, 453, 454, 472, 473, 484, 493, 595].includes(modelId))
    return false;
  if (
    [
      448, 461, 462, 463, 468, 471, 481, 509, 510, 521, 522, 523, 581, 586,
    ].includes(modelId)
  )
    return false;
  if (
    [
      417, 425, 447, 460, 469, 476, 487, 488, 497, 511, 512, 513, 519, 520, 548,
      553, 563, 577, 592, 593,
    ].includes(modelId)
  )
    return false;
  return true;
}
