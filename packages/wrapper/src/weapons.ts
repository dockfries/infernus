export const GetWeaponSlot = (weaponId: number): number => {
  return samp.callNative("GetWeaponSlot", "i", weaponId);
};
