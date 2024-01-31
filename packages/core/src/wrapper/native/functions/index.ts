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
import { callNative, callNativeFloat } from "core/utils/helperUtils";
import { I18n } from "core/controllers/i18n";

export const SendDeathMessage = (
  killer: number,
  killee: number,
  weapon: WeaponEnum | DamageDeathReasonEnum
): number => {
  return callNative("SendDeathMessage", "iii", killer, killee, weapon);
};

export const SendDeathMessageToPlayer = (
  playerId: number,
  killer: number,
  killee: number,
  weapon: WeaponEnum | DamageDeathReasonEnum
): number => {
  return callNative(
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
  return callNative("GameTextForAll", "sii", string, time, style);
};

export const HideGameTextForAll = (style: number) => {
  callNative("HideGameTextForAll", "i", style);
};

export const GameTextForPlayer = (
  playerId: number,
  string: string,
  time: number,
  style: number
): boolean => {
  return Boolean(
    callNative("GameTextForPlayer", "isii", playerId, string, time, style)
  );
};

export const HasGameText = (playerId: number, style: number): boolean => {
  return Boolean(callNative("HasGameText", "ii", playerId, style));
};

export const HideGameTextForPlayer = (
  playerId: number,
  style: number
): boolean => {
  return Boolean(callNative("HideGameTextForPlayer", "ii", playerId, style));
};

export const GetMaxPlayers = (): number => {
  return callNative("GetMaxPlayers", "");
};

export const VectorSize = (
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
): number => {
  return callNativeFloat("VectorSize", "ffffff", x1, y1, z1, x2, y2, z2);
};

export const SetGameModeText = (string: string): number => {
  return callNative("SetGameModeText", "s", string);
};

export const SetTeamCount = (count: number): number => {
  return callNative("SetTeamCount", "i", count);
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
  return callNative(
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
  return callNative(
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
  return callNative(
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
  return callNative(
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
  return callNative(
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
  return callNative(
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
  return callNative("DestroyPickup", "i", pickup);
};

export const ShowNameTags = (show: boolean): number => {
  return callNative("ShowNameTags", "i", show);
};

export const ShowPlayerMarkers = (mode: MarkerModesEnum): number => {
  return callNative("ShowPlayerMarkers", "i", mode);
};

export const GameModeExit = (): number => {
  return callNative("GameModeExit", "");
};

export const SetWorldTime = (hour: number): number => {
  return callNative("SetWorldTime", "i", hour);
};

export const EnableVehicleFriendlyFire = (): number => {
  return callNative("EnableVehicleFriendlyFire", "");
};

export const SetWeather = (weatherid: number): number => {
  return callNative("SetWeather", "i", weatherid);
};

export const GetGravity = (): number => {
  return callNativeFloat("GetGravity", "");
};

export const SetGravity = (gravity: number): number => {
  return callNative("SetGravity", "f", gravity);
};

export const CreateExplosion = (
  X: number,
  Y: number,
  Z: number,
  type: number,
  Radius: number
): number => {
  return callNative("CreateExplosion", "fffif", X, Y, Z, type, Radius);
};

export const EnableZoneNames = (enable: boolean): number => {
  return callNative("EnableZoneNames", "i", enable);
};

export const UsePlayerPedAnims = (): number => {
  return callNative("UsePlayerPedAnims", "");
};

export const DisableInteriorEnterExits = (): number => {
  return callNative("DisableInteriorEnterExits", "");
};

export const SetNameTagDrawDistance = (distance: number): number => {
  return callNative("SetNameTagDrawDistance", "f", distance);
};

export const DisableNameTagLOS = (): number => {
  return callNative("DisableNameTagLOS", "");
};

export const LimitGlobalChatRadius = (chat_radius: number): number => {
  return callNative("LimitGlobalChatRadius", "f", chat_radius);
};

export const LimitPlayerMarkerRadius = (marker_radius: number): number => {
  return callNative("LimitPlayerMarkerRadius", "f", marker_radius);
};

export const ConnectNPC = (name: string, script: string): number => {
  return callNative("ConnectNPC", "ss", name, script);
};

export const IsPlayerNPC = (playerId: number): boolean => {
  return Boolean(callNative("IsPlayerNPC", "i", playerId));
};

export const IsPlayerAdmin = (playerId: number): boolean => {
  return Boolean(callNative("IsPlayerAdmin", "i", playerId));
};

export const Kick = (playerId: number): number => {
  return callNative("Kick", "i", playerId);
};

export const Ban = (playerId: number): number => {
  return callNative("Ban", "i", playerId);
};

export const SendRconCommand = (command: string): number => {
  return callNative("SendRconCommand", "s", command);
};

export const GetPlayerNetworkStats = (playerId: number): string => {
  return callNative("GetPlayerNetworkStats", "iSi", playerId, 1024);
};

export const GetNetworkStats = (): string => {
  return callNative("GetNetworkStats", "Si", 1024);
};

export const BlockIpAddress = (ip_address: string, timems: number): number => {
  return callNative("BlockIpAddress", "si", ip_address, timems);
};

export const UnBlockIpAddress = (ip_address: string): number => {
  return callNative("UnBlockIpAddress", "s", ip_address);
};

export const GetServerTickRate = (): number => {
  return callNative("GetServerTickRate", "");
};

export const NetStats_GetConnectedTime = (playerId: number): number => {
  return callNative("NetStats_GetConnectedTime", "i", playerId);
};

export const NetStats_MessagesReceived = (playerId: number): number => {
  return callNative("NetStats_MessagesReceived", "i", playerId);
};

export const NetStats_BytesReceived = (playerId: number): number => {
  return callNative("NetStats_BytesReceived", "i", playerId);
};

export const NetStats_MessagesSent = (playerId: number): number => {
  return callNative("NetStats_MessagesSent", "i", playerId);
};

export const NetStats_BytesSent = (playerId: number): number => {
  return callNative("NetStats_BytesSent", "i", playerId);
};

export const NetStats_MessagesRecvPerSecond = (playerId: number): number => {
  return callNative("NetStats_MessagesRecvPerSecond", "i", playerId);
};

export const NetStats_PacketLossPercent = (playerId: number): number => {
  return callNativeFloat("NetStats_PacketLossPercent", "i", playerId);
};

export const NetStats_ConnectionStatus = (
  playerId: number
): ConnectionStatusEnum => {
  return callNative("NetStats_ConnectionStatus", "i", playerId);
};

export const CreateMenu = (
  title: string,
  columns: number,
  x: number,
  y: number,
  col1width: number,
  col2width: number
): number => {
  return callNative(
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
  return callNative("DestroyMenu", "i", menuId);
};

export const AddMenuItem = (
  menuId: number,
  column: number,
  menutext: string
): number => {
  return callNative("AddMenuItem", "iis", menuId, column, menutext);
};

export const SetMenuColumnHeader = (
  menuId: number,
  column: number,
  columnheader: string
): number => {
  return callNative("SetMenuColumnHeader", "iis", menuId, column, columnheader);
};

export const ShowMenuForPlayer = (menuId: number, playerId: number): number => {
  return callNative("ShowMenuForPlayer", "ii", menuId, playerId);
};

export const HideMenuForPlayer = (menuId: number, playerId: number): number => {
  return callNative("HideMenuForPlayer", "ii", menuId, playerId);
};

export const IsValidMenu = (menuId: number): boolean => {
  return Boolean(callNative("IsValidMenu", "i", menuId));
};

export const DisableMenu = (menuId: number): number => {
  return callNative("DisableMenu", "i", menuId);
};

export const DisableMenuRow = (menuId: number, row: number): number => {
  return callNative("DisableMenuRow", "ii", menuId, row);
};

export const GetPlayerMenu = (playerId: number): number => {
  return callNative("GetPlayerMenu", "i", playerId);
};

export const TextDrawCreate = (x: number, y: number, text: string): number => {
  return callNative("TextDrawCreate", "ffs", x, y, text);
};

export const TextDrawDestroy = (text: number): number => {
  return callNative("TextDrawDestroy", "i", text);
};

export const TextDrawLetterSize = (
  text: number,
  x: number,
  y: number
): number => {
  return callNative("TextDrawLetterSize", "iff", text, x, y);
};

export const TextDrawTextSize = (
  text: number,
  x: number,
  y: number
): number => {
  return callNative("TextDrawTextSize", "iff", text, x, y);
};

export const TextDrawAlignment = (
  text: number,
  alignment: TextDrawAlignEnum
): number => {
  return callNative("TextDrawAlignment", "ii", text, alignment);
};

export const TextDrawColor = (
  text: number,
  color: string | number
): boolean => {
  return Boolean(callNative("TextDrawColor", "ii", text, rgba(color)));
};

export const TextDrawUseBox = (text: number, use: boolean): number => {
  return callNative("TextDrawUseBox", "ii", text, use);
};

export const TextDrawBoxColor = (
  text: number,
  color: string | number
): boolean => {
  return Boolean(callNative("TextDrawBoxColor", "ii", text, rgba(color)));
};

export const TextDrawSetShadow = (text: number, size: number): number => {
  return callNative("TextDrawSetShadow", "ii", text, size);
};

export const TextDrawSetOutline = (text: number, size: number): number => {
  return callNative("TextDrawSetOutline", "ii", text, size);
};

export const TextDrawBackgroundColor = (
  text: number,
  color: string | number
): boolean => {
  return Boolean(
    callNative("TextDrawBackgroundColor", "ii", text, rgba(color))
  );
};

export const TextDrawFont = (text: number, font: number): number => {
  return callNative("TextDrawFont", "ii", text, font);
};

export const TextDrawSetProportional = (text: number, set: boolean): number => {
  return callNative("TextDrawSetProportional", "ii", text, set);
};

export const TextDrawSetSelectable = (text: number, set: boolean): number => {
  return callNative("TextDrawSetSelectable", "ii", text, set);
};

export const TextDrawShowForPlayer = (
  playerId: number,
  text: number
): number => {
  return callNative("TextDrawShowForPlayer", "ii", playerId, text);
};

export const TextDrawHideForPlayer = (
  playerId: number,
  text: number
): number => {
  return callNative("TextDrawHideForPlayer", "ii", playerId, text);
};

export const TextDrawShowForAll = (text: number): number => {
  return callNative("TextDrawShowForAll", "i", text);
};

export const TextDrawHideForAll = (text: number): number => {
  return callNative("TextDrawHideForAll", "i", text);
};

export const TextDrawSetString = (text: number, string: string): number => {
  return callNative("TextDrawSetString", "is", text, string);
};

export const TextDrawSetPreviewModel = (
  text: number,
  modelindex: number
): number => {
  return callNative("TextDrawSetPreviewModel", "ii", text, modelindex);
};

export const TextDrawSetPreviewRot = (
  text: number,
  fRotX: number,
  fRotY: number,
  fRotZ: number,
  fZoom = 1
): void => {
  callNative(
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
    callNative(
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
  return callNative("GangZoneCreate", "ffff", minX, minY, maxX, maxY);
};

export const GangZoneDestroy = (zone: number): number => {
  return callNative("GangZoneDestroy", "i", zone);
};

export const GangZoneShowForPlayer = (
  playerId: number,
  zone: number,
  color: string | number
): number => {
  return callNative(
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
  return callNative("GangZoneShowForAll", "ii", zone, rgba(color));
};

export const GangZoneHideForPlayer = (
  playerId: number,
  zone: number
): number => {
  return callNative("GangZoneHideForPlayer", "ii", playerId, zone);
};

export const GangZoneHideForAll = (zone: number): number => {
  return callNative("GangZoneHideForAll", "i", zone);
};

export const GangZoneFlashForPlayer = (
  playerId: number,
  zone: number,
  flashColor: string | number
): number => {
  return callNative(
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
  return callNative("GangZoneFlashForAll", "ii", zone, rgba(flashColor));
};

export const GangZoneStopFlashForPlayer = (
  playerId: number,
  zone: number
): number => {
  return callNative("GangZoneStopFlashForPlayer", "ii", playerId, zone);
};

export const GangZoneStopFlashForAll = (zone: number): number => {
  return callNative("GangZoneStopFlashForAll", "i", zone);
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
  return callNative(
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
  return callNative("Delete3DTextLabel", "i", id);
};

export const Attach3DTextLabelToPlayer = (
  id: number,
  playerId: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number
): number => {
  return callNative(
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
  return callNative(
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
  return callNative("Update3DTextLabelText", "iis", id, rgba(color), text);
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
  return callNative(
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
  return callNative("DeletePlayer3DTextLabel", "ii", playerId, id);
};

export const UpdatePlayer3DTextLabelText = (
  playerId: number,
  id: number,
  color: string | number,
  text: string
): number => {
  return callNative(
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
    I18n.getValidStr(callNative("gpci", "iAi", playerId, 41)),
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
  return callNative("CreateActor", "iffff", modelId, X, Y, Z, Rotation);
};

export const DestroyActor = (actorId: number): number => {
  return callNative("DestroyActor", "i", actorId);
};

export const IsActorStreamedIn = (
  actorId: number,
  forPlayerId: number
): boolean => {
  return Boolean(callNative("IsActorStreamedIn", "ii", actorId, forPlayerId));
};

export const SetActorVirtualWorld = (
  actorId: number,
  vWorld: number
): number => {
  return callNative("SetActorVirtualWorld", "ii", actorId, vWorld);
};

export const GetActorVirtualWorld = (actorId: number): number => {
  return callNative("GetActorVirtualWorld", "i", actorId);
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
  return callNative(
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
  return callNative("ClearActorAnimations", "i", actorId);
};

export const SetActorPos = (
  actorId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNative("SetActorPos", "ifff", actorId, X, Y, Z);
};

export const GetActorPos = (actorId: number): Array<number> => {
  return callNative("GetActorPos", "iFFF", actorId);
};

export const SetActorFacingAngle = (actorId: number, ang: number): number => {
  return callNative("SetActorFacingAngle", "if", actorId, ang);
};

export const GetActorFacingAngle = (actorId: number): number => {
  return callNative("GetActorFacingAngle", "iF", actorId);
};

export const SetActorHealth = (actorId: number, health: number): number => {
  return callNative("SetActorHealth", "if", actorId, health);
};

export const GetActorHealth = (actorId: number): number => {
  return callNative("GetActorHealth", "iF", actorId);
};

export const SetActorInvulnerable = (
  actorId: number,
  invulnerable: boolean
): number => {
  return callNative("SetActorInvulnerable", "ii", actorId, invulnerable);
};

export const IsActorInvulnerable = (actorId: number): boolean => {
  return Boolean(callNative("IsActorInvulnerable", "i", actorId));
};

export const IsValidActor = (actorId: number): boolean => {
  return Boolean(callNative("IsValidActor", "i", actorId));
};

export const HTTP = (
  index: number,
  type: number,
  url: string,
  data: string,
  callback: string
): number => {
  return callNative("HTTP", "iisss", index, type, url, data, callback);
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
  return callNative(
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
  return callNative(
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
  return callNative(
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
  return callNative(
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
  return callNative("SetObjectPos", "ifff", objectId, X, Y, Z);
};

export const GetObjectPos = (objectId: number): Array<number> => {
  return callNative("GetObjectPos", "iFFF", objectId);
};

export const SetObjectRot = (
  objectId: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return callNative("SetObjectRot", "ifff", objectId, RotX, RotY, RotZ);
};

export const GetObjectRot = (objectId: number): Array<number> => {
  return callNative("GetObjectRot", "iFFF", objectId);
};

export const GetObjectModel = (objectId: number): number => {
  return callNative("GetObjectModel", "i", objectId);
};

export const SetObjectNoCameraCollision = (objectId: number): boolean => {
  return Boolean(callNative("SetObjectNoCameraCollision", "i", objectId));
};

export const IsValidObject = (objectId: number): boolean => {
  return Boolean(callNative("IsValidObject", "i", objectId));
};

export const DestroyObject = (objectId: number): number => {
  return callNative("DestroyObject", "i", objectId);
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
  return callNative(
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
  return callNative("StopObject", "i", objectId);
};

export const IsObjectMoving = (objectId: number): boolean => {
  return Boolean(callNative("IsObjectMoving", "i", objectId));
};

export const BeginObjectEditing = (
  playerId: number,
  objectId: number
): boolean => {
  return Boolean(callNative("BeginObjectEditing", "ii", playerId, objectId));
};

export const BeginPlayerObjectEditing = (
  playerId: number,
  objectId: number
): boolean => {
  return Boolean(
    callNative("BeginPlayerObjectEditing", "ii", playerId, objectId)
  );
};

export const BeginObjectSelecting = (playerId: number): boolean => {
  return Boolean(callNative("BeginObjectSelecting", "i", playerId));
};

export const EndObjectEditing = (playerId: number): boolean => {
  return Boolean(callNative("EndObjectEditing", "i", playerId));
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
  return callNative(
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
  return callNative(
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
  return callNative("SetPlayerObjectPos", "iifff", playerId, objectId, X, Y, Z);
};

export const GetPlayerObjectPos = (
  playerId: number,
  objectId: number
): Array<number> => {
  return callNative("GetPlayerObjectPos", "iiFFF", playerId, objectId);
};

export const SetPlayerObjectRot = (
  playerId: number,
  objectId: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return callNative(
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
  return callNative("GetPlayerObjectRot", "iiFFF", playerId, objectId);
};

export const GetPlayerObjectModel = (
  playerId: number,
  objectId: number
): number => {
  return callNative("GetPlayerObjectModel", "ii", playerId, objectId);
};

export const SetPlayerObjectNoCameraCollision = (
  playerId: number,
  objectId: number
): boolean => {
  return Boolean(
    callNative("SetPlayerObjectNoCameraCollision", "ii", playerId, objectId)
  );
};

export const IsValidPlayerObject = (
  playerId: number,
  objectId: number
): boolean => {
  return Boolean(callNative("IsValidPlayerObject", "ii", playerId, objectId));
};

export const DestroyPlayerObject = (
  playerId: number,
  objectId: number
): number => {
  return callNative("DestroyPlayerObject", "ii", playerId, objectId);
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
  return callNative(
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
  return callNative("StopPlayerObject", "ii", playerId, objectId);
};

export const IsPlayerObjectMoving = (
  playerId: number,
  objectId: number
): boolean => {
  return Boolean(callNative("IsPlayerObjectMoving", "ii", playerId, objectId));
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
  return callNative(
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
  return callNative(
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
  return callNative(
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
  return callNative(
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
  return callNative(
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
  return Boolean(callNative("SetObjectsDefaultCameraCol", "i", disable));
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
  return callNative(
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
  return callNative("SpawnPlayer", "i", playerId);
};

export const SetPlayerPos = (
  playerId: number,
  x: number,
  y: number,
  z: number
): number => {
  return callNative("SetPlayerPos", "ifff", playerId, x, y, z);
};

export const SetPlayerPosFindZ = (
  playerId: number,
  x: number,
  y: number,
  z: number
): number => {
  return callNative("SetPlayerPosFindZ", "ifff", playerId, x, y, z);
};

export const GetPlayerPos = (playerId: number): Array<number> => {
  return callNative("GetPlayerPos", "iFFF", playerId);
};

export const SetPlayerFacingAngle = (playerId: number, ang: number): number => {
  return callNative("SetPlayerFacingAngle", "if", playerId, ang);
};

export const GetPlayerFacingAngle = (playerId: number): number => {
  return callNative("GetPlayerFacingAngle", "iF", playerId);
};

export const IsPlayerInRangeOfPoint = (
  playerId: number,
  range: number,
  x: number,
  y: number,
  z: number
): boolean => {
  return Boolean(
    callNative("IsPlayerInRangeOfPoint", "iffff", playerId, range, x, y, z)
  );
};

export const GetPlayerDistanceFromPoint = (
  playerId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNativeFloat(
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
  return Boolean(callNative("IsPlayerStreamedIn", "ii", playerId, forPlayerId));
};

export const SetPlayerInterior = (
  playerId: number,
  interiorId: number
): number => {
  return callNative("SetPlayerInterior", "ii", playerId, interiorId);
};

export const GetPlayerInterior = (playerId: number): number => {
  return callNative("GetPlayerInterior", "i", playerId);
};

export const SetPlayerHealth = (playerId: number, health: number): number => {
  return callNative("SetPlayerHealth", "if", playerId, health);
};

export const GetPlayerHealth = (playerId: number): number => {
  return callNative("GetPlayerHealth", "iF", playerId);
};

export const SetPlayerArmour = (playerId: number, armour: number): number => {
  return callNative("SetPlayerArmour", "if", playerId, armour);
};

export const GetPlayerArmour = (playerId: number): number => {
  return callNative("GetPlayerArmour", "iF", playerId);
};

export const SetPlayerAmmo = (
  playerId: number,
  weaponId: number,
  ammo: number
): number => {
  return callNative("SetPlayerAmmo", "iii", playerId, weaponId, ammo);
};

export const GetPlayerAmmo = (playerId: number): number => {
  return callNative("GetPlayerAmmo", "i", playerId);
};

export const GetPlayerWeaponState = (playerId: number): WeaponStatesEnum => {
  return callNative("GetPlayerWeaponState", "i", playerId);
};

export const GetPlayerTargetPlayer = (playerId: number): number => {
  return callNative("GetPlayerTargetPlayer", "i", playerId);
};

export const GetPlayerTargetActor = (playerId: number): number => {
  return callNative("GetPlayerTargetActor", "i", playerId);
};

export const SetPlayerTeam = (playerId: number, teamId: number): void => {
  callNative("SetPlayerTeam", "ii", playerId, teamId);
};

export const GetPlayerTeam = (playerId: number): number => {
  return callNative("GetPlayerTeam", "i", playerId);
};

export const SetPlayerScore = (playerId: number, score: number): number => {
  return callNative("SetPlayerScore", "ii", playerId, score);
};

export const GetPlayerScore = (playerId: number): number => {
  return callNative("GetPlayerScore", "i", playerId);
};

export const GetPlayerDrunkLevel = (playerId: number): number => {
  return callNative("GetPlayerDrunkLevel", "i", playerId);
};

export const SetPlayerDrunkLevel = (
  playerId: number,
  level: number
): number => {
  return callNative("SetPlayerDrunkLevel", "ii", playerId, level);
};

export const SetPlayerColor = (
  playerId: number,
  color: string | number
): number => {
  return callNative("SetPlayerColor", "ii", playerId, rgba(color));
};

export const GetPlayerColor = (playerId: number): number => {
  return callNative("GetPlayerColor", "i", playerId);
};

export const SetPlayerSkin = (playerId: number, skinId: number): number => {
  return callNative("SetPlayerSkin", "ii", playerId, skinId);
};

export const GetPlayerSkin = (playerId: number): number => {
  return callNative("GetPlayerSkin", "i", playerId);
};

export const GivePlayerWeapon = (
  playerId: number,
  weaponId: number,
  ammo: number
): number => {
  return callNative("GivePlayerWeapon", "iii", playerId, weaponId, ammo);
};

export const ResetPlayerWeapons = (playerId: number): number => {
  return callNative("ResetPlayerWeapons", "i", playerId);
};

export const SetPlayerArmedWeapon = (
  playerId: number,
  weaponId: number
): number => {
  return callNative("SetPlayerArmedWeapon", "ii", playerId, weaponId);
};

export const GetPlayerWeaponData = (
  playerId: number,
  slot: number
): Array<number> => {
  return callNative("GetPlayerWeaponData", "iiII", playerId, slot);
};

export const GivePlayerMoney = (playerId: number, money: number): number => {
  return callNative("GivePlayerMoney", "ii", playerId, money);
};

export const ResetPlayerMoney = (playerId: number): number => {
  return callNative("ResetPlayerMoney", "i", playerId);
};

export const GetPlayerMoney = (playerId: number): number => {
  return callNative("GetPlayerMoney", "i", playerId);
};

export const GetPlayerState = (playerId: number): PlayerStateEnum => {
  return callNative("GetPlayerState", "i", playerId);
};

export const GetPlayerPing = (playerId: number): number => {
  return callNative("GetPlayerPing", "i", playerId);
};

export const GetPlayerWeapon = (playerId: number): number => {
  return callNative("GetPlayerWeapon", "i", playerId);
};

export const GetPlayerKeys = (playerId: number): Array<KeysEnum> => {
  return callNative("GetPlayerKeys", "iIII", playerId);
};

export const SetPlayerTime = (
  playerId: number,
  hour: number,
  minute: number
): number => {
  return callNative("SetPlayerTime", "iii", playerId, hour, minute);
};

export const GetPlayerTime = (playerId: number): Array<number> => {
  return callNative("GetPlayerTime", "iII", playerId);
};

export const TogglePlayerClock = (
  playerId: number,
  toggle: boolean
): number => {
  return callNative("TogglePlayerClock", "ii", playerId, toggle);
};

export const SetPlayerWeather = (playerId: number, weather: number): number => {
  return callNative("SetPlayerWeather", "ii", playerId, weather);
};

export const ForceClassSelection = (playerId: number): number => {
  return callNative("ForceClassSelection", "i", playerId);
};

export const SetPlayerWantedLevel = (
  playerId: number,
  level: number
): number => {
  return callNative("SetPlayerWantedLevel", "ii", playerId, level);
};

export const GetPlayerWantedLevel = (playerId: number): number => {
  return callNative("GetPlayerWantedLevel", "i", playerId);
};

export const SetPlayerFightingStyle = (
  playerId: number,
  style: FightingStylesEnum
): number => {
  return callNative("SetPlayerFightingStyle", "ii", playerId, style);
};

export const GetPlayerFightingStyle = (
  playerId: number
): FightingStylesEnum => {
  return callNative("GetPlayerFightingStyle", "i", playerId);
};

export const SetPlayerVelocity = (
  playerId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNative("SetPlayerVelocity", "ifff", playerId, X, Y, Z);
};

export const GetPlayerVelocity = (playerId: number): Array<number> => {
  return callNative("GetPlayerVelocity", "iFFF", playerId);
};

export const PlayCrimeReportForPlayer = (
  playerId: number,
  suspectid: number,
  crime: number
): number => {
  return callNative(
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
  return callNative(
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
  return callNative("StopAudioStreamForPlayer", "i", playerId);
};

export const SetPlayerShopName = (
  playerId: number,
  shopname: string
): number => {
  return callNative("SetPlayerShopName", "is", playerId, shopname);
};

export const SetPlayerSkillLevel = (
  playerId: number,
  skill: WeaponSkillsEnum,
  level: number
): number => {
  return callNative("SetPlayerSkillLevel", "iii", playerId, skill, level);
};

export const GetPlayerSurfingVehicleID = (playerId: number): number => {
  return callNative("GetPlayerSurfingVehicleID", "i", playerId);
};

export const GetPlayerSurfingObjectID = (playerId: number): number => {
  return callNative("GetPlayerSurfingObjectID", "i", playerId);
};

export const GetPlayerSurfingPlayerObjectID = (playerId: number): number => {
  return callNative("GetPlayerSurfingPlayerObjectID", "i", playerId);
};

export const RemoveBuildingForPlayer = (
  playerId: number,
  modelId: number,
  fX: number,
  fY: number,
  fZ: number,
  fRadius: number
): number => {
  return callNative(
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
  return callNative("GetPlayerLastShotVectors", "iFFFFFF", playerId);
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
  return callNative(
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
  return callNative("RemovePlayerAttachedObject", "ii", playerId, index);
};

export const IsPlayerAttachedObjectSlotUsed = (
  playerId: number,
  index: number
): boolean => {
  return Boolean(
    callNative("IsPlayerAttachedObjectSlotUsed", "ii", playerId, index)
  );
};

export const EditAttachedObject = (playerId: number, index: number): number => {
  return callNative("EditAttachedObject", "ii", playerId, index);
};

export const CreatePlayerTextDraw = (
  playerId: number,
  x: number,
  y: number,
  text: string
): number => {
  return callNative("CreatePlayerTextDraw", "iffs", playerId, x, y, text);
};

export const PlayerTextDrawDestroy = (playerId: number, text: number): void => {
  callNative("PlayerTextDrawDestroy", "ii", playerId, text);
};

export const PlayerTextDrawLetterSize = (
  playerId: number,
  text: number,
  x: number,
  y: number
): number => {
  return callNative("PlayerTextDrawLetterSize", "iiff", playerId, text, x, y);
};

export const PlayerTextDrawTextSize = (
  playerId: number,
  text: number,
  x: number,
  y: number
): number => {
  return callNative("PlayerTextDrawTextSize", "iiff", playerId, text, x, y);
};

export const PlayerTextDrawAlignment = (
  playerId: number,
  text: number,
  alignment: TextDrawAlignEnum
): number => {
  return callNative(
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
    callNative("PlayerTextDrawColor", "iii", playerId, text, rgba(color))
  );
};

export const PlayerTextDrawUseBox = (
  playerId: number,
  text: number,
  use: boolean
): number => {
  return callNative("PlayerTextDrawUseBox", "iii", playerId, text, use);
};

export const PlayerTextDrawBoxColor = (
  playerId: number,
  text: number,
  color: string | number
): boolean => {
  return Boolean(
    callNative("PlayerTextDrawBoxColor", "iii", playerId, text, rgba(color))
  );
};

export const PlayerTextDrawSetShadow = (
  playerId: number,
  text: number,
  size: number
): number => {
  return callNative("PlayerTextDrawSetShadow", "iii", playerId, text, size);
};

export const PlayerTextDrawSetOutline = (
  playerId: number,
  text: number,
  size: number
): number => {
  return callNative("PlayerTextDrawSetOutline", "iii", playerId, text, size);
};

export const PlayerTextDrawBackgroundColor = (
  playerId: number,
  text: number,
  color: string | number
): boolean => {
  return Boolean(
    callNative(
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
  return callNative("PlayerTextDrawFont", "iii", playerId, text, font);
};

export const PlayerTextDrawSetProportional = (
  playerId: number,
  text: number,
  set: boolean
): number => {
  return callNative(
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
  return callNative("PlayerTextDrawSetSelectable", "iii", playerId, text, set);
};

export const PlayerTextDrawShow = (playerId: number, text: number): number => {
  return callNative("PlayerTextDrawShow", "ii", playerId, text);
};

export const PlayerTextDrawHide = (playerId: number, text: number): number => {
  return callNative("PlayerTextDrawHide", "ii", playerId, text);
};

export const PlayerTextDrawSetString = (
  playerId: number,
  text: number,
  string: string
): number => {
  return callNative("PlayerTextDrawSetString", "iis", playerId, text, string);
};

export const PlayerTextDrawSetPreviewModel = (
  playerId: number,
  text: number,
  modelindex: number
): number => {
  return callNative(
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
  return callNative(
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
    callNative(
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
  return callNative(
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
  return callNative("PutPlayerInVehicle", "iii", playerId, vehicleId, seatId);
};

export const GetPlayerVehicleID = (playerId: number): number => {
  return callNative("GetPlayerVehicleID", "i", playerId);
};

export const GetPlayerVehicleSeat = (playerId: number): number => {
  return callNative("GetPlayerVehicleSeat", "i", playerId);
};

export const RemovePlayerFromVehicle = (playerId: number): number => {
  return callNative("RemovePlayerFromVehicle", "i", playerId);
};

export const TogglePlayerControllable = (
  playerId: number,
  toggle: boolean
): number => {
  return callNative("TogglePlayerControllable", "ii", playerId, toggle);
};

export const PlayerPlaySound = (
  playerId: number,
  soundid: number,
  x: number,
  y: number,
  z: number
): number => {
  return callNative("PlayerPlaySound", "iifff", playerId, soundid, x, y, z);
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
  return callNative(
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
  return callNative("ClearAnimations", "ii", playerId, forcesync);
};

export const GetPlayerAnimationIndex = (playerId: number): number => {
  return callNative("GetPlayerAnimationIndex", "i", playerId);
};

export const GetPlayerSpecialAction = (
  playerId: number
): SpecialActionsEnum => {
  return callNative("GetPlayerSpecialAction", "i", playerId);
};

export const SetPlayerSpecialAction = (
  playerId: number,
  actionid: SpecialActionsEnum
): number => {
  return callNative("SetPlayerSpecialAction", "ii", playerId, actionid);
};

export const DisableRemoteVehicleCollisions = (
  playerId: number,
  disable: boolean
): number => {
  return callNative("DisableRemoteVehicleCollisions", "ii", playerId, disable);
};

export const SetPlayerCheckpoint = (
  playerId: number,
  x: number,
  y: number,
  z: number,
  size: number
): number => {
  return callNative("SetPlayerCheckpoint", "iffff", playerId, x, y, z, size);
};

export const DisablePlayerCheckpoint = (playerId: number): number => {
  return callNative("DisablePlayerCheckpoint", "i", playerId);
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
  return callNative(
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
  return callNative("DisablePlayerRaceCheckpoint", "i", playerId);
};

export const SetPlayerWorldBounds = (
  playerId: number,
  x_max: number,
  x_min: number,
  y_max: number,
  y_min: number
): number => {
  return callNative(
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
  return Boolean(callNative("ClearPlayerWorldBounds", "i", playerId));
};

export const SetPlayerMarkerForPlayer = (
  playerId: number,
  showplayerid: number,
  color: string | number
): number => {
  return callNative(
    "SetPlayerMarkerForPlayer",
    "iii",
    playerId,
    showplayerid,
    rgba(color)
  );
};

export const ShowPlayerNameTagForPlayer = (
  playerId: number,
  showplayerid: number,
  show: boolean
): number => {
  return callNative(
    "ShowPlayerNameTagForPlayer",
    "iii",
    playerId,
    showplayerid,
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
  return callNative(
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
  return callNative("RemovePlayerMapIcon", "ii", playerId, iconId);
};

export const SetPlayerCameraPos = (
  playerId: number,
  x: number,
  y: number,
  z: number
): number => {
  return callNative("SetPlayerCameraPos", "ifff", playerId, x, y, z);
};

export const SetPlayerCameraLookAt = (
  playerId: number,
  x: number,
  y: number,
  z: number,
  cut: CameraCutStylesEnum
): number => {
  return callNative("SetPlayerCameraLookAt", "ifffi", playerId, x, y, z, cut);
};

export const SetCameraBehindPlayer = (playerId: number): number => {
  return callNative("SetCameraBehindPlayer", "i", playerId);
};

export const GetPlayerCameraPos = (playerId: number): Array<number> => {
  return callNative("GetPlayerCameraPos", "iFFF", playerId);
};

export const GetPlayerCameraFrontVector = (playerId: number): Array<number> => {
  return callNative("GetPlayerCameraFrontVector", "iFFF", playerId);
};

export const GetPlayerCameraMode = (playerId: number): CameraModesEnum => {
  return callNative("GetPlayerCameraMode", "i", playerId);
};

export const EnablePlayerCameraTarget = (
  playerId: number,
  enable: boolean
): number => {
  return callNative("EnablePlayerCameraTarget", "ii", playerId, enable);
};

export const GetPlayerCameraTargetObject = (playerId: number): number => {
  return callNative("GetPlayerCameraTargetObject", "i", playerId);
};

export const GetPlayerCameraTargetVehicle = (playerId: number): number => {
  return callNative("GetPlayerCameraTargetVehicle", "i", playerId);
};

export const GetPlayerCameraTargetPlayer = (playerId: number): number => {
  return callNative("GetPlayerCameraTargetPlayer", "i", playerId);
};

export const GetPlayerCameraTargetActor = (playerId: number): number => {
  return callNative("GetPlayerCameraTargetActor", "i", playerId);
};

export const GetPlayerCameraAspectRatio = (playerId: number): number => {
  return callNativeFloat("GetPlayerCameraAspectRatio", "i", playerId);
};

export const GetPlayerCameraZoom = (playerId: number): number => {
  return callNativeFloat("GetPlayerCameraZoom", "i", playerId);
};

export const AttachCameraToObject = (
  playerId: number,
  objectId: number
): number => {
  return callNative("AttachCameraToObject", "ii", playerId, objectId);
};

export const AttachCameraToPlayerObject = (
  playerId: number,
  playerobjectId: number
): number => {
  return callNative(
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
  return callNative(
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
  return callNative(
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
  return Boolean(callNative("IsPlayerConnected", "i", playerId));
};

export const IsPlayerInVehicle = (
  playerId: number,
  vehicleId: number
): boolean => {
  return Boolean(callNative("IsPlayerInVehicle", "ii", playerId, vehicleId));
};

export const IsPlayerInAnyVehicle = (playerId: number): boolean => {
  return Boolean(callNative("IsPlayerInAnyVehicle", "i", playerId));
};

export const IsPlayerInCheckpoint = (playerId: number): boolean => {
  return Boolean(callNative("IsPlayerInCheckpoint", "i", playerId));
};

export const IsPlayerInRaceCheckpoint = (playerId: number): boolean => {
  return Boolean(callNative("IsPlayerInRaceCheckpoint", "i", playerId));
};

export const SetPlayerVirtualWorld = (
  playerId: number,
  worldId: number
): number => {
  return callNative("SetPlayerVirtualWorld", "ii", playerId, worldId);
};

export const GetPlayerVirtualWorld = (playerId: number): number => {
  return callNative("GetPlayerVirtualWorld", "i", playerId);
};

export const EnableStuntBonusForPlayer = (
  playerId: number,
  enable: boolean
): number => {
  return callNative("EnableStuntBonusForPlayer", "ii", playerId, enable);
};

export const EnableStuntBonusForAll = (enable: boolean): number => {
  return callNative("EnableStuntBonusForAll", "i", enable);
};

export const TogglePlayerSpectating = (
  playerId: number,
  toggle: boolean
): number => {
  return callNative("TogglePlayerSpectating", "ii", playerId, toggle);
};

export const PlayerSpectatePlayer = (
  playerId: number,
  targetplayerid: number,
  mode: SpectateModesEnum
): number => {
  return callNative(
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
  return callNative(
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
  return callNative(
    "StartRecordingPlayerData",
    "iis",
    playerId,
    recordtype,
    recordname
  );
};

export const StopRecordingPlayerData = (playerId: number): number => {
  return callNative("StopRecordingPlayerData", "i", playerId);
};

export const SelectTextDraw = (
  playerId: number,
  hovercolor: string | number
): void => {
  callNative("SelectTextDraw", "ii", playerId, rgba(hovercolor));
};

export const CancelSelectTextDraw = (playerId: number): void => {
  callNative("CancelSelectTextDraw", "i", playerId);
};

export const CreateExplosionForPlayer = (
  playerId: number,
  X: number,
  Y: number,
  Z: number,
  type: number,
  Radius: number
): number => {
  return callNative(
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
  return callNative(
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
  return callNative(
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
  return callNative("DestroyVehicle", "i", vehicleId);
};

export const IsVehicleStreamedIn = (
  vehicleId: number,
  forPlayerId: number
): boolean => {
  return Boolean(
    callNative("IsVehicleStreamedIn", "ii", vehicleId, forPlayerId)
  );
};

export const GetVehiclePos = (vehicleId: number) => {
  const values: number[] = callNative("GetVehiclePos", "iFFF", vehicleId);
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
  return callNative("SetVehiclePos", "ifff", vehicleId, x, y, z);
};

export const GetVehicleZAngle = (vehicleId: number): number => {
  return callNative("GetVehicleZAngle", "iF", vehicleId);
};

export const GetVehicleRotationQuat = (vehicleId: number): Array<number> => {
  return callNative("GetVehicleRotationQuat", "iFFFF", vehicleId);
};

export const GetVehicleDistanceFromPoint = (
  vehicleId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNativeFloat(
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
  return callNative("SetVehicleZAngle", "if", vehicleId, z_angle);
};

export const SetVehicleParamsForPlayer = (
  vehicleId: number,
  playerId: number,
  objective: boolean,
  doorslocked: boolean
): number => {
  return callNative(
    "SetVehicleParamsForPlayer",
    "iiii",
    vehicleId,
    playerId,
    objective,
    doorslocked
  );
};

export const ManualVehicleEngineAndLights = (): number => {
  return callNative("ManualVehicleEngineAndLights", "");
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
  return callNative(
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
  return callNative("GetVehicleParamsEx", "iIIIIIII", vehicleId);
};

export const GetVehicleParamsSirenState = (vehicleId: number): number => {
  return callNative("GetVehicleParamsSirenState", "i", vehicleId);
};

export const SetVehicleParamsCarDoors = (
  vehicleId: number,
  driver: boolean,
  passenger: boolean,
  backleft: boolean,
  backright: boolean
): number => {
  return callNative(
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
  const values = callNative("GetVehicleParamsCarDoors", "iIIII", vehicleId);
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
  return callNative(
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
  const values = callNative("GetVehicleParamsCarWindows", "iIIII", vehicleId);
  return {
    driver: values[0],
    passenger: values[1],
    backleft: values[2],
    backright: values[3],
  };
};

export const SetVehicleToRespawn = (vehicleId: number): number => {
  return callNative("SetVehicleToRespawn", "i", vehicleId);
};

export const LinkVehicleToInterior = (
  vehicleId: number,
  interiorId: number
): number => {
  return callNative("LinkVehicleToInterior", "ii", vehicleId, interiorId);
};

export const AddVehicleComponent = (
  vehicleId: number,
  componentId: number
): number => {
  return callNative("AddVehicleComponent", "ii", vehicleId, componentId);
};

export const RemoveVehicleComponent = (
  vehicleId: number,
  componentId: number
): number => {
  return callNative("RemoveVehicleComponent", "ii", vehicleId, componentId);
};

export const ChangeVehicleColors = (
  vehicleId: number,
  color1: string | number,
  color2: string | number
): number => {
  return callNative(
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
  return callNative("ChangeVehiclePaintjob", "ii", vehicleId, paintjobId);
};

export const SetVehicleHealth = (vehicleId: number, health: number): number => {
  return callNative("SetVehicleHealth", "if", vehicleId, health);
};

export const GetVehicleHealth = (vehicleId: number): number => {
  return callNative("GetVehicleHealth", "iF", vehicleId);
};

export const AttachTrailerToVehicle = (
  trailerid: number,
  vehicleId: number
): number => {
  return callNative("AttachTrailerToVehicle", "ii", trailerid, vehicleId);
};

export const DetachTrailerFromVehicle = (vehicleId: number): number => {
  return callNative("DetachTrailerFromVehicle", "i", vehicleId);
};

export const IsTrailerAttachedToVehicle = (vehicleId: number): boolean => {
  return Boolean(callNative("IsTrailerAttachedToVehicle", "i", vehicleId));
};

export const GetVehicleTrailer = (vehicleId: number): number => {
  return callNative("GetVehicleTrailer", "i", vehicleId);
};

export const SetVehicleNumberPlate = (
  vehicleId: number,
  numberplate: string
): number => {
  return callNative("SetVehicleNumberPlate", "is", vehicleId, numberplate);
};

export const GetVehicleModel = (vehicleId: number): number => {
  return callNative("GetVehicleModel", "i", vehicleId);
};

export const GetVehicleComponentInSlot = (
  vehicleId: number,
  slot: CarModTypeEnum
): number => {
  return callNative("GetVehicleComponentInSlot", "ii", vehicleId, slot);
};

export const GetVehicleComponentType = (component: number): CarModTypeEnum => {
  return callNative("GetVehicleComponentType", "i", component);
};

export const RepairVehicle = (vehicleId: number): number => {
  return callNative("RepairVehicle", "i", vehicleId);
};

export const GetVehicleVelocity = (vehicleId: number): Array<number> => {
  return callNative("GetVehicleVelocity", "iFFF", vehicleId);
};

export const SetVehicleVelocity = (
  vehicleId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNative("SetVehicleVelocity", "ifff", vehicleId, X, Y, Z);
};

export const SetVehicleAngularVelocity = (
  vehicleId: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNative("SetVehicleAngularVelocity", "ifff", vehicleId, X, Y, Z);
};

export const GetVehicleDamageStatus = (vehicleId: number) => {
  const values: number[] = callNative(
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
  return callNative(
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
  const values: number[] = callNative(
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
  return callNative("SetVehicleVirtualWorld", "ii", vehicleId, worldId);
};

export const GetVehicleVirtualWorld = (vehicleId: number): number => {
  return callNative("GetVehicleVirtualWorld", "i", vehicleId);
};

export const IsValidVehicle = (vehicleId: number): boolean => {
  return Boolean(callNative("IsValidVehicle", "i", vehicleId));
};

export const StartRecordingPlayback = (
  playbacktype: RecordTypesEnum,
  recordname: string
): void => {
  return callNative("StartRecordingPlayback", "is", playbacktype, recordname);
};

export const StopRecordingPlayback = (): void => {
  return callNative("StopRecordingPlayback", "");
};

export const PauseRecordingPlayback = (): void => {
  return callNative("PauseRecordingPlayback", "");
};

export const ResumeRecordingPlayback = (): void => {
  return callNative("ResumeRecordingPlayback", "");
};

export const GetPlayerCustomSkin = (playerId: number): number => {
  return callNative("GetPlayerCustomSkin", "i", playerId);
};

export const RedirectDownload = (playerId: number, url: string): number => {
  return callNative("RedirectDownload", "is", playerId, url);
};

export const AddSimpleModel = (
  virtualWorld: number,
  baseid: number,
  newid: number,
  dffname: string,
  txdName: string
): number => {
  return callNative(
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
  return callNative(
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
  return callNative("GetWeaponName", "iSi", weaponId, 32);
};

export const NetStats_GetIpPort = (playerId: number): string => {
  return callNative("NetStats_GetIpPort", "iSi", playerId, 128 + 6);
};

export const GetPlayerIp = (playerId: number): string => {
  return callNative("GetPlayerIp", "iSi", playerId, 128);
};

export const GetAnimationName = (index: number): Array<string> => {
  return callNative("GetAnimationName", "iSiSi", index, 32, 32);
};

export const GetPlayerVersion = (playerId: number): string => {
  return callNative("GetPlayerVersion", "iSi", playerId, 24);
};

export const FindModelFileNameFromCRC = (crc: number): string => {
  return callNative("FindModelFileNameFromCRC", "iSi", crc, 255);
};

export const FindTextureFileNameFromCRC = (crc: number): string => {
  return callNative("FindTextureFileNameFromCRC", "iSi", crc, 255);
};
