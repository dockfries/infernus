import {
  InvalidEnum,
  Player,
  PlayerEvent,
  PlayerStateEnum,
  useTrigger,
  WeaponEnum,
  withTriggerOptions,
} from "@infernus/core";
import {
  playerHealth,
  playerArmour,
  isDying,
  beingResynced,
  knifeTimeout,
  damageDoneHealth,
  damageDoneArmour,
  lastDeathTick,
} from "../../struct";
import { innerGameModeConfig } from "../../config";
import {
  InvalidDamageEnum,
  RejectedReasonEnum,
  WC_WeaponEnum,
} from "../../enums";
import { orig_playerMethods } from "../../hooks/origin";
import { debugMessage, debugMessageRed } from "../../utils/debug";
import { IEditableOnPlayerDamage, triggerOnPlayerDamage } from "../custom";
import {
  s_ValidDamageTaken,
  s_WeaponDamage,
  s_WeaponRange,
} from "../../constants";
import { internalPlayerDeath } from "./spawn";
import {
  addRejectedHit,
  IProcessDamageArgs,
  processDamage,
  inflictDamage,
} from "../../functions/internal/damage";
import { playerDeath } from "../../functions/internal/death";
import {
  hasSameTeam,
  isVehicleArmedWithWeapon,
} from "../../functions/internal/is";
import { updateHealthBar } from "../../functions/internal/set";
import {
  onPlayerDamageDone,
  onInvalidWeaponDamage,
} from "../../functions/internal/event";
import {
  isBulletWeapon,
  isHighRateWeapon,
  isMeleeWeapon,
  wc_IsPlayerPaused,
  wc_IsPlayerSpawned,
} from "../../functions/public/is";
import { resyncPlayer } from "../../functions/public/set";

PlayerEvent.onTakeDamage(({ player, damage, amount, weapon, bodyPart }) => {
  if (orig_playerMethods.isNpc.call(player)) {
    return 0;
  }

  if (damage instanceof Player && orig_playerMethods.isNpc.call(damage)) {
    inflictDamage(
      player,
      s_WeaponDamage[weapon],
      damage,
      weapon as unknown as WC_WeaponEnum,
      bodyPart,
      !isBulletWeapon(weapon),
    );
  }

  updateHealthBar(player, true);

  if (!wc_IsPlayerSpawned(player)) {
    return 0;
  }

  if (!isHighRateWeapon(weapon)) {
    debugMessage(
      player,
      `OnPlayerTakeDamage(${player.id} took ${amount} from ${typeof damage === "number" ? damage : damage.id} by ${weapon} on bodyPart ${bodyPart})`,
    );
  }

  if (
    weapon < WC_WeaponEnum.UNARMED ||
    weapon >= s_ValidDamageTaken.length ||
    !s_ValidDamageTaken[weapon]
  ) {
    return 0;
  }

  if (weapon === WeaponEnum.REASON_COLLISION && amount === 0.0) {
    return 0;
  }

  if (amount === 1833.33154296875) {
    return 0;
  }

  if (weapon === WeaponEnum.REASON_COLLISION) {
    if (innerGameModeConfig.customFallDamage) {
      return 0;
    }

    const anim = orig_playerMethods.getAnimationIndex.call(player);

    if (anim >= 1061 && anim <= 1067) {
      debugMessage(player, "climb bug prevented");
      return 0;
    }
  } else if (weapon === WeaponEnum.KNIFE) {
    if (amount === 0.0) {
      if (damage === player) {
        return 0;
      }

      if (knifeTimeout.get(player.id)) {
        clearTimeout(knifeTimeout.get(player.id)!);
        knifeTimeout.set(player.id, null);
      }

      if (damage === InvalidEnum.PLAYER_ID || hasSameTeam(player, damage.id)) {
        resyncPlayer(player);

        return 0;
      } else {
        const { x, y, z } = orig_playerMethods.getPos.call(damage)!;

        if (
          orig_playerMethods.getDistanceFromPoint.call(player, x, y, z) >
          s_WeaponRange[weapon] + 2.0
        ) {
          resyncPlayer(player);
          return 0;
        }
      }

      const editable: IEditableOnPlayerDamage = {
        player,
        amount,
        issuerId: damage,
        weaponId: weapon,
        bodyPart,
      };

      if (!triggerOnPlayerDamage(editable)) {
        resyncPlayer(editable.player);
        return 0;
      }

      if (editable.issuerId === InvalidEnum.PLAYER_ID) {
        return 0;
      }

      weapon = WeaponEnum.KNIFE;
      amount = 0.0;

      damageDoneHealth.set(
        editable.player.id,
        playerHealth.get(editable.player.id),
      );
      damageDoneArmour.set(
        editable.player.id,
        playerArmour.get(editable.player.id),
      );

      onPlayerDamageDone(
        editable.player,
        playerHealth.get(editable.player.id) +
          playerArmour.get(editable.player.id),
        editable.issuerId,
        weapon,
        bodyPart,
      );

      const animLib = "KNIFE";
      let animName = "KILL_Knife_Ped_Die";
      playerDeath(
        editable.player,
        animLib,
        animName,
        false,
        4000 - orig_playerMethods.getPing.call(editable.player),
      );

      useTrigger("OnPlayerDeath")!(
        withTriggerOptions({
          skipToNext: internalPlayerDeath,
          args: [editable.player.id, editable.issuerId, weapon],
        }),
      );

      orig_playerMethods.setHealth.call(editable.player, 0x7f7fffff);

      debugMessage(
        editable.player.id,
        `being knifed by ${editable.issuerId.id}`,
      );
      debugMessage(editable.issuerId, `knifing ${editable.player.id}`);

      let forceSync = 2;

      const a = orig_playerMethods.getFacingAngle.call(editable.player).angle;
      orig_playerMethods.setFacingAngle.call(editable.issuerId, a);

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

  if (innerGameModeConfig.lagCompMode && s_ValidDamageTaken[weapon] !== 2) {
    if (
      damage !== InvalidEnum.PLAYER_ID &&
      (weapon === WeaponEnum.M4 || weapon === WeaponEnum.MINIGUN) &&
      orig_playerMethods.getState.call(damage) === PlayerStateEnum.DRIVER
    ) {
      const vehicle = orig_playerMethods.getVehicle.call(damage);

      if (
        vehicle &&
        isVehicleArmedWithWeapon(vehicle, weapon as unknown as WC_WeaponEnum)
      ) {
        if ((weapon as unknown as number) === WC_WeaponEnum.MINIGUN) {
          weapon = WC_WeaponEnum.VEHICLE_MINIGUN as unknown as number;
        } else {
          weapon = WC_WeaponEnum.VEHICLE_M4 as unknown as number;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  if (
    damage !== InvalidEnum.PLAYER_ID &&
    orig_playerMethods.isConnected.call(damage)
  ) {
    if (hasSameTeam(player, damage.id)) {
      return 0;
    }

    if (
      isDying.get(damage.id) &&
      (isBulletWeapon(weapon) || isMeleeWeapon(weapon)) &&
      Date.now() - lastDeathTick.get(damage.id) > 80
    ) {
      debugMessageRed(player, `shot/punched by dead player (${damage.id})`);
      return 0;
    }

    if (beingResynced.get(damage.id)) {
      return 0;
    }

    if (
      weapon === WeaponEnum.REASON_COLLISION ||
      weapon === WeaponEnum.REASON_DROWN
    ) {
      return 0;
    }

    if (
      weapon === WeaponEnum.REASON_VEHICLE ||
      (weapon as number) === WC_WeaponEnum.HELIBLADES
    ) {
      if (orig_playerMethods.getState.call(damage) !== PlayerStateEnum.DRIVER) {
        return 0;
      }
    }

    if (
      (!orig_playerMethods.isStreamedIn.call(player, damage) &&
        !wc_IsPlayerPaused(damage)) ||
      !orig_playerMethods.isStreamedIn.call(damage, player)
    ) {
      if (innerGameModeConfig.lagCompMode) {
        damage = InvalidEnum.PLAYER_ID;
      } else {
        addRejectedHit(
          player,
          damage,
          RejectedReasonEnum.HIT_UNSTREAMED,
          weapon,
          damage.id,
        );
        return 0;
      }
    }
  }

  const bullets = 0.0;
  let err = 0;

  const editable: IProcessDamageArgs = {
    player,
    issuer: damage,
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
        false,
      );
    }

    return 0;
  }

  if (isBulletWeapon(editable.weaponId)) {
    const { x, y, z } = orig_playerMethods.getPos.call(editable.issuer)!;
    const dist = orig_playerMethods.getDistanceFromPoint.call(
      editable.player,
      x,
      y,
      z,
    );

    if (dist > s_WeaponRange[editable.weaponId] + 2.0) {
      addRejectedHit(
        editable.issuer,
        editable.player,
        RejectedReasonEnum.HIT_OUT_OF_RANGE,
        editable.weaponId,
        dist,
        s_WeaponRange[editable.weaponId],
      );
      return 0;
    }
  }

  inflictDamage(
    editable.player,
    editable.amount,
    editable.issuer,
    editable.weaponId,
    editable.bodyPart,
  );

  return 0;
});
