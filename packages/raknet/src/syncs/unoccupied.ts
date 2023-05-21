import type { BitStream } from "raknet/bitStream";
import { sync, syncRead, syncWrite } from "raknet/decorators";
import { PacketIdList, PR_ValueType } from "raknet/enums";
import type { IUnoccupiedSync } from "raknet/interfaces";

@sync(PacketIdList.UNOCCUPIED_SYNC)
export class UnoccupiedSync {
  constructor(private bs: BitStream) {}

  @syncRead
  read() {
    const data: Partial<IUnoccupiedSync> = {};
    [
      data.vehicleId,
      data.seatId,
      data.roll,
      data.direction,
      data.position,
      data.velocity,
      data.angularVelocity,
      data.vehicleHealth,
    ] = this.bs.readValue(
      PR_ValueType.UINT16,
      PR_ValueType.UINT8,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT
    ) as any;
    return data as IUnoccupiedSync | null;
  }

  @syncWrite
  write(data: IUnoccupiedSync) {
    this.bs.writeValue(
      [PR_ValueType.UINT16, data.vehicleId],
      [PR_ValueType.UINT8, data.seatId],
      [PR_ValueType.FLOAT3, data.roll],
      [PR_ValueType.FLOAT3, data.direction],
      [PR_ValueType.FLOAT3, data.position],
      [PR_ValueType.FLOAT3, data.velocity],
      [PR_ValueType.FLOAT3, data.angularVelocity],
      [PR_ValueType.FLOAT, data.vehicleHealth]
    );
  }
}
