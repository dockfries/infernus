import {
  InvalidEnum,
  KeysEnum,
  PlayerEvent,
  PlayerStateEnum,
  useTrigger,
  WeaponEnum,
  withTriggerOptions,
} from "@infernus/core";
import {
  playerHealth,
  playerArmour,
  lastShot,
  lastHitIdx,
  hitsIssued,
  isDying,
  knifeTimeout,
  damageDoneHealth,
  damageDoneArmour,
  lastDeathTick,
  lastHitTicks,
  lastHitWeapons,
} from "../../struct";
import { innerGameModeConfig, innerWeaponConfig } from "../../config";
import {
  InvalidDamageEnum,
  RejectedReasonEnum,
  WC_WeaponEnum,
} from "../../enums";
import { orig_playerMethods } from "../../hooks/origin";
import { debugMessage, debugMessageRed } from "../../utils/debug";
import { IEditableOnPlayerDamage, triggerOnPlayerDamage } from "../custom";
import {
  s_MaxWeaponShootRate,
  s_ValidDamageGiven,
  s_WeaponRange,
} from "../../constants";
import { internalPlayerDeath } from "./spawn";
import { wc_SecondKnifeAnim } from "../../functions/internal/anim";
import {
  addRejectedHit,
  IProcessDamageArgs,
  processDamage,
  inflictDamage,
} from "../../functions/internal/damage";
import { playerDeath } from "../../functions/internal/death";
import { hasSameTeam, isVehicleBike } from "../../functions/internal/is";
import {
  wc_SetSpawnForStreamedIn,
  wc_SpawnForStreamedIn,
} from "../../functions/internal/set";
import {
  onInvalidWeaponDamage,
  onPlayerDamageDone,
} from "../../functions/internal/event";
import {
  isBulletWeapon,
  isHighRateWeapon,
  wc_IsPlayerPaused,
  wc_IsPlayerSpawned,
} from "../../functions/public/is";
import { averageHitRate } from "../../functions/public/get";

PlayerEvent.onGiveDamage(({ player, damage, amount, weapon, bodyPart }) => {
  if (!isHighRateWeapon(weapon)) {
    debugMessage(
      player,
      `OnPlayerGiveDamage(${player.id} gave ${amount} to ${damage.id} using ${weapon} on bodyPart ${bodyPart})`,
    );
  }

  if (!orig_playerMethods.isConnected.call(damage)) {
    onInvalidWeaponDamage(
      player,
      damage,
      amount,
      weapon,
      bodyPart,
      InvalidDamageEnum.NO_DAMAGED,
      true,
    );
    addRejectedHit(player, damage, RejectedReasonEnum.HIT_NO_DAMAGEDID, weapon);
    return 0;
  }

  if (isDying.get(damage.id)) {
    addRejectedHit(player, damage, RejectedReasonEnum.HIT_DYING_PLAYER, weapon);
    return 0;
  }

  if (!innerGameModeConfig.lagCompMode) {
    const npc = orig_playerMethods.isNpc.call(damage);

    if (weapon === WeaponEnum.KNIFE && amount === 0.0) {
      if (damage === player) {
        return 0;
      }

      if (knifeTimeout.get(damage.id)) {
        clearTimeout(knifeTimeout.get(damage.id)!);
      }

      knifeTimeout.set(
        damage.id,
        setTimeout(() => {
          wc_SetSpawnForStreamedIn(damage);
        }, 2500),
      );
    }

    if (!npc) {
      return 0;
    }
  }

  if (
    weapon < WC_WeaponEnum.UNARMED ||
    weapon >= s_ValidDamageGiven.length ||
    !s_ValidDamageGiven[weapon]
  ) {
    if (
      weapon !== WeaponEnum.FLAMETHROWER &&
      weapon !== WeaponEnum.REASON_VEHICLE
    ) {
      addRejectedHit(
        player,
        damage,
        RejectedReasonEnum.HIT_INVALID_WEAPON,
        weapon,
      );
    }

    return 0;
  }

  let tick = Date.now();
  if (tick === 0) tick = 1;

  if (!wc_IsPlayerSpawned(player) && tick - lastDeathTick.get(player.id) > 80) {
    if (!isBulletWeapon(weapon) || lastShot.get(player.id).valid) {
      addRejectedHit(
        player,
        damage,
        RejectedReasonEnum.HIT_NOT_SPAWNED,
        weapon,
      );
    }

    return 0;
  }

  const npc = orig_playerMethods.isNpc.call(damage);

  if (amount === 1833.33154296875) {
    return 0;
  }

  if (weapon === WeaponEnum.KNIFE) {
    if (amount === 0.0) {
      const { weapons: w } = orig_playerMethods.getWeaponData.call(player, 0);

      if (damage === player) {
        return 0;
      }

      if (npc || hasSameTeam(player, damage.id)) {
        if (knifeTimeout.get(damage.id)) {
          clearTimeout(knifeTimeout.get(damage.id)!);
        }

        knifeTimeout.set(
          damage.id,
          setTimeout(() => {
            wc_SpawnForStreamedIn(damage);
          }, 150),
        );
        orig_playerMethods.clearAnimations.call(player, true);
        orig_playerMethods.setArmedWeapon.call(player, w);

        return 0;
      } else {
        const { x, y, z } = orig_playerMethods.getPos.call(player)!;

        if (
          orig_playerMethods.getDistanceFromPoint.call(damage, x, y, z) >
          s_WeaponRange[weapon] + 2.0
        ) {
          if (knifeTimeout.get(damage.id)) {
            clearTimeout(knifeTimeout.get(damage.id)!);
          }

          knifeTimeout.set(
            damage.id,
            setTimeout(() => {
              wc_SpawnForStreamedIn(damage);
            }, 150),
          );
          orig_playerMethods.clearAnimations.call(player, true);
          orig_playerMethods.setArmedWeapon.call(player, w);

          return 0;
        }
      }

      const editable: IEditableOnPlayerDamage = {
        player: damage,
        amount,
        issuerId: player,
        weaponId: weapon,
        bodyPart,
      };

      if (!triggerOnPlayerDamage(editable)) {
        if (knifeTimeout.get(editable.player.id)) {
          clearTimeout(knifeTimeout.get(editable.player.id)!);
        }

        knifeTimeout.set(
          editable.player.id,
          setTimeout(() => {
            wc_SpawnForStreamedIn(editable.player);
          }, 150),
        );

        if (editable.issuerId === InvalidEnum.PLAYER_ID) {
          return 0;
        }

        orig_playerMethods.clearAnimations.call(editable.issuerId, true);
        orig_playerMethods.setArmedWeapon.call(editable.issuerId, w);
        return 0;
      }

      if (editable.issuerId === InvalidEnum.PLAYER_ID) {
        return 0;
      }

      damageDoneHealth.set(
        editable.issuerId.id,
        playerHealth.get(editable.issuerId.id),
      );
      damageDoneArmour.set(
        editable.issuerId.id,
        playerArmour.get(editable.issuerId.id),
      );

      onPlayerDamageDone(
        editable.player,
        playerHealth.get(editable.player.id) +
          playerArmour.get(editable.player.id),
        editable.issuerId.id,
        editable.weaponId,
        editable.bodyPart,
      );

      orig_playerMethods.clearAnimations.call(editable.player, true);

      const animLib = "KNIFE";
      let animName = "KILL_Knife_Ped_Damage";
      playerDeath(editable.player, animLib, animName, false, 5200);

      setTimeout(() => {
        wc_SecondKnifeAnim(editable.player);
      }, 2200);

      useTrigger("OnPlayerDeath")!(
        withTriggerOptions({
          skipToNext: internalPlayerDeath,
          args: [editable.player.id, editable.issuerId.id, editable.weaponId],
        }),
      );

      debugMessage(
        editable.player.id,
        `being knifed by ${editable.issuerId.id}`,
      );
      debugMessage(editable.issuerId.id, `knifing ${editable.player.id}`);

      let forceSync = 2;

      const angle = orig_playerMethods.getFacingAngle.call(editable.player);
      orig_playerMethods.setFacingAngle.call(editable.issuerId, angle);

      orig_playerMethods.setVelocity.call(editable.player, 0.0, 0.0, 0.0);
      orig_playerMethods.setVelocity.call(editable.issuerId, 0.0, 0.0, 0.0);

      const animIndex = orig_playerMethods.getAnimationIndex.call(
        editable.issuerId,
      );

      if (animIndex !== 747) {
        debugMessageRed(
          editable.issuerId,
          `applying knife anim for you too (current: ${animIndex})`,
        );
        forceSync = 1;
      }

      animName = "KILL_Knife_Player";
      orig_playerMethods.applyAnimation.call(
        editable.issuerId,
        animLib,
        animName,
        4.1,
        false,
        true,
        true,
        false,
        1800,
        forceSync,
      );

      return 0;
    }
  }

  if (hasSameTeam(player, damage.id)) {
    addRejectedHit(player, damage, RejectedReasonEnum.HIT_SAME_TEAM, weapon);
    return 0;
  }

  if (
    (!orig_playerMethods.isStreamedIn.call(player, damage) &&
      !wc_IsPlayerPaused(damage)) ||
    !orig_playerMethods.isStreamedIn.call(damage, player)
  ) {
    addRejectedHit(
      player,
      damage,
      RejectedReasonEnum.HIT_UNSTREAMED,
      weapon,
      damage.id,
    );
    return 0;
  }

  const bullets = 0;
  let err = 0;

  const editable: IProcessDamageArgs = {
    player: damage,
    issuer: player,
    amount,
    weaponId: weapon,
    bodyPart,
    bullets,
  };

  if ((err = processDamage(editable))) {
    if (err === InvalidDamageEnum.INVALID_DAMAGE) {
      addRejectedHit(
        editable.issuer,
        editable.player,
        RejectedReasonEnum.HIT_INVALID_DAMAGE,
        editable.weaponId,
        editable.amount,
      );
    }

    if (err !== InvalidDamageEnum.INVALID_DISTANCE) {
      onInvalidWeaponDamage(
        editable.issuer,
        editable.player,
        editable.amount,
        editable.weaponId,
        editable.bodyPart,
        err,
        true,
      );
    }

    return 0;
  }

  if (editable.issuer === InvalidEnum.PLAYER_ID) return 0;

  let idx =
    (lastHitIdx.get(editable.issuer.id) + 1) %
    lastHitTicks.get(editable.issuer.id).length;

  if (idx < 0) {
    idx += lastHitTicks.get(editable.issuer.id).length;
  }

  lastHitIdx.set(editable.issuer.id, idx);
  lastHitTicks.get(editable.issuer.id)[idx] = tick;
  lastHitWeapons.get(editable.issuer.id)[idx] = editable.weaponId;
  hitsIssued.set(editable.issuer.id, hitsIssued.get(editable.issuer.id) + 1);

  if (innerWeaponConfig.DEBUG) {
    if (hitsIssued.get(editable.issuer.id) > 1) {
      let prev_tick_idx =
        (idx - 1) % lastHitTicks.get(editable.issuer.id).length;

      if (prev_tick_idx < 0) {
        prev_tick_idx += lastHitTicks.get(editable.issuer.id).length;
      }

      const prev_tick = lastHitTicks.get(editable.issuer.id)[prev_tick_idx];

      debugMessage(
        player,
        `(hit) last: ${tick - prev_tick} last 3: ${averageHitRate(editable.issuer, 3)}`,
      );
    }
  }

  const { multiple_weapons, ret: avg_rate } = averageHitRate(
    editable.issuer,
    innerGameModeConfig.maxHitRateSamples,
  );

  if (avg_rate !== -1) {
    if (multiple_weapons) {
      if (avg_rate < 100) {
        addRejectedHit(
          editable.issuer,
          editable.player,
          RejectedReasonEnum.HIT_RATE_TOO_FAST_MULTIPLE,
          editable.weaponId,
          avg_rate,
          innerGameModeConfig.maxHitRateSamples,
        );
        return 0;
      }
    } else if (s_MaxWeaponShootRate[editable.weaponId] - avg_rate > 20) {
      addRejectedHit(
        editable.issuer,
        editable.player,
        RejectedReasonEnum.HIT_RATE_TOO_FAST,
        editable.weaponId,
        avg_rate,
        innerGameModeConfig.maxHitRateSamples,
        s_MaxWeaponShootRate[editable.weaponId],
      );
      return 0;
    }
  }

  let valid = true;

  if (
    orig_playerMethods.getState.call(editable.issuer) === PlayerStateEnum.DRIVER
  ) {
    if (
      (editable.weaponId >= WeaponEnum.UZI &&
        editable.weaponId <= WeaponEnum.MP5) ||
      editable.weaponId === WeaponEnum.TEC9
    ) {
      const vehicle = orig_playerMethods.getVehicle.call(editable.issuer)!;

      if (!isVehicleBike(vehicle)) {
        const { keys } = orig_playerMethods.getKeys.call(editable.issuer);

        valid = Boolean(
          keys & KeysEnum.LOOK_RIGHT || keys & KeysEnum.LOOK_LEFT,
        );
      }
    } else {
      valid = false;
    }
  } else if (
    isBulletWeapon(editable.weaponId) &&
    amount !== 2.6400001049041748046875
  ) {
    if (
      !lastShot.get(editable.issuer.id).valid ||
      (tick - lastShot.get(editable.issuer.id).tick > 1500 &&
        editable.weaponId !== WeaponEnum.SNIPER)
    ) {
      valid = false;
      debugMessageRed(editable.issuer, "last shot not valid");
    } else if (
      editable.weaponId >= WeaponEnum.SHOTGUN &&
      editable.weaponId <= WeaponEnum.SHOTGSPA
    ) {
      if (lastShot.get(editable.issuer.id).hits >= 2) {
        valid = false;
        addRejectedHit(
          editable.issuer,
          editable.player,
          RejectedReasonEnum.HIT_MULTIPLE_PLAYERS_SHOTGUN,
          editable.weaponId,
          lastShot.get(editable.issuer.id).hits + 1,
        );
      }
    } else if (lastShot.get(editable.issuer.id).hits > 0) {
      if (
        lastShot.get(editable.issuer.id).hits >= 6 ||
        (lastShot.get(editable.issuer.id).hits >= 3 &&
          editable.weaponId !== WeaponEnum.SNIPER)
      ) {
        valid = false;
        addRejectedHit(
          editable.issuer,
          editable.player,
          RejectedReasonEnum.HIT_MULTIPLE_PLAYERS,
          editable.weaponId,
          lastShot.get(editable.issuer.id).hits + 1,
        );
      } else {
        debugMessageRed(
          editable.issuer,
          `hit ${lastShot.get(editable.issuer.id).hits + 1} players with 1 shot`,
        );
      }
    }

    if (valid && editable.weaponId !== WeaponEnum.SNIPER) {
      const dist = orig_playerMethods.getDistanceFromPoint.call(
        editable.player,
        lastShot.get(editable.issuer.id).hX,
        lastShot.get(editable.issuer.id).hY,
        lastShot.get(editable.issuer.id).hZ,
      );

      if (dist > 20.0) {
        const suf_veh = orig_playerMethods.getSurfingVehicle.call(
          editable.player,
        );
        const in_veh =
          orig_playerMethods.isInAnyVehicle.call(editable.player) ||
          (suf_veh && suf_veh.id !== InvalidEnum.VEHICLE_ID);

        const suf_obj = orig_playerMethods.getSurfingObject.call(
          editable.player,
        );

        if (
          (!in_veh && (!suf_obj || suf_obj.id === InvalidEnum.OBJECT_ID)) ||
          dist > 50.0
        ) {
          valid = false;
          addRejectedHit(
            editable.issuer,
            editable.player,
            RejectedReasonEnum.HIT_TOO_FAR_FROM_SHOT,
            editable.weaponId,
            dist,
          );
        }
      }
    }

    lastShot.get(editable.issuer.id).hits += 1;
  }

  if (!valid) {
    return 0;
  }

  if (npc) {
    onPlayerDamageDone(
      editable.player,
      amount,
      editable.issuer,
      editable.weaponId,
      editable.bodyPart,
    );
  } else {
    inflictDamage(
      editable.player,
      amount,
      editable.issuer,
      editable.weaponId,
      editable.bodyPart,
    );
  }

  return 0;
});
