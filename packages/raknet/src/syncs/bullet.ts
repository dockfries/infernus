import type { BitStream } from "@/bitStream";
import { sync, syncRead, syncWrite } from "@/decorators";
import { PacketIdList, PR_ValueType } from "@/enums";
import type { IBulletSync } from "@/interfaces";

@sync(PacketIdList.BULLET_SYNC)
export class BulletSync {
  constructor(private bs: BitStream) {}

  @syncRead
  read() {
    const data: Partial<IBulletSync> = {};
    [
      data.hitType,
      data.hitId,
      data.origin,
      data.hitPos,
      data.offsets,
      data.weaponId,
    ] = this.bs.readValue(
      PR_ValueType.UINT8,
      PR_ValueType.UINT16,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT3,
      PR_ValueType.UINT8
    ) as any;
    return data as IBulletSync | null;
  }

  @syncWrite
  write(data: IBulletSync) {
    this.bs.writeValue(
      [PR_ValueType.UINT8, data.hitType],
      [PR_ValueType.UINT16, data.hitId],
      [PR_ValueType.FLOAT3, data.origin],
      [PR_ValueType.FLOAT3, data.hitPos],
      [PR_ValueType.FLOAT3, data.offsets],
      [PR_ValueType.UINT8, data.weaponId]
    );
  }
}
