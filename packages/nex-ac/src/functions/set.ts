import { Player, Vehicle } from "@infernus/core";
import {
  BitStream,
  PacketRpcPriority,
  PacketRpcReliability,
  PacketRpcValueType,
} from "@infernus/raknet";

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
