import { BitStream } from "raknet/bitStream";
import { SyncId, SyncReader, SyncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import { RakNetException } from "raknet/exceptions";
import type { IPacketListSync, IUnoccupiedSync } from "raknet/interfaces";

@SyncId(PacketIdList.UnoccupiedSync)
export class UnoccupiedSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @SyncReader
  readSync() {
    const data: Partial<IUnoccupiedSync> = {};

    if (this.bs.isIncoming()) {
      [
        data.vehicleId,
        data.seatId,
        data.roll,
        data.direction,
        data.position,
        data.velocity,
        data.angularVelocity,
        data.vehicleHealth,
      ] = this.bs.readValue(
        PacketRpcValueType.UInt16,
        PacketRpcValueType.UInt8,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float,
      ) as any;
    } else {
      [
        data.playerId,
        data.vehicleId,
        data.seatId,
        data.roll,
        data.direction,
        data.position,
        data.velocity,
        data.angularVelocity,
        data.vehicleHealth,
      ] = this.bs.readValue(
        PacketRpcValueType.UInt16,
        PacketRpcValueType.UInt16,
        PacketRpcValueType.UInt8,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float,
      ) as any;
    }

    return data as IUnoccupiedSync | null;
  }

  @SyncWriter
  writeSync(data: IUnoccupiedSync) {
    const value = [
      [PacketRpcValueType.UInt16, data.vehicleId],
      [PacketRpcValueType.UInt8, data.seatId],
      [PacketRpcValueType.Float3, data.roll],
      [PacketRpcValueType.Float3, data.direction],
      [PacketRpcValueType.Float3, data.position],
      [PacketRpcValueType.Float3, data.velocity],
      [PacketRpcValueType.Float3, data.angularVelocity],
      [PacketRpcValueType.Float, data.vehicleHealth],
    ] as any;
    if (!this.bs.isIncoming()) {
      if (typeof data.playerId === "undefined") {
        throw new RakNetException("playerId is required for outgoing UnoccupiedSync");
      }
      value.unshift([PacketRpcValueType.UInt16, data.playerId]);
    }
    this.bs.writeValue(...value);
  }
}
