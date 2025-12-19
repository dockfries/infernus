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
    return { name: `Weapon ${weaponId}`, ret: false };
  }
  return { name: g_WeaponName[weaponId], ret: true };
};

GameMode.getWeaponName = wc_GetWeaponName;
