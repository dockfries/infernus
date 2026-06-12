import { BitStream } from "raknet/bitStream";
import { SyncId, SyncReader, SyncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import { RakNetException } from "raknet/exceptions";
import type { IAimSync, IPacketListSync } from "raknet/interfaces";
import { WriteTuple } from "raknet/types";

@SyncId(PacketIdList.AimSync)
export class AimSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @SyncReader
  readSync() {
    const data: Partial<IAimSync> = {};

    if (this.bs.isIncoming()) {
      [
        data.camMode,
        data.camFrontVec,
        data.camPos,
        data.aimZ,
        data.weaponState,
        data.camZoom,
        data.aspectRatio,
      ] = this.bs.readValue(
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.Float3],
        [PacketRpcValueType.Float3],
        [PacketRpcValueType.Float],
        [PacketRpcValueType.Bits, 2],
        [PacketRpcValueType.Bits, 6],
        [PacketRpcValueType.UInt8],
      );
    } else {
      [
        data.playerId,
        data.camMode,
        data.camFrontVec,
        data.camPos,
        data.aimZ,
        data.weaponState,
        data.camZoom,
        data.aspectRatio,
      ] = this.bs.readValue(
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.Float3],
        [PacketRpcValueType.Float3],
        [PacketRpcValueType.Float],
        [PacketRpcValueType.Bits, 2],
        [PacketRpcValueType.Bits, 6],
        [PacketRpcValueType.UInt8],
      );
    }

    return data as IAimSync | null;
  }

  @SyncWriter
  writeSync(data: IAimSync) {
    const value: WriteTuple[] = [
      [PacketRpcValueType.UInt8, data.camMode],
      [PacketRpcValueType.Float3, data.camFrontVec],
      [PacketRpcValueType.Float3, data.camPos],
      [PacketRpcValueType.Float, data.aimZ],
      [PacketRpcValueType.Bits, data.weaponState, 2],
      [PacketRpcValueType.Bits, data.camZoom, 6],
      [PacketRpcValueType.UInt8, data.aspectRatio],
    ];
    if (!this.bs.isIncoming()) {
      if (typeof data.playerId === "undefined") {
        throw new RakNetException("playerId is required for outgoing AimSync");
      }
      value.unshift([PacketRpcValueType.UInt16, data.playerId]);
    }
    this.bs.writeValue(...value);
  }
}
