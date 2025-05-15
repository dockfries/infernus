import { Player, InvalidEnum, LimitsEnum } from "@infernus/core";
import { innerGameModeConfig } from "../../config";
import {
  s_WeaponDamage,
  s_DamageType,
  s_DamageArmour,
  s_MaxWeaponShootRate,
  s_WeaponRange,
} from "../../constants";
import { WC_WeaponEnum, DamageTypeEnum, WC_BodyPartsEnum } from "../../enums";
import {
  damageRangeSteps,
  damageRangeRanges,
  damageRangeValues,
  cBugAllowed,
  damageFeedPlayer,
  playerMaxHealth,
  playerMaxArmour,
  beingResynced,
} from "../../struct";
import { inflictDamage } from "../internal/damage";
import { damageFeedUpdate } from "../internal/damageFeed";
import { saveSyncData } from "../internal/raknet";
import { spawnPlayerInPlace } from "../internal/set";
import {
  createVendingMachines,
  destroyVendingMachines,
} from "../internal/vendingMachines";
import { isBulletWeapon } from "./is";

export function setRespawnTime(ms: number) {
  innerGameModeConfig.respawnTime = Math.max(0, ms);
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

export function setWeaponMaxRange(weaponId: WC_WeaponEnum, range: number) {
  if (!isBulletWeapon(weaponId)) {
    return 0;
  }
  s_WeaponRange[weaponId] = range;
  return 1;
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

export function resyncPlayer(player: Player) {
  saveSyncData(player);
  beingResynced.set(player.id, true);
  spawnPlayerInPlace(player);
}
