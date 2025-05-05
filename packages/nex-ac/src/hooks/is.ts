import { Player, Vehicle } from "@infernus/core";
import { ac_ACAllow, ac_NOPAllow } from "../constants";
import { ACInfo, ACVehInfo } from "../struct";

export function ac_AntiCheatIsKickedWithDesync(player: Player) {
  return ACInfo.get(player.id).acKicked;
}

export function ac_AntiCheatIsVehicleSpawned(vehicleId: number) {
  return ACVehInfo.get(vehicleId).acSpawned;
}

export function ac_IsAntiCheatEnabled(code: number) {
  if (!(code >= 0 && code < ac_ACAllow.length)) return false;
  return ac_ACAllow[code];
}

export function ac_IsAntiNOPEnabled(nopCode: number) {
  if (!(nopCode >= 0 && nopCode < ac_NOPAllow.length)) return false;
  return ac_NOPAllow[nopCode];
}

export function ac_IsAntiCheatEnabledForPlayer(player: Player, code: number) {
  if (!(code >= 0 && code < ac_ACAllow.length)) return false;
  return ACInfo.get(player.id).acACAllow[code];
}

export function ac_IsAntiNOPEnabledForPlayer(player: Player, nopCode: number) {
  if (!(nopCode >= 0 && nopCode < ac_NOPAllow.length)) return false;
  return ACInfo.get(player.id).acNOPAllow[nopCode];
}

export function ac_AntiCheatIntEntExitIsEnabled(player: Player) {
  return ACInfo.get(player.id).acIntEnterExits;
}

export function ac_AntiCheatStuntBonusIsEnabled(player: Player) {
  return ACInfo.get(player.id).acStuntBonus;
}

export function ac_AntiCheatIsInModShop(player: Player) {
  return ACInfo.get(player.id).acModShop;
}

export function ac_AntiCheatIsInSpectate(player: Player) {
  return ACInfo.get(player.id).acSpec;
}

export function ac_AntiCheatIsFrozen(player: Player) {
  return !ACInfo.get(player.id).acUnFrozen;
}

export function ac_AntiCheatIsDead(player: Player) {
  return ACInfo.get(player.id).acDead;
}

export function ac_AntiCheatIsConnected(player: Player) {
  return ACInfo.get(player.id).acOnline;
}

export function isAntiCheatEnabled(code: number) {
  return ac_IsAntiCheatEnabled(code);
}

export function isAntiNOPEnabled(nopCode: number) {
  return ac_IsAntiNOPEnabled(nopCode);
}

export function isAntiCheatEnabledForPlayer(player: Player, code: number) {
  if (!player.isConnected()) return false;
  return ac_IsAntiCheatEnabledForPlayer(player, code);
}

export function isAntiNOPEnabledForPlayer(player: Player, nopCode: number) {
  if (!player.isConnected()) return false;
  return ac_IsAntiNOPEnabledForPlayer(player, nopCode);
}

export function antiCheatIntEnterExitsIsEnabled(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatIntEntExitIsEnabled(player);
}

export function antiCheatStuntBonusIsEnabled(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatStuntBonusIsEnabled(player);
}

export function antiCheatIsInModShop(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatIsInModShop(player);
}

export function antiCheatIsInSpectate(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatIsInSpectate(player);
}

export function antiCheatIsFrozen(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatIsFrozen(player);
}

export function antiCheatIsDead(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatIsDead(player);
}

export function antiCheatIsConnected(player: Player) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatIsConnected(player);
}

export function antiCheatIsKickedWithDesync(player: Player) {
  if (!player.isConnected()) return 3;
  return ac_AntiCheatIsKickedWithDesync(player);
}

export function antiCheatIsVehicleSpawned(vehicleId: number) {
  const veh = Vehicle.getInstance(vehicleId);
  if (!veh || veh.getModel() <= 0) return false;
  return ac_AntiCheatIsVehicleSpawned(vehicleId);
}
