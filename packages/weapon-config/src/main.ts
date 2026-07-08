import "./defines";
import "./callbacks/index";
import "./callbacks/raknet";
import "./hooks";

export { setDisableSyncBugs, setKnifeSync } from "./functions/emulated";

export {
  onInvalidWeaponDamage,
  onPlayerDamage,
  onPlayerDamageDone,
  onPlayerDeathFinished,
  onPlayerPrepareDeath,
  onRejectedHit,
} from "./callbacks/custom";

export {
  averageHitRate,
  averageShootRate,
  enableHealthBarForPlayer,
  getHealthBarPosition,
  getHealthBarSize,
  getHealthBarPadding,
  getHealthBarColor,
  getCbugAllowed,
  getRejectedHit,
  getRespawnTime,
  getWeaponDamage,
  getWeaponMaxRange,
  getWeaponShootRate,
  returnWeaponName,
} from "./functions/public/get";

export {
  isBulletWeapon,
  isDamageFeedActive,
  isHighRateWeapon,
  isMeleeWeapon,
  isPlayerDying,
  wc_IsPlayerPaused,
  wc_IsPlayerSpawned,
} from "./functions/public/is";

export {
  damagePlayer,
  setCbugAllowed,
  setCbugDeathDelay,
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
  setHealthBarPosition,
  setHealthBarSize,
  setHealthBarPadding,
  setHealthBarPositionForPlayer,
  setHealthBarSizeForPlayer,
  setHealthBarPaddingForPlayer,
  setHealthBarColor,
  setHealthBarColorForPlayer,
} from "./functions/public/set";

export { defineWeaponConfig, type IWeaponConfig } from "./config";

export * from "./enums";
