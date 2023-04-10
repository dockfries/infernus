export const ClearBanList = (): void => {
  samp.callNative("ClearBanList", "");
};

export const IsBanned = (ipaddress: string): boolean => {
  return Boolean(samp.callNative("IsBanned", "s", ipaddress));
};

export const IsValidNickName = (name: string): boolean => {
  return Boolean(samp.callNative("IsValidNickName", "s", name));
};

export const AllowNickNameCharacter = (byte: number, allow: boolean): void => {
  samp.callNative("AllowNickNameCharacter", "ii", byte, allow);
};

export const IsNickNameCharacterAllowed = (byte: number): boolean => {
  return Boolean(samp.callNative("IsNickNameCharacterAllowed", "i", byte));
};

export const AddServerRule = (name: string, value: string): boolean => {
  return Boolean(samp.callNative("AddServerRule", "ss", name, value));
};

export const SetServerRule = (name: string, value: string): boolean => {
  return Boolean(samp.callNative("SetServerRule", "ss", name, value));
};

export const IsValidServerRule = (name: string): boolean => {
  return Boolean(samp.callNative("IsValidServerRule", "s", name));
};

export const RemoveServerRule = (name: string): boolean => {
  return Boolean(samp.callNative("RemoveServerRule", "s", name));
};

export const CountRunningTimers = (): number => {
  return samp.callNative("CountRunningTimers", "");
};

export const AllowAdminTeleport = (allow: boolean) => {
  samp.callNative("AllowAdminTeleport", "i", allow);
};

export const IsAdminTeleportAllowed = (): boolean => {
  return Boolean(samp.callNative("IsAdminTeleportAllowed", ""));
};

export const AllowInteriorWeapons = (allow: boolean) => {
  samp.callNative("AllowInteriorWeapons", "i", allow);
};

export const AreInteriorWeaponsAllowed = (): boolean => {
  return Boolean(samp.callNative("AreInteriorWeaponsAllowed", ""));
};

export const AreAllAnimationsEnabled = () => {
  return Boolean(samp.callNative("AreAllAnimationsEnabled", ""));
};

export const EnableAllAnimations = (enable: boolean) => {
  samp.callNative("EnableAllAnimations", "i", enable);
};
