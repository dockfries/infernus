import type { BitStream } from "raknet/bitStream";
import { sync, syncRead, syncWrite } from "raknet/decorators";
import { PacketIdList, PR_ValueType } from "raknet/enums";
import type { IMarkersSync } from "raknet/interfaces";
import type { Vector3 } from "raknet/types";
import { LimitsEnum } from "@infernus/core";

@sync(PacketIdList.MARKERS_SYNC)
export class MarkersSync {
  constructor(private bs: BitStream) {}

  @syncRead
  read() {
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
          PR_ValueType.INT16,
          PR_ValueType.INT16,
          PR_ValueType.INT16
        ) as Vector3<number>;

        data.playerPositionX[playerId] = x;
        data.playerPositionY[playerId] = y;
        data.playerPositionZ[playerId] = z;
      }
    }
    return data as IMarkersSync | null;
  }

  @syncWrite
  write(data: IMarkersSync) {
    this.bs.writeInt32(data.numberOfPlayers);

    for (let i = 0; i < LimitsEnum.MAX_PLAYERS; i++) {
      if (!data.playerIsParticipant[i]) {
        continue;
      }

      this.bs.writeValue(
        [PR_ValueType.UINT16, i],
        [PR_ValueType.CBOOL, data.playerIsActive[i]]
      );

      if (data.playerIsActive[i]) {
        this.bs.writeValue(
          [PR_ValueType.INT16, data.playerPositionX[i]],
          [PR_ValueType.INT16, data.playerPositionY[i]],
          [PR_ValueType.INT16, data.playerPositionZ[i]]
        );
      }
    }
  }
}
