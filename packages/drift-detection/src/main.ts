import { Player, LimitsEnum } from "@infernus/core";
import { MAX_DRIFT_ANGLE } from "./constants";
import "./defines";
import { DriftOptionsEnum } from "./enums";
import { onPlayerEnd, onPlayerStart, onPlayerUpdate } from "./callbacks";
import { internalVar } from "./utils";

export * from "./constants";
export * from "./enums";
export * from "./interfaces";

export const Drift = {
  setMinAngle(angle: number) {
    if (angle < MAX_DRIFT_ANGLE) {
      internalVar.g_MinDriftAngle = angle;
    }
  },
  getMinAngle() {
    return internalVar.g_MinDriftAngle;
  },

  setMinSpeed(speed: number) {
    internalVar.g_MinDriftSpeed = speed;
  },
  getMinSpeed() {
    return internalVar.g_MinDriftSpeed;
  },
  setTimeoutTicks(ticks: number) {
    internalVar.g_DriftTimeoutTicks = ticks;
  },
  getTimeoutTicks() {
    return internalVar.g_DriftTimeoutTicks;
  },
  enableDetection(player: Player | -1 = -1) {
    if (player !== -1 && player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS) {
      internalVar.g_DriftPlayers.get(player).playerFlags |=
        DriftOptionsEnum.DRIFT_CHECK_ENABLED;
    } else {
      internalVar.g_DriftFlags |= DriftOptionsEnum.DRIFT_CHECK_ENABLED;
    }
  },
  disableDetection(player: Player | -1 = -1) {
    if (player !== -1 && player.id > 0 && player.id < LimitsEnum.MAX_PLAYERS) {
      internalVar.g_DriftPlayers.get(player).playerFlags &=
        ~DriftOptionsEnum.DRIFT_CHECK_ENABLED;
    } else {
      internalVar.g_DriftFlags &= ~DriftOptionsEnum.DRIFT_CHECK_ENABLED;
    }
  },
  isDetectionEnabled(player: Player | -1 = -1) {
    if (player !== -1 && player.id > 0 && player.id < LimitsEnum.MAX_PLAYERS) {
      return !!(
        internalVar.g_DriftPlayers.get(player).playerFlags &
        DriftOptionsEnum.DRIFT_CHECK_ENABLED
      );
    }
    return !!(internalVar.g_DriftFlags & DriftOptionsEnum.DRIFT_CHECK_ENABLED);
  },
  enableDamageCheck(player: Player | -1 = -1) {
    if (player !== -1 && player.id > 0 && player.id < LimitsEnum.MAX_PLAYERS) {
      internalVar.g_DriftPlayers.get(player).playerFlags |=
        DriftOptionsEnum.DAMAGE_CHECK_ENABLED;
    } else {
      internalVar.g_DriftFlags |= DriftOptionsEnum.DAMAGE_CHECK_ENABLED;
    }
  },
  disableDamageCheck(player: Player | -1 = -1) {
    if (player !== -1 && player.id > 0 && player.id < LimitsEnum.MAX_PLAYERS) {
      internalVar.g_DriftPlayers.get(player).playerFlags &=
        ~DriftOptionsEnum.DAMAGE_CHECK_ENABLED;
    } else {
      internalVar.g_DriftFlags &= ~DriftOptionsEnum.DAMAGE_CHECK_ENABLED;
    }
  },
  isDamageCheckEnabled(player: Player | -1 = -1) {
    if (player !== -1 && player.id > 0 && player.id < LimitsEnum.MAX_PLAYERS) {
      return !!(
        internalVar.g_DriftPlayers.get(player).playerFlags &
        DriftOptionsEnum.DAMAGE_CHECK_ENABLED
      );
    }
    return !!(internalVar.g_DriftFlags & DriftOptionsEnum.DAMAGE_CHECK_ENABLED);
  },
  isPlayerDrifting(player: Player) {
    return (
      internalVar.g_DriftPlayers.has(player) &&
      !!internalVar.g_DriftPlayers.get(player).driftState
    );
  },
};

export const DriftEvent = {
  onPlayerStart,
  onPlayerUpdate,
  onPlayerEnd,
};
