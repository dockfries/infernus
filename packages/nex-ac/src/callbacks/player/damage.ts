import {
  InvalidEnum,
  LimitsEnum,
  PlayerEvent,
  WeaponEnum,
} from "@infernus/core";
import { ACInfo } from "../../struct";
import {
  ac_IsValidDamageReason,
  ac_IsValidWeapon,
  ac_KickWithCode,
} from "../../functions";
import { innerACConfig } from "../../config";
import { ac_wSlot } from "../../constants";

PlayerEvent.onTakeDamage(
  ({ player, bodyPart, amount, damage, weapon, next }) => {
    if (ACInfo.get(player.id).acKicked > 0) return true;
    const issuerId = typeof damage === "number" ? damage : damage.id;
    if (
      ACInfo.get(player.id).acACAllow[47] &&
      (amount < 0.0 ||
        (issuerId !== InvalidEnum.PLAYER_ID &&
          !(issuerId >= 0 && issuerId < LimitsEnum.MAX_PLAYERS)) ||
        !(bodyPart >= 3 && bodyPart <= 9) ||
        !ac_IsValidDamageReason(weapon))
    ) {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] Issuerid: ${issuerId}, amount: ${amount}, weaponId: ${weapon}, bodyPart: ${bodyPart}`,
        );
      }
      ac_KickWithCode(player, "", 0, 47, 4);
      return true;
    }
    if (!ACInfo.get(player.id).acDead) ACInfo.get(player.id).acDeathRes = true;
    return next();
  },
);

PlayerEvent.onGiveDamage(
  ({ player, damage, bodyPart, weapon, amount, next }) => {
    if (ACInfo.get(player.id).acKicked > 0) return true;
    if (ACInfo.get(player.id).acACAllow[47]) {
      if (
        amount < 0.0 ||
        !(damage.id >= 0 && damage.id < LimitsEnum.MAX_PLAYERS) ||
        !(bodyPart >= 3 && bodyPart <= 9) ||
        !ac_IsValidWeapon(weapon)
      ) {
        if (innerACConfig.DEBUG) {
          console.log(
            `[Nex-AC DEBUG] Damagedid: ${damage.id}, amount: ${amount}, weaponId: ${weapon}, bodyPart: ${bodyPart}`,
          );
        }
        ac_KickWithCode(player, "", 0, 47, 3);
        return true;
      }
      if (!ACInfo.get(player.id).acDead) {
        const ac_s = ac_wSlot[weapon];
        if (
          ACInfo.get(player.id).acWeapon[ac_s] !== weapon &&
          ACInfo.get(player.id).acSetWeapon[ac_s] !== weapon &&
          weapon !== WeaponEnum.FLAMETHROWER
        ) {
          if (Date.now() - ACInfo.get(player.id).acGtc[6] > player.getPing()) {
            if (innerACConfig.DEBUG) {
              console.log(
                `[Nex-AC DEBUG] Damagedid: ${damage.id}, amount: ${amount}, AC weapon: ${ACInfo.get(player.id).acWeapon[ac_s]}, weaponId: ${weapon}, bodyPart: ${bodyPart}`,
              );
            }
            ac_KickWithCode(player, "", 0, 47, 5);
          }
          return true;
        }
      }
    }
    return next();
  },
);
