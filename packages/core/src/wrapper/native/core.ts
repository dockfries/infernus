import type {
  WeaponEnum,
  DamageDeathReasonEnum,
  MarkerModesEnum,
} from "core/enums";

export const IsValidNickName = (name: string): boolean => {
  return !!samp.callNative("IsValidNickName", "s", name);
};

export const AllowNickNameCharacter = (byte: number, allow: boolean): void => {
  samp.callNative("AllowNickNameCharacter", "ii", byte, allow);
};

export const IsNickNameCharacterAllowed = (byte: number): boolean => {
  return !!samp.callNative("IsNickNameCharacterAllowed", "i", byte);
};

export const AddServerRule = (name: string, value: string): boolean => {
  return !!samp.callNative("AddServerRule", "ss", name, value);
};

export const SetServerRule = (name: string, value: string): boolean => {
  return !!samp.callNative("SetServerRule", "ss", name, value);
};

export const IsValidServerRule = (name: string): boolean => {
  return !!samp.callNative("IsValidServerRule", "s", name);
};

export const RemoveServerRule = (name: string): boolean => {
  return !!samp.callNative("RemoveServerRule", "s", name);
};

export const AllowAdminTeleport = (allow: boolean): void => {
  samp.callNative("AllowAdminTeleport", "i", allow);
};

export const IsAdminTeleportAllowed = (): boolean => {
  return !!samp.callNative("IsAdminTeleportAllowed", "");
};

export const AllowInteriorWeapons = (allow: boolean): void => {
  samp.callNative("AllowInteriorWeapons", "i", allow);
};

export const AreInteriorWeaponsAllowed = (): boolean => {
  return !!samp.callNative("AreInteriorWeaponsAllowed", "");
};

export const AreAllAnimationsEnabled = (): boolean => {
  return !!samp.callNative("AreAllAnimationsEnabled", "");
};

export const EnableAllAnimations = (enable: boolean): void => {
  samp.callNative("EnableAllAnimations", "i", enable);
};

export const GetConsoleVarAsByteArray = (varname: string) => {
  const [consoleVarBuf, ret]: [number[], number] = samp.callNative(
    "GetConsoleVarAsString",
    "sAi",
    varname,
    64,
  );
  return { consoleVarBuf, ret };
};

export const GetConsoleVarAsInt = (varname: string): number => {
  return samp.callNative("GetConsoleVarAsInt", "s", varname);
};

export const GetConsoleVarAsBool = (varname: string) => {
  return !!samp.callNative("GetConsoleVarAsBool", "s", varname);
};

export const GetWeather = (): number => {
  return samp.callNative("GetWeather", "");
};

export const GetServerRuleFlags = (rule: string): number => {
  return samp.callNative("GetServerRuleFlags", "s", rule);
};

export const SetServerRuleFlags = (rule: string, flags: number) => {
  return !!samp.callNative("SetServerRuleFlags", "si", rule, flags);
};

export const SetModeRestartTime = (seconds: number) => {
  return !!samp.callNative("SetModeRestartTime", "f", seconds);
};

export const GetModeRestartTime = (): number => {
  return samp.callNativeFloat("GetModeRestartTime", "");
};

export const GameTextForAll = (
  string: number[],
  time: number,
  style: number,
): boolean => {
  return !!samp.callNative("GameTextForAll", "aii", string, time, style);
};

export const HideGameTextForAll = (style: number): boolean => {
  return !!samp.callNative("HideGameTextForAll", "i", style);
};

export const SendDeathMessage = (
  killer: number,
  killee: number,
  weapon: WeaponEnum | DamageDeathReasonEnum,
): boolean => {
  return !!samp.callNative("SendDeathMessage", "iii", killer, killee, weapon);
};

export const GetMaxPlayers = (): number => {
  return samp.callNative("GetMaxPlayers", "");
};

export const VectorSize = (x: number, y: number, z: number): number => {
  return Math.sqrt(x * x + y * y + z * z);
};

export const SetGameModeText = (string: string): boolean => {
  return !!samp.callNative("SetGameModeText", "s", string);
};

export const ShowNameTags = (show: boolean): void => {
  samp.callNative("ShowNameTags", "i", show);
};

export const ShowPlayerMarkers = (mode: MarkerModesEnum): void => {
  samp.callNative("ShowPlayerMarkers", "i", mode);
};

export const GameModeExit = (): void => {
  samp.callNative("GameModeExit", "");
};

export const SetWorldTime = (hour: number): void => {
  samp.callNative("SetWorldTime", "i", hour);
};

export const GetWorldTime = (): number => {
  return samp.callNative("GetWorldTime", "");
};

export const EnableVehicleFriendlyFire = (): void => {
  samp.callNative("EnableVehicleFriendlyFire", "");
};

export const SetWeather = (weatherId: number): void => {
  samp.callNative("SetWeather", "i", weatherId);
};

export const GetGravity = (): number => {
  return samp.callNativeFloat("GetGravity", "");
};

export const SetGravity = (gravity: number): void => {
  samp.callNative("SetGravity", "f", gravity);
};

export const CreateExplosion = (
  x: number,
  y: number,
  z: number,
  type: number,
  radius: number,
): boolean => {
  return !!samp.callNative("CreateExplosion", "fffif", x, y, z, type, radius);
};

export const EnableZoneNames = (enable: boolean): void => {
  samp.callNative("EnableZoneNames", "i", enable);
};

export const UsePlayerPedAnims = (): void => {
  samp.callNative("UsePlayerPedAnims", "");
};

export const DisableInteriorEnterExits = (): void => {
  samp.callNative("DisableInteriorEnterExits", "");
};

export const SetNameTagDrawDistance = (distance: number): void => {
  samp.callNative("SetNameTagDrawDistance", "f", distance);
};

export const DisableNameTagLOS = (): void => {
  samp.callNative("DisableNameTagLOS", "");
};

export const LimitGlobalChatRadius = (chatRadius: number): boolean => {
  return !!samp.callNative("LimitGlobalChatRadius", "f", chatRadius);
};

export const LimitPlayerMarkerRadius = (markerRadius: number): boolean => {
  return !!samp.callNative("LimitPlayerMarkerRadius", "f", markerRadius);
};

export const ConnectNPC = (name: string, script: string): number => {
  return samp.callNative("ConnectNPC", "ss", name, script);
};

export const GetServerTickRate = (): number => {
  return samp.callNative("GetServerTickRate", "");
};

export const GetAnimationName = (index: number) => {
  const [animLib, animName, ret] = samp.callNative(
    "GetAnimationName",
    "iSiSi",
    index,
    32,
    32,
  ) as [string, string, number];
  return {
    animLib,
    animName,
    ret: !!ret,
  };
};

export const EnableStuntBonusForAll = (enable: boolean): void => {
  samp.callNative("EnableStuntBonusForAll", "i", enable);
};

export const ToggleChatTextReplacement = (toggle: boolean): void => {
  samp.callNative("ToggleChatTextReplacement", "i", toggle);
};

export const ChatTextReplacementToggled = (): boolean => {
  return !!samp.callNative("ChatTextReplacementToggled", "");
};

export const GetWeaponSlot = (weaponId: number): number => {
  return samp.callNative("GetWeaponSlot", "i", weaponId);
};

export const GetWeaponName = (weaponId: number) => {
  const [name, ret] = samp.callNative("GetWeaponName", "iSi", weaponId, 32) as [
    string,
    number,
  ];
  return { name, ret: !!ret };
};
