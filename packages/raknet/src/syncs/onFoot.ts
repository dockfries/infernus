import { BitStream } from "@/bitStream";
import { sync, syncRead, syncWrite } from "@/decorators";
import { PacketIdList, PR_ValueType } from "@/enums";
import type { IOnFootSync } from "@/interfaces";

@sync(PacketIdList.ONFOOT_SYNC)
export class OnFootSync {
  constructor(private bs: BitStream) {}

  @syncRead
  read(outgoing = false) {
    const data: Partial<IOnFootSync> = {
      lrKey: 0,
      udKey: 0,
      surfingVehicleId: 0,
      animationId: 0,
      animationFlags: 0,
    };

    if (outgoing) {
      const hasLeftRight = this.bs.readValue(PR_ValueType.BOOL);

      if (hasLeftRight) {
        data.lrKey = this.bs.readValue(PR_ValueType.UINT16) as number;
      }

      const hasUpDown = this.bs.readValue(PR_ValueType.BOOL);

      if (hasUpDown) {
        data.udKey = this.bs.readValue(PR_ValueType.UINT16) as number;
      }

      let healthArmour: number, hasSurfInfo: number;

      [
        data.keys,
        data.position,
        data.quaternion,
        healthArmour,
        data.weaponId,
        data.specialAction,
        data.velocity,
        hasSurfInfo,
      ] = this.bs.readValue(
        PR_ValueType.UINT16,
        PR_ValueType.FLOAT3,
        PR_ValueType.NORM_QUAT,
        PR_ValueType.UINT8,
        PR_ValueType.UINT8,
        PR_ValueType.UINT8,
        PR_ValueType.VECTOR,
        PR_ValueType.BOOL
      ) as any;

      const { health, armour } = BitStream.unpackHealthArmour(
        healthArmour as number
      );
      data.health = health;
      data.armour = armour;

      if (hasSurfInfo) {
        [data.surfingVehicleId, data.surfingOffsets] = this.bs.readValue(
          PR_ValueType.UINT16,
          PR_ValueType.FLOAT3
        ) as any;
      }

      const hasAnimation = this.bs.readValue(PR_ValueType.BOOL);

      if (hasAnimation) {
        [data.animationId, data.animationFlags] = this.bs.readValue(
          PR_ValueType.INT16,
          PR_ValueType.INT16
        ) as any;
      }
    } else {
      [
        data.lrKey,
        data.udKey,
        data.keys,
        data.position,
        data.quaternion,
        data.health,
        data.armour,
        data.additionalKey,
        data.weaponId,
        data.specialAction,
        data.velocity,
        data.surfingOffsets,
        data.surfingVehicleId,
        data.animationId,
        data.animationFlags,
      ] = this.bs.readValue(
        PR_ValueType.UINT16,
        PR_ValueType.UINT16,
        PR_ValueType.UINT16,
        PR_ValueType.FLOAT3,
        PR_ValueType.FLOAT4,
        PR_ValueType.UINT8,
        PR_ValueType.UINT8,
        [PR_ValueType.BITS, 2],
        [PR_ValueType.BITS, 6],
        PR_ValueType.UINT8,
        PR_ValueType.FLOAT3,
        PR_ValueType.FLOAT3,
        PR_ValueType.UINT16,
        PR_ValueType.INT16,
        PR_ValueType.INT16
      ) as any;
    }
    return data as IOnFootSync | null;
  }

  @syncWrite
  write(data: IOnFootSync, outgoing = false) {
    this.bs.resetWritePointer();
    this.bs.writeBits(8, PacketIdList.ONFOOT_SYNC);

    if (outgoing) {
      if (data.lrKey) {
        this.bs.writeValue(
          [PR_ValueType.BOOL, true],
          [PR_ValueType.UINT16, data.lrKey]
        );
      } else {
        this.bs.writeValue([PR_ValueType.BOOL, false]);
      }

      if (data.udKey) {
        this.bs.writeValue(
          [PR_ValueType.BOOL, true],
          [PR_ValueType.UINT16, data.udKey]
        );
      } else {
        this.bs.writeValue([PR_ValueType.BOOL, false]);
      }

      const healthArmour = BitStream.packHealthArmour(data.health, data.armour);

      this.bs.writeValue(
        [PR_ValueType.UINT16, data.keys],
        [PR_ValueType.FLOAT3, data.position],
        [PR_ValueType.NORM_QUAT, data.quaternion],
        [PR_ValueType.UINT8, healthArmour],
        [PR_ValueType.UINT8, data.weaponId],
        [PR_ValueType.UINT8, data.specialAction],
        [PR_ValueType.VECTOR, data.velocity]
      );

      if (data.surfingVehicleId) {
        this.bs.writeValue(
          [PR_ValueType.BOOL, true],
          [PR_ValueType.UINT16, data.surfingVehicleId],
          [PR_ValueType.FLOAT3, data.surfingOffsets]
        );
      } else {
        this.bs.writeValue([PR_ValueType.BOOL, false]);
      }

      if (data.animationId || data.animationFlags) {
        this.bs.writeValue(
          [PR_ValueType.BOOL, true],
          [PR_ValueType.INT16, data.animationId],
          [PR_ValueType.INT16, data.animationFlags]
        );
      } else {
        this.bs.writeValue([PR_ValueType.BOOL, false]);
      }
    } else {
      this.bs.writeValue(
        [PR_ValueType.UINT16, data.lrKey],
        [PR_ValueType.UINT16, data.udKey],
        [PR_ValueType.UINT16, data.keys],
        [PR_ValueType.FLOAT3, data.position],
        [PR_ValueType.FLOAT4, data.quaternion],
        [PR_ValueType.UINT8, data.health],
        [PR_ValueType.UINT8, data.armour],
        [PR_ValueType.BITS, data.additionalKey, 2],
        [PR_ValueType.BITS, data.weaponId, 6],
        [PR_ValueType.UINT8, data.specialAction],
        [PR_ValueType.FLOAT3, data.velocity],
        [PR_ValueType.FLOAT3, data.surfingOffsets],
        [PR_ValueType.UINT16, data.surfingVehicleId],
        [PR_ValueType.INT16, data.animationId],
        [PR_ValueType.INT16, data.animationFlags]
      );
    }
  }
}
