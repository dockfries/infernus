import {
  PlayerEvent,
  GameMode,
  InvalidEnum,
  KeysEnum,
  Player,
  PlayerStateEnum,
  WeaponEnum,
} from "@infernus/core";
import {
  wc_GetPlayerArmour,
  wc_GetPlayerHealth,
  wc_IsPlayerTeleportAllowed,
  wcc_setPlayerHealth,
} from "../../hooks";
import { orig_playerMethods } from "../../hooks/origin";
import {
  isDying,
  lastStopTick,
  blockAdminTeleport,
  cBugAllowed,
  cBugFroze,
  deathTimer,
  delayedDeathTimer,
  lastExplosive,
  lastShot,
  playerHealth,
  playerMaxHealth,
  previousHits,
  restorePlayerTeleport,
  vendingUseTimer,
} from "../../struct";
import { innerWeaponConfig, innerGameModeConfig } from "../../config";
import { sc_VendingMachines } from "../../constants";
import { VendingMachineIndex } from "../../enums";
import {
  IEditableOnPlayerUseVendingMachine,
  triggerOnPlayerUseVendingMachine,
} from "../custom";
import { freezeSyncPacket } from "../../functions/internal/raknet";
// import { setFakeFacingAngle } from "../../functions/internal/set";
import { wc_VendingMachineUsed } from "../../functions/internal/vendingMachines";
import { angleBetweenPoints } from "../../utils/math";

PlayerEvent.onClickMap(({ player, next }) => {
  if (
    (GameMode.isAdminTeleportAllowed() &&
      orig_playerMethods.isAdmin.call(player)) ||
    wc_IsPlayerTeleportAllowed.call(player)
  ) {
    if (!isDying.get(player.id)) {
      lastStopTick.set(player.id, Date.now());
    } else {
      blockAdminTeleport.set(player.id, true);
    }
  }
  return next();
});

export function wc_CbugPunishment(player: Player, weapon: number) {
  freezeSyncPacket(player, false);
  orig_playerMethods.setArmedWeapon.call(player, weapon);

  if (!isDying.get(player.id)) {
    orig_playerMethods.clearAnimations.call(player, true);
  }
}

PlayerEvent.onKeyStateChange(({ player, newKeys, oldKeys, next }) => {
  let animLib = "",
    animName = "";

  if (
    !cBugAllowed.get(player.id) &&
    !isDying.get(player.id) &&
    orig_playerMethods.getState.call(player) === PlayerStateEnum.ONFOOT
  ) {
    if (newKeys & KeysEnum.CROUCH) {
      const tick = Date.now();
      const diff = tick - lastShot.get(player.id).tick;

      if (
        lastShot.get(player.id).tick &&
        diff < 1200 &&
        !cBugFroze.get(player.id)
      ) {
        orig_playerMethods.playSound.call(player, 1055, 0.0, 0.0, 0.0);

        if (
          lastShot.get(player.id).valid &&
          Math.abs(lastShot.get(player.id).hX) > 1.0 &&
          Math.abs(lastShot.get(player.id).hY) > 1.0
        ) {
          orig_playerMethods.setFacingAngle.call(
            player,
            angleBetweenPoints(
              lastShot.get(player.id).hX,
              lastShot.get(player.id).hY,
              lastShot.get(player.id).oX,
              lastShot.get(player.id).oY,
            ),
          );
        }

        const { weapons: w } = orig_playerMethods.getWeaponData.call(player, 0);

        animLib = "PED";
        animName = "IDLE_stance";
        orig_playerMethods.clearAnimations.call(player, true);
        orig_playerMethods.applyAnimation.call(
          player,
          animLib,
          animName,
          4.1,
          true,
          false,
          false,
          false,
          0,
          1,
        );
        freezeSyncPacket(player, true);
        orig_playerMethods.setArmedWeapon.call(player, w);
        setTimeout(() => {
          wc_CbugPunishment(player, orig_playerMethods.getWeapon.call(player));
        }, 600);

        cBugFroze.set(player.id, tick);

        let j = 0,
          health = 0,
          armour = 0;

        Player.getInstances().forEach((i) => {
          for (j = 0; j < previousHits.get(i.id).length; j++) {
            if (
              previousHits.get(i.id)[j].issuer === player.id &&
              tick - previousHits.get(i.id)[j].tick <= 1200
            ) {
              previousHits.get(i.id)[j].issuer = InvalidEnum.PLAYER_ID;

              health = wc_GetPlayerHealth.call(i);
              armour = wc_GetPlayerArmour.call(i);

              if (isDying.get(i.id)) {
                if (!delayedDeathTimer.get(i.id)) {
                  continue;
                }

                clearTimeout(delayedDeathTimer.get(i.id)!);
                delayedDeathTimer.set(i.id, null);
                orig_playerMethods.clearAnimations.call(i, true);
                // setFakeFacingAngle(i);
                freezeSyncPacket(i, false);

                isDying.set(i.id, false);

                if (restorePlayerTeleport.get(i.id)) {
                  restorePlayerTeleport.set(i.id, false);
                  orig_playerMethods.allowTeleport.call(i, true);
                }

                if (deathTimer.get(i.id)) {
                  clearTimeout(deathTimer.get(i.id)!);
                  deathTimer.set(i.id, null);
                }
              }

              health += previousHits.get(i.id)[j].health;
              armour += previousHits.get(i.id)[j].armour;

              wcc_setPlayerHealth(i, health, armour);
            }
          }
        });
      }
    }
  }

  if (orig_playerMethods.getState.call(player) === PlayerStateEnum.ONFOOT) {
    if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
      if (
        innerGameModeConfig.customVendingMachines &&
        newKeys === KeysEnum.SECONDARY_ATTACK &&
        !oldKeys &&
        !vendingUseTimer.get(player.id) &&
        orig_playerMethods.getAnimationIndex.call(player) !== 1660
      ) {
        let failed = false;

        if (
          orig_playerMethods.getMoney.call(player) <= 0 ||
          playerHealth.get(player.id) >= playerMaxHealth.get(player.id)
        ) {
          failed = true;
        }

        const { z } = orig_playerMethods.getPos.call(player)!;

        for (
          let i = 0, healthGiven = 35.0;
          i < sc_VendingMachines.length;
          i++
        ) {
          if (
            Math.abs(z - sc_VendingMachines[i][VendingMachineIndex.posZ]) > 1.5
          ) {
            continue;
          }

          if (
            orig_playerMethods.isInRangeOfPoint.call(
              player,
              0.5,
              sc_VendingMachines[i][VendingMachineIndex.frontX],
              sc_VendingMachines[i][VendingMachineIndex.frontY],
              z,
            )
          ) {
            if (failed) {
              orig_playerMethods.playSound.call(player, 1055, 0.0, 0.0, 0.0);
              break;
            }

            const editable: IEditableOnPlayerUseVendingMachine = {
              healthGiven,
            };

            if (triggerOnPlayerUseVendingMachine(player, editable)) {
              vendingUseTimer.set(
                player.id,
                setTimeout(() => {
                  wc_VendingMachineUsed(player, editable.healthGiven);
                }, 2500),
              );

              animLib = "VENDING";
              animName = "VEND_USE";
              orig_playerMethods.setFacingAngle.call(
                player,
                sc_VendingMachines[i][VendingMachineIndex.rotZ],
              );
              orig_playerMethods.setPos.call(
                player,
                sc_VendingMachines[i][VendingMachineIndex.frontX],
                sc_VendingMachines[i][VendingMachineIndex.frontY],
                z,
              );
              orig_playerMethods.applyAnimation.call(
                player,
                animLib,
                animName,
                4.1,
                false,
                false,
                true,
                false,
                0,
                1,
              );

              orig_playerMethods.playSound.call(player, 42600, 0.0, 0.0, 0.0);
            } else {
              orig_playerMethods.playSound.call(player, 1055, 0.0, 0.0, 0.0);
            }

            break;
          }
        }
      }
    }

    if (newKeys & KeysEnum.FIRE) {
      const weapon = orig_playerMethods.getWeapon.call(player);

      switch (weapon) {
        case WeaponEnum.BOMB:
        case WeaponEnum.SATCHEL: {
          lastExplosive.set(player.id, WeaponEnum.SATCHEL);
          break;
        }

        case WeaponEnum.ROCKETLAUNCHER:
        case WeaponEnum.HEATSEEKER:
        case WeaponEnum.GRENADE: {
          lastExplosive.set(player.id, weapon);
        }
      }
    }
  }

  if (!isDying.get(player.id)) {
    return next();
  }
  return 0;
});
