import { BitStream } from "raknet/bitStream";
import { SyncId, SyncReader, SyncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import { RakNetException } from "raknet/exceptions";
import type { IPacketListSync, IPassengerSync } from "raknet/interfaces";
import { WriteTuple } from "raknet/types";

@SyncId(PacketIdList.PassengerSync)
export class PassengerSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @SyncReader
  readSync() {
    const data: Partial<IPassengerSync> = {};

    if (this.bs.isIncoming()) {
      [
        data.vehicleId,
        data.driveBy,
        data.seatId,
        data.additionalKey,
        data.weaponId,
        data.playerHealth,
        data.playerArmour,
        data.lrKey,
        data.udKey,
        data.keys,
        data.position,
      ] = this.bs.readValue(
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.Bits, 2],
        [PacketRpcValueType.Bits, 6],
        [PacketRpcValueType.Bits, 2],
        [PacketRpcValueType.Bits, 6],
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.Float3],
      );
    } else {
      [
        data.playerId,
        data.vehicleId,
        data.driveBy,
        data.seatId,
        data.additionalKey,
        data.weaponId,
        data.playerHealth,
        data.playerArmour,
        data.lrKey,
        data.udKey,
        data.keys,
        data.position,
      ] = this.bs.readValue(
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.Bits, 2],
        [PacketRpcValueType.Bits, 6],
        [PacketRpcValueType.Bits, 2],
        [PacketRpcValueType.Bits, 6],
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.Float3],
      );
    }

    return data as IPassengerSync | null;
  }

  @SyncWriter
  writeSync(data: IPassengerSync) {
    const value: WriteTuple[] = [
      [PacketRpcValueType.UInt16, data.vehicleId],
      [PacketRpcValueType.Bits, data.driveBy, 2],
      [PacketRpcValueType.Bits, data.seatId, 6],
      [PacketRpcValueType.Bits, data.additionalKey, 2],
      [PacketRpcValueType.Bits, data.weaponId, 6],
      [PacketRpcValueType.UInt8, data.playerHealth],
      [PacketRpcValueType.UInt8, data.playerArmour],
      [PacketRpcValueType.UInt16, data.lrKey],
      [PacketRpcValueType.UInt16, data.udKey],
      [PacketRpcValueType.UInt16, data.keys],
      [PacketRpcValueType.Float3, data.position],
    ];
    if (!this.bs.isIncoming()) {
      if (typeof data.playerId === "undefined") {
        throw new RakNetException("playerId is required for outgoing PassengerSync");
      }
      value.unshift([PacketRpcValueType.UInt16, data.playerId]);
    }
    this.bs.writeValue(...value);
  }
}
