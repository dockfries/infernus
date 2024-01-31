export const GetWeaponSlot = (weaponId: number): number => {
  return samp.callNative("GetWeaponSlot", "i", weaponId);
};

export const GetWeaponName = (weaponId: number): string => {
  return samp.callNative("GetWeaponName", "iSi", weaponId, 32);
};
