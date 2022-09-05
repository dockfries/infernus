// Reference to Peter Szombati's samp-node-lib

// removed db_, timer functions, for better maintainability you should use the node library

import { rgba } from "@/utils/colorUtils";
import {
  CarModTypeEnum,
  ConnectionStatusEnum,
  FightingStylesEnum,
  PlayerStateEnum,
  RecordTypesEnum,
  TextDrawAlignEnum,
  VehicleModelInfoEnum,
  WeaponSkillsEnum,
} from "@/enums";
import { BaseGameMode, I18n } from "@/controllers";

export const SendPlayerMessageToPlayer = (
  playerid: number,
  senderid: number,
  message: string
): number => {
  return samp.callNative(
    "SendPlayerMessageToPlayer",
    "iis",
    playerid,
    senderid,
    message
  );
};

export const SendPlayerMessageToAll = (
  senderid: number,
  message: string
): number => {
  return samp.callNative("SendPlayerMessageToAll", "is", senderid, message);
};

export const SendDeathMessage = (
  killer: number,
  killee: number,
  weapon: number
): number => {
  return samp.callNative("SendDeathMessage", "iii", killer, killee, weapon);
};

export const SendDeathMessageToPlayer = (
  playerid: number,
  killer: number,
  killee: number,
  weapon: number
): number => {
  return samp.callNative(
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
  return samp.callNative("GameTextForAll", "sii", string, time, style);
};

export const GameTextForPlayer = (
  playerid: number,
  string: string,
  time: number,
  style: number
): number => {
  return samp.callNative(
    "GameTextForPlayer",
    "isii",
    playerid,
    string,
    time,
    style
  );
};

export const GetTickCount = (): number => {
  return samp.callNative("GetTickCount", "");
};

export const GetMaxPlayers = (): number => {
  return samp.callNative("GetMaxPlayers", "");
};

export const VectorSize = (x: number, y: number, z: number): number => {
  return samp.callNativeFloat("VectorSize", "fff", x, y, z);
};

export const asin = (value: number): number => {
  return samp.callNativeFloat("asin", "f", value);
};

export const acos = (value: number): number => {
  return samp.callNativeFloat("acos", "f", value);
};

export const atan = (value: number): number => {
  return samp.callNativeFloat("atan", "f", value);
};

export const atan2 = (y: number, x: number): number => {
  return samp.callNativeFloat("atan2", "ff", y, x);
};

export const GetPlayerPoolSize = (): number => {
  return samp.callNative("GetPlayerPoolSize", "");
};

export const GetVehiclePoolSize = (): number => {
  return samp.callNative("GetVehiclePoolSize", "");
};

export const GetActorPoolSize = (): number => {
  return samp.callNative("GetActorPoolSize", "");
};

export const SetGameModeText = (string: string): number => {
  return samp.callNative("SetGameModeText", "s", string);
};

export const SetTeamCount = (count: number): number => {
  return samp.callNative("SetTeamCount", "i", count);
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
  return samp.callNative(
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
  return samp.callNative(
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
  color1: number,
  color2: number
): number => {
  return samp.callNative(
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
  color1: number,
  color2: number,
  respawn_delay: number,
  addsiren: number
): number => {
  return samp.callNative(
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
  return samp.callNative(
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
  return samp.callNative(
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
  return samp.callNative("DestroyPickup", "i", pickup);
};

export const ShowNameTags = (show: number): number => {
  return samp.callNative("ShowNameTags", "i", show);
};

export const ShowPlayerMarkers = (mode: number): number => {
  return samp.callNative("ShowPlayerMarkers", "i", mode);
};

export const GameModeExit = (): number => {
  return samp.callNative("GameModeExit", "");
};

export const SetWorldTime = (hour: number): number => {
  return samp.callNative("SetWorldTime", "i", hour);
};

export const GetWeaponName = (weaponid: number, len: number): string => {
  return samp.callNative("GetWeaponName", "iSi", weaponid, len);
};

export const EnableVehicleFriendlyFire = (): number => {
  return samp.callNative("EnableVehicleFriendlyFire", "");
};

export const AllowInteriorWeapons = (allow: boolean): number => {
  return samp.callNative("AllowInteriorWeapons", "i", allow);
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

export const AllowAdminTeleport = (allow: boolean): number => {
  return samp.callNative("AllowAdminTeleport", "i", allow);
};

export const SetDeathDropAmount = (amount: number): number => {
  return samp.callNative("SetDeathDropAmount", "i", amount);
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

export const IsPlayerNPC = (playerid: number): number => {
  return samp.callNative("IsPlayerNPC", "i", playerid);
};

export const IsPlayerAdmin = (playerid: number): number => {
  return samp.callNative("IsPlayerAdmin", "i", playerid);
};

export const Kick = (playerid: number): number => {
  return samp.callNative("Kick", "i", playerid);
};

export const Ban = (playerid: number): number => {
  return samp.callNative("Ban", "i", playerid);
};

export const BanEx = (playerid: number, reason: string): number => {
  return samp.callNative("BanEx", "is", playerid, reason);
};

export const SendRconCommand = (command: string): number => {
  return samp.callNative("SendRconCommand", "s", command);
};

export const GetPlayerNetworkStats = (
  playerid: number,
  retstr_size: number
): string => {
  return samp.callNative("GetPlayerNetworkStats", "iSi", playerid, retstr_size);
};

export const GetNetworkStats = (retstr_size: number): string => {
  return samp.callNative("GetNetworkStats", "Si", retstr_size);
};

export const GetPlayerVersion = (playerid: number, len: number): string => {
  return samp.callNative("GetPlayerVersion", "iSi", playerid, len);
};

export const BlockIpAddress = (ip_address: string, timems: number): number => {
  return samp.callNative("BlockIpAddress", "si", ip_address, timems);
};

export const UnBlockIpAddress = (ip_address: string): number => {
  return samp.callNative("UnBlockIpAddress", "s", ip_address);
};

export const GetServerVarAsString = (varname: string, len: number): string => {
  return samp.callNative("GetServerVarAsString", "sSi", varname, len);
};

export const GetServerVarAsInt = (varname: string): number => {
  return samp.callNative("GetServerVarAsInt", "s", varname);
};

export const GetServerVarAsBool = (varname: string): number => {
  return samp.callNative("GetServerVarAsBool", "s", varname);
};

export const GetConsoleVarAsString = (varname: string, len: number): string => {
  return samp.callNative("GetConsoleVarAsString", "sSi", varname, len);
};

export const GetConsoleVarAsInt = (varname: string): number => {
  return samp.callNative("GetConsoleVarAsInt", "s", varname);
};

export const GetConsoleVarAsBool = (varname: string): number => {
  return samp.callNative("GetConsoleVarAsBool", "s", varname);
};

export const GetServerTickRate = (): number => {
  return samp.callNative("GetServerTickRate", "");
};

export const NetStats_GetConnectedTime = (playerid: number): number => {
  return samp.callNative("NetStats_GetConnectedTime", "i", playerid);
};

export const NetStats_MessagesReceived = (playerid: number): number => {
  return samp.callNative("NetStats_MessagesReceived", "i", playerid);
};

export const NetStats_BytesReceived = (playerid: number): number => {
  return samp.callNative("NetStats_BytesReceived", "i", playerid);
};

export const NetStats_MessagesSent = (playerid: number): number => {
  return samp.callNative("NetStats_MessagesSent", "i", playerid);
};

export const NetStats_BytesSent = (playerid: number): number => {
  return samp.callNative("NetStats_BytesSent", "i", playerid);
};

export const NetStats_MessagesRecvPerSecond = (playerid: number): number => {
  return samp.callNative("NetStats_MessagesRecvPerSecond", "i", playerid);
};

export const NetStats_PacketLossPercent = (playerid: number): number => {
  return samp.callNativeFloat("NetStats_PacketLossPercent", "i", playerid);
};

export const NetStats_ConnectionStatus = (
  playerid: number
): ConnectionStatusEnum => {
  return samp.callNative("NetStats_ConnectionStatus", "i", playerid);
};

export const NetStats_GetIpPort = (playerid: number): string => {
  const buf = I18n.getValidStr(
    samp.callNative("NetStats_GetIpPort", "iAi", playerid, 128 + 6)
  );
  return I18n.decodeFromBuf(buf, BaseGameMode.charset);
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

export const DestroyMenu = (menuid: number): number => {
  return samp.callNative("DestroyMenu", "i", menuid);
};

export const AddMenuItem = (
  menuid: number,
  column: number,
  menutext: string
): number => {
  return samp.callNative("AddMenuItem", "iis", menuid, column, menutext);
};

export const SetMenuColumnHeader = (
  menuid: number,
  column: number,
  columnheader: string
): number => {
  return samp.callNative(
    "SetMenuColumnHeader",
    "iis",
    menuid,
    column,
    columnheader
  );
};

export const ShowMenuForPlayer = (menuid: number, playerid: number): number => {
  return samp.callNative("ShowMenuForPlayer", "ii", menuid, playerid);
};

export const HideMenuForPlayer = (menuid: number, playerid: number): number => {
  return samp.callNative("HideMenuForPlayer", "ii", menuid, playerid);
};

export const IsValidMenu = (menuid: number): number => {
  return samp.callNative("IsValidMenu", "i", menuid);
};

export const DisableMenu = (menuid: number): number => {
  return samp.callNative("DisableMenu", "i", menuid);
};

export const DisableMenuRow = (menuid: number, row: number): number => {
  return samp.callNative("DisableMenuRow", "ii", menuid, row);
};

export const GetPlayerMenu = (playerid: number): number => {
  return samp.callNative("GetPlayerMenu", "i", playerid);
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

export const TextDrawAlignment = (text: number, alignment: number): number => {
  return samp.callNative("TextDrawAlignment", "ii", text, alignment);
};

export const TextDrawColor = (text: number, color: string): number => {
  return samp.callNative("TextDrawColor", "ii", text, rgba(color));
};

export const TextDrawUseBox = (text: number, use: number): number => {
  return samp.callNative("TextDrawUseBox", "ii", text, use);
};

export const TextDrawBoxColor = (text: number, color: string): number => {
  return samp.callNative("TextDrawBoxColor", "ii", text, rgba(color));
};

export const TextDrawSetShadow = (text: number, size: number): number => {
  return samp.callNative("TextDrawSetShadow", "ii", text, size);
};

export const TextDrawSetOutline = (text: number, size: number): number => {
  return samp.callNative("TextDrawSetOutline", "ii", text, size);
};

export const TextDrawBackgroundColor = (
  text: number,
  color: string
): number => {
  return samp.callNative("TextDrawBackgroundColor", "ii", text, rgba(color));
};

export const TextDrawFont = (text: number, font: number): number => {
  return samp.callNative("TextDrawFont", "ii", text, font);
};

export const TextDrawSetProportional = (text: number, set: number): number => {
  return samp.callNative("TextDrawSetProportional", "ii", text, set);
};

export const TextDrawSetSelectable = (text: number, set: number): number => {
  return samp.callNative("TextDrawSetSelectable", "ii", text, set);
};

export const TextDrawShowForPlayer = (
  playerid: number,
  text: number
): number => {
  return samp.callNative("TextDrawShowForPlayer", "ii", playerid, text);
};

export const TextDrawHideForPlayer = (
  playerid: number,
  text: number
): number => {
  return samp.callNative("TextDrawHideForPlayer", "ii", playerid, text);
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
  fZoom: number
): number => {
  return samp.callNative(
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
  color1: number,
  color2: number
): number => {
  return samp.callNative(
    "TextDrawSetPreviewVehCol",
    "iii",
    text,
    color1,
    color2
  );
};

export const GangZoneCreate = (
  minx: number,
  miny: number,
  maxx: number,
  maxy: number
): number => {
  return samp.callNative("GangZoneCreate", "ffff", minx, miny, maxx, maxy);
};

export const GangZoneDestroy = (zone: number): number => {
  return samp.callNative("GangZoneDestroy", "i", zone);
};

export const GangZoneShowForPlayer = (
  playerid: number,
  zone: number,
  color: string
): number => {
  return samp.callNative(
    "GangZoneShowForPlayer",
    "iii",
    playerid,
    zone,
    rgba(color)
  );
};

export const GangZoneShowForAll = (zone: number, color: string): number => {
  return samp.callNative("GangZoneShowForAll", "ii", zone, rgba(color));
};

export const GangZoneHideForPlayer = (
  playerid: number,
  zone: number
): number => {
  return samp.callNative("GangZoneHideForPlayer", "ii", playerid, zone);
};

export const GangZoneHideForAll = (zone: number): number => {
  return samp.callNative("GangZoneHideForAll", "i", zone);
};

export const GangZoneFlashForPlayer = (
  playerid: number,
  zone: number,
  flashcolor: string
): number => {
  return samp.callNative(
    "GangZoneFlashForPlayer",
    "iii",
    playerid,
    zone,
    rgba(flashcolor)
  );
};

export const GangZoneFlashForAll = (
  zone: number,
  flashcolor: string
): number => {
  return samp.callNative("GangZoneFlashForAll", "ii", zone, rgba(flashcolor));
};

export const GangZoneStopFlashForPlayer = (
  playerid: number,
  zone: number
): number => {
  return samp.callNative("GangZoneStopFlashForPlayer", "ii", playerid, zone);
};

export const GangZoneStopFlashForAll = (zone: number): number => {
  return samp.callNative("GangZoneStopFlashForAll", "i", zone);
};

export const Create3DTextLabel = (
  text: string,
  color: string,
  X: number,
  Y: number,
  Z: number,
  DrawDistance: number,
  virtualworld: number,
  testLOS: number
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
    virtualworld,
    testLOS
  );
};

export const Delete3DTextLabel = (id: number): number => {
  return samp.callNative("Delete3DTextLabel", "i", id);
};

export const Attach3DTextLabelToPlayer = (
  id: number,
  playerid: number,
  OffsetX: number,
  OffsetY: number,
  OffsetZ: number
): number => {
  return samp.callNative(
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
  return samp.callNative(
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
  color: string,
  text: string
): number => {
  return samp.callNative("Update3DTextLabelText", "iis", id, rgba(color), text);
};

export const CreatePlayer3DTextLabel = (
  playerid: number,
  text: string,
  color: string,
  X: number,
  Y: number,
  Z: number,
  DrawDistance: number,
  attachedplayer: number,
  attachedvehicle: number,
  testLOS: number
): number => {
  return samp.callNative(
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
  return samp.callNative("DeletePlayer3DTextLabel", "ii", playerid, id);
};

export const UpdatePlayer3DTextLabelText = (
  playerid: number,
  id: number,
  color: string,
  text: string
): number => {
  return samp.callNative(
    "UpdatePlayer3DTextLabelText",
    "iiis",
    playerid,
    id,
    rgba(color),
    text
  );
};

export const gpci = (playerid: number, maxlen: number): string => {
  return samp.callNative("gpci", "iSi", playerid, maxlen);
};

export const CreateActor = (
  modelid: number,
  X: number,
  Y: number,
  Z: number,
  Rotation: number
): number => {
  return samp.callNative("CreateActor", "iffff", modelid, X, Y, Z, Rotation);
};

export const DestroyActor = (actorid: number): number => {
  return samp.callNative("DestroyActor", "i", actorid);
};

export const IsActorStreamedIn = (
  actorid: number,
  forplayerid: number
): number => {
  return samp.callNative("IsActorStreamedIn", "ii", actorid, forplayerid);
};

export const SetActorVirtualWorld = (
  actorid: number,
  vworld: number
): number => {
  return samp.callNative("SetActorVirtualWorld", "ii", actorid, vworld);
};

export const GetActorVirtualWorld = (actorid: number): number => {
  return samp.callNative("GetActorVirtualWorld", "i", actorid);
};

export const ApplyActorAnimation = (
  actorid: number,
  animlib: string,
  animname: string,
  fDelta: number,
  loop: number,
  lockx: number,
  locky: number,
  freeze: number,
  time: number
): number => {
  return samp.callNative(
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
  return samp.callNative("ClearActorAnimations", "i", actorid);
};

export const SetActorPos = (
  actorid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNative("SetActorPos", "ifff", actorid, X, Y, Z);
};

export const GetActorPos = (actorid: number): Array<any> => {
  return samp.callNative("GetActorPos", "iFFF", actorid);
};

export const SetActorFacingAngle = (actorid: number, ang: number): number => {
  return samp.callNative("SetActorFacingAngle", "if", actorid, ang);
};

export const GetActorFacingAngle = (actorid: number): number => {
  return samp.callNative("GetActorFacingAngle", "iF", actorid);
};

export const SetActorHealth = (actorid: number, health: number): number => {
  return samp.callNative("SetActorHealth", "if", actorid, health);
};

export const GetActorHealth = (actorid: number): number => {
  return samp.callNative("GetActorHealth", "iF", actorid);
};

export const SetActorInvulnerable = (
  actorid: number,
  invulnerable: number
): number => {
  return samp.callNative("SetActorInvulnerable", "ii", actorid, invulnerable);
};

export const IsActorInvulnerable = (actorid: number): number => {
  return samp.callNative("IsActorInvulnerable", "i", actorid);
};

export const IsValidActor = (actorid: number): number => {
  return samp.callNative("IsValidActor", "i", actorid);
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
  modelid: number,
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
  return samp.callNative(
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
  SyncRotation: number
): number => {
  return samp.callNative(
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
  return samp.callNative(
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
  return samp.callNative("SetObjectPos", "ifff", objectid, X, Y, Z);
};

export const GetObjectPos = (objectid: number): Array<any> => {
  return samp.callNative("GetObjectPos", "iFFF", objectid);
};

export const SetObjectRot = (
  objectid: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return samp.callNative("SetObjectRot", "ifff", objectid, RotX, RotY, RotZ);
};

export const GetObjectRot = (objectid: number): Array<any> => {
  return samp.callNative("GetObjectRot", "iFFF", objectid);
};

export const GetObjectModel = (objectid: number): number => {
  return samp.callNative("GetObjectModel", "i", objectid);
};

export const SetObjectNoCameraCol = (objectid: number): number => {
  return samp.callNative("SetObjectNoCameraCol", "i", objectid);
};

export const IsValidObject = (objectid: number): number => {
  return samp.callNative("IsValidObject", "i", objectid);
};

export const DestroyObject = (objectid: number): number => {
  return samp.callNative("DestroyObject", "i", objectid);
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
  return samp.callNative(
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
  return samp.callNative("StopObject", "i", objectid);
};

export const IsObjectMoving = (objectid: number): number => {
  return samp.callNative("IsObjectMoving", "i", objectid);
};

export const EditObject = (playerid: number, objectid: number): number => {
  return samp.callNative("EditObject", "ii", playerid, objectid);
};

export const EditPlayerObject = (
  playerid: number,
  objectid: number
): number => {
  return samp.callNative("EditPlayerObject", "ii", playerid, objectid);
};

export const SelectObject = (playerid: number): number => {
  return samp.callNative("SelectObject", "i", playerid);
};

export const CancelEdit = (playerid: number): number => {
  return samp.callNative("CancelEdit", "i", playerid);
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
  return samp.callNative(
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
  return samp.callNative(
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
  return samp.callNative(
    "SetPlayerObjectPos",
    "iifff",
    playerid,
    objectid,
    X,
    Y,
    Z
  );
};

export const GetPlayerObjectPos = (
  playerid: number,
  objectid: number
): Array<any> => {
  return samp.callNative("GetPlayerObjectPos", "iiFFF", playerid, objectid);
};

export const SetPlayerObjectRot = (
  playerid: number,
  objectid: number,
  RotX: number,
  RotY: number,
  RotZ: number
): number => {
  return samp.callNative(
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
): Array<any> => {
  return samp.callNative("GetPlayerObjectRot", "iiFFF", playerid, objectid);
};

export const GetPlayerObjectModel = (
  playerid: number,
  objectid: number
): number => {
  return samp.callNative("GetPlayerObjectModel", "ii", playerid, objectid);
};

export const SetPlayerObjectNoCameraCol = (
  playerid: number,
  objectid: number
): number => {
  return samp.callNative(
    "SetPlayerObjectNoCameraCol",
    "ii",
    playerid,
    objectid
  );
};

export const IsValidPlayerObject = (
  playerid: number,
  objectid: number
): number => {
  return samp.callNative("IsValidPlayerObject", "ii", playerid, objectid);
};

export const DestroyPlayerObject = (
  playerid: number,
  objectid: number
): number => {
  return samp.callNative("DestroyPlayerObject", "ii", playerid, objectid);
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
  return samp.callNative(
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
  return samp.callNative("StopPlayerObject", "ii", playerid, objectid);
};

export const IsPlayerObjectMoving = (
  playerid: number,
  objectid: number
): number => {
  return samp.callNative("IsPlayerObjectMoving", "ii", playerid, objectid);
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
  return samp.callNative(
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
  materialcolor: string
): number => {
  return samp.callNative(
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
  materialcolor: string
): number => {
  return samp.callNative(
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
  bold: number,
  fontcolor: string,
  backcolor: string,
  textalignment: number
): number => {
  return samp.callNative(
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
  bold: number,
  fontcolor: string,
  backcolor: string,
  textalignment: number
): number => {
  return samp.callNative(
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

export const SetObjectsDefaultCameraCol = (disable: number): number => {
  return samp.callNative("SetObjectsDefaultCameraCol", "i", disable);
};

export const SetSpawnInfo = (
  playerid: number,
  team: number,
  skin: number,
  x: number,
  y: number,
  z: number,
  rotation: number,
  weapon1: number,
  weapon1_ammo: number,
  weapon2: number,
  weapon2_ammo: number,
  weapon3: number,
  weapon3_ammo: number
): number => {
  return samp.callNative(
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
  return samp.callNative("SpawnPlayer", "i", playerid);
};

export const SetPlayerPos = (
  playerid: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative("SetPlayerPos", "ifff", playerid, x, y, z);
};

export const SetPlayerPosFindZ = (
  playerid: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative("SetPlayerPosFindZ", "ifff", playerid, x, y, z);
};

export const GetPlayerPos = (playerid: number): Array<any> => {
  return samp.callNative("GetPlayerPos", "iFFF", playerid);
};

export const SetPlayerFacingAngle = (playerid: number, ang: number): number => {
  return samp.callNative("SetPlayerFacingAngle", "if", playerid, ang);
};

export const GetPlayerFacingAngle = (playerid: number): number => {
  return samp.callNative("GetPlayerFacingAngle", "iF", playerid);
};

export const IsPlayerInRangeOfPoint = (
  playerid: number,
  range: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative(
    "IsPlayerInRangeOfPoint",
    "iffff",
    playerid,
    range,
    x,
    y,
    z
  );
};

export const GetPlayerDistanceFromPoint = (
  playerid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNativeFloat(
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
): number => {
  return samp.callNative("IsPlayerStreamedIn", "ii", playerid, forplayerid);
};

export const SetPlayerInterior = (
  playerid: number,
  interiorid: number
): number => {
  return samp.callNative("SetPlayerInterior", "ii", playerid, interiorid);
};

export const GetPlayerInterior = (playerid: number): number => {
  return samp.callNative("GetPlayerInterior", "i", playerid);
};

export const SetPlayerHealth = (playerid: number, health: number): number => {
  return samp.callNative("SetPlayerHealth", "if", playerid, health);
};

export const GetPlayerHealth = (playerid: number): number => {
  return samp.callNative("GetPlayerHealth", "iF", playerid);
};

export const SetPlayerArmour = (playerid: number, armour: number): number => {
  return samp.callNative("SetPlayerArmour", "if", playerid, armour);
};

export const GetPlayerArmour = (playerid: number): number => {
  return samp.callNative("GetPlayerArmour", "iF", playerid);
};

export const SetPlayerAmmo = (
  playerid: number,
  weaponslot: number,
  ammo: number
): number => {
  return samp.callNative("SetPlayerAmmo", "iii", playerid, weaponslot, ammo);
};

export const GetPlayerAmmo = (playerid: number): number => {
  return samp.callNative("GetPlayerAmmo", "i", playerid);
};

export const GetPlayerWeaponState = (playerid: number): number => {
  return samp.callNative("GetPlayerWeaponState", "i", playerid);
};

export const GetPlayerTargetPlayer = (playerid: number): number => {
  return samp.callNative("GetPlayerTargetPlayer", "i", playerid);
};

export const GetPlayerTargetActor = (playerid: number): number => {
  return samp.callNative("GetPlayerTargetActor", "i", playerid);
};

export const SetPlayerTeam = (playerid: number, teamid: number): number => {
  return samp.callNative("SetPlayerTeam", "ii", playerid, teamid);
};

export const GetPlayerTeam = (playerid: number): number => {
  return samp.callNative("GetPlayerTeam", "i", playerid);
};

export const SetPlayerScore = (playerid: number, score: number): number => {
  return samp.callNative("SetPlayerScore", "ii", playerid, score);
};

export const GetPlayerScore = (playerid: number): number => {
  return samp.callNative("GetPlayerScore", "i", playerid);
};

export const GetPlayerDrunkLevel = (playerid: number): number => {
  return samp.callNative("GetPlayerDrunkLevel", "i", playerid);
};

export const SetPlayerDrunkLevel = (
  playerid: number,
  level: number
): number => {
  return samp.callNative("SetPlayerDrunkLevel", "ii", playerid, level);
};

export const SetPlayerColor = (playerid: number, color: string): number => {
  return samp.callNative("SetPlayerColor", "ii", playerid, rgba(color));
};

export const GetPlayerColor = (playerid: number): number => {
  return samp.callNative("GetPlayerColor", "i", playerid);
};

export const SetPlayerSkin = (playerid: number, skinid: number): number => {
  return samp.callNative("SetPlayerSkin", "ii", playerid, skinid);
};

export const GetPlayerSkin = (playerid: number): number => {
  return samp.callNative("GetPlayerSkin", "i", playerid);
};

export const GivePlayerWeapon = (
  playerid: number,
  weaponid: number,
  ammo: number
): number => {
  return samp.callNative("GivePlayerWeapon", "iii", playerid, weaponid, ammo);
};

export const ResetPlayerWeapons = (playerid: number): number => {
  return samp.callNative("ResetPlayerWeapons", "i", playerid);
};

export const SetPlayerArmedWeapon = (
  playerid: number,
  weaponid: number
): number => {
  return samp.callNative("SetPlayerArmedWeapon", "ii", playerid, weaponid);
};

export const GetPlayerWeaponData = (
  playerid: number,
  slot: number
): Array<any> => {
  return samp.callNative("GetPlayerWeaponData", "iiII", playerid, slot);
};

export const GivePlayerMoney = (playerid: number, money: number): number => {
  return samp.callNative("GivePlayerMoney", "ii", playerid, money);
};

export const ResetPlayerMoney = (playerid: number): number => {
  return samp.callNative("ResetPlayerMoney", "i", playerid);
};

export const SetPlayerName = (playerid: number, name: string): number => {
  return samp.callNative("SetPlayerName", "is", playerid, name);
};

export const GetPlayerMoney = (playerid: number): number => {
  return samp.callNative("GetPlayerMoney", "i", playerid);
};

export const GetPlayerState = (playerid: number): PlayerStateEnum => {
  return samp.callNative("GetPlayerState", "i", playerid);
};

export const GetPlayerIp = (playerid: number, len: number): string => {
  return samp.callNative("GetPlayerIp", "iSi", playerid, len);
};

export const GetPlayerPing = (playerid: number): number => {
  return samp.callNative("GetPlayerPing", "i", playerid);
};

export const GetPlayerWeapon = (playerid: number): number => {
  return samp.callNative("GetPlayerWeapon", "i", playerid);
};

export const GetPlayerKeys = (playerid: number): Array<any> => {
  return samp.callNative("GetPlayerKeys", "iIII", playerid);
};

export const SetPlayerTime = (
  playerid: number,
  hour: number,
  minute: number
): number => {
  return samp.callNative("SetPlayerTime", "iii", playerid, hour, minute);
};

export const GetPlayerTime = (playerid: number): Array<any> => {
  return samp.callNative("GetPlayerTime", "iII", playerid);
};

export const TogglePlayerClock = (playerid: number, toggle: number): number => {
  return samp.callNative("TogglePlayerClock", "ii", playerid, toggle);
};

export const SetPlayerWeather = (playerid: number, weather: number): number => {
  return samp.callNative("SetPlayerWeather", "ii", playerid, weather);
};

export const ForceClassSelection = (playerid: number): number => {
  return samp.callNative("ForceClassSelection", "i", playerid);
};

export const SetPlayerWantedLevel = (
  playerid: number,
  level: number
): number => {
  return samp.callNative("SetPlayerWantedLevel", "ii", playerid, level);
};

export const GetPlayerWantedLevel = (playerid: number): number => {
  return samp.callNative("GetPlayerWantedLevel", "i", playerid);
};

export const SetPlayerFightingStyle = (
  playerid: number,
  style: FightingStylesEnum
): number => {
  return samp.callNative("SetPlayerFightingStyle", "ii", playerid, style);
};

export const GetPlayerFightingStyle = (
  playerid: number
): FightingStylesEnum => {
  return samp.callNative("GetPlayerFightingStyle", "i", playerid);
};

export const SetPlayerVelocity = (
  playerid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNative("SetPlayerVelocity", "ifff", playerid, X, Y, Z);
};

export const GetPlayerVelocity = (playerid: number): Array<any> => {
  return samp.callNative("GetPlayerVelocity", "iFFF", playerid);
};

export const PlayCrimeReportForPlayer = (
  playerid: number,
  suspectid: number,
  crime: number
): number => {
  return samp.callNative(
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
  usepos: number
): number => {
  return samp.callNative(
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
  return samp.callNative("StopAudioStreamForPlayer", "i", playerid);
};

export const SetPlayerShopName = (
  playerid: number,
  shopname: string
): number => {
  return samp.callNative("SetPlayerShopName", "is", playerid, shopname);
};

export const SetPlayerSkillLevel = (
  playerid: number,
  skill: WeaponSkillsEnum,
  level: number
): number => {
  return samp.callNative("SetPlayerSkillLevel", "iii", playerid, skill, level);
};

export const GetPlayerSurfingVehicleID = (playerid: number): number => {
  return samp.callNative("GetPlayerSurfingVehicleID", "i", playerid);
};

export const GetPlayerSurfingObjectID = (playerid: number): number => {
  return samp.callNative("GetPlayerSurfingObjectID", "i", playerid);
};

export const RemoveBuildingForPlayer = (
  playerid: number,
  modelid: number,
  fX: number,
  fY: number,
  fZ: number,
  fRadius: number
): number => {
  return samp.callNative(
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

export const GetPlayerLastShotVectors = (playerid: number): Array<any> => {
  return samp.callNative("GetPlayerLastShotVectors", "iFFFFFF", playerid);
};

export const SetPlayerAttachedObject = (
  playerid: number,
  index: number,
  modelid: number,
  bone: number,
  fOffsetX: number,
  fOffsetY: number,
  fOffsetZ: number,
  fRotX: number,
  fRotY: number,
  fRotZ: number,
  fScaleX: number,
  fScaleY: number,
  fScaleZ: number,
  materialcolor1: number,
  materialcolor2: number
): number => {
  return samp.callNative(
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
    materialcolor1,
    materialcolor2
  );
};

export const RemovePlayerAttachedObject = (
  playerid: number,
  index: number
): number => {
  return samp.callNative("RemovePlayerAttachedObject", "ii", playerid, index);
};

export const IsPlayerAttachedObjectSlotUsed = (
  playerid: number,
  index: number
): number => {
  return samp.callNative(
    "IsPlayerAttachedObjectSlotUsed",
    "ii",
    playerid,
    index
  );
};

export const EditAttachedObject = (playerid: number, index: number): number => {
  return samp.callNative("EditAttachedObject", "ii", playerid, index);
};

export const CreatePlayerTextDraw = (
  playerid: number,
  x: number,
  y: number,
  text: string
): number => {
  return samp.callNative("CreatePlayerTextDraw", "iffs", playerid, x, y, text);
};

export const PlayerTextDrawDestroy = (playerid: number, text: number): void => {
  samp.callNative("PlayerTextDrawDestroy", "ii", playerid, text);
};

export const PlayerTextDrawLetterSize = (
  playerid: number,
  text: number,
  x: number,
  y: number
): number => {
  return samp.callNative(
    "PlayerTextDrawLetterSize",
    "iiff",
    playerid,
    text,
    x,
    y
  );
};

export const PlayerTextDrawTextSize = (
  playerid: number,
  text: number,
  x: number,
  y: number
): number => {
  return samp.callNative(
    "PlayerTextDrawTextSize",
    "iiff",
    playerid,
    text,
    x,
    y
  );
};

export const PlayerTextDrawAlignment = (
  playerid: number,
  text: number,
  alignment: TextDrawAlignEnum
): number => {
  return samp.callNative(
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
  color: string
): number => {
  return samp.callNative(
    "PlayerTextDrawColor",
    "iii",
    playerid,
    text,
    rgba(color)
  );
};

export const PlayerTextDrawUseBox = (
  playerid: number,
  text: number,
  use: 0 | 1
): number => {
  return samp.callNative("PlayerTextDrawUseBox", "iii", playerid, text, use);
};

export const PlayerTextDrawBoxColor = (
  playerid: number,
  text: number,
  color: string
): number => {
  return samp.callNative(
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
  return samp.callNative(
    "PlayerTextDrawSetShadow",
    "iii",
    playerid,
    text,
    size
  );
};

export const PlayerTextDrawSetOutline = (
  playerid: number,
  text: number,
  size: number
): number => {
  return samp.callNative(
    "PlayerTextDrawSetOutline",
    "iii",
    playerid,
    text,
    size
  );
};

export const PlayerTextDrawBackgroundColor = (
  playerid: number,
  text: number,
  color: string
): number => {
  return samp.callNative(
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
  return samp.callNative("PlayerTextDrawFont", "iii", playerid, text, font);
};

export const PlayerTextDrawSetProportional = (
  playerid: number,
  text: number,
  set: number
): number => {
  return samp.callNative(
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
  set: number
): number => {
  return samp.callNative(
    "PlayerTextDrawSetSelectable",
    "iii",
    playerid,
    text,
    set
  );
};

export const PlayerTextDrawShow = (playerid: number, text: number): number => {
  return samp.callNative("PlayerTextDrawShow", "ii", playerid, text);
};

export const PlayerTextDrawHide = (playerid: number, text: number): number => {
  return samp.callNative("PlayerTextDrawHide", "ii", playerid, text);
};

export const PlayerTextDrawSetString = (
  playerid: number,
  text: number,
  string: string
): number => {
  return samp.callNative(
    "PlayerTextDrawSetString",
    "iis",
    playerid,
    text,
    string
  );
};

export const PlayerTextDrawSetPreviewModel = (
  playerid: number,
  text: number,
  modelindex: number
): number => {
  return samp.callNative(
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
  return samp.callNative(
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
  color1: number,
  color2: number
): number => {
  return samp.callNative(
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
  color: string,
  drawdistance: number,
  expiretime: number
): number => {
  return samp.callNative(
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
  return samp.callNative(
    "PutPlayerInVehicle",
    "iii",
    playerid,
    vehicleid,
    seatid
  );
};

export const GetPlayerVehicleID = (playerid: number): number => {
  return samp.callNative("GetPlayerVehicleID", "i", playerid);
};

export const GetPlayerVehicleSeat = (playerid: number): number => {
  return samp.callNative("GetPlayerVehicleSeat", "i", playerid);
};

export const RemovePlayerFromVehicle = (playerid: number): number => {
  return samp.callNative("RemovePlayerFromVehicle", "i", playerid);
};

export const TogglePlayerControllable = (
  playerid: number,
  toggle: number
): number => {
  return samp.callNative("TogglePlayerControllable", "ii", playerid, toggle);
};

export const PlayerPlaySound = (
  playerid: number,
  soundid: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative(
    "PlayerPlaySound",
    "iifff",
    playerid,
    soundid,
    x,
    y,
    z
  );
};

export const ApplyAnimation = (
  playerid: number,
  animlib: string,
  animname: string,
  fDelta: number,
  loop: number,
  lockx: number,
  locky: number,
  freeze: number,
  time: number,
  forcesync: number
): number => {
  return samp.callNative(
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
  forcesync: number
): number => {
  return samp.callNative("ClearAnimations", "ii", playerid, forcesync);
};

export const GetPlayerAnimationIndex = (playerid: number): number => {
  return samp.callNative("GetPlayerAnimationIndex", "i", playerid);
};

export const GetAnimationName = (
  index: number,
  len1: number,
  len2: number
): Array<any> => {
  return samp.callNative("GetAnimationName", "iSiSi", index, len1, len2);
};

export const GetPlayerSpecialAction = (playerid: number): number => {
  return samp.callNative("GetPlayerSpecialAction", "i", playerid);
};

export const SetPlayerSpecialAction = (
  playerid: number,
  actionid: number
): number => {
  return samp.callNative("SetPlayerSpecialAction", "ii", playerid, actionid);
};

export const DisableRemoteVehicleCollisions = (
  playerid: number,
  disable: number
): number => {
  return samp.callNative(
    "DisableRemoteVehicleCollisions",
    "ii",
    playerid,
    disable
  );
};

export const SetPlayerCheckpoint = (
  playerid: number,
  x: number,
  y: number,
  z: number,
  size: number
): number => {
  return samp.callNative(
    "SetPlayerCheckpoint",
    "iffff",
    playerid,
    x,
    y,
    z,
    size
  );
};

export const DisablePlayerCheckpoint = (playerid: number): number => {
  return samp.callNative("DisablePlayerCheckpoint", "i", playerid);
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
  return samp.callNative(
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
  return samp.callNative("DisablePlayerRaceCheckpoint", "i", playerid);
};

export const SetPlayerWorldBounds = (
  playerid: number,
  x_max: number,
  x_min: number,
  y_max: number,
  y_min: number
): number => {
  return samp.callNative(
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
  color: string
): number => {
  return samp.callNative(
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
  show: number
): number => {
  return samp.callNative(
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
  color: string,
  style: number
): number => {
  return samp.callNative(
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
  return samp.callNative("RemovePlayerMapIcon", "ii", playerid, iconid);
};

export const AllowPlayerTeleport = (
  playerid: number,
  allow: boolean
): number => {
  return samp.callNative("AllowPlayerTeleport", "ii", playerid, allow);
};

export const SetPlayerCameraPos = (
  playerid: number,
  x: number,
  y: number,
  z: number
): number => {
  return samp.callNative("SetPlayerCameraPos", "ifff", playerid, x, y, z);
};

export const SetPlayerCameraLookAt = (
  playerid: number,
  x: number,
  y: number,
  z: number,
  cut: number
): number => {
  return samp.callNative(
    "SetPlayerCameraLookAt",
    "ifffi",
    playerid,
    x,
    y,
    z,
    cut
  );
};

export const SetCameraBehindPlayer = (playerid: number): number => {
  return samp.callNative("SetCameraBehindPlayer", "i", playerid);
};

export const GetPlayerCameraPos = (playerid: number): Array<any> => {
  return samp.callNative("GetPlayerCameraPos", "iFFF", playerid);
};

export const GetPlayerCameraFrontVector = (playerid: number): Array<any> => {
  return samp.callNative("GetPlayerCameraFrontVector", "iFFF", playerid);
};

export const GetPlayerCameraMode = (playerid: number): number => {
  return samp.callNative("GetPlayerCameraMode", "i", playerid);
};

export const EnablePlayerCameraTarget = (
  playerid: number,
  enable: boolean
): number => {
  return samp.callNative("EnablePlayerCameraTarget", "ii", playerid, enable);
};

export const GetPlayerCameraTargetObject = (playerid: number): number => {
  return samp.callNative("GetPlayerCameraTargetObject", "i", playerid);
};

export const GetPlayerCameraTargetVehicle = (playerid: number): number => {
  return samp.callNative("GetPlayerCameraTargetVehicle", "i", playerid);
};

export const GetPlayerCameraTargetPlayer = (playerid: number): number => {
  return samp.callNative("GetPlayerCameraTargetPlayer", "i", playerid);
};

export const GetPlayerCameraTargetActor = (playerid: number): number => {
  return samp.callNative("GetPlayerCameraTargetActor", "i", playerid);
};

export const GetPlayerCameraAspectRatio = (playerid: number): number => {
  return samp.callNativeFloat("GetPlayerCameraAspectRatio", "i", playerid);
};

export const GetPlayerCameraZoom = (playerid: number): number => {
  return samp.callNativeFloat("GetPlayerCameraZoom", "i", playerid);
};

export const AttachCameraToObject = (
  playerid: number,
  objectid: number
): number => {
  return samp.callNative("AttachCameraToObject", "ii", playerid, objectid);
};

export const AttachCameraToPlayerObject = (
  playerid: number,
  playerobjectid: number
): number => {
  return samp.callNative(
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
  cut: number
): number => {
  return samp.callNative(
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
  cut: number
): number => {
  return samp.callNative(
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

export const IsPlayerConnected = (playerid: number): number => {
  return samp.callNative("IsPlayerConnected", "i", playerid);
};

export const IsPlayerInVehicle = (
  playerid: number,
  vehicleid: number
): number => {
  return samp.callNative("IsPlayerInVehicle", "ii", playerid, vehicleid);
};

export const IsPlayerInAnyVehicle = (playerid: number): number => {
  return samp.callNative("IsPlayerInAnyVehicle", "i", playerid);
};

export const IsPlayerInCheckpoint = (playerid: number): number => {
  return samp.callNative("IsPlayerInCheckpoint", "i", playerid);
};

export const IsPlayerInRaceCheckpoint = (playerid: number): number => {
  return samp.callNative("IsPlayerInRaceCheckpoint", "i", playerid);
};

export const SetPlayerVirtualWorld = (
  playerid: number,
  worldid: number
): number => {
  return samp.callNative("SetPlayerVirtualWorld", "ii", playerid, worldid);
};

export const GetPlayerVirtualWorld = (playerid: number): number => {
  return samp.callNative("GetPlayerVirtualWorld", "i", playerid);
};

export const EnableStuntBonusForPlayer = (
  playerid: number,
  enable: boolean
): number => {
  return samp.callNative("EnableStuntBonusForPlayer", "ii", playerid, enable);
};

export const EnableStuntBonusForAll = (enable: boolean): number => {
  return samp.callNative("EnableStuntBonusForAll", "i", enable);
};

export const TogglePlayerSpectating = (
  playerid: number,
  toggle: number
): number => {
  return samp.callNative("TogglePlayerSpectating", "ii", playerid, toggle);
};

export const PlayerSpectatePlayer = (
  playerid: number,
  targetplayerid: number,
  mode: number
): number => {
  return samp.callNative(
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
  mode: number
): number => {
  return samp.callNative(
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
  return samp.callNative(
    "StartRecordingPlayerData",
    "iis",
    playerid,
    recordtype,
    recordname
  );
};

export const StopRecordingPlayerData = (playerid: number): number => {
  return samp.callNative("StopRecordingPlayerData", "i", playerid);
};

export const SelectTextDraw = (
  playerid: number,
  hovercolor: string
): number => {
  return samp.callNative("SelectTextDraw", "ii", playerid, rgba(hovercolor));
};

export const CancelSelectTextDraw = (playerid: number): number => {
  return samp.callNative("CancelSelectTextDraw", "i", playerid);
};

export const CreateExplosionForPlayer = (
  playerid: number,
  X: number,
  Y: number,
  Z: number,
  type: number,
  Radius: number
): number => {
  return samp.callNative(
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
  return samp.callNative(
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
  color1: number,
  color2: number,
  respawn_delay: number,
  addsiren: number
): number => {
  return samp.callNative(
    "CreateVehicle",
    "iffffiiii",
    vehicletype,
    x,
    y,
    z,
    rotation,
    color1,
    color2,
    respawn_delay,
    addsiren
  );
};

export const DestroyVehicle = (vehicleid: number): number => {
  return samp.callNative("DestroyVehicle", "i", vehicleid);
};

export const IsVehicleStreamedIn = (
  vehicleid: number,
  forplayerid: number
): number => {
  return samp.callNative("IsVehicleStreamedIn", "ii", vehicleid, forplayerid);
};

export const GetVehiclePos = (vehicleid: number) => {
  const values = samp.callNative("GetVehiclePos", "iFFF", vehicleid);
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
  return samp.callNative("SetVehiclePos", "ifff", vehicleid, x, y, z);
};

export const GetVehicleZAngle = (vehicleid: number): number => {
  return samp.callNative("GetVehicleZAngle", "iF", vehicleid);
};

export const GetVehicleRotationQuat = (vehicleid: number): Array<any> => {
  return samp.callNative("GetVehicleRotationQuat", "iFFFF", vehicleid);
};

export const GetVehicleDistanceFromPoint = (
  vehicleid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNativeFloat(
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
  return samp.callNative("SetVehicleZAngle", "if", vehicleid, z_angle);
};

export const SetVehicleParamsForPlayer = (
  vehicleid: number,
  playerid: number,
  objective: number,
  doorslocked: number
): number => {
  return samp.callNative(
    "SetVehicleParamsForPlayer",
    "iiii",
    vehicleid,
    playerid,
    objective,
    doorslocked
  );
};

export const ManualVehicleEngineAndLights = (): number => {
  return samp.callNative("ManualVehicleEngineAndLights", "");
};

export const SetVehicleParamsEx = (
  vehicleid: number,
  engine: number,
  lights: number,
  alarm: number,
  doors: number,
  bonnet: number,
  boot: number,
  objective: number
): number => {
  return samp.callNative(
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

export const GetVehicleParamsEx = (vehicleid: number): Array<any> => {
  return samp.callNative("GetVehicleParamsEx", "iIIIIIII", vehicleid);
};

export const GetVehicleParamsSirenState = (vehicleid: number): number => {
  return samp.callNative("GetVehicleParamsSirenState", "i", vehicleid);
};

export const SetVehicleParamsCarDoors = (
  vehicleid: number,
  driver: number,
  passenger: number,
  backleft: number,
  backright: number
): number => {
  return samp.callNative(
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
  const values = samp.callNative(
    "GetVehicleParamsCarDoors",
    "iIIII",
    vehicleid
  );
  return {
    driver: values[0],
    passenger: values[1],
    backleft: values[2],
    backright: values[3],
  };
};

export const SetVehicleParamsCarWindows = (
  vehicleid: number,
  driver: number,
  passenger: number,
  backleft: number,
  backright: number
): number => {
  return samp.callNative(
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
  const values = samp.callNative(
    "GetVehicleParamsCarWindows",
    "iIIII",
    vehicleid
  );
  return {
    driver: values[0],
    passenger: values[1],
    backleft: values[2],
    backright: values[3],
  };
};

export const SetVehicleToRespawn = (vehicleid: number): number => {
  return samp.callNative("SetVehicleToRespawn", "i", vehicleid);
};

export const LinkVehicleToInterior = (
  vehicleid: number,
  interiorid: number
): number => {
  return samp.callNative("LinkVehicleToInterior", "ii", vehicleid, interiorid);
};

export const AddVehicleComponent = (
  vehicleid: number,
  componentid: number
): number => {
  return samp.callNative("AddVehicleComponent", "ii", vehicleid, componentid);
};

export const RemoveVehicleComponent = (
  vehicleid: number,
  componentid: number
): number => {
  return samp.callNative(
    "RemoveVehicleComponent",
    "ii",
    vehicleid,
    componentid
  );
};

export const ChangeVehicleColor = (
  vehicleid: number,
  color1: number,
  color2: number
): number => {
  return samp.callNative(
    "ChangeVehicleColor",
    "iii",
    vehicleid,
    color1,
    color2
  );
};

export const ChangeVehiclePaintjob = (
  vehicleid: number,
  paintjobid: number
): number => {
  return samp.callNative("ChangeVehiclePaintjob", "ii", vehicleid, paintjobid);
};

export const SetVehicleHealth = (vehicleid: number, health: number): number => {
  return samp.callNative("SetVehicleHealth", "if", vehicleid, health);
};

export const GetVehicleHealth = (vehicleid: number): number => {
  return samp.callNative("GetVehicleHealth", "iF", vehicleid);
};

export const AttachTrailerToVehicle = (
  trailerid: number,
  vehicleid: number
): number => {
  return samp.callNative("AttachTrailerToVehicle", "ii", trailerid, vehicleid);
};

export const DetachTrailerFromVehicle = (vehicleid: number): number => {
  return samp.callNative("DetachTrailerFromVehicle", "i", vehicleid);
};

export const IsTrailerAttachedToVehicle = (vehicleid: number): number => {
  return samp.callNative("IsTrailerAttachedToVehicle", "i", vehicleid);
};

export const GetVehicleTrailer = (vehicleid: number): number => {
  return samp.callNative("GetVehicleTrailer", "i", vehicleid);
};

export const SetVehicleNumberPlate = (
  vehicleid: number,
  numberplate: string
): number => {
  return samp.callNative("SetVehicleNumberPlate", "is", vehicleid, numberplate);
};

export const GetVehicleModel = (vehicleid: number): number => {
  return samp.callNative("GetVehicleModel", "i", vehicleid);
};

export const GetVehicleComponentInSlot = (
  vehicleid: number,
  slot: CarModTypeEnum
): number => {
  return samp.callNative("GetVehicleComponentInSlot", "ii", vehicleid, slot);
};

export const GetVehicleComponentType = (
  component: number
): CarModTypeEnum | -1 => {
  return samp.callNative("GetVehicleComponentType", "i", component);
};

export const RepairVehicle = (vehicleid: number): number => {
  return samp.callNative("RepairVehicle", "i", vehicleid);
};

export const GetVehicleVelocity = (vehicleid: number): Array<any> => {
  return samp.callNative("GetVehicleVelocity", "iFFF", vehicleid);
};

export const SetVehicleVelocity = (
  vehicleid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNative("SetVehicleVelocity", "ifff", vehicleid, X, Y, Z);
};

export const SetVehicleAngularVelocity = (
  vehicleid: number,
  X: number,
  Y: number,
  Z: number
): number => {
  return samp.callNative(
    "SetVehicleAngularVelocity",
    "ifff",
    vehicleid,
    X,
    Y,
    Z
  );
};

export const GetVehicleDamageStatus = (vehicleid: number) => {
  const values = samp.callNative("GetVehicleDamageStatus", "iIIII", vehicleid);
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
  return samp.callNative(
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
  const values = samp.callNative(
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
  return samp.callNative("SetVehicleVirtualWorld", "ii", vehicleid, worldid);
};

export const GetVehicleVirtualWorld = (vehicleid: number): number => {
  return samp.callNative("GetVehicleVirtualWorld", "i", vehicleid);
};

export const IsValidVehicle = (vehicleid: number): number => {
  return samp.callNative("IsValidVehicle", "i", vehicleid);
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
