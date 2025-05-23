import { GameMode } from "@infernus/core";
import { g_WeaponName } from "../constants";
import { WC_WeaponEnum } from "../enums";

export function setWeaponName(weaponId: WC_WeaponEnum, name: string) {
  if (weaponId < WC_WeaponEnum.UNARMED || weaponId >= g_WeaponName.length) {
    return false;
  }
  g_WeaponName[weaponId] = name;
  return true;
}

export const wc_GetWeaponName = function (weaponId: number) {
  if (weaponId < WC_WeaponEnum.UNARMED || weaponId >= g_WeaponName.length) {
    return `Weapon ${weaponId}`;
  }
  return g_WeaponName[weaponId];
};

GameMode.getWeaponName = wc_GetWeaponName;
