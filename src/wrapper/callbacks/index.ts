// Reference to Peter Szombati's samp-node-lib

import { BodyPartsEnum, WeaponEnum } from "@/enums";

export const OnGameModeInit = (func: () => void) => {
  samp.addEventListener("OnGameModeInit", func);
};

export const OnGameModeExit = (func: () => void) => {
  samp.addEventListener("OnGameModeExit", func);
};

export const OnFilterScriptInit = (func: () => void) => {
  samp.addEventListener("OnFilterScriptInit", func);
};

export const OnFilterScriptExit = (func: () => void) => {
  samp.addEventListener("OnFilterScriptExit", func);
};

export const OnPlayerConnect = (func: (playerid: number) => void) => {
  samp.addEventListener("OnPlayerConnect", func);
};

export const OnPlayerDisconnect = (
  func: (playerid: number, reason: number) => void
) => {
  samp.addEventListener("OnPlayerDisconnect", func);
};

export const OnPlayerSpawn = (func: (playerid: number) => void) => {
  samp.addEventListener("OnPlayerSpawn", func);
};

export const OnPlayerDeath = (
  func: (playerid: number, killerid: number, reason: number) => void
) => {
  samp.addEventListener("OnPlayerDeath", func);
};

export const OnVehicleSpawn = (func: (vehicleid: number) => void) => {
  samp.addEventListener("OnVehicleSpawn", func);
};

export const OnVehicleDeath = (
  func: (vehicleid: number, killer: number) => void
) => {
  samp.addEventListener("OnVehicleDeath", func);
};

export const OnPlayerRequestClass = (
  func: (playerid: number, classid: number) => void
) => {
  samp.addEventListener("OnPlayerRequestClass", func);
};

export const OnPlayerEnterVehicle = (
  func: (playerid: number, vehicleid: number, ispassenger: number) => void
) => {
  samp.addEventListener("OnPlayerEnterVehicle", func);
};

export const OnPlayerExitVehicle = (
  func: (playerid: number, vehicleid: number) => void
) => {
  samp.addEventListener("OnPlayerExitVehicle", func);
};

export const OnPlayerStateChange = (
  func: (playerid: number, newstate: number, oldstate: number) => void
) => {
  samp.addEventListener("OnPlayerStateChange", func);
};

export const OnPlayerEnterCheckpoint = (func: (playerid: number) => void) => {
  samp.addEventListener("OnPlayerEnterCheckpoint", func);
};

export const OnPlayerLeaveCheckpoint = (func: (playerid: number) => void) => {
  samp.addEventListener("OnPlayerLeaveCheckpoint", func);
};

export const OnPlayerEnterRaceCheckpoint = (
  func: (playerid: number) => void
) => {
  samp.addEventListener("OnPlayerEnterRaceCheckpoint", func);
};

export const OnPlayerLeaveRaceCheckpoint = (
  func: (playerid: number) => void
) => {
  samp.addEventListener("OnPlayerLeaveRaceCheckpoint", func);
};

export const OnPlayerRequestSpawn = (func: (playerid: number) => void) => {
  samp.addEventListener("OnPlayerRequestSpawn", func);
};

export const OnObjectMoved = (func: (objectid: number) => void) => {
  samp.addEventListener("OnObjectMoved", func);
};

export const OnPlayerObjectMoved = (
  func: (playerid: number, objectid: number) => void
) => {
  samp.addEventListener("OnPlayerObjectMoved", func);
};

export const OnPlayerPickUpPickup = (
  func: (playerid: number, pickupid: number) => void
) => {
  samp.addEventListener("OnPlayerPickUpPickup", func);
};

export const OnVehicleMod = (
  func: (playerid: number, vehicleid: number, componentid: number) => void
) => {
  samp.addEventListener("OnVehicleMod", func);
};

export const OnEnterExitModShop = (
  func: (playerid: number, enterexit: number, interiorid: number) => void
) => {
  samp.addEventListener("OnEnterExitModShop", func);
};

export const OnVehiclePaintjob = (
  func: (playerid: number, vehicleid: number, paintjobid: number) => void
) => {
  samp.addEventListener("OnVehiclePaintjob", func);
};

export const OnVehicleRespray = (
  func: (
    playerid: number,
    vehicleid: number,
    color1: number,
    color2: number
  ) => void
) => {
  samp.addEventListener("OnVehicleRespray", func);
};

export const OnVehicleDamageStatusUpdate = (
  func: (vehicleid: number, playerid: number) => void
) => {
  samp.addEventListener("OnVehicleDamageStatusUpdate", func);
};

export const OnUnoccupiedVehicleUpdate = (
  func: (
    vehicleid: number,
    playerid: number,
    passenger_seat: number,
    new_x: number,
    new_y: number,
    new_z: number,
    vel_x: number,
    vel_y: number,
    vel_z: number
  ) => void
) => {
  samp.addEventListener("OnUnoccupiedVehicleUpdate", func);
};

export const OnPlayerSelectedMenuRow = (
  func: (playerid: number, row: number) => void
) => {
  samp.addEventListener("OnPlayerSelectedMenuRow", func);
};

export const OnPlayerExitedMenu = (func: (playerid: number) => void) => {
  samp.addEventListener("OnPlayerExitedMenu", func);
};

export const OnPlayerInteriorChange = (
  func: (playerid: number, newinteriorid: number, oldinteriorid: number) => void
) => {
  samp.addEventListener("OnPlayerInteriorChange", func);
};

export const OnPlayerKeyStateChange = (
  func: (playerid: number, newkeys: number, oldkeys: number) => void
) => {
  samp.addEventListener("OnPlayerKeyStateChange", func);
};

export const OnPlayerUpdate = (func: (playerid: number) => void) => {
  samp.addEventListener("OnPlayerUpdate", func);
};

export const OnPlayerStreamIn = (
  func: (playerid: number, forplayerid: number) => void
) => {
  samp.addEventListener("OnPlayerStreamIn", func);
};

export const OnPlayerStreamOut = (
  func: (playerid: number, forplayerid: number) => void
) => {
  samp.addEventListener("OnPlayerStreamOut", func);
};

export const OnVehicleStreamIn = (
  func: (vehicleid: number, forplayerid: number) => void
) => {
  samp.addEventListener("OnVehicleStreamIn", func);
};

export const OnVehicleStreamOut = (
  func: (vehicleid: number, forplayerid: number) => void
) => {
  samp.addEventListener("OnVehicleStreamOut", func);
};

export const OnActorStreamIn = (
  func: (actorid: number, forplayerid: number) => void
) => {
  samp.addEventListener("OnActorStreamIn", func);
};

export const OnActorStreamOut = (
  func: (actorid: number, forplayerid: number) => void
) => {
  samp.addEventListener("OnActorStreamOut", func);
};

export const OnPlayerTakeDamage = (
  func: (
    playerid: number,
    issuerid: number,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ) => void
) => {
  samp.addEventListener("OnPlayerTakeDamage", func);
};

export const OnPlayerGiveDamage = (
  func: (
    playerid: number,
    damageid: number,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ) => void
) => {
  samp.addEventListener("OnPlayerGiveDamage", func);
};

export const OnPlayerGiveDamageActor = (
  func: (
    playerid: number,
    damaged_actorid: number,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ) => void
) => {
  samp.addEventListener("OnPlayerGiveDamageActor", func);
};

export const OnPlayerClickMap = (
  func: (playerid: number, fX: number, fY: number, fZ: number) => void
) => {
  samp.addEventListener("OnPlayerClickMap", func);
};

export const OnPlayerClickTextDraw = (
  func: (playerid: number, clickedid: number) => void
) => {
  samp.addEventListener("OnPlayerClickTextDraw", func);
};

export const OnPlayerClickPlayerTextDraw = (
  func: (playerid: number, playertextid: number) => void
) => {
  samp.addEventListener("OnPlayerClickPlayerTextDraw", func);
};

export const OnIncomingConnection = (
  func: (playerid: number, ip_address: string, port: number) => void
) => {
  samp.addEventListener("OnIncomingConnection", func);
};

export const OnTrailerUpdate = (
  func: (playerid: number, vehicleid: number) => void
) => {
  samp.addEventListener("OnTrailerUpdate", func);
};

export const OnVehicleSirenStateChange = (
  func: (playerid: number, vehicleid: number, newstate: number) => void
) => {
  samp.addEventListener("OnVehicleSirenStateChange", func);
};

export const OnPlayerFinishedDownloading = (
  func: (playerid: number, virtualworld: number) => void
) => {
  samp.addEventListener("OnPlayerFinishedDownloading", func);
};

export const OnPlayerRequestDownload = (
  func: (playerid: number, type: number, crc: any) => void
) => {
  samp.addEventListener("OnPlayerRequestDownload", func);
};

export const OnPlayerClickPlayer = (
  func: (playerid: number, clickedplayerid: number, source: number) => void
) => {
  samp.addEventListener("OnPlayerClickPlayer", func);
};

export const OnPlayerSelectObject = (
  func: (
    playerid: number,
    type: number,
    objectid: number,
    modelid: number,
    fX: number,
    fY: number,
    fZ: number
  ) => void
) => {
  samp.addEventListener("OnPlayerSelectObject", func);
};

export const OnPlayerWeaponShot = (
  func: (
    playerid: number,
    weaponid: WeaponEnum,
    hittype: number,
    hitid: number,
    fX: number,
    fY: number,
    fZ: number
  ) => void
) => {
  samp.addEventListener("OnPlayerWeaponShot", func);
};

export const OnClientCheckResponse = (
  func: (
    playerid: number,
    actionid: number,
    memaddr: number,
    retndata: number
  ) => void
) => {
  samp.addEventListener("OnClientCheckResponse", func);
};

export const OnScriptCash = (
  func: (playerid: number, amount: number, source: number) => void
) => {
  samp.addEventListener("OnScriptCash", func);
};

export const OnNPCEnterVehicle = (
  func: (vehicleid: number, seatid: number) => void
) => {
  samp.addEventListener("OnNPCEnterVehicle", func);
};

export const OnNPCExitVehicle = (func: () => void) => {
  samp.addEventListener("OnNPCExitVehicle", func);
};

export const OnNpcConnect = (func: (myplayerid: number) => void) => {
  samp.addEventListener("OnNpcConnect", func);
};

export const OnNpcDisconnect = (func: (reason: string) => void) => {
  samp.addEventListener("OnNpcDisconnect", func);
};

export const OnNPCModeInit = (func: () => void) => {
  samp.addEventListener("OnNPCModeInit", func);
};

export const OnNPCModeExit = (func: () => void) => {
  samp.addEventListener("OnNPCModeExit", func);
};

export const OnNPCSpawn = (func: () => void) => {
  samp.addEventListener("OnNPCSpawn", func);
};
