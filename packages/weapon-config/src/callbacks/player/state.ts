import {
  PlayerEvent,
  Player,
  InvalidEnum,
  PlayerStateEnum,
} from "@infernus/core";
import { innerWeaponConfig } from "../../config";
import { orig_playerMethods } from "../../hooks/origin";
import {
  spectating,
  vendingUseTimer,
  isDying,
  lastVehicleTick,
} from "../../struct";
import { sendLastSyncPacket } from "../../functions/internal/raknet";
import { clearAnimationsForPlayer } from "../../functions/internal/anim";
import { setHealthBarVisible } from "../../functions/internal/set";

PlayerEvent.onStateChange(({ player, newState, oldState, next }) => {
  if (
    spectating.get(player.id) !== InvalidEnum.PLAYER_ID &&
    newState !== PlayerStateEnum.SPECTATING
  ) {
    spectating.set(player.id, InvalidEnum.PLAYER_ID);
  }

  if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
    if (vendingUseTimer.get(player.id)) {
      clearTimeout(vendingUseTimer.get(player.id)!);
      vendingUseTimer.set(player.id, null);
    }
  }

  if (
    isDying.get(player.id) &&
    (newState === PlayerStateEnum.DRIVER ||
      newState === PlayerStateEnum.PASSENGER)
  ) {
    orig_playerMethods.toggleControllable.call(player, false);
  }

  if (
    oldState === PlayerStateEnum.DRIVER ||
    oldState === PlayerStateEnum.PASSENGER
  ) {
    lastVehicleTick.set(player.id, Date.now());

    if (newState === PlayerStateEnum.ONFOOT) {
      const {
        x: vx,
        y: vy,
        z: vz,
      } = orig_playerMethods.getVelocity.call(player);

      if (vx * vx + vy * vy + vz * vz <= 0.05) {
        Player.getInstances().forEach((i) => {
          if (i !== player && orig_playerMethods.isStreamedIn.call(player, i)) {
            sendLastSyncPacket(player, i);
            clearAnimationsForPlayer(player, i);
          }
        });
      }
    }
  }

  switch (newState) {
    case PlayerStateEnum.ONFOOT:
    case PlayerStateEnum.DRIVER:
    case PlayerStateEnum.PASSENGER: {
      setHealthBarVisible(player, true);
      break;
    }

    default: {
      setHealthBarVisible(player, false);
    }
  }

  return next();
});
