import { GameMode, Player, Vehicle } from "@infernus/core";
import { ac_MaxPassengers } from "../constants";
import { ac_IsValidVehicleModel } from "./is";
import { ACInfo, ACVehInfo } from "../struct";

export function antiCheatGetHealth(player: Player) {
  if (!player.isConnected()) return 0;
  return ACInfo.get(player.id).acHealth;
}

export function antiCheatGetArmour(player: Player) {
  if (!player.isConnected()) return 0;
  return ACInfo.get(player.id).acArmour;
}

export function antiCheatGetWeaponData(player: Player, slot: number) {
  if (!player.isConnected()) return { weapons: null, ammo: null, ret: 0 };
  if (!(slot >= 0 && slot <= 12)) return { weapons: null, ammo: null, ret: -1 };
  const weapons = ACInfo.get(player.id).acWeapon[slot];
  const ammo = ACInfo.get(player.id).acAmmo[slot];
  return { weapons, ammo, ret: 1 };
}

export function antiCheatGetPos(player: Player) {
  if (!player.isConnected()) return { x: 0, y: 0, z: 0, ret: false };
  const x = ACInfo.get(player.id).acPosX;
  const y = ACInfo.get(player.id).acPosY;
  const z = ACInfo.get(player.id).acPosZ;
  return { x, y, z, ret: true };
}

export function antiCheatGetSpawnPos(player: Player) {
  if (!player.isConnected()) return { x: 0, y: 0, z: 0, ret: false };
  const x = ACInfo.get(player.id).acSpawnPosX;
  const y = ACInfo.get(player.id).acSpawnPosY;
  const z = ACInfo.get(player.id).acSpawnPosZ;
  return { x, y, z, ret: true };
}

export function antiCheatGetSpawnWeapon(player: Player) {
  if (!player.isConnected()) {
    return {
      weapon1: 0,
      weapon1_ammo: 0,
      weapon2: 0,
      weapon2_ammo: 0,
      weapon3: 0,
      weapon3_ammo: 0,
      result: false,
    };
  }
  const weapon1 = ACInfo.get(player.id).acSpawnWeapon1;
  const weapon1_ammo = ACInfo.get(player.id).acSpawnAmmo1;
  const weapon2 = ACInfo.get(player.id).acSpawnWeapon2;
  const weapon2_ammo = ACInfo.get(player.id).acSpawnAmmo2;
  const weapon3 = ACInfo.get(player.id).acSpawnWeapon3;
  const weapon3_ammo = ACInfo.get(player.id).acSpawnAmmo3;
  return {
    weapon1,
    weapon1_ammo,
    weapon2,
    weapon2_ammo,
    weapon3,
    weapon3_ammo,
    result: true,
  };
}

export function antiCheatGetVehicleHealth(vehicle: Vehicle) {
  if (vehicle.getModel() <= 0) return 0;
  return ACVehInfo.get(vehicle.id).acHealth;
}

export function antiCheatGetVehiclePos(vehicle: Vehicle) {
  if (vehicle.getModel() <= 0) {
    return {
      x: 0,
      y: 0,
      z: 0,
      result: false,
    };
  }
  const x = ACVehInfo.get(vehicle.id).acPosX;
  const y = ACVehInfo.get(vehicle.id).acPosY;
  const z = ACVehInfo.get(vehicle.id).acPosZ;
  return { x, y, z, ret: true };
}

export function antiCheatGetVehicleVelocity(vehicle: Vehicle) {
  if (vehicle.getModel() <= 0) {
    return {
      x: 0,
      y: 0,
      z: 0,
      result: false,
    };
  }
  const x = ACVehInfo.get(vehicle.id).acVelX;
  const y = ACVehInfo.get(vehicle.id).acVelY;
  const z = ACVehInfo.get(vehicle.id).acVelZ;
  return {
    x,
    y,
    z,
    result: true,
  };
}

export function antiCheatGetVehicleZAngle(vehicle: Vehicle) {
  if (vehicle.getModel() <= 0) return 0;
  return ACVehInfo.get(vehicle.id).acZAngle;
}

export function antiCheatGetVehicleSpawnPos(vehicle: Vehicle) {
  if (vehicle.getModel() <= 0) {
    return {
      x: 0,
      y: 0,
      z: 0,
      result: false,
    };
  }
  const x = ACVehInfo.get(vehicle.id).acSpawnPosX;
  const y = ACVehInfo.get(vehicle.id).acSpawnPosY;
  const z = ACVehInfo.get(vehicle.id).acSpawnPosZ;
  return {
    x,
    y,
    z,
    result: true,
  };
}

export function antiCheatGetVehicleSpawnZAngle(vehicle: Vehicle) {
  if (vehicle.getModel() <= 0) return 0;
  return ACVehInfo.get(vehicle.id).acSpawnZAngle;
}

export function ac_GetMaxPassengers(modelId: number) {
  if (ac_IsValidVehicleModel(modelId)) {
    modelId -= 400;
    return (ac_MaxPassengers[modelId >>> 3] >>> ((modelId & 7) << 2)) & 0xf;
  }
  return 0xf;
}

export function ac_GetVectorDist(ac_x: number, ac_y: number, ac_z = 0.0) {
  return GameMode.vectorSize(ac_x, ac_y, ac_z);
}

export function ac_GetSpeed(ac_x: number, ac_y: number, ac_z: number = 0.0) {
  return Math.round(GameMode.vectorSize(ac_x, ac_y, ac_z) * 179.28625);
}
