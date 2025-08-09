import {
  PlayerEvent,
  PlayerStateEnum,
  WeaponEnum,
  InvalidEnum,
} from "@infernus/core";
import { innerGameModeConfig } from "../../config";
import { s_WeaponDamage } from "../../constants";
import { WC_WeaponEnum } from "../../enums";
import { orig_playerMethods } from "../../hooks/origin";
import {
  tempDataWritten,
  lastSyncData,
  tempSyncData,
  isDying,
  forceClassSelection,
  deathSkip,
  deathSkipTick,
  playerTeam,
  spawnForStreamedIn,
  lastUpdateTick,
  lastStopTick,
  lastZVelo,
  lastZ,
  lastAnim,
} from "../../struct";
import { debugMessage } from "../../utils/debug";
import { inflictDamage } from "../../functions/internal/damage";
import { wc_DeathSkipEnd } from "../../functions/internal/death";
import { wc_SpawnForStreamedIn } from "../../functions/internal/set";

PlayerEvent.onUpdate(({ player, next }) => {
  if (tempDataWritten.get(player.id)) {
    if (orig_playerMethods.getState.call(player) === PlayerStateEnum.ONFOOT) {
      lastSyncData.set(player.id, tempSyncData.get(player.id));
      tempDataWritten.set(player.id, false);
    }
  }

  if (isDying.get(player.id)) {
    return 1;
  }

  if (forceClassSelection.get(player.id)) {
    return 0;
  }

  const tick = Date.now();

  if (deathSkip.get(player.id) === 1) {
    if (deathSkipTick.get(player.id)) {
      if (tick - deathSkipTick.get(player.id) > 1000) {
        const { x, y, z } = orig_playerMethods.getPos.call(player)!;
        const r = orig_playerMethods.getFacingAngle.call(player).angle;

        orig_playerMethods.setSpawnInfo.call(
          player,
          playerTeam.get(player.id),
          orig_playerMethods.getSkin.call(player),
          x,
          y,
          z,
          r,
          WeaponEnum.FIST,
          0,
          WeaponEnum.FIST,
          0,
          WeaponEnum.FIST,
          0,
        );

        deathSkipTick.set(player.id, 0);

        const animLib = "PED",
          animName = "IDLE_stance";
        orig_playerMethods.applyAnimation.call(
          player,
          animLib,
          animName,
          4.1,
          true,
          false,
          false,
          false,
          1,
          1,
        );
      }
    } else {
      if (orig_playerMethods.getAnimationIndex.call(player) !== 1189) {
        deathSkip.set(player.id, 0);

        wc_DeathSkipEnd(player);

        debugMessage(player, "Death skip end");
      }
    }
  }

  if (spawnForStreamedIn.get(player.id)) {
    wc_SpawnForStreamedIn(player);

    spawnForStreamedIn.set(player.id, false);
  }

  lastUpdateTick.set(player.id, tick);

  if (innerGameModeConfig.customFallDamage) {
    let { z: vz } = orig_playerMethods.getVelocity.call(player);
    const { z } = orig_playerMethods.getPos.call(player)!;

    const surfingVehicle = orig_playerMethods.getSurfingVehicle.call(player);
    let surfing = false;

    if (!surfingVehicle || surfingVehicle.id === InvalidEnum.VEHICLE_ID) {
      const obj = orig_playerMethods.getSurfingObject.call(player);
      surfing = Boolean(obj && obj.id !== InvalidEnum.OBJECT_ID);
    } else {
      surfing = true;
    }

    if (surfing || tick - lastStopTick.get(player.id) < 2000) {
      vz = 0.0;
      lastZVelo.set(player.id, 0.0);
    } else {
      if (vz !== 0.0) {
        lastZVelo.set(player.id, vz);
      }

      if (z - lastZ.get(player.id) > 1.0) {
        lastZVelo.set(player.id, 0.1);
        vz = 0.1;
      }
    }

    lastZ.set(player.id, z);

    const anim = orig_playerMethods.getAnimationIndex.call(player);

    if (anim !== lastAnim.get(player.id)) {
      const prev = lastAnim.get(player.id);
      lastAnim.set(player.id, anim);

      if (
        (prev === 1130 && vz === 0.0) ||
        (anim >= 1128 && anim <= 1134) ||
        anim === 1208
      ) {
        let amount = -1.0;
        debugMessage(player, `vz: ${vz} anim: ${anim} prev: ${prev}`);

        vz = lastZVelo.get(player.id);

        if (vz <= innerGameModeConfig.fallDeathVelocity) {
          amount = 0.0;
        } else if (vz <= -0.2) {
          if (vz === -0.2) {
            amount = s_WeaponDamage[WeaponEnum.REASON_COLLISION] * 0.2;
          } else {
            amount = (vz + 0.2) / (innerGameModeConfig.fallDeathVelocity + 0.2);
            amount *= s_WeaponDamage[WeaponEnum.REASON_COLLISION];
          }
        }

        if (
          orig_playerMethods.getWeapon.call(player) === WeaponEnum.PARACHUTE &&
          anim === 1134
        ) {
          amount = -1.0;
        }

        if (amount >= 0.0) {
          debugMessage(
            player,
            `fall dmg: ${amount.toFixed(5)} (vz: ${vz}, anim: ${anim}, prev:${prev})`,
          );

          inflictDamage(
            player,
            amount,
            InvalidEnum.PLAYER_ID,
            WC_WeaponEnum.REASON_COLLISION,
            3,
          );
        }
      }
    }
  }

  return next();
});
