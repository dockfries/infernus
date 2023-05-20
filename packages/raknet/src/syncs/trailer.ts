import type { BitStream } from "@/bitStream";
import { sync, syncRead, syncWrite } from "@/decorators";
import { PacketIdList, PR_ValueType } from "@/enums";
import type { ITrailerSync } from "@/interfaces";

@sync(PacketIdList.TRAILER_SYNC)
export class TrailerSync {
  constructor(private bs: BitStream) {}

  @syncRead
  read() {
    const data: Partial<ITrailerSync> = {};
    [
      data.trailerId,
      data.position,
      data.quaternion,
      data.velocity,
      data.angularVelocity,
    ] = this.bs.readValue(
      PR_ValueType.UINT16,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT4,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT3
    ) as any;
    return data as ITrailerSync | null;
  }

  @syncWrite
  write(data: ITrailerSync) {
    this.bs.writeValue(
      [PR_ValueType.UINT16, data.trailerId],
      [PR_ValueType.FLOAT3, data.position],
      [PR_ValueType.FLOAT4, data.quaternion],
      [PR_ValueType.FLOAT3, data.velocity],
      [PR_ValueType.FLOAT3, data.angularVelocity]
    );
  }
}
