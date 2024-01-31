// Reference to Peter Szombati's samp-node-lib

// removed db_, timer functions, for better maintainability you should use the node library

import { rgba } from "core/utils/colorUtils";
import type {
  BoneIdsEnum,
  CameraCutStylesEnum,
  CameraModesEnum,
  CarModTypeEnum,
  ConnectionStatusEnum,
  DamageDeathReasonEnum,
  FightingStylesEnum,
  KeysEnum,
  MarkerModesEnum,
  PlayerStateEnum,
  RecordTypesEnum,
  SpecialActionsEnum,
  SpectateModesEnum,
  TextDrawAlignEnum,
  VehicleModelInfoEnum,
  WeaponEnum,
  WeaponSkillsEnum,
  WeaponStatesEnum,
} from "core/enums";
import { I18n } from "core/controllers/i18n";

export const SendDeathMessage = (
  killer: number,
  killee: number,
  weapon: WeaponEnum | DamageDeathReasonEnum
): number => {
  return samp.callNative("SendDeathMessage", "iii", killer, killee, weapon);
};

export const SendDeathMessageToPlayer = (
  playerId: number,
  killer: number,
  killee: number,
  weapon: WeaponEnum | DamageDeathReasonEnum
): number => {
  return samp.callNative(
    "SendDeathMessageToPlayer",
    "iiii",
    playerId,
    killer,
    killee,
    weapon
  );
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

export const GameTextForPlayer = (
  playerId: number,
  string: string,
  time: number,
  style: number
): boolean => {
  return Boolean(
    samp.callNative("GameTextForPlayer", "isii", playerId, string, time, style)
  );
};

export const HasGameText = (playerId: number, style: number): boolean => {
  return Boolean(samp.callNative("HasGameText", "ii", playerId, style));
};

export const HideGameTextForPlayer = (
  playerId: number,
  style: number
): boolean => {
  return Boolean(
    samp.callNative("HideGameTextForPlayer", "ii", playerId, style)
  );
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

export const SetTeamCount = (count: number): number => {
  return samp.callNative("SetTeamCount", "i", count);
};

export const AddPlayerClass = (
  modelId: number,
  spawn_x: number,
  spawn_y: number,
  spawn_z: number,
  z_angle: number,
  weapon1: number,
  weapon1_ammo: number,
  weapon2: number,
  weapon2_ammo: number,
  weapon3: number,
  weapon3_ammo: number
): number => {
  return samp.callNative(
    "AddPlayerClass",
    "iffffiiiiii",
    modelId,
    spawn_x,
    spawn_y,
    spawn_z,
    z_angle,
    weapon1,
    weapon1_ammo,
    weapon2,
    weapon2_ammo,
    weapon3,
    weapon3_ammo
  );
};

export const AddPlayerClassEx = (
  teamId: number,
  modelId: number,
  spawn_x: number,
  spawn_y: number,
  spawn_z: number,
  z_angle: number,
  weapon1: number,
  weapon1_ammo: number,
  weapon2: number,
  weapon2_ammo: number,
  weapon3: number,
  weapon3_ammo: number
): number => {
  return samp.callNative(
    "AddPlayerClassEx",
    "iiffffiiiiii",
    teamId,
    modelId,
    spawn_x,
    spawn_y,
    spawn_z,
    z_angle,
    weapon1,
    weapon1_ammo,
    weapon2,
    weapon2_ammo,
    weapon3,
    weapon3_ammo
  );
};

export const AddStaticVehicle = (
  modelId: number,
  spawn_x: number,
  spawn_y: number,
  spawn_z: number,
  z_angle: number,
  color1: string | number,
  color2: string | number
): number => {
  return samp.callNative(
    "AddStaticVehicle",
    "iffffii",
    modelId,
    spawn_x,
    spawn_y,
    spawn_z,
    z_angle,
    color1,
    color2
  );
};

export const AddStaticVehicleEx = (
  modelId: number,
  spawn_x: number,
  spawn_y: number,
  spawn_z: number,
  z_angle: number,
  color1: string | number,
  color2: string | number,
  respawn_delay: number,
  addsiren: boolean
): number => {
  return samp.callNative(
    "AddStaticVehicleEx",
    "iffffiiii",
    modelId,
    spawn_x,
    spawn_y,
    spawn_z,
    z_angle,
    color1,
    color2,
    respawn_delay,
    addsiren
  );
};

export const AddStaticPickup = (
  model: number,
  type: number,
  X: number,
  Y: number,
  Z: number,
  virtualWorld: number
): number => {
  return samp.callNative(
    "AddStaticPickup",
    "iifffi",
    model,
    type,
    X,
    Y,
    Z,
    virtualWorld
  );
};

export const CreatePickup = (
  model: number,
  type: number,
  X: number,
  Y: number,
  Z: number,
  virtualWorld: number
): number => {
  return samp.callNative(
    "CreatePickup",
    "iifffi",
    model,
    type,
    X,
    Y,
    Z,
    virtualWorld
  );
};

export const DestroyPickup = (pickup: number): number => {
  return samp.callNative("DestroyPickup", "i", pickup);
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

export const IsPlayerNPC = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerNPC", "i", playerId));
};

export const IsPlayerAdmin = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerAdmin", "i", playerId));
};

export const Kick = (playerId: number): number => {
  return samp.callNative("Kick", "i", playerId);
};

export const Ban = (playerId: number): number => {
  return samp.callNative("Ban", "i", playerId);
};

export const SendRconCommand = (command: string): number => {
  return samp.callNative("SendRconCommand", "s", command);
};

export const GetPlayerNetworkStats = (playerId: number): string => {
  return samp.callNative("GetPlayerNetworkStats", "iSi", playerId, 1024);
};

export const GetNetworkStats = (): string => {
  return samp.callNative("GetNetworkStats", "Si", 1024);
};

export const BlockIpAddress = (ip_address: string, timems: number): number => {
  return samp.callNative("BlockIpAddress", "si", ip_address, timems);
};

export const UnBlockIpAddress = (ip_address: string): number => {
  return samp.callNative("UnBlockIpAddress", "s", ip_address);
};

export const GetServerTickRate = (): number => {
  return samp.callNative("GetServerTickRate", "");
};

export const NetStats_GetConnectedTime = (playerId: number): number => {
  return samp.callNative("NetStats_GetConnectedTime", "i", playerId);
};

export const NetStats_MessagesReceived = (playerId: number): number => {
  return samp.callNative("NetStats_MessagesReceived", "i", playerId);
};

export const NetStats_BytesReceived = (playerId: number): number => {
  return samp.callNative("NetStats_BytesReceived", "i", playerId);
};

export const NetStats_MessagesSent = (playerId: number): number => {
  return samp.callNative("NetStats_MessagesSent", "i", playerId);
};

export const NetStats_BytesSent = (playerId: number): number => {
  return samp.callNative("NetStats_BytesSent", "i", playerId);
};

export const NetStats_MessagesRecvPerSecond = (playerId: number): number => {
  return samp.callNative("NetStats_MessagesRecvPerSecond", "i", playerId);
};

export const NetStats_PacketLossPercent = (playerId: number): number => {
  return samp.callNativeFloat("NetStats_PacketLossPercent", "i", playerId);
};

export const NetStats_ConnectionStatus = (
  playerId: number
): ConnectionStatusEnum => {
  return samp.callNative("NetStats_ConnectionStatus", "i", playerId);
};

export const CreateMenu = (
  title: string,
  columns: number,
  x: number,
  y: number,
  col1width: number,
  col2width: number
): number => {
  return samp.callNative(
    "CreateMenu",
    "siffff",
    title,
    columns,
    x,
    y,
    col1width,
    col2width
  );
};

export const DestroyMenu = (menuId: number): number => {
  return samp.callNative("DestroyMenu", "i", menuId);
};

export const AddMenuItem = (
  menuId: number,
  column: number,
  menutext: string
): number => {
  return samp.callNative("AddMenuItem", "iis", menuId, column, menutext);
};

export const SetMenuColumnHeader = (
  menuId: number,
  column: number,
  columnheader: string
): number => {
  return samp.callNative(
    "SetMenuColumnHeader",
    "iis",
    menuId,
    column,
    columnheader
  );
};

export const ShowMenuForPlayer = (menuId: number, playerId: number): number => {
  return samp.callNative("ShowMenuForPlayer", "ii", menuId, playerId);
};

export const HideMenuForPlayer = (menuId: number, playerId: number): number => {
  return samp.callNative("HideMenuForPlayer", "ii", menuId, playerId);
};

export const IsValidMenu = (menuId: number): boolean => {
  return Boolean(samp.callNative("IsValidMenu", "i", menuId));
};

export const DisableMenu = (menuId: number): number => {
  return samp.callNative("DisableMenu", "i", menuId);
};

export const DisableMenuRow = (menuId: number, row: number): number => {
  return samp.callNative("DisableMenuRow", "ii", menuId, row);
};

export const GetPlayerMenu = (playerId: number): number => {
  return samp.callNative("GetPlayerMenu", "i", playerId);
};

export const TextDrawCreate = (x: number, y: number, text: string): number => {
  return samp.callNative("TextDrawCreate", "ffs", x, y, text);
};

export const TextDrawDestroy = (text: number): number => {
  return samp.callNative("TextDrawDestroy", "i", text);
};

export const TextDrawLetterSize = (
  text: number,
  x: number,
  y: number
): number => {
  return samp.callNative("TextDrawLetterSize", "iff", text, x, y);
};

export const TextDrawTextSize = (
  text: number,
  x: number,
  y: number
): number => {
  return samp.callNative("TextDrawTextSize", "iff", text, x, y);
};

export const TextDrawAlignment = (
  text: number,
  alignment: TextDrawAlignEnum
): number => {
  return samp.callNative("TextDrawAlignment", "ii", text, alignment);
};

export const TextDrawColor = (
  text: number,
  color: string | number
): boolean => {
  return Boolean(samp.callNative("TextDrawColor", "ii", text, rgba(color)));
};

export const TextDrawUseBox = (text: number, use: boolean): number => {
  return samp.callNative("TextDrawUseBox", "ii", text, use);
};

export const TextDrawBoxColor = (
  text: number,
  color: string | number
): boolean => {
  return Boolean(samp.callNative("TextDrawBoxColor", "ii", text, rgba(color)));
};

export const TextDrawSetShadow = (text: number, size: number): number => {
  return samp.callNative("TextDrawSetShadow", "ii", text, size);
};

export const TextDrawSetOutline = (text: number, size: number): number => {
  return samp.callNative("TextDrawSetOutline", "ii", text, size);
};

export const TextDrawBackgroundColor = (
  text: number,
  color: string | number
): boolean => {
  return Boolean(
    samp.callNative("TextDrawBackgroundColor", "ii", text, rgba(color))
  );
};

export const TextDrawFont = (text: number, font: number): number => {
  return samp.callNative("TextDrawFont", "ii", text, font);
};

export const TextDrawSetProportional = (text: number, set: boolean): number => {
  return samp.callNative("TextDrawSetProportional", "ii", text, set);
};

export const TextDrawSetSelectable = (text: number, set: boolean): number => {
  return samp.callNative("TextDrawSetSelectable", "ii", text, set);
};

export const TextDrawShowForPlayer = (
  playerId: number,
  text: number
): number => {
  return samp.callNative("TextDrawShowForPlayer", "ii", playerId, text);
};

export const TextDrawHideForPlayer = (
  playerId: number,
  text: number
): number => {
  return samp.callNative("TextDrawHideForPlayer", "ii", playerId, text);
};

export const TextDrawShowForAll = (text: number): number => {
  return samp.callNative("TextDrawShowForAll", "i", text);
};

export const TextDrawHideForAll = (text: number): number => {
  return samp.callNative("TextDrawHideForAll", "i", text);
};

export const TextDrawSetString = (text: number, string: string): number => {
  return samp.callNative("TextDrawSetString", "is", text, string);
};

export const TextDrawSetPreviewModel = (
  text: number,
  modelindex: number
): number => {
  return samp.callNative("TextDrawSetPreviewModel", "ii", text, modelindex);
};

export const TextDrawSetPreviewRot = (
  text: number,
  fRotX: number,
  fRotY: number,
  fRotZ: number,
  fZoom = 1
): void => {
  samp.callNative(
    "TextDrawSetPreviewRot",
    "iffff",
    text,
    fRotX,
    fRotY,
    fRotZ,
    fZoom
  );
};

export const TextDrawSetPreviewVehicleColors = (
  text: number,
  color1: string | number,
  color2: string | number
): boolean => {
  return Boolean(
    samp.callNative(
      "TextDrawSetPreviewVehCol",
      "iii",
      text,
      rgba(color1),
      rgba(color2)
    )
  );
};

export const GangZoneCreate = (
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
): number => {
  return samp.callNative("GangZoneCreate", "ffff", minX, minY, maxX, maxY);
};

export const GangZoneDestroy = (zone: number): number => {
  return samp.callNative("GangZoneDestroy", "i", zone);
};

export const GangZoneShowForPlayer = (
  playerId: number,
  zone: number,
  color: string | number
): number => {
  return samp.callNative(
    "GangZoneShowForPlayer",
    "iii",
    playerId,
    zone,
    rgba(color)
  );
};

export const GangZoneShowForAll = (
  zone: number,
  color: string | number
): number => {
  return samp.callNative("GangZoneShowForAll", "ii", zone, rgba(color));
};

export const GangZoneHideForPlayer = (
  playerId: number,
  zone: number
): number => {
  return samp.callNative("GangZoneHideForPlayer", "ii", playerId, zone);
};

export const GangZoneHideForAll = (zone: number): number => {
  return samp.callNative("GangZoneHideForAll", "i", zone);
};

export const GangZoneFlashForPlayer = (
  playerId: number,
  zone: number,
  flashColor: string | number
): number => {
  return samp.callNative(
    "GangZoneFlashForPlayer",
    "iii",
    playerId,
    zone,
    rgba(flashColor)
  );
};

export const GangZoneFlashForAll = (
  zone: number,
  flashColor: string | number
): number => {
  return samp.callNative("GangZoneFlashForAll", "ii", zone, rgba(flashColor));
};

export const GangZoneStopFlashForPlayer = (
  playerId: number,
  zone: number
): number => {
  return samp.callNative("GangZoneStopFlashForPlayer", "ii", playerId, zone);
};

export const GangZoneStopFlashForAll = (zone: number): number => {
  return samp.callNative("GangZoneStopFlashForAll", "i", zone);
};

export const Create3DTextLabel = (
  text: string,
  color: string | number,
  X: number,
  Y: number,
  Z: number,
  DrawDistance: number,
  virtualWorld: number,
  testLOS = false
): number => {
  return samp.callNative(
    "Create3DTextLabel",
    "siffffii",
    text,
    rgba(color),
    X,
    Y,
    Z,
    DrawDistance,
    virtualWorld,
    testLOS
  );
};

export const Delete3DTextLabel = (id: number): number => {
  return samp.callNative("Delete3DTextLabel", "i", id);
};

export const Attach3DTextLabelToPlayer = (
  id: number,
  playerId: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number
): number => {
  return samp.callNative(
    "Attach3DTextLabelToPlayer",
    "iifff",
    id,
    playerId,
    OffsetX,
    OffsetY,
    OffsetZ
  );
};

export const Attach3DTextLabelToVehicle = (
  id: number,
  vehicleId: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number
): number => {
  return samp.callNative(
    "Attach3DTextLabelToVehicle",
    "iifff",
    id,
    vehicleId,
    OffsetX,
    OffsetY,
    OffsetZ
  );
};

export const Update3DTextLabelText = (
  id: number,
  color: string | number,
  text: string
): number => {
  return samp.callNative("Update3DTextLabelText", "iis", id, rgba(color), text);
};

export const CreatePlayer3DTextLabel = (
  playerId: number,
  text: string,
  color: string | number,
  X: number,
  Y: number,
  Z: number,
  DrawDistance: number,
  attachedPlayer: number,
  attachedVehicle: number,
  testLOS: boolean
): number => {
  return samp.callNative(
    "CreatePlayer3DTextLabel",
    "isiffffiii",
    playerId,
    text,
    rgba(color),
    X,
    Y,
    Z,
    DrawDistance,
    attachedPlayer,
    attachedVehicle,
    testLOS
  );
};

export const DeletePlayer3DTextLabel = (
  playerId: number,
  id: number
): number => {
  return samp.callNative("DeletePlayer3DTextLabel", "ii", playerId, id);
};

export const UpdatePlayer3DTextLabelText = (
  playerId: number,
  id: number,
  color: string | number,
  text: string
): number => {
  return samp.callNative(
    "UpdatePlayer3DTextLabelText",
    "iiis",
    playerId,
    id,
    rgba(color),
    text
  );
};

export const gpci = (playerId: number, charset: string): string => {
  return I18n.decodeFromBuf(
    I18n.getValidStr(samp.callNative("gpci", "iAi", playerId, 41)),
    charset
  );
};

export const CreateActor = (
  modelId: number,
  X: number,
  Y: number,
  Z: number,
  Rotation: number
): number => {
  return samp.callNative("CreateActor", "iffff", modelId, X, Y, Z, Rotation);
};

export const DestroyActor = (actorId: number): number => {
  return samp.callNative("DestroyActor", "i", actorId);
};

export const IsActorStreamedIn = (
  actorId: number,
  forPlayerId: number
): boolean => {
  return Boolean(
    samp.callNative("IsActorStreamedIn", "ii", actorId, forPlayerId)
  );
};

export const SetActorVirtualWorld = (
  actorId: number,
  vWorld: number
): number => {
  return samp.callNative("SetActorVirtualWorld", "ii", actorId, vWorld);
};

export const GetActorVirtualWorld = (actorId: number): number => {
  return samp.callNative("GetActorVirtualWorld", "i", actorId);
};

export const ApplyActorAnimation = (
  actorId: number,
  animLib: string,
  animName: string,
  fDelta: number,
  loop: boolean,
  lockX: boolean,
  lockY: boolean,
  freeze: boolean,
  time: number
): number => {
  return samp.callNative(
    "ApplyActorAnimation",
    "issfiiiii",
    actorId,
    animLib,
    animName,
    fDelta,
    loop,
    lockX,
    lockY,
    freeze,
    time
  );
};

export const ClearActorAnimations = (actorId: number): number => {
  return samp.callNative("ClearActorAnimations", "i", actorId);
};

export const SetActorPos = (
  actorId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNative("SetActorPos", "ifff", actorId, X, Y, Z);
};

export const GetActorPos = (actorId: number): Array<number> => {
  return samp.callNative("GetActorPos", "iFFF", actorId);
};

export const SetActorFacingAngle = (actorId: number, ang: number): number => {
  return samp.callNative("SetActorFacingAngle", "if", actorId, ang);
};

export const GetActorFacingAngle = (actorId: number): number => {
  return samp.callNative("GetActorFacingAngle", "iF", actorId);
};

export const SetActorHealth = (actorId: number, health: number): number => {
  return samp.callNative("SetActorHealth", "if", actorId, health);
};

export const GetActorHealth = (actorId: number): number => {
  return samp.callNative("GetActorHealth", "iF", actorId);
};

export const SetActorInvulnerable = (
  actorId: number,
  invulnerable: boolean
): number => {
  return samp.callNative("SetActorInvulnerable", "ii", actorId, invulnerable);
};

export const IsActorInvulnerable = (actorId: number): boolean => {
  return Boolean(samp.callNative("IsActorInvulnerable", "i", actorId));
};

export const IsValidActor = (actorId: number): boolean => {
  return Boolean(samp.callNative("IsValidActor", "i", actorId));
};

export const HTTP = (
  index: number,
  type: number,
  url: string,
  data: string,
  callback: string
): number => {
  return samp.callNative("HTTP", "iisss", index, type, url, data, callback);
};

export const CreateObject = (
  modelId: number,
  X: number,
  Y: number,
  Z: number,
  rX: number,
  rY: number,
  rZ: number,
  DrawDistance: number
): number => {
  return samp.callNative(
    "CreateObject",
    "ifffffff",
    modelId,
    X,
    Y,
    Z,
    rX,
    rY,
    rZ,
    DrawDistance
  );
};

export const AttachObjectToVehicle = (
  objectId: number,
  vehicleId: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return samp.callNative(
    "AttachObjectToVehicle",
    "iiffffff",
    objectId,
    vehicleId,
    OffsetX,
    OffsetY,
    OffsetZ,
    RotX,
    RotY,
    RotZ
  );
};

export const AttachObjectToObject = (
  objectId: number,
  attachToId: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number,
  RotX: number,
  RotY: number,
  RotZ: number,
  SyncRotation = true
): number => {
  return samp.callNative(
    "AttachObjectToObject",
    "iiffffffi",
    objectId,
    attachToId,
    OffsetX,
    OffsetY,
    OffsetZ,
    RotX,
    RotY,
    RotZ,
    SyncRotation
  );
};

export const AttachObjectToPlayer = (
  objectId: number,
  playerId: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return samp.callNative(
    "AttachObjectToPlayer",
    "iiffffff",
    objectId,
    playerId,
    OffsetX,
    OffsetY,
    OffsetZ,
    RotX,
    RotY,
    RotZ
  );
};

export const SetObjectPos = (
  objectId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNative("SetObjectPos", "ifff", objectId, X, Y, Z);
};

export const GetObjectPos = (objectId: number): Array<number> => {
  return samp.callNative("GetObjectPos", "iFFF", objectId);
};

export const SetObjectRot = (
  objectId: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return samp.callNative("SetObjectRot", "ifff", objectId, RotX, RotY, RotZ);
};

export const GetObjectRot = (objectId: number): Array<number> => {
  return samp.callNative("GetObjectRot", "iFFF", objectId);
};

export const GetObjectModel = (objectId: number): number => {
  return samp.callNative("GetObjectModel", "i", objectId);
};

export const SetObjectNoCameraCollision = (objectId: number): boolean => {
  return Boolean(samp.callNative("SetObjectNoCameraCollision", "i", objectId));
};

export const IsValidObject = (objectId: number): boolean => {
  return Boolean(samp.callNative("IsValidObject", "i", objectId));
};

export const DestroyObject = (objectId: number): number => {
  return samp.callNative("DestroyObject", "i", objectId);
};

export const MoveObject = (
  objectId: number,
  X: number,
  Y: number,
  Z: number,
  Speed: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return samp.callNative(
    "MoveObject",
    "ifffffff",
    objectId,
    X,
    Y,
    Z,
    Speed,
    RotX,
    RotY,
    RotZ
  );
};

export const StopObject = (objectId: number): number => {
  return samp.callNative("StopObject", "i", objectId);
};

export const IsObjectMoving = (objectId: number): boolean => {
  return Boolean(samp.callNative("IsObjectMoving", "i", objectId));
};

export const BeginObjectEditing = (
  playerId: number,
  objectId: number
): boolean => {
  return Boolean(
    samp.callNative("BeginObjectEditing", "ii", playerId, objectId)
  );
};

export const BeginPlayerObjectEditing = (
  playerId: number,
  objectId: number
): boolean => {
  return Boolean(
    samp.callNative("BeginPlayerObjectEditing", "ii", playerId, objectId)
  );
};

export const BeginObjectSelecting = (playerId: number): boolean => {
  return Boolean(samp.callNative("BeginObjectSelecting", "i", playerId));
};

export const EndObjectEditing = (playerId: number): boolean => {
  return Boolean(samp.callNative("EndObjectEditing", "i", playerId));
};

export const CreatePlayerObject = (
  playerId: number,
  modelId: number,
  X: number,
  Y: number,
  Z: number,
  rX: number,
  rY: number,
  rZ: number,
  DrawDistance: number
): number => {
  return samp.callNative(
    "CreatePlayerObject",
    "iifffffff",
    playerId,
    modelId,
    X,
    Y,
    Z,
    rX,
    rY,
    rZ,
    DrawDistance
  );
};

export const AttachPlayerObjectToVehicle = (
  playerId: number,
  objectId: number,
  vehicleId: number,
  fOffsetX: number,
  fOffsetY: number,
  fOffsetZ: number,
  fRotX: number,
  fRotY: number,
  RotZ: number
): number => {
  return samp.callNative(
    "AttachPlayerObjectToVehicle",
    "iiiffffff",
    playerId,
    objectId,
    vehicleId,
    fOffsetX,
    fOffsetY,
    fOffsetZ,
    fRotX,
    fRotY,
    RotZ
  );
};

export const SetPlayerObjectPos = (
  playerId: number,
  objectId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNative(
    "SetPlayerObjectPos",
    "iifff",
    playerId,
    objectId,
    X,
    Y,
    Z
  );
};

export const GetPlayerObjectPos = (
  playerId: number,
  objectId: number
): Array<number> => {
  return samp.callNative("GetPlayerObjectPos", "iiFFF", playerId, objectId);
};

export const SetPlayerObjectRot = (
  playerId: number,
  objectId: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return samp.callNative(
    "SetPlayerObjectRot",
    "iifff",
    playerId,
    objectId,
    RotX,
    RotY,
    RotZ
  );
};

export const GetPlayerObjectRot = (
  playerId: number,
  objectId: number
): Array<number> => {
  return samp.callNative("GetPlayerObjectRot", "iiFFF", playerId, objectId);
};

export const GetPlayerObjectModel = (
  playerId: number,
  objectId: number
): number => {
  return samp.callNative("GetPlayerObjectModel", "ii", playerId, objectId);
};

export const SetPlayerObjectNoCameraCollision = (
  playerId: number,
  objectId: number
): boolean => {
  return Boolean(
    samp.callNative(
      "SetPlayerObjectNoCameraCollision",
      "ii",
      playerId,
      objectId
    )
  );
};

export const IsValidPlayerObject = (
  playerId: number,
  objectId: number
): boolean => {
  return Boolean(
    samp.callNative("IsValidPlayerObject", "ii", playerId, objectId)
  );
};

export const DestroyPlayerObject = (
  playerId: number,
  objectId: number
): number => {
  return samp.callNative("DestroyPlayerObject", "ii", playerId, objectId);
};

export const MovePlayerObject = (
  playerId: number,
  objectId: number,
  X: number,
  Y: number,
  Z: number,
  Speed: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return samp.callNative(
    "MovePlayerObject",
    "iifffffff",
    playerId,
    objectId,
    X,
    Y,
    Z,
    Speed,
    RotX,
    RotY,
    RotZ
  );
};

export const StopPlayerObject = (
  playerId: number,
  objectId: number
): number => {
  return samp.callNative("StopPlayerObject", "ii", playerId, objectId);
};

export const IsPlayerObjectMoving = (
  playerId: number,
  objectId: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerObjectMoving", "ii", playerId, objectId)
  );
};

export const AttachPlayerObjectToPlayer = (
  objectplayer: number,
  objectId: number,
  attachplayer: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number,
  rX: number,
  rY: number,
  rZ: number
): number => {
  return samp.callNative(
    "AttachPlayerObjectToPlayer",
    "iiiffffff",
    objectplayer,
    objectId,
    attachplayer,
    OffsetX,
    OffsetY,
    OffsetZ,
    rX,
    rY,
    rZ
  );
};

export const SetObjectMaterial = (
  objectId: number,
  materialIndex: number,
  modelId: number,
  txdName: string,
  textureName: string,
  materialColor: string | number
): number => {
  return samp.callNative(
    "SetObjectMaterial",
    "iiissi",
    objectId,
    materialIndex,
    modelId,
    txdName,
    textureName,
    rgba(materialColor)
  );
};

export const SetPlayerObjectMaterial = (
  playerId: number,
  objectId: number,
  materialIndex: number,
  modelId: number,
  txdName: string,
  textureName: string,
  materialColor: string | number
): number => {
  return samp.callNative(
    "SetPlayerObjectMaterial",
    "iiiissi",
    playerId,
    objectId,
    materialIndex,
    modelId,
    txdName,
    textureName,
    rgba(materialColor)
  );
};

export const SetObjectMaterialText = (
  objectId: number,
  text: string,
  materialIndex: number,
  materialSize: number,
  fontFace: string,
  fontsize: number,
  bold = true,
  fontColor: string | number,
  backColor: string | number,
  textAlignment: number
): number => {
  return samp.callNative(
    "SetObjectMaterialText",
    "isiisiiiii",
    objectId,
    text,
    materialIndex,
    materialSize,
    fontFace,
    fontsize,
    bold,
    rgba(fontColor),
    rgba(backColor),
    textAlignment
  );
};

export const SetPlayerObjectMaterialText = (
  playerId: number,
  objectId: number,
  text: string,
  materialIndex: number,
  materialSize: number,
  fontFace: string,
  fontsize: number,
  bold = true,
  fontColor: string | number,
  backColor: string | number,
  textAlignment: number
): number => {
  return samp.callNative(
    "SetPlayerObjectMaterialText",
    "iisiisiiiii",
    playerId,
    objectId,
    text,
    materialIndex,
    materialSize,
    fontFace,
    fontsize,
    bold,
    rgba(fontColor),
    rgba(backColor),
    textAlignment
  );
};

export const SetObjectsDefaultCameraCollision = (disable: boolean): boolean => {
  return Boolean(samp.callNative("SetObjectsDefaultCameraCol", "i", disable));
};

export const SetSpawnInfo = (
  playerId: number,
  team: number,
  skin: number,
  x: number,
  y: number,
  z: number,
  rotation: number,
  weapon1: WeaponEnum,
  weapon1_ammo: number,
  weapon2: WeaponEnum,
  weapon2_ammo: number,
  weapon3: WeaponEnum,
  weapon3_ammo: number
): number => {
  return samp.callNative(
    "SetSpawnInfo",
    "iiiffffiiiiii",
    playerId,
    team,
    skin,
    x,
    y,
    z,
    rotation,
    weapon1,
    weapon1_ammo,
    weapon2,
    weapon2_ammo,
    weapon3,
    weapon3_ammo
  );
};

export const SpawnPlayer = (playerId: number): number => {
  return samp.callNative("SpawnPlayer", "i", playerId);
};

export const SetPlayerPos = (
  playerId: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative("SetPlayerPos", "ifff", playerId, x, y, z);
};

export const SetPlayerPosFindZ = (
  playerId: number,
  x: number,
  y: number,
  z: number
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
  return samp.callNative("GetPlayerFacingAngle", "iF", playerId);
};

export const IsPlayerInRangeOfPoint = (
  playerId: number,
  range: number,
  x: number,
  y: number,
  z: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInRangeOfPoint", "iffff", playerId, range, x, y, z)
  );
};

export const GetPlayerDistanceFromPoint = (
  playerId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNativeFloat(
    "GetPlayerDistanceFromPoint",
    "ifff",
    playerId,
    X,
    Y,
    Z
  );
};

export const IsPlayerStreamedIn = (
  playerId: number,
  forPlayerId: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerStreamedIn", "ii", playerId, forPlayerId)
  );
};

export const SetPlayerInterior = (
  playerId: number,
  interiorId: number
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
  return samp.callNative("GetPlayerHealth", "iF", playerId);
};

export const SetPlayerArmour = (playerId: number, armour: number): number => {
  return samp.callNative("SetPlayerArmour", "if", playerId, armour);
};

export const GetPlayerArmour = (playerId: number): number => {
  return samp.callNative("GetPlayerArmour", "iF", playerId);
};

export const SetPlayerAmmo = (
  playerId: number,
  weaponId: number,
  ammo: number
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
  level: number
): number => {
  return samp.callNative("SetPlayerDrunkLevel", "ii", playerId, level);
};

export const SetPlayerColor = (
  playerId: number,
  color: string | number
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
  ammo: number
): number => {
  return samp.callNative("GivePlayerWeapon", "iii", playerId, weaponId, ammo);
};

export const ResetPlayerWeapons = (playerId: number): number => {
  return samp.callNative("ResetPlayerWeapons", "i", playerId);
};

export const SetPlayerArmedWeapon = (
  playerId: number,
  weaponId: number
): number => {
  return samp.callNative("SetPlayerArmedWeapon", "ii", playerId, weaponId);
};

export const GetPlayerWeaponData = (
  playerId: number,
  slot: number
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
  minute: number
): number => {
  return samp.callNative("SetPlayerTime", "iii", playerId, hour, minute);
};

export const GetPlayerTime = (playerId: number): Array<number> => {
  return samp.callNative("GetPlayerTime", "iII", playerId);
};

export const TogglePlayerClock = (
  playerId: number,
  toggle: boolean
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
  level: number
): number => {
  return samp.callNative("SetPlayerWantedLevel", "ii", playerId, level);
};

export const GetPlayerWantedLevel = (playerId: number): number => {
  return samp.callNative("GetPlayerWantedLevel", "i", playerId);
};

export const SetPlayerFightingStyle = (
  playerId: number,
  style: FightingStylesEnum
): number => {
  return samp.callNative("SetPlayerFightingStyle", "ii", playerId, style);
};

export const GetPlayerFightingStyle = (
  playerId: number
): FightingStylesEnum => {
  return samp.callNative("GetPlayerFightingStyle", "i", playerId);
};

export const SetPlayerVelocity = (
  playerId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNative("SetPlayerVelocity", "ifff", playerId, X, Y, Z);
};

export const GetPlayerVelocity = (playerId: number): Array<number> => {
  return samp.callNative("GetPlayerVelocity", "iFFF", playerId);
};

export const PlayCrimeReportForPlayer = (
  playerId: number,
  suspectid: number,
  crime: number
): number => {
  return samp.callNative(
    "PlayCrimeReportForPlayer",
    "iii",
    playerId,
    suspectid,
    crime
  );
};

export const PlayAudioStreamForPlayer = (
  playerId: number,
  url: string,
  posX: number,
  posY: number,
  posZ: number,
  distance: number,
  usepos = false
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
    usepos
  );
};

export const StopAudioStreamForPlayer = (playerId: number): number => {
  return samp.callNative("StopAudioStreamForPlayer", "i", playerId);
};

export const SetPlayerShopName = (
  playerId: number,
  shopname: string
): number => {
  return samp.callNative("SetPlayerShopName", "is", playerId, shopname);
};

export const SetPlayerSkillLevel = (
  playerId: number,
  skill: WeaponSkillsEnum,
  level: number
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
  fRadius: number
): number => {
  return samp.callNative(
    "RemoveBuildingForPlayer",
    "iiffff",
    playerId,
    modelId,
    fX,
    fY,
    fZ,
    fRadius
  );
};

export const GetPlayerLastShotVectors = (playerId: number): Array<number> => {
  return samp.callNative("GetPlayerLastShotVectors", "iFFFFFF", playerId);
};

export const SetPlayerAttachedObject = (
  playerId: number,
  index: number,
  modelId: number,
  bone: BoneIdsEnum,
  fOffsetX: number,
  fOffsetY: number,
  fOffsetZ: number,
  fRotX: number,
  fRotY: number,
  fRotZ: number,
  fScaleX: number,
  fScaleY: number,
  fScaleZ: number,
  materialColor1: string | number,
  materialColor2: string | number
): number => {
  return samp.callNative(
    "SetPlayerAttachedObject",
    "iiiifffffffffii",
    playerId,
    index,
    modelId,
    bone,
    fOffsetX,
    fOffsetY,
    fOffsetZ,
    fRotX,
    fRotY,
    fRotZ,
    fScaleX,
    fScaleY,
    fScaleZ,
    rgba(materialColor1),
    rgba(materialColor2)
  );
};

export const RemovePlayerAttachedObject = (
  playerId: number,
  index: number
): number => {
  return samp.callNative("RemovePlayerAttachedObject", "ii", playerId, index);
};

export const IsPlayerAttachedObjectSlotUsed = (
  playerId: number,
  index: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerAttachedObjectSlotUsed", "ii", playerId, index)
  );
};

export const EditAttachedObject = (playerId: number, index: number): number => {
  return samp.callNative("EditAttachedObject", "ii", playerId, index);
};

export const CreatePlayerTextDraw = (
  playerId: number,
  x: number,
  y: number,
  text: string
): number => {
  return samp.callNative("CreatePlayerTextDraw", "iffs", playerId, x, y, text);
};

export const PlayerTextDrawDestroy = (playerId: number, text: number): void => {
  samp.callNative("PlayerTextDrawDestroy", "ii", playerId, text);
};

export const PlayerTextDrawLetterSize = (
  playerId: number,
  text: number,
  x: number,
  y: number
): number => {
  return samp.callNative(
    "PlayerTextDrawLetterSize",
    "iiff",
    playerId,
    text,
    x,
    y
  );
};

export const PlayerTextDrawTextSize = (
  playerId: number,
  text: number,
  x: number,
  y: number
): number => {
  return samp.callNative(
    "PlayerTextDrawTextSize",
    "iiff",
    playerId,
    text,
    x,
    y
  );
};

export const PlayerTextDrawAlignment = (
  playerId: number,
  text: number,
  alignment: TextDrawAlignEnum
): number => {
  return samp.callNative(
    "PlayerTextDrawAlignment",
    "iii",
    playerId,
    text,
    alignment
  );
};

export const PlayerTextDrawColor = (
  playerId: number,
  text: number,
  color: string | number
): boolean => {
  return Boolean(
    samp.callNative("PlayerTextDrawColor", "iii", playerId, text, rgba(color))
  );
};

export const PlayerTextDrawUseBox = (
  playerId: number,
  text: number,
  use: boolean
): number => {
  return samp.callNative("PlayerTextDrawUseBox", "iii", playerId, text, use);
};

export const PlayerTextDrawBoxColor = (
  playerId: number,
  text: number,
  color: string | number
): boolean => {
  return Boolean(
    samp.callNative(
      "PlayerTextDrawBoxColor",
      "iii",
      playerId,
      text,
      rgba(color)
    )
  );
};

export const PlayerTextDrawSetShadow = (
  playerId: number,
  text: number,
  size: number
): number => {
  return samp.callNative(
    "PlayerTextDrawSetShadow",
    "iii",
    playerId,
    text,
    size
  );
};

export const PlayerTextDrawSetOutline = (
  playerId: number,
  text: number,
  size: number
): number => {
  return samp.callNative(
    "PlayerTextDrawSetOutline",
    "iii",
    playerId,
    text,
    size
  );
};

export const PlayerTextDrawBackgroundColor = (
  playerId: number,
  text: number,
  color: string | number
): boolean => {
  return Boolean(
    samp.callNative(
      "PlayerTextDrawBackgroundColor",
      "iii",
      playerId,
      text,
      rgba(color)
    )
  );
};

export const PlayerTextDrawFont = (
  playerId: number,
  text: number,
  font: number
): number => {
  return samp.callNative("PlayerTextDrawFont", "iii", playerId, text, font);
};

export const PlayerTextDrawSetProportional = (
  playerId: number,
  text: number,
  set: boolean
): number => {
  return samp.callNative(
    "PlayerTextDrawSetProportional",
    "iii",
    playerId,
    text,
    set
  );
};

export const PlayerTextDrawSetSelectable = (
  playerId: number,
  text: number,
  set: boolean
): number => {
  return samp.callNative(
    "PlayerTextDrawSetSelectable",
    "iii",
    playerId,
    text,
    set
  );
};

export const PlayerTextDrawShow = (playerId: number, text: number): number => {
  return samp.callNative("PlayerTextDrawShow", "ii", playerId, text);
};

export const PlayerTextDrawHide = (playerId: number, text: number): number => {
  return samp.callNative("PlayerTextDrawHide", "ii", playerId, text);
};

export const PlayerTextDrawSetString = (
  playerId: number,
  text: number,
  string: string
): number => {
  return samp.callNative(
    "PlayerTextDrawSetString",
    "iis",
    playerId,
    text,
    string
  );
};

export const PlayerTextDrawSetPreviewModel = (
  playerId: number,
  text: number,
  modelindex: number
): number => {
  return samp.callNative(
    "PlayerTextDrawSetPreviewModel",
    "iii",
    playerId,
    text,
    modelindex
  );
};

export const PlayerTextDrawSetPreviewRot = (
  playerId: number,
  text: number,
  fRotX: number,
  fRotY: number,
  fRotZ: number,
  fZoom: number
): number => {
  return samp.callNative(
    "PlayerTextDrawSetPreviewRot",
    "iiffff",
    playerId,
    text,
    fRotX,
    fRotY,
    fRotZ,
    fZoom
  );
};

export const PlayerTextDrawSetPreviewVehicleColors = (
  playerId: number,
  text: number,
  color1: string | number,
  color2: string | number
): boolean => {
  return Boolean(
    samp.callNative(
      "PlayerTextDrawSetPreviewVehCol",
      "iiii",
      playerId,
      text,
      color1,
      color2
    )
  );
};

export const SetPlayerChatBubble = (
  playerId: number,
  text: string,
  color: string | number,
  drawDistance: number,
  expiretime: number
): number => {
  return samp.callNative(
    "SetPlayerChatBubble",
    "isifi",
    playerId,
    text,
    rgba(color),
    drawDistance,
    expiretime
  );
};

export const PutPlayerInVehicle = (
  playerId: number,
  vehicleId: number,
  seatId: number
): number => {
  return samp.callNative(
    "PutPlayerInVehicle",
    "iii",
    playerId,
    vehicleId,
    seatId
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
  toggle: boolean
): number => {
  return samp.callNative("TogglePlayerControllable", "ii", playerId, toggle);
};

export const PlayerPlaySound = (
  playerId: number,
  soundid: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative(
    "PlayerPlaySound",
    "iifff",
    playerId,
    soundid,
    x,
    y,
    z
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
  forcesync: boolean
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
    forcesync
  );
};

export const ClearAnimations = (
  playerId: number,
  forcesync: boolean
): number => {
  return samp.callNative("ClearAnimations", "ii", playerId, forcesync);
};

export const GetPlayerAnimationIndex = (playerId: number): number => {
  return samp.callNative("GetPlayerAnimationIndex", "i", playerId);
};

export const GetPlayerSpecialAction = (
  playerId: number
): SpecialActionsEnum => {
  return samp.callNative("GetPlayerSpecialAction", "i", playerId);
};

export const SetPlayerSpecialAction = (
  playerId: number,
  actionid: SpecialActionsEnum
): number => {
  return samp.callNative("SetPlayerSpecialAction", "ii", playerId, actionid);
};

export const DisableRemoteVehicleCollisions = (
  playerId: number,
  disable: boolean
): number => {
  return samp.callNative(
    "DisableRemoteVehicleCollisions",
    "ii",
    playerId,
    disable
  );
};

export const SetPlayerCheckpoint = (
  playerId: number,
  x: number,
  y: number,
  z: number,
  size: number
): number => {
  return samp.callNative(
    "SetPlayerCheckpoint",
    "iffff",
    playerId,
    x,
    y,
    z,
    size
  );
};

export const DisablePlayerCheckpoint = (playerId: number): number => {
  return samp.callNative("DisablePlayerCheckpoint", "i", playerId);
};

export const SetPlayerRaceCheckpoint = (
  playerId: number,
  type: number,
  x: number,
  y: number,
  z: number,
  nextX: number,
  nextY: number,
  nextZ: number,
  size: number
): number => {
  return samp.callNative(
    "SetPlayerRaceCheckpoint",
    "iifffffff",
    playerId,
    type,
    x,
    y,
    z,
    nextX,
    nextY,
    nextZ,
    size
  );
};

export const DisablePlayerRaceCheckpoint = (playerId: number): number => {
  return samp.callNative("DisablePlayerRaceCheckpoint", "i", playerId);
};

export const SetPlayerWorldBounds = (
  playerId: number,
  x_max: number,
  x_min: number,
  y_max: number,
  y_min: number
): number => {
  return samp.callNative(
    "SetPlayerWorldBounds",
    "iffff",
    playerId,
    x_max,
    x_min,
    y_max,
    y_min
  );
};

export const ClearPlayerWorldBounds = (playerId: number) => {
  return Boolean(samp.callNative("ClearPlayerWorldBounds", "i", playerId));
};

export const SetPlayerMarkerForPlayer = (
  playerId: number,
  showPlayerId: number,
  color: string | number
): number => {
  return samp.callNative(
    "SetPlayerMarkerForPlayer",
    "iii",
    playerId,
    showPlayerId,
    rgba(color)
  );
};

export function GetPlayerMarkerForPlayer(
  playerId: number,
  targetId: number
): number {
  return samp.callNative("GetPlayerMarkerForPlayer", "ii", targetId);
}

export const ShowPlayerNameTagForPlayer = (
  playerId: number,
  showPlayerId: number,
  show: boolean
): number => {
  return samp.callNative(
    "ShowPlayerNameTagForPlayer",
    "iii",
    playerId,
    showPlayerId,
    show
  );
};

export const SetPlayerMapIcon = (
  playerId: number,
  iconId: number,
  x: number,
  y: number,
  z: number,
  markertype: number,
  color: string | number,
  style: number
): number => {
  return samp.callNative(
    "SetPlayerMapIcon",
    "iifffiii",
    playerId,
    iconId,
    x,
    y,
    z,
    markertype,
    rgba(color),
    style
  );
};

export const RemovePlayerMapIcon = (
  playerId: number,
  iconId: number
): number => {
  return samp.callNative("RemovePlayerMapIcon", "ii", playerId, iconId);
};

export const SetPlayerCameraPos = (
  playerId: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative("SetPlayerCameraPos", "ifff", playerId, x, y, z);
};

export const SetPlayerCameraLookAt = (
  playerId: number,
  x: number,
  y: number,
  z: number,
  cut: CameraCutStylesEnum
): number => {
  return samp.callNative(
    "SetPlayerCameraLookAt",
    "ifffi",
    playerId,
    x,
    y,
    z,
    cut
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
  enable: boolean
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
  objectId: number
): number => {
  return samp.callNative("AttachCameraToObject", "ii", playerId, objectId);
};

export const AttachCameraToPlayerObject = (
  playerId: number,
  playerobjectId: number
): number => {
  return samp.callNative(
    "AttachCameraToPlayerObject",
    "ii",
    playerId,
    playerobjectId
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
  cut: CameraCutStylesEnum
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
    cut
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
  cut: CameraCutStylesEnum
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
    cut
  );
};

export const IsPlayerConnected = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerConnected", "i", playerId));
};

export const IsPlayerInVehicle = (
  playerId: number,
  vehicleId: number
): boolean => {
  return Boolean(
    samp.callNative("IsPlayerInVehicle", "ii", playerId, vehicleId)
  );
};

export const IsPlayerInAnyVehicle = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerInAnyVehicle", "i", playerId));
};

export const IsPlayerInCheckpoint = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerInCheckpoint", "i", playerId));
};

export const IsPlayerInRaceCheckpoint = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerInRaceCheckpoint", "i", playerId));
};

export const SetPlayerVirtualWorld = (
  playerId: number,
  worldId: number
): number => {
  return samp.callNative("SetPlayerVirtualWorld", "ii", playerId, worldId);
};

export const GetPlayerVirtualWorld = (playerId: number): number => {
  return samp.callNative("GetPlayerVirtualWorld", "i", playerId);
};

export const EnableStuntBonusForPlayer = (
  playerId: number,
  enable: boolean
): number => {
  return samp.callNative("EnableStuntBonusForPlayer", "ii", playerId, enable);
};

export const EnableStuntBonusForAll = (enable: boolean): number => {
  return samp.callNative("EnableStuntBonusForAll", "i", enable);
};

export const TogglePlayerSpectating = (
  playerId: number,
  toggle: boolean
): number => {
  return samp.callNative("TogglePlayerSpectating", "ii", playerId, toggle);
};

export const PlayerSpectatePlayer = (
  playerId: number,
  targetplayerid: number,
  mode: SpectateModesEnum
): number => {
  return samp.callNative(
    "PlayerSpectatePlayer",
    "iii",
    playerId,
    targetplayerid,
    mode
  );
};

export const PlayerSpectateVehicle = (
  playerId: number,
  targetvehicleId: number,
  mode: SpectateModesEnum
): number => {
  return samp.callNative(
    "PlayerSpectateVehicle",
    "iii",
    playerId,
    targetvehicleId,
    mode
  );
};

export const StartRecordingPlayerData = (
  playerId: number,
  recordtype: number,
  recordname: string
): number => {
  return samp.callNative(
    "StartRecordingPlayerData",
    "iis",
    playerId,
    recordtype,
    recordname
  );
};

export const StopRecordingPlayerData = (playerId: number): number => {
  return samp.callNative("StopRecordingPlayerData", "i", playerId);
};

export const SelectTextDraw = (
  playerId: number,
  hovercolor: string | number
): void => {
  samp.callNative("SelectTextDraw", "ii", playerId, rgba(hovercolor));
};

export const CancelSelectTextDraw = (playerId: number): void => {
  samp.callNative("CancelSelectTextDraw", "i", playerId);
};

export const CreateExplosionForPlayer = (
  playerId: number,
  X: number,
  Y: number,
  Z: number,
  type: number,
  Radius: number
): number => {
  return samp.callNative(
    "CreateExplosionForPlayer",
    "ifffif",
    playerId,
    X,
    Y,
    Z,
    type,
    Radius
  );
};

export const SendClientCheck = (
  playerId: number,
  type: number,
  memAddr: number,
  memOffset: number,
  byteCount: number
): number => {
  return samp.callNative(
    "SendClientCheck",
    "iiiii",
    playerId,
    type,
    memAddr,
    memOffset,
    byteCount
  );
};

export const CreateVehicle = (
  vehicletype: number,
  x: number,
  y: number,
  z: number,
  rotation: number,
  color1: string | number,
  color2: string | number,
  respawn_delay: number,
  addsiren: boolean
): number => {
  return samp.callNative(
    "CreateVehicle",
    "iffffiiii",
    vehicletype,
    x,
    y,
    z,
    rotation,
    rgba(color1),
    rgba(color2),
    respawn_delay,
    addsiren
  );
};

export const DestroyVehicle = (vehicleId: number): number => {
  return samp.callNative("DestroyVehicle", "i", vehicleId);
};

export const IsVehicleStreamedIn = (
  vehicleId: number,
  forPlayerId: number
): boolean => {
  return Boolean(
    samp.callNative("IsVehicleStreamedIn", "ii", vehicleId, forPlayerId)
  );
};

export const GetVehiclePos = (vehicleId: number) => {
  const values: number[] = samp.callNative("GetVehiclePos", "iFFF", vehicleId);
  if (values.length < 3) {
    throw new Error("VehicleID " + vehicleId + " not found");
  }
  return {
    x: values[0],
    y: values[1],
    z: values[2],
  };
};

export const SetVehiclePos = (
  vehicleId: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative("SetVehiclePos", "ifff", vehicleId, x, y, z);
};

export const GetVehicleZAngle = (vehicleId: number): number => {
  return samp.callNative("GetVehicleZAngle", "iF", vehicleId);
};

export const GetVehicleRotationQuat = (vehicleId: number): Array<number> => {
  return samp.callNative("GetVehicleRotationQuat", "iFFFF", vehicleId);
};

export const GetVehicleDistanceFromPoint = (
  vehicleId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNativeFloat(
    "GetVehicleDistanceFromPoint",
    "ifff",
    vehicleId,
    X,
    Y,
    Z
  );
};

export const SetVehicleZAngle = (
  vehicleId: number,
  z_angle: number
): number => {
  return samp.callNative("SetVehicleZAngle", "if", vehicleId, z_angle);
};

export const SetVehicleParamsForPlayer = (
  vehicleId: number,
  playerId: number,
  objective: boolean,
  doorslocked: boolean
): number => {
  return samp.callNative(
    "SetVehicleParamsForPlayer",
    "iiii",
    vehicleId,
    playerId,
    objective,
    doorslocked
  );
};

export const ManualVehicleEngineAndLights = (): number => {
  return samp.callNative("ManualVehicleEngineAndLights", "");
};

export const SetVehicleParamsEx = (
  vehicleId: number,
  engine: boolean,
  lights: boolean,
  alarm: boolean,
  doors: boolean,
  bonnet: boolean,
  boot: boolean,
  objective: boolean
): number => {
  return samp.callNative(
    "SetVehicleParamsEx",
    "iiiiiiii",
    vehicleId,
    engine,
    lights,
    alarm,
    doors,
    bonnet,
    boot,
    objective
  );
};

export const GetVehicleParamsEx = (vehicleId: number): Array<number> => {
  return samp.callNative("GetVehicleParamsEx", "iIIIIIII", vehicleId);
};

export const GetVehicleParamsSirenState = (vehicleId: number): number => {
  return samp.callNative("GetVehicleParamsSirenState", "i", vehicleId);
};

export const SetVehicleParamsCarDoors = (
  vehicleId: number,
  driver: boolean,
  passenger: boolean,
  backleft: boolean,
  backright: boolean
): number => {
  return samp.callNative(
    "SetVehicleParamsCarDoors",
    "iiiii",
    vehicleId,
    driver,
    passenger,
    backleft,
    backright
  );
};

export const GetVehicleParamsCarDoors = (
  vehicleId: number
): {
  driver: -1 | 0 | 1;
  passenger: -1 | 0 | 1;
  backleft: -1 | 0 | 1;
  backright: -1 | 0 | 1;
} => {
  const values = samp.callNative(
    "GetVehicleParamsCarDoors",
    "iIIII",
    vehicleId
  );
  return {
    driver: values[0],
    passenger: values[1],
    backleft: values[2],
    backright: values[3],
  };
};

export const SetVehicleParamsCarWindows = (
  vehicleId: number,
  driver: boolean,
  passenger: boolean,
  backleft: boolean,
  backright: boolean
): number => {
  return samp.callNative(
    "SetVehicleParamsCarWindows",
    "iiiii",
    vehicleId,
    driver,
    passenger,
    backleft,
    backright
  );
};

export const GetVehicleParamsCarWindows = (
  vehicleId: number
): {
  driver: -1 | 0 | 1;
  passenger: -1 | 0 | 1;
  backleft: -1 | 0 | 1;
  backright: -1 | 0 | 1;
} => {
  const values = samp.callNative(
    "GetVehicleParamsCarWindows",
    "iIIII",
    vehicleId
  );
  return {
    driver: values[0],
    passenger: values[1],
    backleft: values[2],
    backright: values[3],
  };
};

export const SetVehicleToRespawn = (vehicleId: number): number => {
  return samp.callNative("SetVehicleToRespawn", "i", vehicleId);
};

export const LinkVehicleToInterior = (
  vehicleId: number,
  interiorId: number
): number => {
  return samp.callNative("LinkVehicleToInterior", "ii", vehicleId, interiorId);
};

export const AddVehicleComponent = (
  vehicleId: number,
  componentId: number
): number => {
  return samp.callNative("AddVehicleComponent", "ii", vehicleId, componentId);
};

export const RemoveVehicleComponent = (
  vehicleId: number,
  componentId: number
): number => {
  return samp.callNative(
    "RemoveVehicleComponent",
    "ii",
    vehicleId,
    componentId
  );
};

export const ChangeVehicleColors = (
  vehicleId: number,
  color1: string | number,
  color2: string | number
): number => {
  return samp.callNative(
    "ChangeVehicleColor",
    "iii",
    vehicleId,
    rgba(color1),
    rgba(color2)
  );
};

export const ChangeVehiclePaintjob = (
  vehicleId: number,
  paintjobId: number
): number => {
  return samp.callNative("ChangeVehiclePaintjob", "ii", vehicleId, paintjobId);
};

export const SetVehicleHealth = (vehicleId: number, health: number): number => {
  return samp.callNative("SetVehicleHealth", "if", vehicleId, health);
};

export const GetVehicleHealth = (vehicleId: number): number => {
  return samp.callNative("GetVehicleHealth", "iF", vehicleId);
};

export const AttachTrailerToVehicle = (
  trailerid: number,
  vehicleId: number
): number => {
  return samp.callNative("AttachTrailerToVehicle", "ii", trailerid, vehicleId);
};

export const DetachTrailerFromVehicle = (vehicleId: number): number => {
  return samp.callNative("DetachTrailerFromVehicle", "i", vehicleId);
};

export const IsTrailerAttachedToVehicle = (vehicleId: number): boolean => {
  return Boolean(samp.callNative("IsTrailerAttachedToVehicle", "i", vehicleId));
};

export const GetVehicleTrailer = (vehicleId: number): number => {
  return samp.callNative("GetVehicleTrailer", "i", vehicleId);
};

export const SetVehicleNumberPlate = (
  vehicleId: number,
  numberplate: string
): number => {
  return samp.callNative("SetVehicleNumberPlate", "is", vehicleId, numberplate);
};

export const GetVehicleModel = (vehicleId: number): number => {
  return samp.callNative("GetVehicleModel", "i", vehicleId);
};

export const GetVehicleComponentInSlot = (
  vehicleId: number,
  slot: CarModTypeEnum
): number => {
  return samp.callNative("GetVehicleComponentInSlot", "ii", vehicleId, slot);
};

export const GetVehicleComponentType = (component: number): CarModTypeEnum => {
  return samp.callNative("GetVehicleComponentType", "i", component);
};

export const RepairVehicle = (vehicleId: number): number => {
  return samp.callNative("RepairVehicle", "i", vehicleId);
};

export const GetVehicleVelocity = (vehicleId: number): Array<number> => {
  return samp.callNative("GetVehicleVelocity", "iFFF", vehicleId);
};

export const SetVehicleVelocity = (
  vehicleId: number,
  X: number,
  Y: number,
  Z: number
) => {
  return Boolean(
    samp.callNative("SetVehicleVelocity", "ifff", vehicleId, X, Y, Z)
  );
};

export const SetVehicleAngularVelocity = (
  vehicleId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNative(
    "SetVehicleAngularVelocity",
    "ifff",
    vehicleId,
    X,
    Y,
    Z
  );
};

export const GetVehicleDamageStatus = (vehicleId: number) => {
  const values: number[] = samp.callNative(
    "GetVehicleDamageStatus",
    "iIIII",
    vehicleId
  );
  if (values.length < 4) {
    throw new Error("VehicleID " + vehicleId + " not found");
  }
  return {
    panels: values[0],
    doors: values[1],
    lights: values[2],
    tires: values[3],
  };
};

export const UpdateVehicleDamageStatus = (
  vehicleId: number,
  panels: number,
  doors: number,
  lights: number,
  tires: number
): number => {
  return samp.callNative(
    "UpdateVehicleDamageStatus",
    "iiiii",
    vehicleId,
    panels,
    doors,
    lights,
    tires
  );
};

export const GetVehicleModelInfo = (
  vehiclemodel: number,
  infoType: VehicleModelInfoEnum
) => {
  const values: number[] = samp.callNative(
    "GetVehicleModelInfo",
    "iiFFF",
    vehiclemodel,
    infoType
  );
  if (values.length < 3) {
    throw new Error("ModelID " + vehiclemodel + " not found");
  }
  return {
    x: values[0],
    y: values[1],
    z: values[2],
  };
};

export const SetVehicleVirtualWorld = (
  vehicleId: number,
  worldId: number
): number => {
  return samp.callNative("SetVehicleVirtualWorld", "ii", vehicleId, worldId);
};

export const GetVehicleVirtualWorld = (vehicleId: number): number => {
  return samp.callNative("GetVehicleVirtualWorld", "i", vehicleId);
};

export const IsValidVehicle = (vehicleId: number): boolean => {
  return Boolean(samp.callNative("IsValidVehicle", "i", vehicleId));
};

export const StartRecordingPlayback = (
  playbacktype: RecordTypesEnum,
  recordname: string
): void => {
  return samp.callNative(
    "StartRecordingPlayback",
    "is",
    playbacktype,
    recordname
  );
};

export const StopRecordingPlayback = (): void => {
  return samp.callNative("StopRecordingPlayback", "");
};

export const PauseRecordingPlayback = (): void => {
  return samp.callNative("PauseRecordingPlayback", "");
};

export const ResumeRecordingPlayback = (): void => {
  return samp.callNative("ResumeRecordingPlayback", "");
};

export const GetPlayerCustomSkin = (playerId: number): number => {
  return samp.callNative("GetPlayerCustomSkin", "i", playerId);
};

export const RedirectDownload = (playerId: number, url: string): number => {
  return samp.callNative("RedirectDownload", "is", playerId, url);
};

export const AddSimpleModel = (
  virtualWorld: number,
  baseid: number,
  newid: number,
  dffname: string,
  txdName: string
): number => {
  return samp.callNative(
    "AddSimpleModel",
    "iiiss",
    virtualWorld,
    baseid,
    newid,
    dffname,
    txdName
  );
};

export const AddSimpleModelTimed = (
  virtualWorld: number,
  baseid: number,
  newid: number,
  dffname: string,
  txdName: string,
  timeon: number,
  timeoff: number
): number => {
  return samp.callNative(
    "AddSimpleModelTimed",
    "iiissii",
    virtualWorld,
    baseid,
    newid,
    dffname,
    txdName,
    timeon,
    timeoff
  );
};

export const GetWeaponName = (weaponId: number): string => {
  return samp.callNative("GetWeaponName", "iSi", weaponId, 32);
};

export const NetStats_GetIpPort = (playerId: number): string => {
  return samp.callNative("NetStats_GetIpPort", "iSi", playerId, 128 + 6);
};

export const GetPlayerIp = (playerId: number): string => {
  return samp.callNative("GetPlayerIp", "iSi", playerId, 128);
};

export const GetAnimationName = (index: number): Array<string> => {
  return samp.callNative("GetAnimationName", "iSiSi", index, 32, 32);
};

export const GetPlayerVersion = (playerId: number): string => {
  return samp.callNative("GetPlayerVersion", "iSi", playerId, 24);
};

export const FindModelFileNameFromCRC = (crc: number): string => {
  return samp.callNative("FindModelFileNameFromCRC", "iSi", crc, 255);
};

export const FindTextureFileNameFromCRC = (crc: number): string => {
  return samp.callNative("FindTextureFileNameFromCRC", "iSi", crc, 255);
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
