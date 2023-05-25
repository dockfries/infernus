import { BitStream } from "raknet/bitStream";
import { syncId, syncReader, syncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import type { IPacketListSync, IPassengerSync } from "raknet/interfaces";

@syncId(PacketIdList.PassengerSync)
export class PassengerSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @syncReader
  readSync() {
    const data: Partial<IPassengerSync> = {};
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
      PacketRpcValueType.UInt16,
      [PacketRpcValueType.Bits, 2],
      [PacketRpcValueType.Bits, 6],
      [PacketRpcValueType.Bits, 2],
      [PacketRpcValueType.Bits, 6],
      PacketRpcValueType.UInt8,
      PacketRpcValueType.UInt8,
      PacketRpcValueType.UInt16,
      PacketRpcValueType.UInt16,
      PacketRpcValueType.UInt16,
      PacketRpcValueType.Float3
    ) as any;
    return data as IPassengerSync | null;
  }

  @syncWriter
  writeSync(data: IPassengerSync) {
    this.bs.writeValue(
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
      [PacketRpcValueType.Float3, data.position]
    );
  }
}
