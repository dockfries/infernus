import type { BitStream } from "raknet/bitStream";
import { sync, syncRead, syncWrite } from "raknet/decorators";
import { PacketIdList, PR_ValueType } from "raknet/enums";
import type { ISpectatingSync } from "raknet/interfaces";

@sync(PacketIdList.SPECTATING_SYNC)
export class SpectatingSync {
  constructor(private bs: BitStream) {}

  @syncRead
  read() {
    const data: Partial<ISpectatingSync> = {};
    [data.lrKey, data.udKey, data.keys, data.position] = this.bs.readValue(
      PR_ValueType.UINT16,
      PR_ValueType.UINT16,
      PR_ValueType.UINT16,
      PR_ValueType.FLOAT3
    ) as any;

    return data as ISpectatingSync | null;
  }

  @syncWrite
  write(data: ISpectatingSync) {
    this.bs.writeValue(
      [PR_ValueType.UINT16, data.lrKey],
      [PR_ValueType.UINT16, data.udKey],
      [PR_ValueType.UINT16, data.keys],
      [PR_ValueType.FLOAT3, data.position]
    );
  }
}
