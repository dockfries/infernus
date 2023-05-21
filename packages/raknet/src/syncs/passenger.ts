import type { BitStream } from "raknet/bitStream";
import { sync, syncRead, syncWrite } from "raknet/decorators";
import { PacketIdList, PR_ValueType } from "raknet/enums";
import type { IPassengerSync } from "raknet/interfaces";

@sync(PacketIdList.PASSENGER_SYNC)
export class PassengerSync {
  constructor(private bs: BitStream) {}

  @syncRead
  read() {
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
      PR_ValueType.UINT16,
      [PR_ValueType.BITS, 2],
      [PR_ValueType.BITS, 6],
      [PR_ValueType.BITS, 2],
      [PR_ValueType.BITS, 6],
      PR_ValueType.UINT8,
      PR_ValueType.UINT8,
      PR_ValueType.UINT16,
      PR_ValueType.UINT16,
      PR_ValueType.UINT16,
      PR_ValueType.FLOAT3
    ) as any;
    return data as IPassengerSync | null;
  }

  @syncWrite
  write(data: IPassengerSync) {
    this.bs.writeValue(
      [PR_ValueType.UINT16, data.vehicleId],
      [PR_ValueType.BITS, data.driveBy, 2],
      [PR_ValueType.BITS, data.seatId, 6],
      [PR_ValueType.BITS, data.additionalKey, 2],
      [PR_ValueType.BITS, data.weaponId, 6],
      [PR_ValueType.UINT8, data.playerHealth],
      [PR_ValueType.UINT8, data.playerArmour],
      [PR_ValueType.UINT16, data.lrKey],
      [PR_ValueType.UINT16, data.udKey],
      [PR_ValueType.UINT16, data.keys],
      [PR_ValueType.FLOAT3, data.position]
    );
  }
}
