import { TextDraw } from "@infernus/core";

export interface IWeaponConfigGM {
  lagCompMode: boolean;
  maxShootRateSamples: number;
  maxHitRateSamples: number;
  respawnTime: number;
  customFallDamage: boolean;
  damageFeed: boolean;
  damageFeedHideDelay: number;
  damageFeedMaxUpdateRate: number;
  vehiclePassengerDamage: boolean;
  vehicleUnoccupiedDamage: boolean;
  fallDeathVelocity: number;
  damageTakenSound: number;
  damageGivenSound: number;
  disableSyncBugs: boolean;
  knifeSync: boolean;
  cBugGlobal: boolean;
  cBugDeathDelay: boolean;
  damageArmourToggle: [boolean, boolean];
  customVendingMachines: boolean;
  healthBarBorder: TextDraw | null;
  healthBarBackground: TextDraw | null;
}

export const innerGameModeConfig: IWeaponConfigGM = {
  lagCompMode: false,
  maxShootRateSamples: 4,
  maxHitRateSamples: 4,
  respawnTime: 3000,
  customFallDamage: false,
  damageFeed: true,
  damageFeedHideDelay: 3000,
  damageFeedMaxUpdateRate: 250,
  vehiclePassengerDamage: false,
  vehicleUnoccupiedDamage: false,
  fallDeathVelocity: -0.6,
  damageTakenSound: 1190,
  damageGivenSound: 17802,
  disableSyncBugs: true,
  knifeSync: true,
  cBugGlobal: true,
  cBugDeathDelay: true,
  damageArmourToggle: [false, false],
  customVendingMachines: true,
  healthBarBorder: null,
  healthBarBackground: null,
};

export interface IWeaponConfig {
  DEBUG: boolean;
  DEBUG_SILENT: boolean;
  MAX_REJECTED_HITS: number;
  MAX_DAMAGE_RANGES: number;
  DEATH_WORLD: number;
  FEED_HEIGHT: number;
  FEED_GIVEN_COLOR: number;
  FEED_TAKEN_COLOR: number;
  MAX_CLASSES: number;
  CUSTOM_VENDING_MACHINES: boolean;
  HEALTH_BAR_FG_COLOR: number;
  HEALTH_BAR_BG_COLOR: number;
}

export const innerWeaponConfig: IWeaponConfig = {
  DEBUG: false,
  DEBUG_SILENT: false,
  MAX_REJECTED_HITS: 15,
  MAX_DAMAGE_RANGES: 5,
  DEATH_WORLD: 0x00dead00,
  FEED_HEIGHT: 5,
  FEED_GIVEN_COLOR: 0x30ff50ff,
  FEED_TAKEN_COLOR: 0x33ccffff,
  MAX_CLASSES: 320,
  CUSTOM_VENDING_MACHINES: true,
  HEALTH_BAR_FG_COLOR: 0xb4191dff,
  HEALTH_BAR_BG_COLOR: 0x5a0c0eff,
};

export function defineWeaponConfig(cb: () => Partial<IWeaponConfig>) {
  const config = cb();
  Object.assign(innerWeaponConfig, config);
}
