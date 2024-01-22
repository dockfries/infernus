import { BitStream } from "raknet/bitStream";
import { SyncId, SyncReader, SyncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import type { IMarkersSync, IPacketListSync } from "raknet/interfaces";
import type { Vector3 } from "raknet/types";
import { LimitsEnum } from "@infernus/core";

@SyncId(PacketIdList.MarkersSync)
export class MarkersSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @SyncReader
  readSync() {
    const data: Partial<IMarkersSync> = {};

    data.playerPositionX = [];
    data.playerPositionY = [];
    data.playerPositionZ = [];
    data.playerIsParticipant = [];
    data.playerIsActive = [];

    const numberOfPlayers = this.bs.readInt32() as number;

    if (numberOfPlayers < 0 || numberOfPlayers > LimitsEnum.MAX_PLAYERS) {
      return;
    }

    data.numberOfPlayers = numberOfPlayers;

    for (let i = 0; i < numberOfPlayers; i++) {
      const playerId = this.bs.readUint16() as number;

      if (playerId >= LimitsEnum.MAX_PLAYERS) {
        return;
      }

      data.playerIsParticipant[playerId] = true;

      const isActive = this.bs.readCompressedBool();

      if (isActive) {
        data.playerIsActive[playerId] = true;

        const [x, y, z] = this.bs.readValue(
          PacketRpcValueType.Int16,
          PacketRpcValueType.Int16,
          PacketRpcValueType.Int16
        ) as Vector3<number>;

        data.playerPositionX[playerId] = x;
        data.playerPositionY[playerId] = y;
        data.playerPositionZ[playerId] = z;
      }
    }
    return data as IMarkersSync | null;
  }

  @SyncWriter
  writeSync(data: IMarkersSync) {
    this.bs.writeInt32(data.numberOfPlayers);

    for (let i = 0; i < LimitsEnum.MAX_PLAYERS; i++) {
      if (!data.playerIsParticipant[i]) {
        continue;
      }

      this.bs.writeValue(
        [PacketRpcValueType.UInt16, i],
        [PacketRpcValueType.CBool, data.playerIsActive[i]]
      );

      if (data.playerIsActive[i]) {
        this.bs.writeValue(
          [PacketRpcValueType.Int16, data.playerPositionX[i]],
          [PacketRpcValueType.Int16, data.playerPositionY[i]],
          [PacketRpcValueType.Int16, data.playerPositionZ[i]]
        );
      }
    }
  }
}
