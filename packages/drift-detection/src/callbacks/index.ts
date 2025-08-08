import {
  defineEvent,
  Player,
  PlayerEvent,
  GameMode,
  PlayerStateEnum,
} from "@infernus/core";
import { DriftEndReasonEnum, DriftOptionsEnum, DriftStateEnum } from "../enums";
import { internalVar, isModelACar } from "../utils";
import { DRIFT_PROCESS_INTERVAL, MAX_DRIFT_ANGLE } from "../constants";

export const [onPlayerStart, triggerPlayerStart] = defineEvent({
  name: "OnPlayerDriftStart",
  isNative: false,
  beforeEach(player: Player) {
    return { player };
  },
});

export const [onPlayerUpdate, triggerPlayerUpdate] = defineEvent({
  name: "OnPlayerDriftUpdate",
  isNative: false,
  beforeEach(player: Player, driftAngle: number, speed: number, time: number) {
    return { player, driftAngle, speed, time };
  },
});

export const [onPlayerEnd, triggerPlayerEnd] = defineEvent({
  name: "triggerPlayerEnd",
  isNative: false,
  beforeEach(
    player: Player,
    reason: DriftEndReasonEnum,
    distance: number,
    time: number,
  ) {
    return { player, reason, distance, time };
  },
});

PlayerEvent.onUpdate(({ player, next }) => {
  const driftPlayer = internalVar.g_DriftPlayers.get(player);

  if (
    internalVar.g_DriftFlags & DriftOptionsEnum.DRIFT_CHECK_ENABLED &&
    driftPlayer.playerFlags & DriftOptionsEnum.DRIFT_CHECK_ENABLED
  ) {
    if (Date.now() > driftPlayer.lastTimestamp) {
      const vehicle = player.getVehicle();
      if (
        vehicle &&
        player.getState() === PlayerStateEnum.DRIVER &&
        isModelACar(vehicle.getModel())
      ) {
        const { x: vX, y: vY } = vehicle.getVelocity();
        const angle = vehicle.getZAngle();
        const speed = vehicle.getSpeed(180.0);

        let direction = (Math.atan2(vY, vX) * 180) / Math.PI;
        direction -= 90.0;

        if (direction < 0) direction += 360.0;

        let driftAngle = angle - Math.abs(direction);

        if (driftAngle > 270.0) driftAngle -= 270.0;
        if (driftAngle < -270.0) driftAngle += 270.0;

        driftAngle = Math.abs(driftAngle);

        switch (driftPlayer.driftState) {
          case DriftStateEnum.NONE: {
            if (
              driftAngle >= internalVar.g_MinDriftAngle &&
              driftAngle <= MAX_DRIFT_ANGLE &&
              speed >= internalVar.g_MinDriftSpeed
            ) {
              driftPlayer.driftState = DriftStateEnum.DRIFTING;
              driftPlayer.startTimestamp = Date.now();

              driftPlayer.vHealth = vehicle.getHealth();

              const { x, y, z } = player.getPos();

              driftPlayer.startPosX = x;
              driftPlayer.startPosY = y;
              driftPlayer.startPosZ = z;

              triggerPlayerStart(player);
            }
            break;
          }
          case DriftStateEnum.DRIFTING: {
            if (
              internalVar.g_DriftFlags &
                DriftOptionsEnum.DAMAGE_CHECK_ENABLED &&
              driftPlayer.playerFlags & DriftOptionsEnum.DAMAGE_CHECK_ENABLED
            ) {
              const vehicleHealth = vehicle.getHealth();

              if (vehicleHealth < driftPlayer.vHealth) {
                driftPlayer.driftState = DriftStateEnum.NONE;
                driftPlayer.timeoutTicks = 0;

                const distance = player.getDistanceFromPoint(
                  driftPlayer.startPosX,
                  driftPlayer.startPosY,
                  driftPlayer.startPosZ,
                );

                triggerPlayerEnd(
                  player,
                  DriftEndReasonEnum.DAMAGED,
                  distance,
                  Date.now() - driftPlayer.startTimestamp,
                );
              }
            }
            if (
              driftAngle >= internalVar.g_MinDriftAngle &&
              driftAngle <= MAX_DRIFT_ANGLE &&
              speed >= internalVar.g_MinDriftSpeed
            ) {
              driftPlayer.timeoutTicks = 0;
              triggerPlayerUpdate(
                player,
                driftAngle,
                speed,
                Date.now() - driftPlayer.startTimestamp,
              );
            } else {
              driftPlayer.timeoutTicks++;

              if (driftPlayer.timeoutTicks >= internalVar.g_DriftTimeoutTicks) {
                driftPlayer.driftState = DriftStateEnum.NONE;
                driftPlayer.timeoutTicks = 0;

                const distance = player.getDistanceFromPoint(
                  driftPlayer.startPosX,
                  driftPlayer.startPosY,
                  driftPlayer.startPosZ,
                );

                triggerPlayerEnd(
                  player,
                  DriftEndReasonEnum.TIMEOUT,
                  distance,
                  Date.now() - driftPlayer.startTimestamp,
                );
              }
            }
            break;
          }
        }
      }
      driftPlayer.lastTimestamp = Date.now() + DRIFT_PROCESS_INTERVAL;
    }
  }

  return next();
});

PlayerEvent.onStateChange(({ player, oldState, next }) => {
  const driftPlayer = internalVar.g_DriftPlayers.get(player);

  if (
    driftPlayer.driftState === DriftStateEnum.DRIFTING &&
    oldState === PlayerStateEnum.DRIVER
  ) {
    driftPlayer.driftState = DriftStateEnum.NONE;
    driftPlayer.timeoutTicks = 0;

    const distance = player.getDistanceFromPoint(
      driftPlayer.startPosX,
      driftPlayer.startPosY,
      driftPlayer.startPosZ,
    );

    triggerPlayerEnd(
      player,
      DriftEndReasonEnum.OTHER,
      distance,
      Date.now() - driftPlayer.startTimestamp,
    );
  }

  return next();
});

PlayerEvent.onDisconnect(({ player, next }) => {
  const driftPlayer = internalVar.g_DriftPlayers.get(player);

  if (driftPlayer.driftState === DriftStateEnum.DRIFTING) {
    driftPlayer.driftState = DriftStateEnum.NONE;
    driftPlayer.timeoutTicks = 0;
    const distance = player.getDistanceFromPoint(
      driftPlayer.startPosX,
      driftPlayer.startPosY,
      driftPlayer.startPosZ,
    );
    triggerPlayerEnd(
      player,
      DriftEndReasonEnum.OTHER,
      distance,
      Date.now() - driftPlayer.startTimestamp,
    );
  }

  if (internalVar.g_DriftPlayers.has(player)) {
    internalVar.g_DriftPlayers.delete(player);
  }

  return next();
});

GameMode.onExit(({ next }) => {
  internalVar.g_DriftPlayers.clear();
  return next();
});
