import { BitStream } from "raknet/bitStream";
import { SyncId, SyncReader, SyncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import { RakNetException } from "raknet/exceptions";
import type { IBulletSync, IPacketListSync } from "raknet/interfaces";

@SyncId(PacketIdList.BulletSync)
export class BulletSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @SyncReader
  readSync() {
    const data: Partial<IBulletSync> = {};

    if (this.bs.isIncoming()) {
      [data.hitType, data.hitId, data.origin, data.hitPos, data.offsets, data.weaponId] =
        this.bs.readValue(
          PacketRpcValueType.UInt8,
          PacketRpcValueType.UInt16,
          PacketRpcValueType.Float3,
          PacketRpcValueType.Float3,
          PacketRpcValueType.Float3,
          PacketRpcValueType.UInt8,
        ) as any;
    } else {
      [
        data.playerId,
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
        PacketRpcValueType.UInt8,
      ) as any;
    }

    return data as IBulletSync | null;
  }

  @SyncWriter
  writeSync(data: IBulletSync) {
    const value = [
      [PacketRpcValueType.UInt8, data.hitType],
      [PacketRpcValueType.UInt16, data.hitId],
      [PacketRpcValueType.Float3, data.origin],
      [PacketRpcValueType.Float3, data.hitPos],
      [PacketRpcValueType.Float3, data.offsets],
      [PacketRpcValueType.UInt8, data.weaponId],
    ] as any;
    if (!this.bs.isIncoming()) {
      if (typeof data.playerId === "undefined") {
        throw new RakNetException("playerId is required for outgoing BulletSync");
      }
      value.unshift([PacketRpcValueType.UInt16, data.playerId]);
    }
    this.bs.writeValue(...value);
  }
}
