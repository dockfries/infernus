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
import { rgba } from "core/utils/colorUtils";

export const TogglePlayerWidescreen = (
  playerId: number,
  set: boolean,
): number => {
  return samp.callNative("TogglePlayerWidescreen", "ii", playerId, set);
};

export const IsPlayerWidescreenToggled = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerWidescreenToggled", "i", playerId));
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

export const GetPlayerWorldBounds = (playerId: number): IBounds => {
  const [x_max = 0.0, x_min = 0.0, y_max = 0.0, y_min = 0.0]: number[] =
    samp.callNative("GetPlayerWorldBounds", "iFFFF", playerId);
  return { x_max, x_min, y_max, y_min };
};

export const GetPlayerZAim = (playerId: number): number => {
  return samp.callNativeFloat("GetPlayerZAim", "i", playerId);
};

export const GetPlayerSurfingOffsets = (playerId: number): IOffsets => {
  const [fOffsetX = 0.0, fOffsetY = 0.0, fOffsetZ = 0.0]: number[] =
    samp.callNative("GetPlayerSurfingOffsets", "iFFF", playerId);
  return { fOffsetX, fOffsetY, fOffsetZ };
};

export const GetPlayerRotationQuat = (playerId: number): IQuat => {
  const [w = 0.0, x = 0.0, y = 0.0, z = 0.0]: number[] = samp.callNative(
    "GetPlayerRotationQuat",
    "iFFFF",
    playerId,
  );
  return { w, x, y, z };
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

export const SetPlayerGravity = (playerId: number, gravity: number): number => {
  return samp.callNative("SetPlayerGravity", "if", playerId, gravity);
};

export const GetPlayerGravity = (playerId: number): number => {
  return samp.callNativeFloat("GetPlayerGravity", "i", playerId);
};

export const IsPlayerSpawned = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerSpawned", "i", playerId));
};

export const IsPlayerControllable = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerControllable", "i", playerId));
};

export const IsPlayerCameraTargetEnabled = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerCameraTargetEnabled", "i", playerId));
};

export const TogglePlayerGhostMode = (
  playerId: number,
  toggle: boolean,
): number => {
  return samp.callNative("TogglePlayerGhostMode", "ii", playerId, toggle);
};

export const GetPlayerGhostMode = (playerId: number): boolean => {
  return Boolean(samp.callNative("GetPlayerGhostMode", "i", playerId));
};

export const GetPlayerBuildingsRemoved = (playerId: number): number => {
  return samp.callNative("GetPlayerBuildingsRemoved", "i", playerId);
};

export const RemovePlayerWeapon = (
  playerId: number,
  weaponId: number,
): number => {
  return samp.callNative("RemovePlayerWeapon", "ii", playerId, weaponId);
};

export const HidePlayerDialog = (playerId: number): number => {
  return samp.callNative("HidePlayerDialog", "i", playerId);
};

export const IsPlayerUsingOfficialClient = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerUsingOfficialClient", "i", playerId));
};

export const AllowPlayerTeleport = (
  playerId: number,
  allow: boolean,
): boolean => {
  return Boolean(samp.callNative("AllowPlayerTeleport", "ii", playerId, allow));
};

export const IsPlayerTeleportAllowed = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerTeleportAllowed", "i", playerId));
};

export const AllowPlayerWeapons = (
  playerId: number,
  allow: boolean,
): boolean => {
  return Boolean(samp.callNative("AllowPlayerWeapons", "i", playerId, allow));
};

export const ArePlayerWeaponsAllowed = (playerId: number): boolean => {
  return Boolean(samp.callNative("ArePlayerWeaponsAllowed", "i", playerId));
};

export const GameTextForPlayer = (
  playerId: number,
  string: string,
  time: number,
  style: number,
): boolean => {
  return Boolean(
    samp.callNative("GameTextForPlayer", "isii", playerId, string, time, style),
  );
};

export const HasGameText = (playerId: number, style: number): boolean => {
  return Boolean(samp.callNative("HasGameText", "ii", playerId, style));
};

export const SendDeathMessageToPlayer = (
  playerId: number,
  killer: number,
  killee: number,
  weapon: WeaponEnum | DamageDeathReasonEnum,
): number => {
  return samp.callNative(
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
  return Boolean(
    samp.callNative("HideGameTextForPlayer", "ii", playerId, style),
  );
};

export const IsPlayerNPC = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerNPC", "i", playerId));
};

export const SetPlayerPos = (
  playerId: number,
  x: number,
  y: number,
  z: number,
): number => {
  return samp.callNative("SetPlayerPos", "ifff", playerId, x, y, z);
};

export const SetPlayerPosFindZ = (
  playerId: number,
  x: number,
  y: number,
  z: number,
): number => {
  return samp.callNative("SetPlayerPosFindZ", "ifff", playerId, x, y, z);
};

export const GetPlayerPos = (playerId: number): Array<number> => {
  return samp.callNative("GetPlayerPos", "iFFF", playerId);
};

export const SetPlayerFacingAngle = (playerId: number, ang: number): number => {
  return samp.callNative("SetPlayerFacingAngle", "if", playerId, ang);
};

export const GetPlayerFacingAngle = (playerId: number): number => {
  const [angle] = samp.callNative(
    "GetPlayerFacingAngle",
    "iF",
    playerId,
  ) as unknown as number[];
  return angle;
};

export const IsPlayerInRangeOfPoint = (
  playerId: number,
  range: number,
  x: number,
  y: number,
  z: number,
): boolean => {
  return Boolean(
    samp.callNative(
      "IsPlayerInRangeOfPoint",
      "iffff",
      playerId,
      range,
      x,
      y,
      z,
    ),
  );
};

export const GetPlayerDistanceFromPoint = (
  playerId: number,
  X: number,
  Y: number,
  Z: number,
): number => {
  return samp.callNativeFloat(
    "GetPlayerDistanceFromPoint",
    "ifff",
    playerId,
    X,
    Y,
    Z,
  );
};

export const IsPlayerStreamedIn = (
  playerId: number,
  forPlayerId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerStreamedIn", "ii", playerId, forPlayerId),
  );
};

export const SetPlayerInterior = (
  playerId: number,
  interiorId: number,
): number => {
  return samp.callNative("SetPlayerInterior", "ii", playerId, interiorId);
};

export const GetPlayerInterior = (playerId: number): number => {
  return samp.callNative("GetPlayerInterior", "i", playerId);
};

export const SetPlayerHealth = (playerId: number, health: number): number => {
  return samp.callNative("SetPlayerHealth", "if", playerId, health);
};

export const GetPlayerHealth = (playerId: number): number => {
  const [health] = samp.callNative(
    "GetPlayerHealth",
    "iF",
    playerId,
  ) as unknown as number[];
  return health;
};

export const SetPlayerArmour = (playerId: number, armour: number): number => {
  return samp.callNative("SetPlayerArmour", "if", playerId, armour);
};

export const GetPlayerArmour = (playerId: number): number => {
  const [armour] = samp.callNative(
    "GetPlayerArmour",
    "iF",
    playerId,
  ) as unknown as number[];
  return armour;
};

export const SetPlayerAmmo = (
  playerId: number,
  weaponId: number,
  ammo: number,
): number => {
  return samp.callNative("SetPlayerAmmo", "iii", playerId, weaponId, ammo);
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

export const GetPlayerTargetActor = (playerId: number): number => {
  return samp.callNative("GetPlayerTargetActor", "i", playerId);
};

export const SetPlayerTeam = (playerId: number, teamId: number): void => {
  samp.callNative("SetPlayerTeam", "ii", playerId, teamId);
};

export const GetPlayerTeam = (playerId: number): number => {
  return samp.callNative("GetPlayerTeam", "i", playerId);
};

export const SetPlayerScore = (playerId: number, score: number): number => {
  return samp.callNative("SetPlayerScore", "ii", playerId, score);
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
): number => {
  return samp.callNative("SetPlayerDrunkLevel", "ii", playerId, level);
};

export const SetPlayerColor = (
  playerId: number,
  color: string | number,
): number => {
  return samp.callNative("SetPlayerColor", "ii", playerId, rgba(color));
};

export const GetPlayerColor = (playerId: number): number => {
  return samp.callNative("GetPlayerColor", "i", playerId);
};

export const SetPlayerSkin = (playerId: number, skinId: number): number => {
  return samp.callNative("SetPlayerSkin", "ii", playerId, skinId);
};

export const GetPlayerSkin = (playerId: number): number => {
  return samp.callNative("GetPlayerSkin", "i", playerId);
};

export const GivePlayerWeapon = (
  playerId: number,
  weaponId: number,
  ammo: number,
): number => {
  return samp.callNative("GivePlayerWeapon", "iii", playerId, weaponId, ammo);
};

export const ResetPlayerWeapons = (playerId: number): number => {
  return samp.callNative("ResetPlayerWeapons", "i", playerId);
};

export const SetPlayerArmedWeapon = (
  playerId: number,
  weaponId: number,
): number => {
  return samp.callNative("SetPlayerArmedWeapon", "ii", playerId, weaponId);
};

export const GetPlayerWeaponData = (
  playerId: number,
  slot: number,
): Array<number> => {
  return samp.callNative("GetPlayerWeaponData", "iiII", playerId, slot);
};

export const GivePlayerMoney = (playerId: number, money: number): number => {
  return samp.callNative("GivePlayerMoney", "ii", playerId, money);
};

export const ResetPlayerMoney = (playerId: number): number => {
  return samp.callNative("ResetPlayerMoney", "i", playerId);
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

export const GetPlayerKeys = (playerId: number): Array<KeysEnum> => {
  return samp.callNative("GetPlayerKeys", "iIII", playerId);
};

export const SetPlayerTime = (
  playerId: number,
  hour: number,
  minute: number,
): number => {
  return samp.callNative("SetPlayerTime", "iii", playerId, hour, minute);
};

export const GetPlayerTime = (playerId: number): Array<number> => {
  return samp.callNative("GetPlayerTime", "iII", playerId);
};

export const TogglePlayerClock = (
  playerId: number,
  toggle: boolean,
): number => {
  return samp.callNative("TogglePlayerClock", "ii", playerId, toggle);
};

export const SetPlayerWeather = (playerId: number, weather: number): number => {
  return samp.callNative("SetPlayerWeather", "ii", playerId, weather);
};

export const ForceClassSelection = (playerId: number): number => {
  return samp.callNative("ForceClassSelection", "i", playerId);
};

export const SetPlayerWantedLevel = (
  playerId: number,
  level: number,
): number => {
  return samp.callNative("SetPlayerWantedLevel", "ii", playerId, level);
};

export const GetPlayerWantedLevel = (playerId: number): number => {
  return samp.callNative("GetPlayerWantedLevel", "i", playerId);
};

export const SetPlayerFightingStyle = (
  playerId: number,
  style: FightingStylesEnum,
): number => {
  return samp.callNative("SetPlayerFightingStyle", "ii", playerId, style);
};

export const GetPlayerFightingStyle = (
  playerId: number,
): FightingStylesEnum => {
  return samp.callNative("GetPlayerFightingStyle", "i", playerId);
};

export const SetPlayerVelocity = (
  playerId: number,
  X: number,
  Y: number,
  Z: number,
): number => {
  return samp.callNative("SetPlayerVelocity", "ifff", playerId, X, Y, Z);
};

export const GetPlayerVelocity = (playerId: number): Array<number> => {
  return samp.callNative("GetPlayerVelocity", "iFFF", playerId);
};

export const PlayCrimeReportForPlayer = (
  playerId: number,
  suspectId: number,
  crime: number,
): number => {
  return samp.callNative(
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
): number => {
  return samp.callNative(
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

export const StopAudioStreamForPlayer = (playerId: number): number => {
  return samp.callNative("StopAudioStreamForPlayer", "i", playerId);
};

export const SetPlayerShopName = (
  playerId: number,
  shopName: string,
): number => {
  return samp.callNative("SetPlayerShopName", "is", playerId, shopName);
};

export const SetPlayerSkillLevel = (
  playerId: number,
  skill: WeaponSkillsEnum,
  level: number,
): number => {
  return samp.callNative("SetPlayerSkillLevel", "iii", playerId, skill, level);
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
): number => {
  return samp.callNative(
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

export const GetPlayerLastShotVectors = (playerId: number): Array<number> => {
  return samp.callNative("GetPlayerLastShotVectors", "iFFFFFF", playerId);
};

export const SetPlayerChatBubble = (
  playerId: number,
  text: string,
  color: string | number,
  drawDistance: number,
  expireTime: number,
): number => {
  return samp.callNative(
    "SetPlayerChatBubble",
    "isifi",
    playerId,
    text,
    rgba(color),
    drawDistance,
    expireTime,
  );
};

export const PutPlayerInVehicle = (
  playerId: number,
  vehicleId: number,
  seatId: number,
): number => {
  return samp.callNative(
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

export const RemovePlayerFromVehicle = (playerId: number): number => {
  return samp.callNative("RemovePlayerFromVehicle", "i", playerId);
};

export const TogglePlayerControllable = (
  playerId: number,
  toggle: boolean,
): number => {
  return samp.callNative("TogglePlayerControllable", "ii", playerId, toggle);
};

export const PlayerPlaySound = (
  playerId: number,
  soundId: number,
  x: number,
  y: number,
  z: number,
): number => {
  return samp.callNative(
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
): number => {
  return samp.callNative(
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
): number => {
  return samp.callNative("ClearAnimations", "ii", playerId, forceSync);
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
): number => {
  return samp.callNative("SetPlayerSpecialAction", "ii", playerId, actionId);
};

export const DisableRemoteVehicleCollisions = (
  playerId: number,
  disable: boolean,
): number => {
  return samp.callNative(
    "DisableRemoteVehicleCollisions",
    "ii",
    playerId,
    disable,
  );
};

export const SetPlayerVirtualWorld = (
  playerId: number,
  worldId: number,
): number => {
  return samp.callNative("SetPlayerVirtualWorld", "ii", playerId, worldId);
};

export const GetPlayerVirtualWorld = (playerId: number): number => {
  return samp.callNative("GetPlayerVirtualWorld", "i", playerId);
};

export const EnableStuntBonusForPlayer = (
  playerId: number,
  enable: boolean,
): number => {
  return samp.callNative("EnableStuntBonusForPlayer", "ii", playerId, enable);
};

export const GetPlayerCustomSkin = (playerId: number): number => {
  return samp.callNative("GetPlayerCustomSkin", "i", playerId);
};

export const CreateExplosionForPlayer = (
  playerId: number,
  X: number,
  Y: number,
  Z: number,
  type: number,
  Radius: number,
): number => {
  return samp.callNative(
    "CreateExplosionForPlayer",
    "ifffif",
    playerId,
    X,
    Y,
    Z,
    type,
    Radius,
  );
};

export const StartRecordingPlayerData = (
  playerId: number,
  recordType: number,
  recordName: string,
): number => {
  return samp.callNative(
    "StartRecordingPlayerData",
    "iis",
    playerId,
    recordType,
    recordName,
  );
};

export const StopRecordingPlayerData = (playerId: number): number => {
  return samp.callNative("StopRecordingPlayerData", "i", playerId);
};

export const TogglePlayerSpectating = (
  playerId: number,
  toggle: boolean,
): number => {
  return samp.callNative("TogglePlayerSpectating", "ii", playerId, toggle);
};

export const PlayerSpectatePlayer = (
  playerId: number,
  targetPlayerId: number,
  mode: SpectateModesEnum,
): number => {
  return samp.callNative(
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
): number => {
  return samp.callNative(
    "PlayerSpectateVehicle",
    "iii",
    playerId,
    targetVehicleId,
    mode,
  );
};

export const IsPlayerConnected = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerConnected", "i", playerId));
};

export const IsPlayerInVehicle = (
  playerId: number,
  vehicleId: number,
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInVehicle", "ii", playerId, vehicleId),
  );
};

export const IsPlayerInAnyVehicle = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerInAnyVehicle", "i", playerId));
};

export const SetPlayerWorldBounds = (
  playerId: number,
  x_max: number,
  x_min: number,
  y_max: number,
  y_min: number,
): number => {
  return samp.callNative(
    "SetPlayerWorldBounds",
    "iffff",
    playerId,
    x_max,
    x_min,
    y_max,
    y_min,
  );
};

export const ClearPlayerWorldBounds = (playerId: number) => {
  return Boolean(samp.callNative("ClearPlayerWorldBounds", "i", playerId));
};

export const SetPlayerMarkerForPlayer = (
  playerId: number,
  showPlayerId: number,
  color: string | number,
): number => {
  return samp.callNative(
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
  return samp.callNative("GetPlayerMarkerForPlayer", "ii", targetId);
}

export const ShowPlayerNameTagForPlayer = (
  playerId: number,
  showPlayerId: number,
  show: boolean,
): number => {
  return samp.callNative(
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
): number => {
  return samp.callNative(
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
): number => {
  return samp.callNative("RemovePlayerMapIcon", "ii", playerId, iconId);
};

export const SetPlayerCameraPos = (
  playerId: number,
  x: number,
  y: number,
  z: number,
): number => {
  return samp.callNative("SetPlayerCameraPos", "ifff", playerId, x, y, z);
};

export const SetPlayerCameraLookAt = (
  playerId: number,
  x: number,
  y: number,
  z: number,
  cut: CameraCutStylesEnum,
): number => {
  return samp.callNative(
    "SetPlayerCameraLookAt",
    "ifffi",
    playerId,
    x,
    y,
    z,
    cut,
  );
};

export const SetCameraBehindPlayer = (playerId: number): number => {
  return samp.callNative("SetCameraBehindPlayer", "i", playerId);
};

export const GetPlayerCameraPos = (playerId: number): Array<number> => {
  return samp.callNative("GetPlayerCameraPos", "iFFF", playerId);
};

export const GetPlayerCameraFrontVector = (playerId: number): Array<number> => {
  return samp.callNative("GetPlayerCameraFrontVector", "iFFF", playerId);
};

export const GetPlayerCameraMode = (playerId: number): CameraModesEnum => {
  return samp.callNative("GetPlayerCameraMode", "i", playerId);
};

export const EnablePlayerCameraTarget = (
  playerId: number,
  enable: boolean,
): number => {
  return samp.callNative("EnablePlayerCameraTarget", "ii", playerId, enable);
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
): number => {
  return samp.callNative("AttachCameraToObject", "ii", playerId, objectId);
};

export const AttachCameraToPlayerObject = (
  playerId: number,
  playerObjectId: number,
): number => {
  return samp.callNative(
    "AttachCameraToPlayerObject",
    "ii",
    playerId,
    playerObjectId,
  );
};

export const InterpolateCameraPos = (
  playerId: number,
  FromX: number,
  FromY: number,
  FromZ: number,
  ToX: number,
  ToY: number,
  ToZ: number,
  time: number,
  cut: CameraCutStylesEnum,
): number => {
  return samp.callNative(
    "InterpolateCameraPos",
    "iffffffii",
    playerId,
    FromX,
    FromY,
    FromZ,
    ToX,
    ToY,
    ToZ,
    time,
    cut,
  );
};

export const InterpolateCameraLookAt = (
  playerId: number,
  FromX: number,
  FromY: number,
  FromZ: number,
  ToX: number,
  ToY: number,
  ToZ: number,
  time: number,
  cut: CameraCutStylesEnum,
): number => {
  return samp.callNative(
    "InterpolateCameraLookAt",
    "iffffffii",
    playerId,
    FromX,
    FromY,
    FromZ,
    ToX,
    ToY,
    ToZ,
    time,
    cut,
  );
};

export const IsPlayerCuffed = (playerId: number) => {
  return Boolean(samp.callNative("IsPlayerCuffed", "i", playerId));
};

export const IsPlayerInDriveByMode = (playerId: number) => {
  return Boolean(samp.callNative("IsPlayerInDriveByMode", "i", playerId));
};
