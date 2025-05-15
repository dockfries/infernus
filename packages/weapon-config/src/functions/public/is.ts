import { Player, PlayerStateEnum, LimitsEnum } from "@infernus/core";
import { innerGameModeConfig } from "../../config";
import { WC_WeaponEnum } from "../../enums";
import {
  isDying,
  beingResynced,
  inClassSelection,
  forceClassSelection,
  lastUpdate,
  damageFeedPlayer,
} from "../../struct";

export function isBulletWeapon(weaponId: number) {
  return (
    (weaponId >= WC_WeaponEnum.COLT45 && weaponId <= WC_WeaponEnum.SNIPER) ||
    weaponId === WC_WeaponEnum.MINIGUN
  );
}

export function isHighRateWeapon(weaponId: number) {
  switch (weaponId) {
    case (WC_WeaponEnum.FLAMETHROWER,
    WC_WeaponEnum.SPRAYCAN,
    WC_WeaponEnum.FIREEXTINGUISHER,
    WC_WeaponEnum.CARPARK,
    WC_WeaponEnum.REASON_DROWN): {
      return true;
    }
  }

  return false;
}

export function isMeleeWeapon(weaponId: number) {
  return (
    (weaponId >= WC_WeaponEnum.UNARMED && weaponId <= WC_WeaponEnum.CANE) ||
    weaponId === WC_WeaponEnum.PISTOLWHIP
  );
}

export function wc_IsPlayerSpawned(player: Player) {
  if (isDying.get(player.id) || beingResynced.get(player.id)) {
    return false;
  }

  if (inClassSelection.get(player.id) || forceClassSelection.get(player.id)) {
    return false;
  }

  const state = player.getState();
  return (
    (state >= PlayerStateEnum.ONFOOT && state <= PlayerStateEnum.PASSENGER) ||
    state === PlayerStateEnum.SPAWNED
  );
}

export function wc_IsPlayerPaused(player: Player) {
  return Date.now() - lastUpdate.get(player.id) > 2000;
}

export function isDamageFeedActive(player: Player | -1 = -1) {
  if (player !== -1) {
    return (
      damageFeedPlayer.get(player.id) === 1 ||
      (innerGameModeConfig.damageFeed && damageFeedPlayer.get(player.id) !== 0)
    );
  }

  return innerGameModeConfig.damageFeed;
}

export function isPlayerDying(player: Player) {
  if (player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS) {
    return isDying.get(player.id);
  }
  return false;
}
