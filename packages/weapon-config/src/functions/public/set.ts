import { Player, InvalidEnum, LimitsEnum } from "@infernus/core";
import { innerGameModeConfig, innerWeaponConfig } from "../../config";
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
  beingReSynced,
  playerHealthBarPadding,
  healthBarVisible,
  playerHealthBarPosX,
  playerHealthBarPosY,
  playerHealthBarSizeX,
  playerHealthBarSizeY,
  playerHealthBarBorderColor,
  playerHealthBarBGColor,
  playerHealthBarFGColor,
} from "../../struct";
import { inflictDamage } from "../internal/damage";
import { damageFeedUpdate } from "../internal/damageFeed";
import { saveSyncData } from "../internal/raknet";
import {
  setHealthBarVisible,
  spawnPlayerInPlace,
  updateHealthBar,
  updateHealthBarSize,
} from "../internal/set";
import { createVendingMachines, destroyVendingMachines } from "../internal/vendingMachines";
import { isBulletWeapon } from "./is";
import { darkenRGBA } from "../../utils/color";

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

  if (damage_type === DamageTypeEnum.RANGE || damage_type === DamageTypeEnum.RANGE_MULTIPLIER) {
    if (!isBulletWeapon(weaponId)) {
      return 0;
    }

    if (!(args.length & 0b1)) {
      return 0;
    }

    const steps = (args.length - 1) / 2;

    if (steps > innerWeaponConfig.MAX_DAMAGE_RANGES) {
      return 0;
    }

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
  } else if (damage_type === DamageTypeEnum.MULTIPLIER || damage_type === DamageTypeEnum.STATIC) {
    s_DamageType[weaponId] = damage_type;
    damageRangeSteps[weaponId] = 0;
    s_WeaponDamage[weaponId] = amount;

    return 1;
  }

  return 0;
}

export function setCustomArmourRules(armour_rules: boolean, torso_rules = false) {
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
  const _player = typeof player === "number" ? player : player.id;
  if (_player >= 0 && _player < LimitsEnum.MAX_PLAYERS) {
    cBugAllowed.set(_player, enabled);
  } else {
    innerGameModeConfig.cBugGlobal = enabled;
    Player.getInstances().forEach((p) => {
      cBugAllowed.set(p.id, enabled);
    });
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
  if (weaponId >= WC_WeaponEnum.UNARMED && weaponId < s_MaxWeaponShootRate.length) {
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
  if (player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS && value > 0.0) {
    playerMaxHealth.set(player.id, value);
    updateHealthBar(player, true);

    return 1;
  }

  return 0;
}

export function setPlayerMaxArmour(player: Player, value: number) {
  if (player.id >= 0 && player.id < LimitsEnum.MAX_PLAYERS && value > 0.0) {
    playerMaxArmour.set(player.id, value);
    updateHealthBar(player, true);

    return 1;
  }

  return 0;
}

export function damagePlayer(
  player: Player,
  amount: number,
  issuerId: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID,
  weaponId: WC_WeaponEnum = WC_WeaponEnum.UNKNOWN,
  bodyPart: WC_BodyPartsEnum = WC_BodyPartsEnum.UNKNOWN,
  ignore_armour = false,
) {
  if (player.id < 0 || player.id >= LimitsEnum.MAX_PLAYERS || !player.isConnected()) {
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
    (issuerId.id < 0 || issuerId.id >= LimitsEnum.MAX_PLAYERS || !issuerId.isConnected())
  ) {
    issuerId = InvalidEnum.PLAYER_ID;
  }

  inflictDamage(player, amount, issuerId, weaponId, bodyPart, ignore_armour);

  return 1;
}

export function resyncPlayer(player: Player) {
  saveSyncData(player);
  beingReSynced.set(player.id, true);
  spawnPlayerInPlace(player);
}

export function setCbugDeathDelay(toggle: boolean) {
  innerGameModeConfig.cBugDeathDelay = toggle;
}

export function setHealthBarPosition(x: number, y: number) {
  innerGameModeConfig.healthBarPosX = x;
  innerGameModeConfig.healthBarPosY = y;

  Player.getInstances().forEach((p) => {
    if (
      healthBarVisible.get(p.id) &&
      (!Number.isNaN(playerHealthBarPosX.get(p.id)) || !Number.isNaN(playerHealthBarPosY.get(p.id)))
    ) {
      setHealthBarVisible(p, false);
      setHealthBarVisible(p, true);
    }
  });
}

export function setHealthBarSize(x: number, y: number) {
  innerGameModeConfig.healthBarSizeX = x;
  innerGameModeConfig.healthBarSizeY = y;

  Player.getInstances().forEach((p) => {
    if (
      healthBarVisible.get(p.id) &&
      (!Number.isNaN(playerHealthBarSizeX.get(p.id)) ||
        !Number.isNaN(playerHealthBarSizeY.get(p.id)))
    ) {
      updateHealthBarSize(p);
    }
  });
}

export function setHealthBarPadding(padding: [number, number, number, number]) {
  innerGameModeConfig.healthBarPadding = [...padding];

  Player.getInstances().forEach((p) => {
    if (
      healthBarVisible.get(p.id) &&
      playerHealthBarPadding.get(p.id).some((v) => !Number.isNaN(v))
    ) {
      setHealthBarVisible(p, false);
      setHealthBarVisible(p, true);
    }
  });
}

export function setHealthBarPositionForPlayer(player: Player, x = Number.NaN, y = Number.NaN) {
  if (!player.isConnected()) return 0;

  playerHealthBarPosX.set(player.id, x);
  playerHealthBarPosY.set(player.id, y);

  if (healthBarVisible.get(player.id)) {
    setHealthBarVisible(player, false);
    setHealthBarVisible(player, true);
  }

  return 1;
}

export function setHealthBarSizeForPlayer(player: Player, x = Number.NaN, y = Number.NaN) {
  if (!player.isConnected()) return 0;

  playerHealthBarSizeX.set(player.id, x);
  playerHealthBarSizeY.set(player.id, y);

  if (healthBarVisible.get(player.id)) {
    updateHealthBarSize(player);
  }

  return 1;
}

export function setHealthBarPaddingForPlayer(
  player: Player,
  padding: [number, number, number, number] = [Number.NaN, Number.NaN, Number.NaN, Number.NaN],
) {
  if (!player.isConnected()) return 0;

  playerHealthBarPadding.set(player.id, [...padding]);

  if (healthBarVisible.get(player.id)) {
    setHealthBarVisible(player, false);
    setHealthBarVisible(player, true);
  }

  return 1;
}

export function setHealthBarColor(borderColor = 0, bgColor = 0, fgColor = 0) {
  if (borderColor !== 0) {
    innerGameModeConfig.healthBarBorderColor = borderColor;
  }

  if (fgColor !== 0) {
    innerGameModeConfig.healthBarFGColor = fgColor;
  }

  if (bgColor !== 0) {
    innerGameModeConfig.healthBarBGColor = bgColor;
  } else if (fgColor !== 0) {
    innerGameModeConfig.healthBarBGColor = darkenRGBA(innerGameModeConfig.healthBarFGColor);
  }

  Player.getInstances().forEach((p) => {
    if (
      healthBarVisible.get(p.id) &&
      (playerHealthBarBorderColor.get(p.id) === 0 ||
        playerHealthBarBGColor.get(p.id) === 0 ||
        playerHealthBarFGColor.get(p.id) === 0)
    ) {
      setHealthBarVisible(p, false);
      setHealthBarVisible(p, true);
    }
  });
}

export function setHealthBarColorForPlayer(
  player: Player,
  borderColor = 0,
  bgColor = 0,
  fgColor = 0,
) {
  if (!player.isConnected()) return 0;

  playerHealthBarBorderColor.set(player.id, borderColor);
  playerHealthBarFGColor.set(player.id, fgColor);

  if (bgColor === 0 && playerHealthBarFGColor.get(player.id) !== 0) {
    playerHealthBarBGColor.set(player.id, darkenRGBA(playerHealthBarFGColor.get(player.id)));
  } else {
    playerHealthBarBGColor.set(player.id, bgColor);
  }

  if (healthBarVisible.get(player.id)) {
    setHealthBarVisible(player, false);
    setHealthBarVisible(player, true);
  }

  return 1;
}
