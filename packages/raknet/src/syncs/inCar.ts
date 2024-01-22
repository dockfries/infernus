import { BitStream } from "raknet/bitStream";
import { SyncId, SyncReader, SyncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import type { IInCarSync, IPacketListSync } from "raknet/interfaces";

@SyncId(PacketIdList.DriverSync)
export class InCarSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @SyncReader
  readSync(outgoing = false) {
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
        PacketRpcValueType.UInt16,
        PacketRpcValueType.UInt16,
        PacketRpcValueType.UInt16,
        PacketRpcValueType.UInt16,
        PacketRpcValueType.NormQuat,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Vector,
        PacketRpcValueType.UInt16,
        PacketRpcValueType.UInt8,
        PacketRpcValueType.UInt8,
        PacketRpcValueType.Bool,
        PacketRpcValueType.Bool
      ) as any;

      data.vehicleHealth = data.vehicleHealth ? +data.vehicleHealth : 0;

      const { health, armour } = BitStream.unpackHealthArmour(healthArmour);

      data.playerHealth = health;
      data.armour = armour;

      const hasTrainSpeed = this.bs.readValue(PacketRpcValueType.Bool);

      if (hasTrainSpeed) {
        data.trainSpeed = this.bs.readValue(PacketRpcValueType.Float) as number;
      }

      const hasTrailer = this.bs.readValue(PacketRpcValueType.Bool);

      if (hasTrailer) {
        data.trailerId = this.bs.readValue(PacketRpcValueType.UInt16) as number;
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
        PacketRpcValueType.UInt16,
        PacketRpcValueType.UInt16,
        PacketRpcValueType.UInt16,
        PacketRpcValueType.UInt16,
        PacketRpcValueType.Float4,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float,
        PacketRpcValueType.UInt8,
        PacketRpcValueType.UInt8,
        [PacketRpcValueType.Bits, 2],
        [PacketRpcValueType.Bits, 6],
        PacketRpcValueType.UInt8,
        PacketRpcValueType.UInt8,
        PacketRpcValueType.UInt16,
        PacketRpcValueType.Float
      ) as any;
    }
    return data as IInCarSync | null;
  }

  @SyncWriter
  writeSync(data: IInCarSync, outgoing = false) {
    if (outgoing) {
      const healthArmour = BitStream.packHealthArmour(
        data.playerHealth,
        data.armour
      );

      this.bs.writeValue(
        [PacketRpcValueType.UInt16, data.vehicleId],
        [PacketRpcValueType.UInt16, data.lrKey],
        [PacketRpcValueType.UInt16, data.udKey],
        [PacketRpcValueType.UInt16, data.keys],
        [PacketRpcValueType.NormQuat, data.quaternion],
        [PacketRpcValueType.Float3, data.position],
        [PacketRpcValueType.Vector, data.velocity],
        [PacketRpcValueType.UInt16, Math.round(data.vehicleHealth)],
        [PacketRpcValueType.UInt8, healthArmour],
        [PacketRpcValueType.UInt8, data.weaponId],
        [PacketRpcValueType.Bool, data.sirenState],
        [PacketRpcValueType.Bool, data.landingGearState]
      );

      if (data.trainSpeed) {
        this.bs.writeValue(
          [PacketRpcValueType.Bool, true],
          [PacketRpcValueType.Float, data.trainSpeed]
        );
      } else {
        this.bs.writeValue([PacketRpcValueType.Bool, false]);
      }

      if (data.trailerId) {
        this.bs.writeValue(
          [PacketRpcValueType.Bool, true],
          [PacketRpcValueType.UInt16, data.trailerId]
        );
      } else {
        this.bs.writeValue([PacketRpcValueType.Bool, false]);
      }
    } else {
      this.bs.writeValue(
        [PacketRpcValueType.UInt16, data.vehicleId],
        [PacketRpcValueType.UInt16, data.lrKey],
        [PacketRpcValueType.UInt16, data.udKey],
        [PacketRpcValueType.UInt16, data.keys],
        [PacketRpcValueType.Float4, data.quaternion],
        [PacketRpcValueType.Float3, data.position],
        [PacketRpcValueType.Float3, data.velocity],
        [PacketRpcValueType.Float, data.vehicleHealth],
        [PacketRpcValueType.UInt8, data.playerHealth],
        [PacketRpcValueType.UInt8, data.armour],
        [PacketRpcValueType.Bits, data.additionalKey, 2],
        [PacketRpcValueType.Bits, data.weaponId, 6],
        [PacketRpcValueType.UInt8, data.sirenState],
        [PacketRpcValueType.UInt8, data.landingGearState],
        [PacketRpcValueType.UInt16, data.trailerId],
        [PacketRpcValueType.Float, data.trainSpeed]
      );
    }
  }
}
