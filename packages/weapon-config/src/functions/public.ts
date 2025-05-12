import {
  InvalidEnum,
  LimitsEnum,
  Player,
  PlayerStateEnum,
} from "@infernus/core";
import {
  WC_BodyPartsEnum,
  DamageTypeEnum,
  RejectedReasonEnum,
  WC_WeaponEnum,
} from "../enums";
import {
  beingResynced,
  cBugAllowed,
  damageDoneArmour,
  damageDoneHealth,
  damageFeedPlayer,
  damageRangeRanges,
  damageRangeSteps,
  damageRangeValues,
  enableHealthBar,
  forceClassSelection,
  hitsIssued,
  inClassSelection,
  isDying,
  lastHitIdx,
  lastHitTicks,
  lastHitWeapons,
  lastShotIdx,
  lastShotTicks,
  lastShotWeapons,
  lastUpdate,
  playerMaxArmour,
  playerMaxHealth,
  rejectedHits,
  rejectedHitsIdx,
  shotsFired,
} from "../struct";
import {
  s_WeaponDamage,
  s_DamageType,
  s_DamageArmour,
  s_MaxWeaponShootRate,
  s_WeaponRange,
  g_HitRejectReasons,
} from "../constants";
import { innerGameModeConfig, innerWeaponConfig } from "../config";
import { debugMessage } from "../utils/debug";
import { wc_GetWeaponName } from "../hooks";
import {
  createVendingMachines,
  damageFeedUpdate,
  destroyVendingMachines,
  inflictDamage,
  saveSyncData,
  setHealthBarVisible,
  spawnPlayerInPlace,
} from "./internal";

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

export function setRespawnTime(ms: number) {
  innerGameModeConfig.respawnTime = Math.max(0, ms);
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

export function setWeaponDamage(
  weaponId: WC_WeaponEnum,
  damage_type: DamageTypeEnum,
  amount: number,
  ...args: number[]
) {
  if (weaponId < WC_WeaponEnum.UNARMED || weaponId >= s_WeaponDamage.length) {
    return 0;
  }

  if (
    damage_type === DamageTypeEnum.RANGE ||
    damage_type === DamageTypeEnum.RANGE_MULTIPLIER
  ) {
    if (!isBulletWeapon(weaponId)) {
      return 0;
    }

    if (!(args.length & 0b1)) {
      return 0;
    }

    const steps = (args.length - 1) / 2;

    s_DamageType[weaponId] = damage_type;
    damageRangeSteps[weaponId] = steps;

    for (let i = 0; i < steps; i++) {
      if (i) {
        damageRangeRanges.get(weaponId)[i] = args[(i - 1) * 2];
        damageRangeValues.get(weaponId)[i] = args[(i - 1) * 2 + 1];
      } else {
        damageRangeValues.get(weaponId)[i] = amount;
      }
    }

    return 1;
  } else if (
    damage_type === DamageTypeEnum.MULTIPLIER ||
    damage_type === DamageTypeEnum.STATIC
  ) {
    s_DamageType[weaponId] = damage_type;
    damageRangeSteps[weaponId] = 0;
    s_WeaponDamage[weaponId] = amount;

    return 1;
  }

  return 0;
}

export function getWeaponDamage(weaponId: number) {
  if (weaponId < WC_WeaponEnum.UNARMED || weaponId >= s_WeaponDamage.length) {
    return 0.0;
  }

  return s_WeaponDamage[weaponId];
}

export function setCustomArmourRules(
  armour_rules: boolean,
  torso_rules = false,
) {
  innerGameModeConfig.damageArmourToggle[0] = armour_rules;
  innerGameModeConfig.damageArmourToggle[1] = torso_rules;
}

export function setWeaponArmourRule(
  weaponId: WC_WeaponEnum,
  affects_armour: boolean,
  torso_only = false,
) {
  if (weaponId < WC_WeaponEnum.UNARMED || weaponId >= s_WeaponDamage.length) {
    return 0;
  }

  s_DamageArmour[weaponId][0] = +affects_armour;
  s_DamageArmour[weaponId][1] = +torso_only;

  return 1;
}

export function setDamageSounds(taken: number, given: number) {
  innerGameModeConfig.damageTakenSound = taken;
  innerGameModeConfig.damageGivenSound = given;
}

export function setCbugAllowed(
  enabled: boolean,
  player: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID,
) {
  if (player === InvalidEnum.PLAYER_ID) {
    innerGameModeConfig.cBugGlobal = enabled;
    Player.getInstances().forEach((p) => {
      cBugAllowed.set(p.id, enabled);
    });
  } else {
    cBugAllowed.set(player.id, enabled);
  }

  return enabled;
}

export function getCbugAllowed(
  player: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID,
) {
  if (player === InvalidEnum.PLAYER_ID) {
    return innerGameModeConfig.cBugGlobal;
  }

  return cBugAllowed.get(player.id);
}

export function setCustomFallDamage(
  toggle: boolean,
  damage_multiplier = 25.0,
  death_velocity = -0.6,
) {
  innerGameModeConfig.customFallDamage = toggle;

  if (toggle) {
    s_WeaponDamage[54] = damage_multiplier;
    innerGameModeConfig.fallDeathVelocity = -Math.abs(death_velocity);
  }
}

export function setCustomVendingMachines(toggle: boolean) {
  innerGameModeConfig.customVendingMachines = toggle;

  if (toggle) {
    createVendingMachines();
  } else {
    destroyVendingMachines();
  }
}

export function setVehiclePassengerDamage(toggle: boolean) {
  innerGameModeConfig.vehiclePassengerDamage = toggle;
}

export function setVehicleUnoccupiedDamage(toggle: boolean) {
  innerGameModeConfig.vehicleUnoccupiedDamage = toggle;
}

export function setDamageFeedForPlayer(player: Player, toggle = -1) {
  if (player.isConnected()) {
    damageFeedPlayer.set(player.id, toggle);
    damageFeedUpdate(player);
    return 1;
  }
  return 0;
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

export function setDamageFeed(toggle: boolean) {
  innerGameModeConfig.damageFeed = toggle;
  Player.getInstances().forEach((p) => {
    damageFeedUpdate(p);
  });
}

export function setWeaponShootRate(weaponId: WC_WeaponEnum, max_rate: number) {
  if (
    weaponId >= WC_WeaponEnum.UNARMED &&
    weaponId < s_MaxWeaponShootRate.length
  ) {
    s_MaxWeaponShootRate[weaponId] = max_rate;
    return 1;
  }
  return 0;
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

export function isPlayerDying(player: Player) {
  if (player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS) {
    return isDying.get(player.id);
  }
  return false;
}

export function setWeaponMaxRange(weaponId: WC_WeaponEnum, range: number) {
  if (!isBulletWeapon(weaponId)) {
    return 0;
  }
  s_WeaponRange[weaponId] = range;
  return 1;
}

export function getWeaponMaxRange(weaponId: number) {
  if (!isBulletWeapon(weaponId)) {
    return 0.0;
  }
  return s_WeaponRange[weaponId];
}

export function setPlayerMaxHealth(player: Player, value: number) {
  if (player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS) {
    playerMaxHealth.set(player.id, value);
  }
}

export function setPlayerMaxArmour(player: Player, value: number) {
  if (player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS) {
    playerMaxArmour.set(player.id, value);
  }
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

export function damagePlayer(
  player: Player,
  amount: number,
  issuerId: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID,
  weaponId: WC_WeaponEnum = WC_WeaponEnum.UNKNOWN,
  bodyPart: WC_BodyPartsEnum = WC_BodyPartsEnum.UNKNOWN,
  ignore_armour = false,
) {
  if (
    player.id < 0 ||
    player.id > LimitsEnum.MAX_PLAYERS ||
    !player.isConnected()
  ) {
    return 0;
  }

  if (amount < 0.0) {
    return 0;
  }

  if (weaponId < WC_WeaponEnum.UNARMED || weaponId > WC_WeaponEnum.UNKNOWN) {
    weaponId = WC_WeaponEnum.UNKNOWN;
  }

  if (
    issuerId !== InvalidEnum.PLAYER_ID &&
    (issuerId.id < 0 ||
      issuerId.id > LimitsEnum.MAX_PLAYERS ||
      !issuerId.isConnected())
  ) {
    issuerId = InvalidEnum.PLAYER_ID;
  }

  inflictDamage(player, amount, issuerId, weaponId, bodyPart, ignore_armour);

  return 1;
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

export function resyncPlayer(player: Player) {
  saveSyncData(player);
  beingResynced.set(player.id, true);
  spawnPlayerInPlace(player);
}
