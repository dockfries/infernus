import { Player, Vehicle } from "@infernus/core";
import {
  BitStream,
  PacketRpcPriority,
  PacketRpcReliability,
  PacketRpcValueType,
} from "@infernus/raknet";
import {
  ac_EnableAntiCheat,
  ac_EnableAntiNOP,
  ac_EnableAntiCheatForPlayer,
  ac_EnableAntiNOPForPlayer,
} from "../hooks";

const AC_RPC_SetVehiclePos = 159;
const AC_RPC_SetVehicleZAngle = 160;

export function setVehicleFakePosForPlayer(
  player: Player,
  vehicle: Vehicle,
  x: number,
  y: number,
  z: number,
) {
  if (!player.isConnected() || vehicle.getModel() <= 0) return 0;
  const bs = new BitStream();
  bs.writeValue(
    [PacketRpcValueType.UInt16, vehicle.id],
    [PacketRpcValueType.Float, x],
    [PacketRpcValueType.Float, y],
    [PacketRpcValueType.Float, z],
  );
  bs.sendRPC(
    player,
    AC_RPC_SetVehiclePos,
    PacketRpcPriority.High,
    PacketRpcReliability.ReliableOrdered, // ReliableSequenced
    4,
  );
  bs.delete();
  return 1;
}

export function setVehicleFakeZAngleForPlayer(
  player: Player,
  vehicle: Vehicle,
  zAngle: number,
) {
  if (!player.isConnected() || vehicle.getModel() <= 0) return 0;
  const bs = new BitStream();
  bs.writeValue(
    [PacketRpcValueType.UInt16, vehicle.id],
    [PacketRpcValueType.Float, zAngle],
  );
  bs.sendRPC(
    player,
    AC_RPC_SetVehicleZAngle,
    PacketRpcPriority.High,
    PacketRpcReliability.ReliableOrdered, // ReliableSequenced
    4,
  );
  bs.delete();
  return 1;
}

export function enableAntiCheat(code: number, enable: boolean) {
  return ac_EnableAntiCheat(code, enable);
}

export function enableAntiNOP(nopCode: number, enable: boolean) {
  return ac_EnableAntiNOP(nopCode, enable);
}

export function enableAntiCheatForPlayer(
  player: Player,
  code: number,
  enable: boolean,
) {
  if (!player.isConnected()) return 0;
  return ac_EnableAntiCheatForPlayer(player, code, enable);
}

export function enableAntiNOPForPlayer(
  player: Player,
  nopCode: number,
  enable: boolean,
) {
  if (!player.isConnected()) return 0;
  return ac_EnableAntiNOPForPlayer(player, nopCode, enable);
}
