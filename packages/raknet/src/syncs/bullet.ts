import { BitStream } from "raknet/bitStream";
import { syncId, syncReader, syncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import type { IBulletSync, IPacketListSync } from "raknet/interfaces";

@syncId(PacketIdList.BulletSync)
export class BulletSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @syncReader
  readSync() {
    const data: Partial<IBulletSync> = {};
    [
      data.fromId,
      data.hitType,
      data.hitId,
      data.origin,
      data.hitPos,
      data.offsets,
      data.weaponId,
    ] = this.bs.readValue(
      PacketRpcValueType.UInt16,
      PacketRpcValueType.UInt8,
      PacketRpcValueType.UInt16,
      PacketRpcValueType.Float3,
      PacketRpcValueType.Float3,
      PacketRpcValueType.Float3,
      PacketRpcValueType.UInt8
    ) as any;
    return data as IBulletSync | null;
  }

  @syncWriter
  writeSync(data: IBulletSync) {
    this.bs.writeValue(
      [PacketRpcValueType.UInt16, data.fromId],
      [PacketRpcValueType.UInt8, data.hitType],
      [PacketRpcValueType.UInt16, data.hitId],
      [PacketRpcValueType.Float3, data.origin],
      [PacketRpcValueType.Float3, data.hitPos],
      [PacketRpcValueType.Float3, data.offsets],
      [PacketRpcValueType.UInt8, data.weaponId]
    );
  }
}
