import { BitStream } from "@/bitStream";
import { sync, syncRead, syncWrite } from "@/decorators";
import { PacketIdList, PR_ValueType } from "@/enums";
import type { IInCarSync } from "@/interfaces";

@sync(PacketIdList.DRIVER_SYNC)
export class InCarSync {
  constructor(private bs: BitStream) {}

  @syncRead
  read(outgoing = false) {
    const data: Partial<IInCarSync> = {
      trainSpeed: 0.0,
      trailerId: 0,
    };

    if (outgoing) {
      let healthArmour;

      [
        data.vehicleId,
        data.lrKey,
        data.udKey,
        data.keys,
        data.quaternion,
        data.position,
        data.velocity,
        data.vehicleHealth,
        healthArmour,
        data.weaponId,
        data.sirenState,
        data.landingGearState,
      ] = this.bs.readValue(
        PR_ValueType.UINT16,
        PR_ValueType.UINT16,
        PR_ValueType.UINT16,
        PR_ValueType.UINT16,
        PR_ValueType.NORM_QUAT,
        PR_ValueType.FLOAT3,
        PR_ValueType.VECTOR,
        PR_ValueType.UINT16,
        PR_ValueType.UINT8,
        PR_ValueType.UINT8,
        PR_ValueType.BOOL,
        PR_ValueType.BOOL
      ) as any;

      data.vehicleHealth = data.vehicleHealth ? +data.vehicleHealth : 0;

      const { health, armour } = BitStream.unpackHealthArmour(healthArmour);

      data.playerHealth = health;
      data.armour = armour;

      const hasTrainSpeed = this.bs.readValue(PR_ValueType.BOOL);

      if (hasTrainSpeed) {
        data.trainSpeed = this.bs.readValue(PR_ValueType.FLOAT) as number;
      }

      const hasTrailer = this.bs.readValue(PR_ValueType.BOOL);

      if (hasTrailer) {
        data.trailerId = this.bs.readValue(PR_ValueType.UINT16) as number;
      }
    } else {
      [
        data.vehicleId,
        data.lrKey,
        data.udKey,
        data.keys,
        data.quaternion,
        data.position,
        data.velocity,
        data.vehicleHealth,
        data.playerHealth,
        data.armour,
        data.additionalKey,
        data.weaponId,
        data.sirenState,
        data.landingGearState,
        data.trailerId,
        data.trainSpeed,
      ] = this.bs.readValue(
        PR_ValueType.UINT16,
        PR_ValueType.UINT16,
        PR_ValueType.UINT16,
        PR_ValueType.UINT16,
        PR_ValueType.FLOAT4,
        PR_ValueType.FLOAT3,
        PR_ValueType.FLOAT3,
        PR_ValueType.FLOAT,
        PR_ValueType.UINT8,
        PR_ValueType.UINT8,
        [PR_ValueType.BITS, 2],
        [PR_ValueType.BITS, 6],
        PR_ValueType.UINT8,
        PR_ValueType.UINT8,
        PR_ValueType.UINT16,
        PR_ValueType.FLOAT
      ) as any;
    }
    return data as IInCarSync | null;
  }

  @syncWrite
  write(data: IInCarSync, outgoing = false) {
    if (outgoing) {
      const healthArmour = BitStream.packHealthArmour(
        data.playerHealth,
        data.armour
      );

      this.bs.writeValue(
        [PR_ValueType.UINT16, data.vehicleId],
        [PR_ValueType.UINT16, data.lrKey],
        [PR_ValueType.UINT16, data.udKey],
        [PR_ValueType.UINT16, data.keys],
        [PR_ValueType.NORM_QUAT, data.quaternion],
        [PR_ValueType.FLOAT3, data.position],
        [PR_ValueType.VECTOR, data.velocity],
        [PR_ValueType.UINT16, Math.round(data.vehicleHealth)],
        [PR_ValueType.UINT8, healthArmour],
        [PR_ValueType.UINT8, data.weaponId],
        [PR_ValueType.BOOL, data.sirenState],
        [PR_ValueType.BOOL, data.landingGearState]
      );

      if (data.trainSpeed) {
        this.bs.writeValue(
          [PR_ValueType.BOOL, true],
          [PR_ValueType.FLOAT, data.trainSpeed]
        );
      } else {
        this.bs.writeValue([PR_ValueType.BOOL, false]);
      }

      if (data.trailerId) {
        this.bs.writeValue(
          [PR_ValueType.BOOL, true],
          [PR_ValueType.UINT16, data.trailerId]
        );
      } else {
        this.bs.writeValue([PR_ValueType.BOOL, false]);
      }
    } else {
      this.bs.writeValue(
        [PR_ValueType.UINT16, data.vehicleId],
        [PR_ValueType.UINT16, data.lrKey],
        [PR_ValueType.UINT16, data.udKey],
        [PR_ValueType.UINT16, data.keys],
        [PR_ValueType.FLOAT4, data.quaternion],
        [PR_ValueType.FLOAT3, data.position],
        [PR_ValueType.FLOAT3, data.velocity],
        [PR_ValueType.FLOAT, data.vehicleHealth],
        [PR_ValueType.UINT8, data.playerHealth],
        [PR_ValueType.UINT8, data.armour],
        [PR_ValueType.BITS, data.additionalKey, 2],
        [PR_ValueType.BITS, data.weaponId, 6],
        [PR_ValueType.UINT8, data.sirenState],
        [PR_ValueType.UINT8, data.landingGearState],
        [PR_ValueType.UINT16, data.trailerId],
        [PR_ValueType.FLOAT, data.trainSpeed]
      );
    }
  }
}
