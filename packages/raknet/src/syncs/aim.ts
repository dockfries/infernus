import type { BitStream } from "@/bitStream";
import { sync, syncRead, syncWrite } from "@/decorators";
import { PacketIdList, PR_ValueType } from "@/enums";
import type { IAimSync } from "@/interfaces";

@sync(PacketIdList.AIM_SYNC)
export class AimSync {
  constructor(private bs: BitStream) {}

  @syncRead
  read() {
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
      PR_ValueType.UINT8,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT,
      [PR_ValueType.BITS, 2],
      [PR_ValueType.BITS, 6],
      PR_ValueType.UINT8
    ) as any;
    return data as IAimSync | null;
  }

  @syncWrite
  write(data: IAimSync) {
    this.bs.writeValue(
      [PR_ValueType.UINT8, data.camMode],
      [PR_ValueType.FLOAT3, data.camFrontVec],
      [PR_ValueType.FLOAT3, data.camPos],
      [PR_ValueType.FLOAT, data.aimZ],
      [PR_ValueType.BITS, data.weaponState, 2],
      [PR_ValueType.BITS, data.camZoom, 6],
      [PR_ValueType.UINT8, data.aspectRatio]
    );
  }
}
