import { BitStream } from "raknet/bitStream";
import { SyncId, SyncReader, SyncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import type { IAimSync, IPacketListSync } from "raknet/interfaces";

@SyncId(PacketIdList.AimSync)
export class AimSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @SyncReader
  readSync() {
    const data: Partial<IAimSync> = {};
    [
      data.camMode,
      data.camFrontVec,
      data.camPos,
      data.aimZ,
      data.weaponState,
      data.camZoom,
      data.aspectRatio,
    ] = this.bs.readValue(
      PacketRpcValueType.UInt8,
      PacketRpcValueType.Float3,
      PacketRpcValueType.Float3,
      PacketRpcValueType.Float,
      [PacketRpcValueType.Bits, 2],
      [PacketRpcValueType.Bits, 6],
      PacketRpcValueType.UInt8
    ) as any;
    return data as IAimSync | null;
  }

  @SyncWriter
  writeSync(data: IAimSync) {
    this.bs.writeValue(
      [PacketRpcValueType.UInt8, data.camMode],
      [PacketRpcValueType.Float3, data.camFrontVec],
      [PacketRpcValueType.Float3, data.camPos],
      [PacketRpcValueType.Float, data.aimZ],
      [PacketRpcValueType.Bits, data.weaponState, 2],
      [PacketRpcValueType.Bits, data.camZoom, 6],
      [PacketRpcValueType.UInt8, data.aspectRatio]
    );
  }
}
