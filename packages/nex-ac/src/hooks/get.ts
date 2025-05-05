import { Player, Vehicle, InvalidEnum } from "@infernus/core";
import { ACInfo, ACVehInfo } from "../struct";

export function ac_AntiCheatGetSpeed(player: Player) {
  return ACInfo.get(player.id).acSpeed;
}

export function ac_AntiCheatGetAnimationIndex(player: Player) {
  return ACInfo.get(player.id).acAnim;
}

export function ac_AntiCheatGetDialog(player: Player) {
  return ACInfo.get(player.id).acDialog;
}

export function ac_AntiCheatGetInterior(player: Player) {
  return ACInfo.get(player.id).acInt;
}

export function ac_AntiCheatGetEnterVehicle(player: Player) {
  return ACInfo.get(player.id).acEnterVeh;
}

export function ac_AntiCheatGetEnterVehicleSeat(player: Player) {
  return ACInfo.get(player.id).acEnterSeat;
}

export function ac_AntiCheatGetVehicleID(player: Player) {
  return ACInfo.get(player.id).acVeh;
}

export function ac_AntiCheatGetVehicleSeat(player: Player) {
  return ACInfo.get(player.id).acSeat;
}

export function ac_AntiCheatGetWeapon(player: Player) {
  return ACInfo.get(player.id).acHoldWeapon;
}

export function ac_AntiCheatGetWeaponInSlot(player: Player, slot: number) {
  return ACInfo.get(player.id).acWeapon[slot];
}

export function ac_AntiCheatGetAmmoInSlot(player: Player, slot: number) {
  return ACInfo.get(player.id).acAmmo[slot];
}

export function ac_AntiCheatGetSpecAction(player: Player) {
  return ACInfo.get(player.id).acSpecAct;
}

export function ac_AntiCheatGetLastSpecAction(player: Player) {
  return ACInfo.get(player.id).acLastSpecAct;
}

export function ac_AntiCheatGetLastShotWeapon(player: Player) {
  return ACInfo.get(player.id).acShotWeapon;
}

export function ac_AntiCheatGetLastPickup(player: Player) {
  return ACInfo.get(player.id).acLastPickup;
}

export function ac_AntiCheatGetLastUpdateTime(player: Player) {
  return ACInfo.get(player.id).acUpdateTick;
}

export function ac_AntiCheatGetLastReloadTime(player: Player) {
  return ACInfo.get(player.id).acReloadTick;
}

export function ac_AntiCheatGetLastEnterVehTime(player: Player) {
  return ACInfo.get(player.id).acEnterVehTick;
}

export function ac_AntiCheatGetLastShotTime(player: Player) {
  return ACInfo.get(player.id).acShotTick;
}

export function ac_AntiCheatGetLastSpawnTime(player: Player) {
  return ACInfo.get(player.id).acSpawnTick;
}

export function ac_AntiCheatGetVehicleDriver(vehicleId: number) {
  return ACVehInfo.get(vehicleId).acDriver;
}

export function ac_AntiCheatGetVehicleInterior(vehicleId: number) {
  return ACVehInfo.get(vehicleId).acInt;
}

export function ac_AntiCheatGetVehiclePaintjob(vehicleId: number) {
  return ACVehInfo.get(vehicleId).acPaintJob;
}

export function ac_AntiCheatGetVehicleSpeed(vehicleId: number) {
  return ACVehInfo.get(vehicleId).acSpeed;
}

export function ac_AntiCheatGetNextDialog(player: Player) {
  return ACInfo.get(player.id).acNextDialog;
}

export function antiCheatGetSpeed(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetSpeed(player);
}

export function antiCheatGetAnimationIndex(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetAnimationIndex(player);
}

export function antiCheatGetDialog(player: Player) {
  if (!player.isConnected()) return -1;
  return ac_AntiCheatGetDialog(player);
}

export function antiCheatGetInterior(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetInterior(player);
}

export function antiCheatGetEnterVehicle(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetEnterVehicle(player);
}

export function antiCheatGetEnterVehicleSeat(player: Player) {
  if (!player.isConnected()) return -1;
  return ac_AntiCheatGetEnterVehicleSeat(player);
}

export function antiCheatGetVehicleID(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetVehicleID(player);
}

export function antiCheatGetVehicleSeat(player: Player) {
  if (!player.isConnected()) return -1;
  return ac_AntiCheatGetVehicleSeat(player);
}

export function antiCheatGetWeapon(player: Player) {
  if (!player.isConnected()) return -1;
  return ac_AntiCheatGetWeapon(player);
}

export function antiCheatGetWeaponInSlot(player: Player, slot: number) {
  if (!player.isConnected()) return -1;
  if (!(slot >= 0 && slot <= 12)) return -2;
  return ac_AntiCheatGetWeaponInSlot(player, slot);
}

export function antiCheatGetAmmoInSlot(player: Player, slot: number) {
  if (!player.isConnected()) return -1;
  if (!(slot >= 0 && slot <= 12)) return -2;
  return ac_AntiCheatGetAmmoInSlot(player, slot);
}

export function antiCheatGetSpecialAction(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetSpecAction(player);
}

export function antiCheatGetLastSpecialAction(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetLastSpecAction(player);
}

export function antiCheatGetLastShotWeapon(player: Player) {
  if (!player.isConnected()) return -1;
  return ac_AntiCheatGetLastShotWeapon(player);
}

export function antiCheatGetLastPickup(player: Player) {
  if (!player.isConnected()) return -1;
  return ac_AntiCheatGetLastPickup(player);
}

export function antiCheatGetLastUpdateTime(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetLastUpdateTime(player);
}

export function antiCheatGetLastReloadTime(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetLastReloadTime(player);
}

export function antiCheatGetLastEnteredVehTime(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetLastEnterVehTime(player);
}

export function antiCheatGetLastShotTime(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetLastShotTime(player);
}

export function antiCheatGetLastSpawnTime(player: Player) {
  if (!player.isConnected()) return 0;
  return ac_AntiCheatGetLastSpawnTime(player);
}

export function antiCheatGetVehicleDriver(vehicleId: number) {
  const veh = Vehicle.getInstance(vehicleId);
  if (!veh || veh.getModel() <= 0) return InvalidEnum.PLAYER_ID;
  return ac_AntiCheatGetVehicleDriver(vehicleId);
}

export function antiCheatGetVehicleInterior(vehicleId: number) {
  const veh = Vehicle.getInstance(vehicleId);
  if (!veh || veh.getModel() <= 0) return 0;
  return ac_AntiCheatGetVehicleInterior(vehicleId);
}

export function antiCheatGetVehiclePaintjob(vehicleId: number) {
  const veh = Vehicle.getInstance(vehicleId);
  if (!veh || veh.getModel() <= 0) return 3;
  return ac_AntiCheatGetVehiclePaintjob(vehicleId);
}

export function antiCheatGetVehicleSpeed(vehicleId: number) {
  const veh = Vehicle.getInstance(vehicleId);
  if (!veh || veh.getModel() <= 0) return false;
  return ac_AntiCheatGetVehicleSpeed(vehicleId);
}
