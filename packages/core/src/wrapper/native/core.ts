import type {
  WeaponEnum,
  DamageDeathReasonEnum,
  MarkerModesEnum,
} from "core/enums";

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

export const GetConsoleVarAsByteArray = (varname: string) => {
  return samp.callNative(
    "GetConsoleVarAsString",
    "sAi",
    varname,
    64
  ) as number[];
};

export const GetConsoleVarAsInt = (varname: string): number => {
  return samp.callNative("GetConsoleVarAsInt", "s", varname);
};

export const GetConsoleVarAsBool = (varname: string) => {
  return Boolean(samp.callNative("GetConsoleVarAsBool", "s", varname));
};

export const GetWeather = (): number => {
  return samp.callNative("GetWeather", "");
};

export const GetServerRuleFlags = (rule: string): number => {
  return samp.callNative("GetServerRuleFlags", "s", rule);
};

export const SetServerRuleFlags = (rule: string, flags: number) => {
  return Boolean(samp.callNative("SetServerRuleFlags", "si", rule, flags));
};

export const SetModeRestartTime = (seconds: number) => {
  return Boolean(samp.callNative("SetModeRestartTime", "f", seconds));
};

export const GetModeRestartTime = (): number => {
  return samp.callNativeFloat("GetModeRestartTime", "");
};

export const GameTextForAll = (
  string: string,
  time: number,
  style: number
): number => {
  return samp.callNative("GameTextForAll", "sii", string, time, style);
};

export const HideGameTextForAll = (style: number) => {
  samp.callNative("HideGameTextForAll", "i", style);
};

export const SendDeathMessage = (
  killer: number,
  killee: number,
  weapon: WeaponEnum | DamageDeathReasonEnum
): number => {
  return samp.callNative("SendDeathMessage", "iii", killer, killee, weapon);
};

export const GetMaxPlayers = (): number => {
  return samp.callNative("GetMaxPlayers", "");
};

export const VectorSize = (
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
): number => {
  return samp.callNativeFloat("VectorSize", "ffffff", x1, y1, z1, x2, y2, z2);
};

export const SetGameModeText = (string: string): number => {
  return samp.callNative("SetGameModeText", "s", string);
};

export const ShowNameTags = (show: boolean): number => {
  return samp.callNative("ShowNameTags", "i", show);
};

export const ShowPlayerMarkers = (mode: MarkerModesEnum): number => {
  return samp.callNative("ShowPlayerMarkers", "i", mode);
};

export const GameModeExit = (): number => {
  return samp.callNative("GameModeExit", "");
};

export const SetWorldTime = (hour: number): number => {
  return samp.callNative("SetWorldTime", "i", hour);
};

export const GetWorldTime = (): number => {
  return samp.callNative("GetWorldTime", "");
};

export const EnableVehicleFriendlyFire = (): number => {
  return samp.callNative("EnableVehicleFriendlyFire", "");
};

export const SetWeather = (weatherid: number): number => {
  return samp.callNative("SetWeather", "i", weatherid);
};

export const GetGravity = (): number => {
  return samp.callNativeFloat("GetGravity", "");
};

export const SetGravity = (gravity: number): number => {
  return samp.callNative("SetGravity", "f", gravity);
};

export const CreateExplosion = (
  X: number,
  Y: number,
  Z: number,
  type: number,
  Radius: number
): number => {
  return samp.callNative("CreateExplosion", "fffif", X, Y, Z, type, Radius);
};

export const EnableZoneNames = (enable: boolean): number => {
  return samp.callNative("EnableZoneNames", "i", enable);
};

export const UsePlayerPedAnims = (): number => {
  return samp.callNative("UsePlayerPedAnims", "");
};

export const DisableInteriorEnterExits = (): number => {
  return samp.callNative("DisableInteriorEnterExits", "");
};

export const SetNameTagDrawDistance = (distance: number): number => {
  return samp.callNative("SetNameTagDrawDistance", "f", distance);
};

export const DisableNameTagLOS = (): number => {
  return samp.callNative("DisableNameTagLOS", "");
};

export const LimitGlobalChatRadius = (chat_radius: number): number => {
  return samp.callNative("LimitGlobalChatRadius", "f", chat_radius);
};

export const LimitPlayerMarkerRadius = (marker_radius: number): number => {
  return samp.callNative("LimitPlayerMarkerRadius", "f", marker_radius);
};

export const ConnectNPC = (name: string, script: string): number => {
  return samp.callNative("ConnectNPC", "ss", name, script);
};

export const GetServerTickRate = (): number => {
  return samp.callNative("GetServerTickRate", "");
};

export const GetAnimationName = (index: number): Array<string> => {
  return samp.callNative("GetAnimationName", "iSiSi", index, 32, 32);
};

export const EnableStuntBonusForAll = (enable: boolean): number => {
  return samp.callNative("EnableStuntBonusForAll", "i", enable);
};

export const ToggleChatTextReplacement = (toggle: boolean): void => {
  samp.callNative("ToggleChatTextReplacement", "i", toggle);
};

export const ChatTextReplacementToggled = (): boolean => {
  return Boolean(samp.callNative("ChatTextReplacementToggled", ""));
};

export const GetWeaponSlot = (weaponId: number): number => {
  return samp.callNative("GetWeaponSlot", "i", weaponId);
};

export const GetWeaponName = (weaponId: number): string => {
  return samp.callNative("GetWeaponName", "iSi", weaponId, 32);
};
