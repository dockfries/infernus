import { Player, InvalidEnum } from "@infernus/core";
import {
  triggerOnRejectedHit,
  triggerOnPlayerDeathFinished,
  triggerOnInvalidWeaponDamage,
  triggerOnPlayerDamageDone,
} from "../../callbacks/custom";
import { innerWeaponConfig, innerGameModeConfig } from "../../config";
import { g_HitRejectReasons } from "../../constants";
import { InvalidDamageEnum } from "../../enums";
import { wc_GetWeaponName } from "../../hooks/weapon";
import { orig_playerMethods } from "../../hooks/origin";
import {
  RejectedHit,
  playerHealth,
  playerMaxHealth,
  deathTimer,
  previousHitIdx,
  previousHits,
  damageDoneHealth,
  damageDoneArmour,
  spectating,
} from "../../struct";
import {
  debugMessageRed,
  debugMessageRedAll,
  debugMessageAll,
} from "../../utils/debug";
import { isHighRateWeapon } from "../public/is";
import { damageFeedAddHitGiven, damageFeedAddHitTaken } from "./damageFeed";

export function onRejectedHit(player: Player, hit: RejectedHit) {
  if (innerWeaponConfig.DEBUG) {
    let output = "";
    const reason = hit.reason;
    const i1 = hit.info1;
    const i2 = hit.info2;
    const i3 = hit.info3;
    const weapon = hit.weapon;

    const name = wc_GetWeaponName(weapon);

    output = `(${name} -> ${hit.name}) ${g_HitRejectReasons(reason + "", [i1, i2, i3])}`;

    debugMessageRed(player, `Rejected hit: ${output}`);
  }

  triggerOnRejectedHit(player, hit);
}

export function onPlayerDeathFinished(player: Player, cancelable: boolean) {
  if (playerHealth.get(player.id) === 0.0) {
    playerHealth.set(player.id, playerMaxHealth.get(player.id));
  }

  if (deathTimer.get(player.id)) {
    clearTimeout(deathTimer.get(player.id)!);
    deathTimer.set(player.id, null);
  }

  const retVal = triggerOnPlayerDeathFinished(player);

  if (!retVal && cancelable) {
    return 0;
  }

  orig_playerMethods.resetWeapons.call(player);

  return 1;
}

export function onInvalidWeaponDamage(
  player: Player | InvalidEnum.PLAYER_ID,
  damaged: Player,
  amount: number,
  weapon: number,
  bodyPart: number,
  error: InvalidDamageEnum,
  given: boolean,
) {
  debugMessageRedAll(
    `OnInvalidWeaponDamage(${typeof player === "number" ? player : player.id}, ${damaged.id}, ${amount}, ${weapon}, ${bodyPart}, ${error}, ${given}})`,
  );

  triggerOnInvalidWeaponDamage(
    player,
    damaged,
    amount,
    weapon,
    bodyPart,
    error,
    given,
  );
}

export function onPlayerDamageDone(
  player: Player,
  amount: number,
  issuer: Player | InvalidEnum.PLAYER_ID,
  weapon: number,
  bodyPart: number,
) {
  const idx = previousHitIdx.get(player.id);

  previousHitIdx.set(
    player.id,
    (previousHitIdx.get(player.id) - 1) % previousHits.get(player.id).length,
  );

  if (previousHitIdx.get(player.id) < 0) {
    previousHitIdx.set(
      player.id,
      previousHitIdx.get(player.id) + previousHits.get(player.id).length,
    );
  }

  previousHits.get(player.id)[idx].tick = Date.now();
  previousHits.get(player.id)[idx].issuer =
    typeof issuer === "number" ? issuer : issuer.id;
  previousHits.get(player.id)[idx].weapon = weapon;
  previousHits.get(player.id)[idx].amount = amount;
  previousHits.get(player.id)[idx].bodyPart = bodyPart;
  previousHits.get(player.id)[idx].health = damageDoneHealth.get(player.id);
  previousHits.get(player.id)[idx].armour = damageDoneArmour.get(player.id);

  if (!isHighRateWeapon(weapon)) {
    debugMessageAll(
      `OnPlayerDamageDone(${typeof issuer === "number" ? issuer : issuer.id} did ${amount} to ${player.id} with ${weapon} on bodyPart ${bodyPart})`,
    );

    if (innerGameModeConfig.damageTakenSound) {
      orig_playerMethods.playSound.call(
        player,
        innerGameModeConfig.damageTakenSound,
        0.0,
        0.0,
        0.0,
      );

      Player.getInstances().forEach((i) => {
        if (spectating.get(i.id) === player.id && i !== player) {
          orig_playerMethods.playSound.call(
            i,
            innerGameModeConfig.damageTakenSound,
            0.0,
            0.0,
            0.0,
          );
        }
      });
    }

    if (
      innerGameModeConfig.damageGivenSound &&
      issuer !== InvalidEnum.PLAYER_ID
    ) {
      orig_playerMethods.playSound.call(
        issuer,
        innerGameModeConfig.damageGivenSound,
        0.0,
        0.0,
        0.0,
      );

      Player.getInstances().forEach((i) => {
        if (spectating.get(i.id) === issuer.id && i !== issuer) {
          orig_playerMethods.playSound.call(
            i,
            innerGameModeConfig.damageGivenSound,
            0.0,
            0.0,
            0.0,
          );
        }
      });
    }
  }

  if (issuer !== InvalidEnum.PLAYER_ID) {
    damageFeedAddHitGiven(issuer, player, amount, weapon);
  }

  damageFeedAddHitTaken(player, issuer, amount, weapon);

  triggerOnPlayerDamageDone(player, amount, issuer, weapon, bodyPart);
}
