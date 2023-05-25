import { BitStream } from "raknet/bitStream";
import { syncId, syncReader, syncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import type { IPacketListSync, ISpectatingSync } from "raknet/interfaces";

@syncId(PacketIdList.SpectatingSync)
export class SpectatingSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @syncReader
  readSync() {
    const data: Partial<ISpectatingSync> = {};
    [data.lrKey, data.udKey, data.keys, data.position] = this.bs.readValue(
      PacketRpcValueType.UInt16,
      PacketRpcValueType.UInt16,
      PacketRpcValueType.UInt16,
      PacketRpcValueType.Float3
    ) as any;

    return data as ISpectatingSync | null;
  }

  @syncWriter
  writeSync(data: ISpectatingSync) {
    this.bs.writeValue(
      [PacketRpcValueType.UInt16, data.lrKey],
      [PacketRpcValueType.UInt16, data.udKey],
      [PacketRpcValueType.UInt16, data.keys],
      [PacketRpcValueType.Float3, data.position]
    );
  }
}
