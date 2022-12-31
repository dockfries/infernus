// Reference to Peter Szombati's samp-node-lib

// removed db_, timer functions, for better maintainability you should use the node library

import { rgba } from "@/utils/colorUtils";
import {
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
} from "@/enums";
import { callNative, callNativeFloat } from "@/utils/helperUtils";

export const SendDeathMessage = (
  killer: number,
  killee: number,
  weapon: WeaponEnum | DamageDeathReasonEnum
): number => {
  return callNative("SendDeathMessage", "iii", killer, killee, weapon);
};

export const SendDeathMessageToPlayer = (
  playerid: number,
  killer: number,
  killee: number,
  weapon: WeaponEnum | DamageDeathReasonEnum
): number => {
  return callNative(
    "SendDeathMessageToPlayer",
    "iiii",
    playerid,
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

export const GameTextForPlayer = (
  playerid: number,
  string: string,
  time: number,
  style: number
): number => {
  return callNative("GameTextForPlayer", "isii", playerid, string, time, style);
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

export const GetPlayerPoolSize = (): number => {
  return callNative("GetPlayerPoolSize", "");
};

export const GetVehiclePoolSize = (): number => {
  return callNative("GetVehiclePoolSize", "");
};

export const GetActorPoolSize = (): number => {
  return callNative("GetActorPoolSize", "");
};

export const SetGameModeText = (string: string): number => {
  return callNative("SetGameModeText", "s", string);
};

export const SetTeamCount = (count: number): number => {
  return callNative("SetTeamCount", "i", count);
};

export const AddPlayerClass = (
  modelid: number,
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
    modelid,
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
  teamid: number,
  modelid: number,
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
    teamid,
    modelid,
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
  modelid: number,
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
    modelid,
    spawn_x,
    spawn_y,
    spawn_z,
    z_angle,
    color1,
    color2
  );
};

export const AddStaticVehicleEx = (
  modelid: number,
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
    modelid,
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
  virtualworld: number
): number => {
  return callNative(
    "AddStaticPickup",
    "iifffi",
    model,
    type,
    X,
    Y,
    Z,
    virtualworld
  );
};

export const CreatePickup = (
  model: number,
  type: number,
  X: number,
  Y: number,
  Z: number,
  virtualworld: number
): number => {
  return callNative(
    "CreatePickup",
    "iifffi",
    model,
    type,
    X,
    Y,
    Z,
    virtualworld
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

export const SetDeathDropAmount = (amount: number): number => {
  return callNative("SetDeathDropAmount", "i", amount);
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

export const IsPlayerNPC = (playerid: number): boolean => {
  return Boolean(callNative("IsPlayerNPC", "i", playerid));
};

export const IsPlayerAdmin = (playerid: number): boolean => {
  return Boolean(callNative("IsPlayerAdmin", "i", playerid));
};

export const Kick = (playerid: number): number => {
  return callNative("Kick", "i", playerid);
};

export const Ban = (playerid: number): number => {
  return callNative("Ban", "i", playerid);
};

export const SendRconCommand = (command: string): number => {
  return callNative("SendRconCommand", "s", command);
};

export const GetPlayerNetworkStats = (playerid: number): string => {
  return callNative("GetPlayerNetworkStats", "iSi", playerid, 1024);
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

export const NetStats_GetConnectedTime = (playerid: number): number => {
  return callNative("NetStats_GetConnectedTime", "i", playerid);
};

export const NetStats_MessagesReceived = (playerid: number): number => {
  return callNative("NetStats_MessagesReceived", "i", playerid);
};

export const NetStats_BytesReceived = (playerid: number): number => {
  return callNative("NetStats_BytesReceived", "i", playerid);
};

export const NetStats_MessagesSent = (playerid: number): number => {
  return callNative("NetStats_MessagesSent", "i", playerid);
};

export const NetStats_BytesSent = (playerid: number): number => {
  return callNative("NetStats_BytesSent", "i", playerid);
};

export const NetStats_MessagesRecvPerSecond = (playerid: number): number => {
  return callNative("NetStats_MessagesRecvPerSecond", "i", playerid);
};

export const NetStats_PacketLossPercent = (playerid: number): number => {
  return callNativeFloat("NetStats_PacketLossPercent", "i", playerid);
};

export const NetStats_ConnectionStatus = (
  playerid: number
): ConnectionStatusEnum => {
  return callNative("NetStats_ConnectionStatus", "i", playerid);
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

export const DestroyMenu = (menuid: number): number => {
  return callNative("DestroyMenu", "i", menuid);
};

export const AddMenuItem = (
  menuid: number,
  column: number,
  menutext: string
): number => {
  return callNative("AddMenuItem", "iis", menuid, column, menutext);
};

export const SetMenuColumnHeader = (
  menuid: number,
  column: number,
  columnheader: string
): number => {
  return callNative("SetMenuColumnHeader", "iis", menuid, column, columnheader);
};

export const ShowMenuForPlayer = (menuid: number, playerid: number): number => {
  return callNative("ShowMenuForPlayer", "ii", menuid, playerid);
};

export const HideMenuForPlayer = (menuid: number, playerid: number): number => {
  return callNative("HideMenuForPlayer", "ii", menuid, playerid);
};

export const IsValidMenu = (menuid: number): boolean => {
  return Boolean(callNative("IsValidMenu", "i", menuid));
};

export const DisableMenu = (menuid: number): number => {
  return callNative("DisableMenu", "i", menuid);
};

export const DisableMenuRow = (menuid: number, row: number): number => {
  return callNative("DisableMenuRow", "ii", menuid, row);
};

export const GetPlayerMenu = (playerid: number): number => {
  return callNative("GetPlayerMenu", "i", playerid);
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

export const TextDrawColor = (text: number, color: string | number): number => {
  return callNative("TextDrawColor", "ii", text, rgba(color));
};

export const TextDrawUseBox = (text: number, use: boolean): number => {
  return callNative("TextDrawUseBox", "ii", text, use);
};

export const TextDrawBoxColor = (
  text: number,
  color: string | number
): number => {
  return callNative("TextDrawBoxColor", "ii", text, rgba(color));
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
): number => {
  return callNative("TextDrawBackgroundColor", "ii", text, rgba(color));
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
  playerid: number,
  text: number
): number => {
  return callNative("TextDrawShowForPlayer", "ii", playerid, text);
};

export const TextDrawHideForPlayer = (
  playerid: number,
  text: number
): number => {
  return callNative("TextDrawHideForPlayer", "ii", playerid, text);
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

export const TextDrawSetPreviewVehCol = (
  text: number,
  color1: string | number,
  color2: string | number
): void => {
  callNative(
    "TextDrawSetPreviewVehCol",
    "iii",
    text,
    rgba(color1),
    rgba(color2)
  );
};

export const GangZoneCreate = (
  minx: number,
  miny: number,
  maxx: number,
  maxy: number
): number => {
  return callNative("GangZoneCreate", "ffff", minx, miny, maxx, maxy);
};

export const GangZoneDestroy = (zone: number): number => {
  return callNative("GangZoneDestroy", "i", zone);
};

export const GangZoneShowForPlayer = (
  playerid: number,
  zone: number,
  color: string | number
): number => {
  return callNative(
    "GangZoneShowForPlayer",
    "iii",
    playerid,
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
  playerid: number,
  zone: number
): number => {
  return callNative("GangZoneHideForPlayer", "ii", playerid, zone);
};

export const GangZoneHideForAll = (zone: number): number => {
  return callNative("GangZoneHideForAll", "i", zone);
};

export const GangZoneFlashForPlayer = (
  playerid: number,
  zone: number,
  flashcolor: string | number
): number => {
  return callNative(
    "GangZoneFlashForPlayer",
    "iii",
    playerid,
    zone,
    rgba(flashcolor)
  );
};

export const GangZoneFlashForAll = (
  zone: number,
  flashcolor: string | number
): number => {
  return callNative("GangZoneFlashForAll", "ii", zone, rgba(flashcolor));
};

export const GangZoneStopFlashForPlayer = (
  playerid: number,
  zone: number
): number => {
  return callNative("GangZoneStopFlashForPlayer", "ii", playerid, zone);
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
  virtualworld: number,
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
    virtualworld,
    testLOS
  );
};

export const Delete3DTextLabel = (id: number): number => {
  return callNative("Delete3DTextLabel", "i", id);
};

export const Attach3DTextLabelToPlayer = (
  id: number,
  playerid: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number
): number => {
  return callNative(
    "Attach3DTextLabelToPlayer",
    "iifff",
    id,
    playerid,
    OffsetX,
    OffsetY,
    OffsetZ
  );
};

export const Attach3DTextLabelToVehicle = (
  id: number,
  vehicleid: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number
): number => {
  return callNative(
    "Attach3DTextLabelToVehicle",
    "iifff",
    id,
    vehicleid,
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
  playerid: number,
  text: string,
  color: string | number,
  X: number,
  Y: number,
  Z: number,
  DrawDistance: number,
  attachedplayer: number,
  attachedvehicle: number,
  testLOS: boolean
): number => {
  return callNative(
    "CreatePlayer3DTextLabel",
    "isiffffiii",
    playerid,
    text,
    rgba(color),
    X,
    Y,
    Z,
    DrawDistance,
    attachedplayer,
    attachedvehicle,
    testLOS
  );
};

export const DeletePlayer3DTextLabel = (
  playerid: number,
  id: number
): number => {
  return callNative("DeletePlayer3DTextLabel", "ii", playerid, id);
};

export const UpdatePlayer3DTextLabelText = (
  playerid: number,
  id: number,
  color: string | number,
  text: string
): number => {
  return callNative(
    "UpdatePlayer3DTextLabelText",
    "iiis",
    playerid,
    id,
    rgba(color),
    text
  );
};

export const gpci = (playerid: number, maxlen: number): string => {
  return callNative("gpci", "iSi", playerid, maxlen);
};

export const CreateActor = (
  modelid: number,
  X: number,
  Y: number,
  Z: number,
  Rotation: number
): number => {
  return callNative("CreateActor", "iffff", modelid, X, Y, Z, Rotation);
};

export const DestroyActor = (actorid: number): number => {
  return callNative("DestroyActor", "i", actorid);
};

export const IsActorStreamedIn = (
  actorid: number,
  forplayerid: number
): boolean => {
  return Boolean(callNative("IsActorStreamedIn", "ii", actorid, forplayerid));
};

export const SetActorVirtualWorld = (
  actorid: number,
  vworld: number
): number => {
  return callNative("SetActorVirtualWorld", "ii", actorid, vworld);
};

export const GetActorVirtualWorld = (actorid: number): number => {
  return callNative("GetActorVirtualWorld", "i", actorid);
};

export const ApplyActorAnimation = (
  actorid: number,
  animlib: string,
  animname: string,
  fDelta: number,
  loop: boolean,
  lockx: boolean,
  locky: boolean,
  freeze: boolean,
  time: number
): number => {
  return callNative(
    "ApplyActorAnimation",
    "issfiiiii",
    actorid,
    animlib,
    animname,
    fDelta,
    loop,
    lockx,
    locky,
    freeze,
    time
  );
};

export const ClearActorAnimations = (actorid: number): number => {
  return callNative("ClearActorAnimations", "i", actorid);
};

export const SetActorPos = (
  actorid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNative("SetActorPos", "ifff", actorid, X, Y, Z);
};

export const GetActorPos = (actorid: number): Array<number> => {
  return callNative("GetActorPos", "iFFF", actorid);
};

export const SetActorFacingAngle = (actorid: number, ang: number): number => {
  return callNative("SetActorFacingAngle", "if", actorid, ang);
};

export const GetActorFacingAngle = (actorid: number): number => {
  return callNative("GetActorFacingAngle", "iF", actorid);
};

export const SetActorHealth = (actorid: number, health: number): number => {
  return callNative("SetActorHealth", "if", actorid, health);
};

export const GetActorHealth = (actorid: number): number => {
  return callNative("GetActorHealth", "iF", actorid);
};

export const SetActorInvulnerable = (
  actorid: number,
  invulnerable: boolean
): number => {
  return callNative("SetActorInvulnerable", "ii", actorid, invulnerable);
};

export const IsActorInvulnerable = (actorid: number): boolean => {
  return Boolean(callNative("IsActorInvulnerable", "i", actorid));
};

export const IsValidActor = (actorid: number): boolean => {
  return Boolean(callNative("IsValidActor", "i", actorid));
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
  modelid: number,
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
    modelid,
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
  objectid: number,
  vehicleid: number,
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
    objectid,
    vehicleid,
    OffsetX,
    OffsetY,
    OffsetZ,
    RotX,
    RotY,
    RotZ
  );
};

export const AttachObjectToObject = (
  objectid: number,
  attachtoid: number,
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
    objectid,
    attachtoid,
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
  objectid: number,
  playerid: number,
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
    objectid,
    playerid,
    OffsetX,
    OffsetY,
    OffsetZ,
    RotX,
    RotY,
    RotZ
  );
};

export const SetObjectPos = (
  objectid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNative("SetObjectPos", "ifff", objectid, X, Y, Z);
};

export const GetObjectPos = (objectid: number): Array<number> => {
  return callNative("GetObjectPos", "iFFF", objectid);
};

export const SetObjectRot = (
  objectid: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return callNative("SetObjectRot", "ifff", objectid, RotX, RotY, RotZ);
};

export const GetObjectRot = (objectid: number): Array<number> => {
  return callNative("GetObjectRot", "iFFF", objectid);
};

export const GetObjectModel = (objectid: number): number => {
  return callNative("GetObjectModel", "i", objectid);
};

export const SetObjectNoCameraCol = (objectid: number): number => {
  return callNative("SetObjectNoCameraCol", "i", objectid);
};

export const IsValidObject = (objectid: number): boolean => {
  return Boolean(callNative("IsValidObject", "i", objectid));
};

export const DestroyObject = (objectid: number): number => {
  return callNative("DestroyObject", "i", objectid);
};

export const MoveObject = (
  objectid: number,
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
    objectid,
    X,
    Y,
    Z,
    Speed,
    RotX,
    RotY,
    RotZ
  );
};

export const StopObject = (objectid: number): number => {
  return callNative("StopObject", "i", objectid);
};

export const IsObjectMoving = (objectid: number): boolean => {
  return Boolean(callNative("IsObjectMoving", "i", objectid));
};

export const EditObject = (playerid: number, objectid: number): number => {
  return callNative("EditObject", "ii", playerid, objectid);
};

export const EditPlayerObject = (
  playerid: number,
  objectid: number
): number => {
  return callNative("EditPlayerObject", "ii", playerid, objectid);
};

export const SelectObject = (playerid: number): number => {
  return callNative("SelectObject", "i", playerid);
};

export const CancelEdit = (playerid: number): number => {
  return callNative("CancelEdit", "i", playerid);
};

export const CreatePlayerObject = (
  playerid: number,
  modelid: number,
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
    playerid,
    modelid,
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
  playerid: number,
  objectid: number,
  vehicleid: number,
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
    playerid,
    objectid,
    vehicleid,
    fOffsetX,
    fOffsetY,
    fOffsetZ,
    fRotX,
    fRotY,
    RotZ
  );
};

export const SetPlayerObjectPos = (
  playerid: number,
  objectid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNative("SetPlayerObjectPos", "iifff", playerid, objectid, X, Y, Z);
};

export const GetPlayerObjectPos = (
  playerid: number,
  objectid: number
): Array<number> => {
  return callNative("GetPlayerObjectPos", "iiFFF", playerid, objectid);
};

export const SetPlayerObjectRot = (
  playerid: number,
  objectid: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return callNative(
    "SetPlayerObjectRot",
    "iifff",
    playerid,
    objectid,
    RotX,
    RotY,
    RotZ
  );
};

export const GetPlayerObjectRot = (
  playerid: number,
  objectid: number
): Array<number> => {
  return callNative("GetPlayerObjectRot", "iiFFF", playerid, objectid);
};

export const GetPlayerObjectModel = (
  playerid: number,
  objectid: number
): number => {
  return callNative("GetPlayerObjectModel", "ii", playerid, objectid);
};

export const SetPlayerObjectNoCameraCol = (
  playerid: number,
  objectid: number
): number => {
  return callNative("SetPlayerObjectNoCameraCol", "ii", playerid, objectid);
};

export const IsValidPlayerObject = (
  playerid: number,
  objectid: number
): boolean => {
  return Boolean(callNative("IsValidPlayerObject", "ii", playerid, objectid));
};

export const DestroyPlayerObject = (
  playerid: number,
  objectid: number
): number => {
  return callNative("DestroyPlayerObject", "ii", playerid, objectid);
};

export const MovePlayerObject = (
  playerid: number,
  objectid: number,
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
    playerid,
    objectid,
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
  playerid: number,
  objectid: number
): number => {
  return callNative("StopPlayerObject", "ii", playerid, objectid);
};

export const IsPlayerObjectMoving = (
  playerid: number,
  objectid: number
): boolean => {
  return Boolean(callNative("IsPlayerObjectMoving", "ii", playerid, objectid));
};

export const AttachPlayerObjectToPlayer = (
  objectplayer: number,
  objectid: number,
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
    objectid,
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
  objectid: number,
  materialindex: number,
  modelid: number,
  txdname: string,
  texturename: string,
  materialcolor: string | number
): number => {
  return callNative(
    "SetObjectMaterial",
    "iiissi",
    objectid,
    materialindex,
    modelid,
    txdname,
    texturename,
    rgba(materialcolor)
  );
};

export const SetPlayerObjectMaterial = (
  playerid: number,
  objectid: number,
  materialindex: number,
  modelid: number,
  txdname: string,
  texturename: string,
  materialcolor: string | number
): number => {
  return callNative(
    "SetPlayerObjectMaterial",
    "iiiissi",
    playerid,
    objectid,
    materialindex,
    modelid,
    txdname,
    texturename,
    rgba(materialcolor)
  );
};

export const SetObjectMaterialText = (
  objectid: number,
  text: string,
  materialindex: number,
  materialsize: number,
  fontface: string,
  fontsize: number,
  bold = true,
  fontcolor: string | number,
  backcolor: string | number,
  textalignment: number
): number => {
  return callNative(
    "SetObjectMaterialText",
    "isiisiiiii",
    objectid,
    text,
    materialindex,
    materialsize,
    fontface,
    fontsize,
    bold,
    rgba(fontcolor),
    rgba(backcolor),
    textalignment
  );
};

export const SetPlayerObjectMaterialText = (
  playerid: number,
  objectid: number,
  text: string,
  materialindex: number,
  materialsize: number,
  fontface: string,
  fontsize: number,
  bold = true,
  fontcolor: string | number,
  backcolor: string | number,
  textalignment: number
): number => {
  return callNative(
    "SetPlayerObjectMaterialText",
    "iisiisiiiii",
    playerid,
    objectid,
    text,
    materialindex,
    materialsize,
    fontface,
    fontsize,
    bold,
    rgba(fontcolor),
    rgba(backcolor),
    textalignment
  );
};

export const SetObjectsDefaultCameraCol = (disable: boolean): number => {
  return callNative("SetObjectsDefaultCameraCol", "i", disable);
};

export const SetSpawnInfo = (
  playerid: number,
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
    playerid,
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

export const SpawnPlayer = (playerid: number): number => {
  return callNative("SpawnPlayer", "i", playerid);
};

export const SetPlayerPos = (
  playerid: number,
  x: number,
  y: number,
  z: number
): number => {
  return callNative("SetPlayerPos", "ifff", playerid, x, y, z);
};

export const SetPlayerPosFindZ = (
  playerid: number,
  x: number,
  y: number,
  z: number
): number => {
  return callNative("SetPlayerPosFindZ", "ifff", playerid, x, y, z);
};

export const GetPlayerPos = (playerid: number): Array<number> => {
  return callNative("GetPlayerPos", "iFFF", playerid);
};

export const SetPlayerFacingAngle = (playerid: number, ang: number): number => {
  return callNative("SetPlayerFacingAngle", "if", playerid, ang);
};

export const GetPlayerFacingAngle = (playerid: number): number => {
  return callNative("GetPlayerFacingAngle", "iF", playerid);
};

export const IsPlayerInRangeOfPoint = (
  playerid: number,
  range: number,
  x: number,
  y: number,
  z: number
): boolean => {
  return Boolean(
    callNative("IsPlayerInRangeOfPoint", "iffff", playerid, range, x, y, z)
  );
};

export const GetPlayerDistanceFromPoint = (
  playerid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNativeFloat(
    "GetPlayerDistanceFromPoint",
    "ifff",
    playerid,
    X,
    Y,
    Z
  );
};

export const IsPlayerStreamedIn = (
  playerid: number,
  forplayerid: number
): boolean => {
  return Boolean(callNative("IsPlayerStreamedIn", "ii", playerid, forplayerid));
};

export const SetPlayerInterior = (
  playerid: number,
  interiorid: number
): number => {
  return callNative("SetPlayerInterior", "ii", playerid, interiorid);
};

export const GetPlayerInterior = (playerid: number): number => {
  return callNative("GetPlayerInterior", "i", playerid);
};

export const SetPlayerHealth = (playerid: number, health: number): number => {
  return callNative("SetPlayerHealth", "if", playerid, health);
};

export const GetPlayerHealth = (playerid: number): number => {
  return callNative("GetPlayerHealth", "iF", playerid);
};

export const SetPlayerArmour = (playerid: number, armour: number): number => {
  return callNative("SetPlayerArmour", "if", playerid, armour);
};

export const GetPlayerArmour = (playerid: number): number => {
  return callNative("GetPlayerArmour", "iF", playerid);
};

export const SetPlayerAmmo = (
  playerid: number,
  weaponid: number,
  ammo: number
): number => {
  return callNative("SetPlayerAmmo", "iii", playerid, weaponid, ammo);
};

export const GetPlayerAmmo = (playerid: number): number => {
  return callNative("GetPlayerAmmo", "i", playerid);
};

export const GetPlayerWeaponState = (playerid: number): WeaponStatesEnum => {
  return callNative("GetPlayerWeaponState", "i", playerid);
};

export const GetPlayerTargetPlayer = (playerid: number): number => {
  return callNative("GetPlayerTargetPlayer", "i", playerid);
};

export const GetPlayerTargetActor = (playerid: number): number => {
  return callNative("GetPlayerTargetActor", "i", playerid);
};

export const SetPlayerTeam = (playerid: number, teamid: number): void => {
  callNative("SetPlayerTeam", "ii", playerid, teamid);
};

export const GetPlayerTeam = (playerid: number): number => {
  return callNative("GetPlayerTeam", "i", playerid);
};

export const SetPlayerScore = (playerid: number, score: number): number => {
  return callNative("SetPlayerScore", "ii", playerid, score);
};

export const GetPlayerScore = (playerid: number): number => {
  return callNative("GetPlayerScore", "i", playerid);
};

export const GetPlayerDrunkLevel = (playerid: number): number => {
  return callNative("GetPlayerDrunkLevel", "i", playerid);
};

export const SetPlayerDrunkLevel = (
  playerid: number,
  level: number
): number => {
  return callNative("SetPlayerDrunkLevel", "ii", playerid, level);
};

export const SetPlayerColor = (
  playerid: number,
  color: string | number
): number => {
  return callNative("SetPlayerColor", "ii", playerid, rgba(color));
};

export const GetPlayerColor = (playerid: number): number => {
  return callNative("GetPlayerColor", "i", playerid);
};

export const SetPlayerSkin = (playerid: number, skinid: number): number => {
  return callNative("SetPlayerSkin", "ii", playerid, skinid);
};

export const GetPlayerSkin = (playerid: number): number => {
  return callNative("GetPlayerSkin", "i", playerid);
};

export const GivePlayerWeapon = (
  playerid: number,
  weaponid: number,
  ammo: number
): number => {
  return callNative("GivePlayerWeapon", "iii", playerid, weaponid, ammo);
};

export const ResetPlayerWeapons = (playerid: number): number => {
  return callNative("ResetPlayerWeapons", "i", playerid);
};

export const SetPlayerArmedWeapon = (
  playerid: number,
  weaponid: number
): number => {
  return callNative("SetPlayerArmedWeapon", "ii", playerid, weaponid);
};

export const GetPlayerWeaponData = (
  playerid: number,
  slot: number
): Array<number> => {
  return callNative("GetPlayerWeaponData", "iiII", playerid, slot);
};

export const GivePlayerMoney = (playerid: number, money: number): number => {
  return callNative("GivePlayerMoney", "ii", playerid, money);
};

export const ResetPlayerMoney = (playerid: number): number => {
  return callNative("ResetPlayerMoney", "i", playerid);
};

export const GetPlayerMoney = (playerid: number): number => {
  return callNative("GetPlayerMoney", "i", playerid);
};

export const GetPlayerState = (playerid: number): PlayerStateEnum => {
  return callNative("GetPlayerState", "i", playerid);
};

export const GetPlayerPing = (playerid: number): number => {
  return callNative("GetPlayerPing", "i", playerid);
};

export const GetPlayerWeapon = (playerid: number): number => {
  return callNative("GetPlayerWeapon", "i", playerid);
};

export const GetPlayerKeys = (playerid: number): Array<KeysEnum> => {
  return callNative("GetPlayerKeys", "iIII", playerid);
};

export const SetPlayerTime = (
  playerid: number,
  hour: number,
  minute: number
): number => {
  return callNative("SetPlayerTime", "iii", playerid, hour, minute);
};

export const GetPlayerTime = (playerid: number): Array<number> => {
  return callNative("GetPlayerTime", "iII", playerid);
};

export const TogglePlayerClock = (
  playerid: number,
  toggle: boolean
): number => {
  return callNative("TogglePlayerClock", "ii", playerid, toggle);
};

export const SetPlayerWeather = (playerid: number, weather: number): number => {
  return callNative("SetPlayerWeather", "ii", playerid, weather);
};

export const ForceClassSelection = (playerid: number): number => {
  return callNative("ForceClassSelection", "i", playerid);
};

export const SetPlayerWantedLevel = (
  playerid: number,
  level: number
): number => {
  return callNative("SetPlayerWantedLevel", "ii", playerid, level);
};

export const GetPlayerWantedLevel = (playerid: number): number => {
  return callNative("GetPlayerWantedLevel", "i", playerid);
};

export const SetPlayerFightingStyle = (
  playerid: number,
  style: FightingStylesEnum
): number => {
  return callNative("SetPlayerFightingStyle", "ii", playerid, style);
};

export const GetPlayerFightingStyle = (
  playerid: number
): FightingStylesEnum => {
  return callNative("GetPlayerFightingStyle", "i", playerid);
};

export const SetPlayerVelocity = (
  playerid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNative("SetPlayerVelocity", "ifff", playerid, X, Y, Z);
};

export const GetPlayerVelocity = (playerid: number): Array<number> => {
  return callNative("GetPlayerVelocity", "iFFF", playerid);
};

export const PlayCrimeReportForPlayer = (
  playerid: number,
  suspectid: number,
  crime: number
): number => {
  return callNative(
    "PlayCrimeReportForPlayer",
    "iii",
    playerid,
    suspectid,
    crime
  );
};

export const PlayAudioStreamForPlayer = (
  playerid: number,
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
    playerid,
    url,
    posX,
    posY,
    posZ,
    distance,
    usepos
  );
};

export const StopAudioStreamForPlayer = (playerid: number): number => {
  return callNative("StopAudioStreamForPlayer", "i", playerid);
};

export const SetPlayerShopName = (
  playerid: number,
  shopname: string
): number => {
  return callNative("SetPlayerShopName", "is", playerid, shopname);
};

export const SetPlayerSkillLevel = (
  playerid: number,
  skill: WeaponSkillsEnum,
  level: number
): number => {
  return callNative("SetPlayerSkillLevel", "iii", playerid, skill, level);
};

export const GetPlayerSurfingVehicleID = (playerid: number): number => {
  return callNative("GetPlayerSurfingVehicleID", "i", playerid);
};

export const GetPlayerSurfingObjectID = (playerid: number): number => {
  return callNative("GetPlayerSurfingObjectID", "i", playerid);
};

export const RemoveBuildingForPlayer = (
  playerid: number,
  modelid: number,
  fX: number,
  fY: number,
  fZ: number,
  fRadius: number
): number => {
  return callNative(
    "RemoveBuildingForPlayer",
    "iiffff",
    playerid,
    modelid,
    fX,
    fY,
    fZ,
    fRadius
  );
};

export const GetPlayerLastShotVectors = (playerid: number): Array<number> => {
  return callNative("GetPlayerLastShotVectors", "iFFFFFF", playerid);
};

export const SetPlayerAttachedObject = (
  playerid: number,
  index: number,
  modelid: number,
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
  materialcolor1: string | number,
  materialcolor2: string | number
): number => {
  return callNative(
    "SetPlayerAttachedObject",
    "iiiifffffffffii",
    playerid,
    index,
    modelid,
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
    rgba(materialcolor1),
    rgba(materialcolor2)
  );
};

export const RemovePlayerAttachedObject = (
  playerid: number,
  index: number
): number => {
  return callNative("RemovePlayerAttachedObject", "ii", playerid, index);
};

export const IsPlayerAttachedObjectSlotUsed = (
  playerid: number,
  index: number
): boolean => {
  return Boolean(
    callNative("IsPlayerAttachedObjectSlotUsed", "ii", playerid, index)
  );
};

export const EditAttachedObject = (playerid: number, index: number): number => {
  return callNative("EditAttachedObject", "ii", playerid, index);
};

export const CreatePlayerTextDraw = (
  playerid: number,
  x: number,
  y: number,
  text: string
): number => {
  return callNative("CreatePlayerTextDraw", "iffs", playerid, x, y, text);
};

export const PlayerTextDrawDestroy = (playerid: number, text: number): void => {
  callNative("PlayerTextDrawDestroy", "ii", playerid, text);
};

export const PlayerTextDrawLetterSize = (
  playerid: number,
  text: number,
  x: number,
  y: number
): number => {
  return callNative("PlayerTextDrawLetterSize", "iiff", playerid, text, x, y);
};

export const PlayerTextDrawTextSize = (
  playerid: number,
  text: number,
  x: number,
  y: number
): number => {
  return callNative("PlayerTextDrawTextSize", "iiff", playerid, text, x, y);
};

export const PlayerTextDrawAlignment = (
  playerid: number,
  text: number,
  alignment: TextDrawAlignEnum
): number => {
  return callNative(
    "PlayerTextDrawAlignment",
    "iii",
    playerid,
    text,
    alignment
  );
};

export const PlayerTextDrawColor = (
  playerid: number,
  text: number,
  color: string | number
): number => {
  return callNative("PlayerTextDrawColor", "iii", playerid, text, rgba(color));
};

export const PlayerTextDrawUseBox = (
  playerid: number,
  text: number,
  use: boolean
): number => {
  return callNative("PlayerTextDrawUseBox", "iii", playerid, text, use);
};

export const PlayerTextDrawBoxColor = (
  playerid: number,
  text: number,
  color: string | number
): number => {
  return callNative(
    "PlayerTextDrawBoxColor",
    "iii",
    playerid,
    text,
    rgba(color)
  );
};

export const PlayerTextDrawSetShadow = (
  playerid: number,
  text: number,
  size: number
): number => {
  return callNative("PlayerTextDrawSetShadow", "iii", playerid, text, size);
};

export const PlayerTextDrawSetOutline = (
  playerid: number,
  text: number,
  size: number
): number => {
  return callNative("PlayerTextDrawSetOutline", "iii", playerid, text, size);
};

export const PlayerTextDrawBackgroundColor = (
  playerid: number,
  text: number,
  color: string | number
): number => {
  return callNative(
    "PlayerTextDrawBackgroundColor",
    "iii",
    playerid,
    text,
    rgba(color)
  );
};

export const PlayerTextDrawFont = (
  playerid: number,
  text: number,
  font: number
): number => {
  return callNative("PlayerTextDrawFont", "iii", playerid, text, font);
};

export const PlayerTextDrawSetProportional = (
  playerid: number,
  text: number,
  set: boolean
): number => {
  return callNative(
    "PlayerTextDrawSetProportional",
    "iii",
    playerid,
    text,
    set
  );
};

export const PlayerTextDrawSetSelectable = (
  playerid: number,
  text: number,
  set: boolean
): number => {
  return callNative("PlayerTextDrawSetSelectable", "iii", playerid, text, set);
};

export const PlayerTextDrawShow = (playerid: number, text: number): number => {
  return callNative("PlayerTextDrawShow", "ii", playerid, text);
};

export const PlayerTextDrawHide = (playerid: number, text: number): number => {
  return callNative("PlayerTextDrawHide", "ii", playerid, text);
};

export const PlayerTextDrawSetString = (
  playerid: number,
  text: number,
  string: string
): number => {
  return callNative("PlayerTextDrawSetString", "iis", playerid, text, string);
};

export const PlayerTextDrawSetPreviewModel = (
  playerid: number,
  text: number,
  modelindex: number
): number => {
  return callNative(
    "PlayerTextDrawSetPreviewModel",
    "iii",
    playerid,
    text,
    modelindex
  );
};

export const PlayerTextDrawSetPreviewRot = (
  playerid: number,
  text: number,
  fRotX: number,
  fRotY: number,
  fRotZ: number,
  fZoom: number
): number => {
  return callNative(
    "PlayerTextDrawSetPreviewRot",
    "iiffff",
    playerid,
    text,
    fRotX,
    fRotY,
    fRotZ,
    fZoom
  );
};

export const PlayerTextDrawSetPreviewVehCol = (
  playerid: number,
  text: number,
  color1: string | number,
  color2: string | number
): number => {
  return callNative(
    "PlayerTextDrawSetPreviewVehCol",
    "iiii",
    playerid,
    text,
    color1,
    color2
  );
};

export const SetPlayerChatBubble = (
  playerid: number,
  text: string,
  color: string | number,
  drawdistance: number,
  expiretime: number
): number => {
  return callNative(
    "SetPlayerChatBubble",
    "isifi",
    playerid,
    text,
    rgba(color),
    drawdistance,
    expiretime
  );
};

export const PutPlayerInVehicle = (
  playerid: number,
  vehicleid: number,
  seatid: number
): number => {
  return callNative("PutPlayerInVehicle", "iii", playerid, vehicleid, seatid);
};

export const GetPlayerVehicleID = (playerid: number): number => {
  return callNative("GetPlayerVehicleID", "i", playerid);
};

export const GetPlayerVehicleSeat = (playerid: number): number => {
  return callNative("GetPlayerVehicleSeat", "i", playerid);
};

export const RemovePlayerFromVehicle = (playerid: number): number => {
  return callNative("RemovePlayerFromVehicle", "i", playerid);
};

export const TogglePlayerControllable = (
  playerid: number,
  toggle: boolean
): number => {
  return callNative("TogglePlayerControllable", "ii", playerid, toggle);
};

export const PlayerPlaySound = (
  playerid: number,
  soundid: number,
  x: number,
  y: number,
  z: number
): number => {
  return callNative("PlayerPlaySound", "iifff", playerid, soundid, x, y, z);
};

export const ApplyAnimation = (
  playerid: number,
  animlib: string,
  animname: string,
  fDelta: number,
  loop: boolean,
  lockx: boolean,
  locky: boolean,
  freeze: boolean,
  time: number,
  forcesync: boolean
): number => {
  return callNative(
    "ApplyAnimation",
    "issfiiiiii",
    playerid,
    animlib,
    animname,
    fDelta,
    loop,
    lockx,
    locky,
    freeze,
    time,
    forcesync
  );
};

export const ClearAnimations = (
  playerid: number,
  forcesync: boolean
): number => {
  return callNative("ClearAnimations", "ii", playerid, forcesync);
};

export const GetPlayerAnimationIndex = (playerid: number): number => {
  return callNative("GetPlayerAnimationIndex", "i", playerid);
};

export const GetPlayerSpecialAction = (
  playerid: number
): SpecialActionsEnum => {
  return callNative("GetPlayerSpecialAction", "i", playerid);
};

export const SetPlayerSpecialAction = (
  playerid: number,
  actionid: SpecialActionsEnum
): number => {
  return callNative("SetPlayerSpecialAction", "ii", playerid, actionid);
};

export const DisableRemoteVehicleCollisions = (
  playerid: number,
  disable: boolean
): number => {
  return callNative("DisableRemoteVehicleCollisions", "ii", playerid, disable);
};

export const SetPlayerCheckpoint = (
  playerid: number,
  x: number,
  y: number,
  z: number,
  size: number
): number => {
  return callNative("SetPlayerCheckpoint", "iffff", playerid, x, y, z, size);
};

export const DisablePlayerCheckpoint = (playerid: number): number => {
  return callNative("DisablePlayerCheckpoint", "i", playerid);
};

export const SetPlayerRaceCheckpoint = (
  playerid: number,
  type: number,
  x: number,
  y: number,
  z: number,
  nextx: number,
  nexty: number,
  nextz: number,
  size: number
): number => {
  return callNative(
    "SetPlayerRaceCheckpoint",
    "iifffffff",
    playerid,
    type,
    x,
    y,
    z,
    nextx,
    nexty,
    nextz,
    size
  );
};

export const DisablePlayerRaceCheckpoint = (playerid: number): number => {
  return callNative("DisablePlayerRaceCheckpoint", "i", playerid);
};

export const SetPlayerWorldBounds = (
  playerid: number,
  x_max: number,
  x_min: number,
  y_max: number,
  y_min: number
): number => {
  return callNative(
    "SetPlayerWorldBounds",
    "iffff",
    playerid,
    x_max,
    x_min,
    y_max,
    y_min
  );
};

export const SetPlayerMarkerForPlayer = (
  playerid: number,
  showplayerid: number,
  color: string | number
): number => {
  return callNative(
    "SetPlayerMarkerForPlayer",
    "iii",
    playerid,
    showplayerid,
    rgba(color)
  );
};

export const ShowPlayerNameTagForPlayer = (
  playerid: number,
  showplayerid: number,
  show: boolean
): number => {
  return callNative(
    "ShowPlayerNameTagForPlayer",
    "iii",
    playerid,
    showplayerid,
    show
  );
};

export const SetPlayerMapIcon = (
  playerid: number,
  iconid: number,
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
    playerid,
    iconid,
    x,
    y,
    z,
    markertype,
    rgba(color),
    style
  );
};

export const RemovePlayerMapIcon = (
  playerid: number,
  iconid: number
): number => {
  return callNative("RemovePlayerMapIcon", "ii", playerid, iconid);
};

export const SetPlayerCameraPos = (
  playerid: number,
  x: number,
  y: number,
  z: number
): number => {
  return callNative("SetPlayerCameraPos", "ifff", playerid, x, y, z);
};

export const SetPlayerCameraLookAt = (
  playerid: number,
  x: number,
  y: number,
  z: number,
  cut: CameraCutStylesEnum
): number => {
  return callNative("SetPlayerCameraLookAt", "ifffi", playerid, x, y, z, cut);
};

export const SetCameraBehindPlayer = (playerid: number): number => {
  return callNative("SetCameraBehindPlayer", "i", playerid);
};

export const GetPlayerCameraPos = (playerid: number): Array<number> => {
  return callNative("GetPlayerCameraPos", "iFFF", playerid);
};

export const GetPlayerCameraFrontVector = (playerid: number): Array<number> => {
  return callNative("GetPlayerCameraFrontVector", "iFFF", playerid);
};

export const GetPlayerCameraMode = (playerid: number): CameraModesEnum => {
  return callNative("GetPlayerCameraMode", "i", playerid);
};

export const EnablePlayerCameraTarget = (
  playerid: number,
  enable: boolean
): number => {
  return callNative("EnablePlayerCameraTarget", "ii", playerid, enable);
};

export const GetPlayerCameraTargetObject = (playerid: number): number => {
  return callNative("GetPlayerCameraTargetObject", "i", playerid);
};

export const GetPlayerCameraTargetVehicle = (playerid: number): number => {
  return callNative("GetPlayerCameraTargetVehicle", "i", playerid);
};

export const GetPlayerCameraTargetPlayer = (playerid: number): number => {
  return callNative("GetPlayerCameraTargetPlayer", "i", playerid);
};

export const GetPlayerCameraTargetActor = (playerid: number): number => {
  return callNative("GetPlayerCameraTargetActor", "i", playerid);
};

export const GetPlayerCameraAspectRatio = (playerid: number): number => {
  return callNativeFloat("GetPlayerCameraAspectRatio", "i", playerid);
};

export const GetPlayerCameraZoom = (playerid: number): number => {
  return callNativeFloat("GetPlayerCameraZoom", "i", playerid);
};

export const AttachCameraToObject = (
  playerid: number,
  objectid: number
): number => {
  return callNative("AttachCameraToObject", "ii", playerid, objectid);
};

export const AttachCameraToPlayerObject = (
  playerid: number,
  playerobjectid: number
): number => {
  return callNative(
    "AttachCameraToPlayerObject",
    "ii",
    playerid,
    playerobjectid
  );
};

export const InterpolateCameraPos = (
  playerid: number,
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
    playerid,
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
  playerid: number,
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
    playerid,
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

export const IsPlayerConnected = (playerid: number): boolean => {
  return Boolean(callNative("IsPlayerConnected", "i", playerid));
};

export const IsPlayerInVehicle = (
  playerid: number,
  vehicleid: number
): boolean => {
  return Boolean(callNative("IsPlayerInVehicle", "ii", playerid, vehicleid));
};

export const IsPlayerInAnyVehicle = (playerid: number): boolean => {
  return Boolean(callNative("IsPlayerInAnyVehicle", "i", playerid));
};

export const IsPlayerInCheckpoint = (playerid: number): boolean => {
  return Boolean(callNative("IsPlayerInCheckpoint", "i", playerid));
};

export const IsPlayerInRaceCheckpoint = (playerid: number): boolean => {
  return Boolean(callNative("IsPlayerInRaceCheckpoint", "i", playerid));
};

export const SetPlayerVirtualWorld = (
  playerid: number,
  worldid: number
): number => {
  return callNative("SetPlayerVirtualWorld", "ii", playerid, worldid);
};

export const GetPlayerVirtualWorld = (playerid: number): number => {
  return callNative("GetPlayerVirtualWorld", "i", playerid);
};

export const EnableStuntBonusForPlayer = (
  playerid: number,
  enable: boolean
): number => {
  return callNative("EnableStuntBonusForPlayer", "ii", playerid, enable);
};

export const EnableStuntBonusForAll = (enable: boolean): number => {
  return callNative("EnableStuntBonusForAll", "i", enable);
};

export const TogglePlayerSpectating = (
  playerid: number,
  toggle: boolean
): number => {
  return callNative("TogglePlayerSpectating", "ii", playerid, toggle);
};

export const PlayerSpectatePlayer = (
  playerid: number,
  targetplayerid: number,
  mode: SpectateModesEnum
): number => {
  return callNative(
    "PlayerSpectatePlayer",
    "iii",
    playerid,
    targetplayerid,
    mode
  );
};

export const PlayerSpectateVehicle = (
  playerid: number,
  targetvehicleid: number,
  mode: SpectateModesEnum
): number => {
  return callNative(
    "PlayerSpectateVehicle",
    "iii",
    playerid,
    targetvehicleid,
    mode
  );
};

export const StartRecordingPlayerData = (
  playerid: number,
  recordtype: number,
  recordname: string
): number => {
  return callNative(
    "StartRecordingPlayerData",
    "iis",
    playerid,
    recordtype,
    recordname
  );
};

export const StopRecordingPlayerData = (playerid: number): number => {
  return callNative("StopRecordingPlayerData", "i", playerid);
};

export const SelectTextDraw = (
  playerid: number,
  hovercolor: string | number
): void => {
  callNative("SelectTextDraw", "ii", playerid, rgba(hovercolor));
};

export const CancelSelectTextDraw = (playerid: number): void => {
  callNative("CancelSelectTextDraw", "i", playerid);
};

export const CreateExplosionForPlayer = (
  playerid: number,
  X: number,
  Y: number,
  Z: number,
  type: number,
  Radius: number
): number => {
  return callNative(
    "CreateExplosionForPlayer",
    "ifffif",
    playerid,
    X,
    Y,
    Z,
    type,
    Radius
  );
};

export const SendClientCheck = (
  playerid: number,
  type: number,
  memAddr: number,
  memOffset: number,
  byteCount: number
): number => {
  return callNative(
    "SendClientCheck",
    "iiiii",
    playerid,
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

export const DestroyVehicle = (vehicleid: number): number => {
  return callNative("DestroyVehicle", "i", vehicleid);
};

export const IsVehicleStreamedIn = (
  vehicleid: number,
  forplayerid: number
): boolean => {
  return Boolean(
    callNative("IsVehicleStreamedIn", "ii", vehicleid, forplayerid)
  );
};

export const GetVehiclePos = (vehicleid: number) => {
  const values: number[] = callNative("GetVehiclePos", "iFFF", vehicleid);
  if (values.length < 3) {
    throw new Error("VehicleID " + vehicleid + " not found");
  }
  return {
    x: values[0],
    y: values[1],
    z: values[2],
  };
};

export const SetVehiclePos = (
  vehicleid: number,
  x: number,
  y: number,
  z: number
): number => {
  return callNative("SetVehiclePos", "ifff", vehicleid, x, y, z);
};

export const GetVehicleZAngle = (vehicleid: number): number => {
  return callNative("GetVehicleZAngle", "iF", vehicleid);
};

export const GetVehicleRotationQuat = (vehicleid: number): Array<number> => {
  return callNative("GetVehicleRotationQuat", "iFFFF", vehicleid);
};

export const GetVehicleDistanceFromPoint = (
  vehicleid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNativeFloat(
    "GetVehicleDistanceFromPoint",
    "ifff",
    vehicleid,
    X,
    Y,
    Z
  );
};

export const SetVehicleZAngle = (
  vehicleid: number,
  z_angle: number
): number => {
  return callNative("SetVehicleZAngle", "if", vehicleid, z_angle);
};

export const SetVehicleParamsForPlayer = (
  vehicleid: number,
  playerid: number,
  objective: boolean,
  doorslocked: boolean
): number => {
  return callNative(
    "SetVehicleParamsForPlayer",
    "iiii",
    vehicleid,
    playerid,
    objective,
    doorslocked
  );
};

export const ManualVehicleEngineAndLights = (): number => {
  return callNative("ManualVehicleEngineAndLights", "");
};

export const SetVehicleParamsEx = (
  vehicleid: number,
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
    vehicleid,
    engine,
    lights,
    alarm,
    doors,
    bonnet,
    boot,
    objective
  );
};

export const GetVehicleParamsEx = (vehicleid: number): Array<number> => {
  return callNative("GetVehicleParamsEx", "iIIIIIII", vehicleid);
};

export const GetVehicleParamsSirenState = (vehicleid: number): number => {
  return callNative("GetVehicleParamsSirenState", "i", vehicleid);
};

export const SetVehicleParamsCarDoors = (
  vehicleid: number,
  driver: boolean,
  passenger: boolean,
  backleft: boolean,
  backright: boolean
): number => {
  return callNative(
    "SetVehicleParamsCarDoors",
    "iiiii",
    vehicleid,
    driver,
    passenger,
    backleft,
    backright
  );
};

export const GetVehicleParamsCarDoors = (
  vehicleid: number
): {
  driver: -1 | 0 | 1;
  passenger: -1 | 0 | 1;
  backleft: -1 | 0 | 1;
  backright: -1 | 0 | 1;
} => {
  const values = callNative("GetVehicleParamsCarDoors", "iIIII", vehicleid);
  return {
    driver: values[0],
    passenger: values[1],
    backleft: values[2],
    backright: values[3],
  };
};

export const SetVehicleParamsCarWindows = (
  vehicleid: number,
  driver: boolean,
  passenger: boolean,
  backleft: boolean,
  backright: boolean
): number => {
  return callNative(
    "SetVehicleParamsCarWindows",
    "iiiii",
    vehicleid,
    driver,
    passenger,
    backleft,
    backright
  );
};

export const GetVehicleParamsCarWindows = (
  vehicleid: number
): {
  driver: -1 | 0 | 1;
  passenger: -1 | 0 | 1;
  backleft: -1 | 0 | 1;
  backright: -1 | 0 | 1;
} => {
  const values = callNative("GetVehicleParamsCarWindows", "iIIII", vehicleid);
  return {
    driver: values[0],
    passenger: values[1],
    backleft: values[2],
    backright: values[3],
  };
};

export const SetVehicleToRespawn = (vehicleid: number): number => {
  return callNative("SetVehicleToRespawn", "i", vehicleid);
};

export const LinkVehicleToInterior = (
  vehicleid: number,
  interiorid: number
): number => {
  return callNative("LinkVehicleToInterior", "ii", vehicleid, interiorid);
};

export const AddVehicleComponent = (
  vehicleid: number,
  componentid: number
): number => {
  return callNative("AddVehicleComponent", "ii", vehicleid, componentid);
};

export const RemoveVehicleComponent = (
  vehicleid: number,
  componentid: number
): number => {
  return callNative("RemoveVehicleComponent", "ii", vehicleid, componentid);
};

export const ChangeVehicleColor = (
  vehicleid: number,
  color1: string | number,
  color2: string | number
): number => {
  return callNative(
    "ChangeVehicleColor",
    "iii",
    vehicleid,
    rgba(color1),
    rgba(color2)
  );
};

export const ChangeVehiclePaintjob = (
  vehicleid: number,
  paintjobid: number
): number => {
  return callNative("ChangeVehiclePaintjob", "ii", vehicleid, paintjobid);
};

export const SetVehicleHealth = (vehicleid: number, health: number): number => {
  return callNative("SetVehicleHealth", "if", vehicleid, health);
};

export const GetVehicleHealth = (vehicleid: number): number => {
  return callNative("GetVehicleHealth", "iF", vehicleid);
};

export const AttachTrailerToVehicle = (
  trailerid: number,
  vehicleid: number
): number => {
  return callNative("AttachTrailerToVehicle", "ii", trailerid, vehicleid);
};

export const DetachTrailerFromVehicle = (vehicleid: number): number => {
  return callNative("DetachTrailerFromVehicle", "i", vehicleid);
};

export const IsTrailerAttachedToVehicle = (vehicleid: number): boolean => {
  return Boolean(callNative("IsTrailerAttachedToVehicle", "i", vehicleid));
};

export const GetVehicleTrailer = (vehicleid: number): number => {
  return callNative("GetVehicleTrailer", "i", vehicleid);
};

export const SetVehicleNumberPlate = (
  vehicleid: number,
  numberplate: string
): number => {
  return callNative("SetVehicleNumberPlate", "is", vehicleid, numberplate);
};

export const GetVehicleModel = (vehicleid: number): number => {
  return callNative("GetVehicleModel", "i", vehicleid);
};

export const GetVehicleComponentInSlot = (
  vehicleid: number,
  slot: CarModTypeEnum
): number => {
  return callNative("GetVehicleComponentInSlot", "ii", vehicleid, slot);
};

export const GetVehicleComponentType = (
  component: number
): CarModTypeEnum | -1 => {
  return callNative("GetVehicleComponentType", "i", component);
};

export const RepairVehicle = (vehicleid: number): number => {
  return callNative("RepairVehicle", "i", vehicleid);
};

export const GetVehicleVelocity = (vehicleid: number): Array<number> => {
  return callNative("GetVehicleVelocity", "iFFF", vehicleid);
};

export const SetVehicleVelocity = (
  vehicleid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNative("SetVehicleVelocity", "ifff", vehicleid, X, Y, Z);
};

export const SetVehicleAngularVelocity = (
  vehicleid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return callNative("SetVehicleAngularVelocity", "ifff", vehicleid, X, Y, Z);
};

export const GetVehicleDamageStatus = (vehicleid: number) => {
  const values: number[] = callNative(
    "GetVehicleDamageStatus",
    "iIIII",
    vehicleid
  );
  if (values.length < 4) {
    throw new Error("VehicleID " + vehicleid + " not found");
  }
  return {
    panels: values[0],
    doors: values[1],
    lights: values[2],
    tires: values[3],
  };
};

export const UpdateVehicleDamageStatus = (
  vehicleid: number,
  panels: number,
  doors: number,
  lights: number,
  tires: number
): number => {
  return callNative(
    "UpdateVehicleDamageStatus",
    "iiiii",
    vehicleid,
    panels,
    doors,
    lights,
    tires
  );
};

export const GetVehicleModelInfo = (
  vehiclemodel: number,
  infotype: VehicleModelInfoEnum
) => {
  const values: number[] = callNative(
    "GetVehicleModelInfo",
    "iiFFF",
    vehiclemodel,
    infotype
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
  vehicleid: number,
  worldid: number
): number => {
  return callNative("SetVehicleVirtualWorld", "ii", vehicleid, worldid);
};

export const GetVehicleVirtualWorld = (vehicleid: number): number => {
  return callNative("GetVehicleVirtualWorld", "i", vehicleid);
};

export const IsValidVehicle = (vehicleid: number): boolean => {
  return Boolean(callNative("IsValidVehicle", "i", vehicleid));
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

export const GetPlayerCustomSkin = (playerid: number): number => {
  return callNative("GetPlayerCustomSkin", "i", playerid);
};

export const RedirectDownload = (playerid: number, url: string): number => {
  return callNative("RedirectDownload", "is", playerid, url);
};

export const AddSimpleModel = (
  virtualworld: number,
  baseid: number,
  newid: number,
  dffname: string,
  txdname: string
): number => {
  return callNative(
    "AddSimpleModel",
    "iiiss",
    virtualworld,
    baseid,
    newid,
    dffname,
    txdname
  );
};

export const AddSimpleModelTimed = (
  virtualworld: number,
  baseid: number,
  newid: number,
  dffname: string,
  txdname: string,
  timeon: number,
  timeoff: number
): number => {
  return callNative(
    "AddSimpleModelTimed",
    "iiissii",
    virtualworld,
    baseid,
    newid,
    dffname,
    txdname,
    timeon,
    timeoff
  );
};

export const GetWeaponName = (weaponid: number): string => {
  return callNative("GetWeaponName", "iSi", weaponid, 32);
};

export const NetStats_GetIpPort = (playerid: number): string => {
  return callNative("NetStats_GetIpPort", "iSi", playerid, 128 + 6);
};

export const GetPlayerIp = (playerid: number): string => {
  return callNative("GetPlayerIp", "iSi", playerid, 128);
};

export const GetAnimationName = (index: number): Array<string> => {
  return callNative("GetAnimationName", "iSiSi", index, 32, 32);
};

export const GetPlayerVersion = (playerid: number): string => {
  return callNative("GetPlayerVersion", "iSi", playerid, 24);
};

export const FindModelFileNameFromCRC = (crc: number): string => {
  return callNative("FindModelFileNameFromCRC", "iSi", crc, 255);
};

export const FindTextureFileNameFromCRC = (crc: number): string => {
  return callNative("FindTextureFileNameFromCRC", "iSi", crc, 255);
};
