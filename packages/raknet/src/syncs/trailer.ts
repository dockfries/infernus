import { BitStream } from "raknet/bitStream";
import { SyncId, SyncReader, SyncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import type { IPacketListSync, ITrailerSync } from "raknet/interfaces";

@SyncId(PacketIdList.TrailerSync)
export class TrailerSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @SyncReader
  readSync() {
    const data: Partial<ITrailerSync> = {};
    [
      data.trailerId,
      data.position,
      data.quaternion,
      data.velocity,
      data.angularVelocity,
    ] = this.bs.readValue(
      PacketRpcValueType.UInt16,
      PacketRpcValueType.Float3,
      PacketRpcValueType.Float4,
      PacketRpcValueType.Float3,
      PacketRpcValueType.Float3,
    ) as any;
    return data as ITrailerSync | null;
  }

  @SyncWriter
  writeSync(data: ITrailerSync) {
    this.bs.writeValue(
      [PacketRpcValueType.UInt16, data.trailerId],
      [PacketRpcValueType.Float3, data.position],
      [PacketRpcValueType.Float4, data.quaternion],
      [PacketRpcValueType.Float3, data.velocity],
      [PacketRpcValueType.Float3, data.angularVelocity],
    );
  }
}
