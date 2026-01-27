import type {
  CameraCutStylesEnum,
  CameraModesEnum,
  DamageDeathReasonEnum,
  FightingStylesEnum,
  KeysEnum,
  PlayerStateEnum,
  SpecialActionsEnum,
  SpectateModesEnum,
  WeaponEnum,
  WeaponSkillsEnum,
  WeaponStatesEnum,
} from "core/enums";
import type { IBounds } from "./interfaces/Bounds";
import type { IOffsets } from "./interfaces/Offsets";
import type { IQuat } from "./interfaces/Quat";
import { rgba } from "core/utils/color";
import { ICommonRetVal } from "core/interfaces";

export const TogglePlayerWidescreen = (
  playerId: number,
  set: boolean,
): boolean => {
  return !!samp.callNative("TogglePlayerWidescreen", "ii", playerId, set);
};

export const IsPlayerWidescreenToggled = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerWidescreenToggled", "i", playerId);
};

export const GetPlayerSkillLevel = (
  playerId: number,
  skill: number,
): number => {
  return samp.callNative("GetPlayerSkillLevel", "ii", playerId, skill);
};

export const GetPlayerWeather = (playerId: number): number => {
  return samp.callNative("GetPlayerWeather", "i", playerId);
};

export const GetPlayerWorldBounds = (
  playerId: number,
): IBounds & ICommonRetVal => {
  const [xMax = 0.0, xMin = 0.0, yMax = 0.0, yMin = 0.0, ret]: number[] =
    samp.callNative("GetPlayerWorldBounds", "iFFFF", playerId);
  return { xMax, xMin, yMax, yMin, ret: !!ret };
};

export const GetPlayerZAim = (playerId: number): number => {
  return samp.callNativeFloat("GetPlayerZAim", "i", playerId);
};

export const GetPlayerSurfingOffsets = (
  playerId: number,
): IOffsets & ICommonRetVal => {
  const [fOffsetX = 0.0, fOffsetY = 0.0, fOffsetZ = 0.0, ret]: number[] =
    samp.callNative("GetPlayerSurfingOffsets", "iFFF", playerId);
  return { fOffsetX, fOffsetY, fOffsetZ, ret: !!ret };
};

export const GetPlayerRotationQuat = (
  playerId: number,
): IQuat & ICommonRetVal => {
  const [w = 0.0, x = 0.0, y = 0.0, z = 0.0, ret]: [
    number,
    number,
    number,
    number,
    number,
  ] = samp.callNative("GetPlayerRotationQuat", "iFFFF", playerId);
  return { w, x, y, z, ret: !!ret };
};

export const GetPlayerDialogID = (playerId: number): number => {
  return samp.callNative("GetPlayerDialogID", "i", playerId);
};

export const GetPlayerSpectateID = (playerId: number): number => {
  return samp.callNative("GetPlayerSpectateID", "i", playerId);
};

export const GetPlayerSpectateType = (playerId: number): number => {
  return samp.callNative("GetPlayerSpectateType", "i", playerId);
};

export const SetPlayerGravity = (
  playerId: number,
  gravity: number,
): boolean => {
  return !!samp.callNative("SetPlayerGravity", "if", playerId, gravity);
};

export const GetPlayerGravity = (playerId: number): number => {
  return samp.callNativeFloat("GetPlayerGravity", "i", playerId);
};

export const IsPlayerSpawned = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerSpawned", "i", playerId);
};

export const IsPlayerControllable = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerControllable", "i", playerId);
};

export const IsPlayerCameraTargetEnabled = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerCameraTargetEnabled", "i", playerId);
};

export const TogglePlayerGhostMode = (
  playerId: number,
  toggle: boolean,
): boolean => {
  return !!samp.callNative("TogglePlayerGhostMode", "ii", playerId, toggle);
};

export const GetPlayerGhostMode = (playerId: number): boolean => {
  return !!samp.callNative("GetPlayerGhostMode", "i", playerId);
};

export const GetPlayerBuildingsRemoved = (playerId: number): number => {
  return samp.callNative("GetPlayerBuildingsRemoved", "i", playerId);
};

export const RemovePlayerWeapon = (
  playerId: number,
  weaponId: number,
): boolean => {
  return !!samp.callNative("RemovePlayerWeapon", "ii", playerId, weaponId);
};

export const HidePlayerDialog = (playerId: number): boolean => {
  return !!samp.callNative("HidePlayerDialog", "i", playerId);
};

export const IsPlayerUsingOfficialClient = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerUsingOfficialClient", "i", playerId);
};

export const AllowPlayerTeleport = (
  playerId: number,
  allow: boolean,
): boolean => {
  return !!samp.callNative("AllowPlayerTeleport", "ii", playerId, allow);
};

export const IsPlayerTeleportAllowed = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerTeleportAllowed", "i", playerId);
};

export const AllowPlayerWeapons = (
  playerId: number,
  allow: boolean,
): boolean => {
  return !!samp.callNative("AllowPlayerWeapons", "i", playerId, allow);
};

export const ArePlayerWeaponsAllowed = (playerId: number): boolean => {
  return !!samp.callNative("ArePlayerWeaponsAllowed", "i", playerId);
};

export const GameTextForPlayer = (
  playerId: number,
  string: number[],
  time: number,
  style: number,
): boolean => {
  return !!samp.callNative(
    "GameTextForPlayer",
    "iaii",
    playerId,
    string,
    time,
    style,
  );
};

export const HasGameText = (playerId: number, style: number): boolean => {
  return !!samp.callNative("HasGameText", "ii", playerId, style);
};

export const SendDeathMessageToPlayer = (
  playerId: number,
  killer: number,
  killee: number,
  weapon: WeaponEnum | DamageDeathReasonEnum,
): boolean => {
  return !!samp.callNative(
    "SendDeathMessageToPlayer",
    "iiii",
    playerId,
    killer,
    killee,
    weapon,
  );
};

export const HideGameTextForPlayer = (
  playerId: number,
  style: number,
): boolean => {
  return !!samp.callNative("HideGameTextForPlayer", "ii", playerId, style);
};

export const IsPlayerNPC = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerNPC", "i", playerId);
};

export const SetPlayerPos = (
  playerId: number,
  x: number,
  y: number,
  z: number,
): boolean => {
  return !!samp.callNative("SetPlayerPos", "ifff", playerId, x, y, z);
};

export const SetPlayerPosFindZ = (
  playerId: number,
  x: number,
  y: number,
  z: number,
): boolean => {
  return !!samp.callNative("SetPlayerPosFindZ", "ifff", playerId, x, y, z);
};

export const GetPlayerPos = (playerId: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetPlayerPos",
    "iFFF",
    playerId,
  );
  return { x, y, z, ret: !!ret };
};

export const SetPlayerFacingAngle = (
  playerId: number,
  ang: number,
): boolean => {
  return !!samp.callNative("SetPlayerFacingAngle", "if", playerId, ang);
};

export const GetPlayerFacingAngle = (playerId: number) => {
  const [angle, ret]: [number, number] = samp.callNative(
    "GetPlayerFacingAngle",
    "iF",
    playerId,
  );
  return { angle, ret: !!ret };
};

export const IsPlayerInRangeOfPoint = (
  playerId: number,
  range: number,
  x: number,
  y: number,
  z: number,
): boolean => {
  return !!samp.callNative(
    "IsPlayerInRangeOfPoint",
    "iffff",
    playerId,
    range,
    x,
    y,
    z,
  );
};

export const GetPlayerDistanceFromPoint = (
  playerId: number,
  x: number,
  y: number,
  z: number,
): number => {
  return samp.callNativeFloat(
    "GetPlayerDistanceFromPoint",
    "ifff",
    playerId,
    x,
    y,
    z,
  );
};

export const IsPlayerStreamedIn = (
  playerId: number,
  forPlayerId: number,
): boolean => {
  return !!samp.callNative("IsPlayerStreamedIn", "ii", playerId, forPlayerId);
};

export const SetPlayerInterior = (
  playerId: number,
  interiorId: number,
): boolean => {
  return !!samp.callNative("SetPlayerInterior", "ii", playerId, interiorId);
};

export const GetPlayerInterior = (playerId: number): number => {
  return samp.callNative("GetPlayerInterior", "i", playerId);
};

export const SetPlayerHealth = (playerId: number, health: number): boolean => {
  return !!samp.callNative("SetPlayerHealth", "if", playerId, health);
};

export const GetPlayerHealth = (playerId: number) => {
  const [health, ret]: [number, number] = samp.callNative(
    "GetPlayerHealth",
    "iF",
    playerId,
  );
  return { health, ret: !!ret };
};

export const SetPlayerArmour = (playerId: number, armour: number): boolean => {
  return !!samp.callNative("SetPlayerArmour", "if", playerId, armour);
};

export const GetPlayerArmour = (playerId: number) => {
  const [armour, ret]: [number, number] = samp.callNative(
    "GetPlayerArmour",
    "iF",
    playerId,
  );
  return { armour, ret: !!ret };
};

export const SetPlayerAmmo = (
  playerId: number,
  weaponId: number,
  ammo: number,
): boolean => {
  return !!samp.callNative("SetPlayerAmmo", "iii", playerId, weaponId, ammo);
};

export const GetPlayerAmmo = (playerId: number): number => {
  return samp.callNative("GetPlayerAmmo", "i", playerId);
};

export const GetPlayerWeaponState = (playerId: number): WeaponStatesEnum => {
  return samp.callNative("GetPlayerWeaponState", "i", playerId);
};

export const GetPlayerTargetPlayer = (playerId: number): number => {
  return samp.callNative("GetPlayerTargetPlayer", "i", playerId);
};

export const GetPlayerTargetActor = (playerId: number): boolean => {
  return !!samp.callNative("GetPlayerTargetActor", "i", playerId);
};

export const SetPlayerTeam = (playerId: number, teamId: number): boolean => {
  return !!samp.callNative("SetPlayerTeam", "ii", playerId, teamId);
};

export const GetPlayerTeam = (playerId: number): number => {
  return samp.callNative("GetPlayerTeam", "i", playerId);
};

export const SetPlayerScore = (playerId: number, score: number): boolean => {
  return !!samp.callNative("SetPlayerScore", "ii", playerId, score);
};

export const GetPlayerScore = (playerId: number): number => {
  return samp.callNative("GetPlayerScore", "i", playerId);
};

export const GetPlayerDrunkLevel = (playerId: number): number => {
  return samp.callNative("GetPlayerDrunkLevel", "i", playerId);
};

export const SetPlayerDrunkLevel = (
  playerId: number,
  level: number,
): boolean => {
  return !!samp.callNative("SetPlayerDrunkLevel", "ii", playerId, level);
};

export const SetPlayerColor = (
  playerId: number,
  color: string | number,
): boolean => {
  return !!samp.callNative("SetPlayerColor", "ii", playerId, rgba(color));
};

export const GetPlayerColor = (playerId: number): number => {
  return samp.callNative("GetPlayerColor", "i", playerId);
};

export const SetPlayerSkin = (playerId: number, skinId: number): boolean => {
  return !!samp.callNative("SetPlayerSkin", "ii", playerId, skinId);
};

export const GetPlayerSkin = (playerId: number): number => {
  return samp.callNative("GetPlayerSkin", "i", playerId);
};

export const GivePlayerWeapon = (
  playerId: number,
  weaponId: number,
  ammo: number,
): boolean => {
  return !!samp.callNative("GivePlayerWeapon", "iii", playerId, weaponId, ammo);
};

export const ResetPlayerWeapons = (playerId: number): boolean => {
  return !!samp.callNative("ResetPlayerWeapons", "i", playerId);
};

export const SetPlayerArmedWeapon = (
  playerId: number,
  weaponId: number,
): boolean => {
  return !!samp.callNative("SetPlayerArmedWeapon", "ii", playerId, weaponId);
};

export const GetPlayerWeaponData = (playerId: number, slot: number) => {
  const [weapons, ammo, ret]: [number, number, number] = samp.callNative(
    "GetPlayerWeaponData",
    "iiII",
    playerId,
    slot,
  );
  return { weapons, ammo, ret: !!ret };
};

export const GivePlayerMoney = (playerId: number, money: number): boolean => {
  return !!samp.callNative("GivePlayerMoney", "ii", playerId, money);
};

export const ResetPlayerMoney = (playerId: number): boolean => {
  return !!samp.callNative("ResetPlayerMoney", "i", playerId);
};

export const GetPlayerMoney = (playerId: number): number => {
  return samp.callNative("GetPlayerMoney", "i", playerId);
};

export const GetPlayerState = (playerId: number): PlayerStateEnum => {
  return samp.callNative("GetPlayerState", "i", playerId);
};

export const GetPlayerPing = (playerId: number): number => {
  return samp.callNative("GetPlayerPing", "i", playerId);
};

export const GetPlayerWeapon = (playerId: number): number => {
  return samp.callNative("GetPlayerWeapon", "i", playerId);
};

export const GetPlayerKeys = (playerId: number) => {
  const [keys, upDown, leftRight, ret]: [KeysEnum, KeysEnum, KeysEnum, number] =
    samp.callNative("GetPlayerKeys", "iIII", playerId);
  return { keys, upDown, leftRight, ret: !!ret };
};

export const SetPlayerTime = (
  playerId: number,
  hour: number,
  minute: number,
): boolean => {
  return !!samp.callNative("SetPlayerTime", "iii", playerId, hour, minute);
};

export const GetPlayerTime = (playerId: number) => {
  const [hour, minute, ret]: [number, number, number] = samp.callNative(
    "GetPlayerTime",
    "iII",
    playerId,
  );
  return { hour, minute, ret: !!ret };
};

export const TogglePlayerClock = (
  playerId: number,
  toggle: boolean,
): boolean => {
  return !!samp.callNative("TogglePlayerClock", "ii", playerId, toggle);
};

export const SetPlayerWeather = (
  playerId: number,
  weather: number,
): boolean => {
  return !!samp.callNative("SetPlayerWeather", "ii", playerId, weather);
};

export const ForceClassSelection = (playerId: number): boolean => {
  return !!samp.callNative("ForceClassSelection", "i", playerId);
};

export const SetPlayerWantedLevel = (
  playerId: number,
  level: number,
): boolean => {
  return !!samp.callNative("SetPlayerWantedLevel", "ii", playerId, level);
};

export const GetPlayerWantedLevel = (playerId: number): number => {
  return samp.callNative("GetPlayerWantedLevel", "i", playerId);
};

export const SetPlayerFightingStyle = (
  playerId: number,
  style: FightingStylesEnum,
): boolean => {
  return !!samp.callNative("SetPlayerFightingStyle", "ii", playerId, style);
};

export const GetPlayerFightingStyle = (
  playerId: number,
): FightingStylesEnum => {
  return samp.callNative("GetPlayerFightingStyle", "i", playerId);
};

export const SetPlayerVelocity = (
  playerId: number,
  x: number,
  y: number,
  z: number,
): boolean => {
  return !!samp.callNative("SetPlayerVelocity", "ifff", playerId, x, y, z);
};

export const GetPlayerVelocity = (playerId: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetPlayerVelocity",
    "iFFF",
    playerId,
  );
  return { x, y, z, ret: !!ret };
};

export const PlayCrimeReportForPlayer = (
  playerId: number,
  suspectId: number,
  crime: number,
): boolean => {
  return !!samp.callNative(
    "PlayCrimeReportForPlayer",
    "iii",
    playerId,
    suspectId,
    crime,
  );
};

export const PlayAudioStreamForPlayer = (
  playerId: number,
  url: string,
  posX: number,
  posY: number,
  posZ: number,
  distance: number,
  usePos = false,
): boolean => {
  return !!samp.callNative(
    "PlayAudioStreamForPlayer",
    "isffffi",
    playerId,
    url,
    posX,
    posY,
    posZ,
    distance,
    usePos,
  );
};

export const StopAudioStreamForPlayer = (playerId: number): boolean => {
  return !!samp.callNative("StopAudioStreamForPlayer", "i", playerId);
};

export const SetPlayerShopName = (
  playerId: number,
  shopName: string,
): boolean => {
  return !!samp.callNative("SetPlayerShopName", "is", playerId, shopName);
};

export const SetPlayerSkillLevel = (
  playerId: number,
  skill: WeaponSkillsEnum,
  level: number,
): boolean => {
  return !!samp.callNative(
    "SetPlayerSkillLevel",
    "iii",
    playerId,
    skill,
    level,
  );
};

export const GetPlayerSurfingVehicleID = (playerId: number): number => {
  return samp.callNative("GetPlayerSurfingVehicleID", "i", playerId);
};

export const GetPlayerSurfingObjectID = (playerId: number): number => {
  return samp.callNative("GetPlayerSurfingObjectID", "i", playerId);
};

export const GetPlayerSurfingPlayerObjectID = (playerId: number): number => {
  return samp.callNative("GetPlayerSurfingPlayerObjectID", "i", playerId);
};

export const RemoveBuildingForPlayer = (
  playerId: number,
  modelId: number,
  fX: number,
  fY: number,
  fZ: number,
  fRadius: number,
): boolean => {
  return !!samp.callNative(
    "RemoveBuildingForPlayer",
    "iiffff",
    playerId,
    modelId,
    fX,
    fY,
    fZ,
    fRadius,
  );
};

export const GetPlayerLastShotVectors = (playerId: number) => {
  const [fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ, ret]: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ] = samp.callNative("GetPlayerLastShotVectors", "iFFFFFF", playerId);
  return {
    fOriginX,
    fOriginY,
    fOriginZ,
    fHitPosX,
    fHitPosY,
    fHitPosZ,
    ret: !!ret,
  };
};

export const PutPlayerInVehicle = (
  playerId: number,
  vehicleId: number,
  seatId: number,
): boolean => {
  return !!samp.callNative(
    "PutPlayerInVehicle",
    "iii",
    playerId,
    vehicleId,
    seatId,
  );
};

export const GetPlayerVehicleID = (playerId: number): number => {
  return samp.callNative("GetPlayerVehicleID", "i", playerId);
};

export const GetPlayerVehicleSeat = (playerId: number): number => {
  return samp.callNative("GetPlayerVehicleSeat", "i", playerId);
};

export const RemovePlayerFromVehicle = (playerId: number): boolean => {
  return !!samp.callNative("RemovePlayerFromVehicle", "i", playerId);
};

export const TogglePlayerControllable = (
  playerId: number,
  toggle: boolean,
): boolean => {
  return !!samp.callNative("TogglePlayerControllable", "ii", playerId, toggle);
};

export const PlayerPlaySound = (
  playerId: number,
  soundId: number,
  x: number,
  y: number,
  z: number,
): boolean => {
  return !!samp.callNative(
    "PlayerPlaySound",
    "iifff",
    playerId,
    soundId,
    x,
    y,
    z,
  );
};

export const ApplyAnimation = (
  playerId: number,
  animLib: string,
  animName: string,
  fDelta: number,
  loop: boolean,
  lockX: boolean,
  lockY: boolean,
  freeze: boolean,
  time: number,
  forceSync: number,
): boolean => {
  return !!samp.callNative(
    "ApplyAnimation",
    "issfiiiiii",
    playerId,
    animLib,
    animName,
    fDelta,
    loop,
    lockX,
    lockY,
    freeze,
    time,
    forceSync,
  );
};

export const ClearAnimations = (
  playerId: number,
  forceSync: boolean,
): boolean => {
  return !!samp.callNative("ClearAnimations", "ii", playerId, forceSync);
};

export const GetPlayerAnimationIndex = (playerId: number): number => {
  return samp.callNative("GetPlayerAnimationIndex", "i", playerId);
};

export const GetPlayerSpecialAction = (
  playerId: number,
): SpecialActionsEnum => {
  return samp.callNative("GetPlayerSpecialAction", "i", playerId);
};

export const SetPlayerSpecialAction = (
  playerId: number,
  actionId: SpecialActionsEnum,
): boolean => {
  return !!samp.callNative("SetPlayerSpecialAction", "ii", playerId, actionId);
};

export const DisableRemoteVehicleCollisions = (
  playerId: number,
  disable: boolean,
): boolean => {
  return !!samp.callNative(
    "DisableRemoteVehicleCollisions",
    "ii",
    playerId,
    disable,
  );
};

export const SetPlayerVirtualWorld = (
  playerId: number,
  worldId: number,
): boolean => {
  return !!samp.callNative("SetPlayerVirtualWorld", "ii", playerId, worldId);
};

export const GetPlayerVirtualWorld = (playerId: number): number => {
  return samp.callNative("GetPlayerVirtualWorld", "i", playerId);
};

export const EnableStuntBonusForPlayer = (
  playerId: number,
  enable: boolean,
): boolean => {
  return !!samp.callNative("EnableStuntBonusForPlayer", "ii", playerId, enable);
};

export const GetPlayerCustomSkin = (playerId: number): number => {
  return samp.callNative("GetPlayerCustomSkin", "i", playerId);
};

export const CreateExplosionForPlayer = (
  playerId: number,
  x: number,
  y: number,
  z: number,
  type: number,
  radius: number,
): boolean => {
  return !!samp.callNative(
    "CreateExplosionForPlayer",
    "ifffif",
    playerId,
    x,
    y,
    z,
    type,
    radius,
  );
};

export const StartRecordingPlayerData = (
  playerId: number,
  recordType: number,
  recordName: string,
): boolean => {
  return !!samp.callNative(
    "StartRecordingPlayerData",
    "iis",
    playerId,
    recordType,
    recordName,
  );
};

export const StopRecordingPlayerData = (playerId: number): boolean => {
  return !!samp.callNative("StopRecordingPlayerData", "i", playerId);
};

export const TogglePlayerSpectating = (
  playerId: number,
  toggle: boolean,
): boolean => {
  return !!samp.callNative("TogglePlayerSpectating", "ii", playerId, toggle);
};

export const PlayerSpectatePlayer = (
  playerId: number,
  targetPlayerId: number,
  mode: SpectateModesEnum,
): boolean => {
  return !!samp.callNative(
    "PlayerSpectatePlayer",
    "iii",
    playerId,
    targetPlayerId,
    mode,
  );
};

export const PlayerSpectateVehicle = (
  playerId: number,
  targetVehicleId: number,
  mode: SpectateModesEnum,
): boolean => {
  return !!samp.callNative(
    "PlayerSpectateVehicle",
    "iii",
    playerId,
    targetVehicleId,
    mode,
  );
};

export const IsPlayerConnected = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerConnected", "i", playerId);
};

export const IsPlayerInVehicle = (
  playerId: number,
  vehicleId: number,
): boolean => {
  return !!samp.callNative("IsPlayerInVehicle", "ii", playerId, vehicleId);
};

export const IsPlayerInAnyVehicle = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerInAnyVehicle", "i", playerId);
};

export const SetPlayerWorldBounds = (
  playerId: number,
  xMax: number,
  xMin: number,
  yMax: number,
  yMin: number,
): boolean => {
  return !!samp.callNative(
    "SetPlayerWorldBounds",
    "iffff",
    playerId,
    xMax,
    xMin,
    yMax,
    yMin,
  );
};

export const ClearPlayerWorldBounds = (playerId: number) => {
  return !!samp.callNative("ClearPlayerWorldBounds", "i", playerId);
};

export const SetPlayerMarkerForPlayer = (
  playerId: number,
  showPlayerId: number,
  color: string | number,
): boolean => {
  return !!samp.callNative(
    "SetPlayerMarkerForPlayer",
    "iii",
    playerId,
    showPlayerId,
    rgba(color),
  );
};

export function GetPlayerMarkerForPlayer(
  playerId: number,
  targetId: number,
): number {
  return samp.callNative("GetPlayerMarkerForPlayer", "ii", playerId, targetId);
}

export const ShowPlayerNameTagForPlayer = (
  playerId: number,
  showPlayerId: number,
  show: boolean,
): boolean => {
  return !!samp.callNative(
    "ShowPlayerNameTagForPlayer",
    "iii",
    playerId,
    showPlayerId,
    show,
  );
};

export const SetPlayerMapIcon = (
  playerId: number,
  iconId: number,
  x: number,
  y: number,
  z: number,
  markerType: number,
  color: string | number,
  style: number,
): boolean => {
  return !!samp.callNative(
    "SetPlayerMapIcon",
    "iifffiii",
    playerId,
    iconId,
    x,
    y,
    z,
    markerType,
    rgba(color),
    style,
  );
};

export const RemovePlayerMapIcon = (
  playerId: number,
  iconId: number,
): boolean => {
  return !!samp.callNative("RemovePlayerMapIcon", "ii", playerId, iconId);
};

export const SetPlayerCameraPos = (
  playerId: number,
  x: number,
  y: number,
  z: number,
): boolean => {
  return !!samp.callNative("SetPlayerCameraPos", "ifff", playerId, x, y, z);
};

export const SetPlayerCameraLookAt = (
  playerId: number,
  x: number,
  y: number,
  z: number,
  style: CameraCutStylesEnum,
): boolean => {
  return !!samp.callNative(
    "SetPlayerCameraLookAt",
    "ifffi",
    playerId,
    x,
    y,
    z,
    style,
  );
};

export const SetCameraBehindPlayer = (playerId: number): boolean => {
  return !!samp.callNative("SetCameraBehindPlayer", "i", playerId);
};

export const GetPlayerCameraPos = (playerId: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetPlayerCameraPos",
    "iFFF",
    playerId,
  );
  return { x, y, z, ret: !!ret };
};

export const GetPlayerCameraFrontVector = (playerId: number) => {
  const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
    "GetPlayerCameraFrontVector",
    "iFFF",
    playerId,
  );
  return { x, y, z, ret: !!ret };
};

export const GetPlayerCameraMode = (playerId: number): CameraModesEnum => {
  return samp.callNative("GetPlayerCameraMode", "i", playerId);
};

export const EnablePlayerCameraTarget = (
  playerId: number,
  enable: boolean,
): boolean => {
  return !!samp.callNative("EnablePlayerCameraTarget", "ii", playerId, enable);
};

export const GetPlayerCameraTargetObject = (playerId: number): number => {
  return samp.callNative("GetPlayerCameraTargetObject", "i", playerId);
};

export const GetPlayerCameraTargetVehicle = (playerId: number): number => {
  return samp.callNative("GetPlayerCameraTargetVehicle", "i", playerId);
};

export const GetPlayerCameraTargetPlayer = (playerId: number): number => {
  return samp.callNative("GetPlayerCameraTargetPlayer", "i", playerId);
};

export const GetPlayerCameraTargetActor = (playerId: number): number => {
  return samp.callNative("GetPlayerCameraTargetActor", "i", playerId);
};

export const GetPlayerCameraAspectRatio = (playerId: number): number => {
  return samp.callNativeFloat("GetPlayerCameraAspectRatio", "i", playerId);
};

export const GetPlayerCameraZoom = (playerId: number): number => {
  return samp.callNativeFloat("GetPlayerCameraZoom", "i", playerId);
};

export const AttachCameraToObject = (
  playerId: number,
  objectId: number,
): boolean => {
  return !!samp.callNative("AttachCameraToObject", "ii", playerId, objectId);
};

export const AttachCameraToPlayerObject = (
  playerId: number,
  playerObjectId: number,
): boolean => {
  return !!samp.callNative(
    "AttachCameraToPlayerObject",
    "ii",
    playerId,
    playerObjectId,
  );
};

export const InterpolateCameraPos = (
  playerId: number,
  fromX: number,
  fromY: number,
  fromZ: number,
  toX: number,
  toY: number,
  toZ: number,
  time: number,
  cut: CameraCutStylesEnum,
): boolean => {
  return !!samp.callNative(
    "InterpolateCameraPos",
    "iffffffii",
    playerId,
    fromX,
    fromY,
    fromZ,
    toX,
    toY,
    toZ,
    time,
    cut,
  );
};

export const InterpolateCameraLookAt = (
  playerId: number,
  fromX: number,
  fromY: number,
  fromZ: number,
  toX: number,
  toY: number,
  toZ: number,
  time: number,
  cut: CameraCutStylesEnum,
): boolean => {
  return !!samp.callNative(
    "InterpolateCameraLookAt",
    "iffffffii",
    playerId,
    fromX,
    fromY,
    fromZ,
    toX,
    toY,
    toZ,
    time,
    cut,
  );
};

export const IsPlayerCuffed = (playerId: number) => {
  return !!samp.callNative("IsPlayerCuffed", "i", playerId);
};

export const IsPlayerInDriveByMode = (playerId: number) => {
  return !!samp.callNative("IsPlayerInDriveByMode", "i", playerId);
};

export const IsPlayerUsingOmp = (playerId: number): boolean => {
  return !!samp.callNative("IsPlayerUsingOmp", "i", playerId);
};

export const PlayerHasClockEnabled = (playerId: number): boolean => {
  return !!samp.callNative("PlayerHasClockEnabled", "i", playerId);
};

// export const IsPlayerLeavingSpectatorMode = (playerId: number): boolean => {
//   return !!samp.callNative("IsPlayerLeavingSpectatorMode", "i", playerId);
// };
