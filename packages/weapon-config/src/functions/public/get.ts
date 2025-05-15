import { Player, InvalidEnum, LimitsEnum } from "@infernus/core";
import { innerGameModeConfig, innerWeaponConfig } from "../../config";
import {
  s_WeaponDamage,
  s_MaxWeaponShootRate,
  s_WeaponRange,
  g_HitRejectReasons,
} from "../../constants";
import { WC_WeaponEnum, RejectedReasonEnum } from "../../enums";
import { wc_GetWeaponName } from "../../hooks";
import {
  shotsFired,
  lastShotIdx,
  lastShotTicks,
  lastShotWeapons,
  hitsIssued,
  lastHitIdx,
  lastHitTicks,
  lastHitWeapons,
  enableHealthBar,
  cBugAllowed,
  playerMaxHealth,
  playerMaxArmour,
  damageDoneHealth,
  damageDoneArmour,
  rejectedHitsIdx,
  rejectedHits,
} from "../../struct";
import { debugMessage } from "../../utils/debug";
import { setHealthBarVisible } from "../internal/set";
import { isBulletWeapon } from "./is";

export function averageShootRate(player: Player, shots: number) {
  let multiple_weapons = false;

  if (
    player.id === InvalidEnum.PLAYER_ID ||
    shotsFired.get(player.id) < shots
  ) {
    return { multiple_weapons, ret: -1 };
  }

  let total = 0;
  const idx = lastShotIdx.get(player.id);

  multiple_weapons = false;

  for (
    let i = shots - 2, prev = 0, prev_weapon = 0, prev_idx = 0, this_idx = 0;
    i >= 0;
    i--
  ) {
    prev_idx = (idx - i - 1) % lastShotTicks.get(player.id).length;

    if (prev_idx < 0) {
      prev_idx += lastShotTicks.get(player.id).length;
    }

    prev = lastShotTicks.get(player.id)[prev_idx];
    prev_weapon = lastShotWeapons.get(player.id)[prev_idx];
    this_idx = (idx - i) % lastShotTicks.get(player.id).length;

    if (this_idx < 0) {
      this_idx += lastShotTicks.get(player.id).length;
    }

    if (prev_weapon !== lastShotWeapons.get(player.id)[this_idx]) {
      multiple_weapons = true;
    }

    total += lastShotTicks.get(player.id)[this_idx] - prev;
  }

  return {
    multiple_weapons,
    ret: shots === 1 ? 1 : total / (shots - 1),
  };
}

export function averageHitRate(player: Player, hits: number) {
  let multiple_weapons = false;
  if (player.id === InvalidEnum.PLAYER_ID || hitsIssued.get(player.id) < hits) {
    return { multiple_weapons, ret: -1 };
  }

  let total = 0;
  const idx = lastHitIdx.get(player.id);

  multiple_weapons = false;

  for (
    let i = hits - 2, prev = 0, prev_weapon = 0, prev_idx = 0, this_idx = 0;
    i >= 0;
    i--
  ) {
    prev_idx = (idx - i - 1) % lastHitTicks.get(player.id).length;

    if (prev_idx < 0) {
      prev_idx += lastHitTicks.get(player.id).length;
    }

    prev = lastHitTicks.get(player.id)[prev_idx];
    prev_weapon = lastHitWeapons.get(player.id)[prev_idx];
    this_idx = (idx - i) % lastHitTicks.get(player.id).length;

    if (this_idx < 0) {
      this_idx += lastHitTicks.get(player.id).length;
    }

    if (prev_weapon !== lastHitWeapons.get(player.id)[this_idx]) {
      multiple_weapons = true;
    }

    total += lastHitTicks.get(player.id)[this_idx] - prev;
  }

  return { multiple_weapons, ret: hits === 1 ? 1 : total / (hits - 1) };
}

export function getRespawnTime() {
  return innerGameModeConfig.respawnTime;
}

export const returnWeaponName = wc_GetWeaponName;

export function enableHealthBarForPlayer(player: Player, enable: boolean) {
  if (player.isConnected()) {
    enableHealthBar.set(player.id, enable);
    setHealthBarVisible(player, enable);

    if (innerWeaponConfig.DEBUG) {
      debugMessage(
        player,
        `health bar is ${enableHealthBar.get(player.id) ? "enabled" : "disabled"} for player`,
      );
    }

    return true;
  }
  return false;
}

export function getWeaponDamage(weaponId: number) {
  if (weaponId < WC_WeaponEnum.UNARMED || weaponId >= s_WeaponDamage.length) {
    return 0.0;
  }

  return s_WeaponDamage[weaponId];
}

export function getCbugAllowed(
  player: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID,
) {
  if (player === InvalidEnum.PLAYER_ID) {
    return innerGameModeConfig.cBugGlobal;
  }

  return cBugAllowed.get(player.id);
}

export function getWeaponShootRate(weaponId: number) {
  if (
    weaponId >= WC_WeaponEnum.UNARMED &&
    weaponId < s_MaxWeaponShootRate.length
  ) {
    return s_MaxWeaponShootRate[weaponId];
  }
  return 0;
}

export function getWeaponMaxRange(weaponId: number) {
  if (!isBulletWeapon(weaponId)) {
    return 0.0;
  }
  return s_WeaponRange[weaponId];
}

export function getPlayerMaxHealth(player: Player) {
  if (player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS) {
    return playerMaxHealth.get(player.id);
  }
  return 0.0;
}

export function getPlayerMaxArmour(player: Player) {
  if (player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS) {
    return playerMaxArmour.get(player.id);
  }
  return 0.0;
}

export function getLastDamageHealth(player: Player) {
  if (player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS) {
    return damageDoneHealth.get(player.id);
  }
  return 0.0;
}

export function getLastDamageArmour(player: Player) {
  if (player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS) {
    return damageDoneArmour.get(player.id);
  }
  return 0.0;
}

export function getRejectedHit(player: Player, idx: number) {
  if (idx >= innerWeaponConfig.MAX_REJECTED_HITS) {
    return { ret: 0, output: "" };
  }

  let real_idx =
    (rejectedHitsIdx.get(player.id) - idx) %
    innerWeaponConfig.MAX_REJECTED_HITS;

  if (real_idx < 0) {
    real_idx += innerWeaponConfig.MAX_REJECTED_HITS;
  }

  if (
    !rejectedHits.get(player.id)[real_idx] ||
    !rejectedHits.get(player.id)[real_idx]!.time
  ) {
    return { ret: 0, output: "" };
  }

  const reason = rejectedHits.get(player.id)[real_idx]!.reason,
    hour = rejectedHits.get(player.id)[real_idx]!.hour,
    minute = rejectedHits.get(player.id)[real_idx]!.minute,
    second = rejectedHits.get(player.id)[real_idx]!.second,
    i1 = rejectedHits.get(player.id)[real_idx]!.info1,
    i2 = rejectedHits.get(player.id)[real_idx]!.info2,
    i3 = rejectedHits.get(player.id)[real_idx]!.info3,
    weapon = rejectedHits.get(player.id)[real_idx]!.weapon;

  const weapon_name = wc_GetWeaponName(weapon);

  let output = "";

  switch (reason) {
    case RejectedReasonEnum.SHOOTING_RATE_TOO_FAST:
    case RejectedReasonEnum.HIT_RATE_TOO_FAST: {
      output = g_HitRejectReasons(reason + "", [i1, i2, i3]);
      break;
    }
    case RejectedReasonEnum.HIT_OUT_OF_RANGE:
    case RejectedReasonEnum.SHOOTING_RATE_TOO_FAST_MULTIPLE:
    case RejectedReasonEnum.HIT_RATE_TOO_FAST_MULTIPLE: {
      g_HitRejectReasons(reason + "", [i1, i2]);
      break;
    }
    case RejectedReasonEnum.HIT_MULTIPLE_PLAYERS:
    case RejectedReasonEnum.HIT_MULTIPLE_PLAYERS_SHOTGUN:
    case RejectedReasonEnum.HIT_INVALID_HITTYPE:
    case RejectedReasonEnum.HIT_TOO_FAR_FROM_SHOT:
    case RejectedReasonEnum.HIT_TOO_FAR_FROM_ORIGIN:
    case RejectedReasonEnum.HIT_INVALID_DAMAGE:
    case RejectedReasonEnum.HIT_INVALID_VEHICLE:
    case RejectedReasonEnum.HIT_DISCONNECTED: {
      g_HitRejectReasons(reason + "", [i1]);
      break;
    }
    default: {
      g_HitRejectReasons(reason + "");
    }
  }

  output = `[%${hour + "".padStart(2, "0")}:${minute + "".padStart(2, "0")}:${second + "".padStart(2, "0")}] (${weapon_name} -> ${rejectedHits.get(player.id)[real_idx]!.name}) ${output}`;

  return { ret: 1, output };
}
