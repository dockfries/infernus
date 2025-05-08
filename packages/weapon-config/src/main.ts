export {
  onInvalidWeaponDamage,
  onPlayerDamage,
  onPlayerDamageDone,
  onPlayerDeathFinished,
  onPlayerPrepareDeath,
  onRejectedHit,
} from "./callbacks/custom";

import "./callbacks/index";
import "./callbacks/raknet";
import "./hooks";

export { defineWeaponConfig, type IWeaponConfig } from "./config";

export * from "./enums";

export {
  averageHitRate,
  averageShootRate,
  damagePlayer,
  enableHealthBarForPlayer,
  getCbugAllowed,
  getRejectedHit,
  getRespawnTime,
  getWeaponDamage,
  getWeaponMaxRange,
  getWeaponShootRate,
  isBulletWeapon,
  isDamageFeedActive,
  isHighRateWeapon,
  isMeleeWeapon,
  isPlayerDying,
  returnWeaponName,
  setCbugAllowed,
  setCustomArmourRules,
  setCustomFallDamage,
  setCustomVendingMachines,
  setDamageFeed,
  setDamageFeedForPlayer,
  setDamageSounds,
  setRespawnTime,
  setVehiclePassengerDamage,
  setVehicleUnoccupiedDamage,
  setWeaponArmourRule,
  setWeaponDamage,
  setWeaponMaxRange,
  setWeaponShootRate,
  wc_IsPlayerPaused,
  wc_IsPlayerSpawned,
} from "./functions/public";
