export const GetWeaponSlot = (weaponid: number): number => {
  return samp.callNative("GetWeaponSlot", "i", weaponid);
};
