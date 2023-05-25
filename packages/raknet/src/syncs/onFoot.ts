import { BitStream } from "raknet/bitStream";
import { syncId, syncReader, syncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import type { IOnFootSync, IPacketListSync } from "raknet/interfaces";

@syncId(PacketIdList.OnFootSync)
export class OnFootSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @syncReader
  readSync(outgoing = false) {
    const data: Partial<IOnFootSync> = {
      lrKey: 0,
      udKey: 0,
      surfingVehicleId: 0,
      animationId: 0,
      animationFlags: 0,
    };

    if (outgoing) {
      const hasLeftRight = this.bs.readValue(PacketRpcValueType.Bool);

      if (hasLeftRight) {
        data.lrKey = this.bs.readValue(PacketRpcValueType.UInt16) as number;
      }

      const hasUpDown = this.bs.readValue(PacketRpcValueType.Bool);

      if (hasUpDown) {
        data.udKey = this.bs.readValue(PacketRpcValueType.UInt16) as number;
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
        PacketRpcValueType.UInt16,
        PacketRpcValueType.Float3,
        PacketRpcValueType.NormQuat,
        PacketRpcValueType.UInt8,
        PacketRpcValueType.UInt8,
        PacketRpcValueType.UInt8,
        PacketRpcValueType.Vector,
        PacketRpcValueType.Bool
      ) as any;

      const { health, armour } = BitStream.unpackHealthArmour(
        healthArmour as number
      );
      data.health = health;
      data.armour = armour;

      if (hasSurfInfo) {
        [data.surfingVehicleId, data.surfingOffsets] = this.bs.readValue(
          PacketRpcValueType.UInt16,
          PacketRpcValueType.Float3
        ) as any;
      }

      const hasAnimation = this.bs.readValue(PacketRpcValueType.Bool);

      if (hasAnimation) {
        [data.animationId, data.animationFlags] = this.bs.readValue(
          PacketRpcValueType.Int16,
          PacketRpcValueType.Int16
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
        PacketRpcValueType.UInt16,
        PacketRpcValueType.UInt16,
        PacketRpcValueType.UInt16,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float4,
        PacketRpcValueType.UInt8,
        PacketRpcValueType.UInt8,
        [PacketRpcValueType.Bits, 2],
        [PacketRpcValueType.Bits, 6],
        PacketRpcValueType.UInt8,
        PacketRpcValueType.Float3,
        PacketRpcValueType.Float3,
        PacketRpcValueType.UInt16,
        PacketRpcValueType.Int16,
        PacketRpcValueType.Int16
      ) as any;
    }
    return data as IOnFootSync | null;
  }

  @syncWriter
  writeSync(data: IOnFootSync, outgoing = false) {
    this.bs.resetWritePointer();
    this.bs.writeBits(8, PacketIdList.OnFootSync);

    if (outgoing) {
      if (data.lrKey) {
        this.bs.writeValue(
          [PacketRpcValueType.Bool, true],
          [PacketRpcValueType.UInt16, data.lrKey]
        );
      } else {
        this.bs.writeValue([PacketRpcValueType.Bool, false]);
      }

      if (data.udKey) {
        this.bs.writeValue(
          [PacketRpcValueType.Bool, true],
          [PacketRpcValueType.UInt16, data.udKey]
        );
      } else {
        this.bs.writeValue([PacketRpcValueType.Bool, false]);
      }

      const healthArmour = BitStream.packHealthArmour(data.health, data.armour);

      this.bs.writeValue(
        [PacketRpcValueType.UInt16, data.keys],
        [PacketRpcValueType.Float3, data.position],
        [PacketRpcValueType.NormQuat, data.quaternion],
        [PacketRpcValueType.UInt8, healthArmour],
        [PacketRpcValueType.UInt8, data.weaponId],
        [PacketRpcValueType.UInt8, data.specialAction],
        [PacketRpcValueType.Vector, data.velocity]
      );

      if (data.surfingVehicleId) {
        this.bs.writeValue(
          [PacketRpcValueType.Bool, true],
          [PacketRpcValueType.UInt16, data.surfingVehicleId],
          [PacketRpcValueType.Float3, data.surfingOffsets]
        );
      } else {
        this.bs.writeValue([PacketRpcValueType.Bool, false]);
      }

      if (data.animationId || data.animationFlags) {
        this.bs.writeValue(
          [PacketRpcValueType.Bool, true],
          [PacketRpcValueType.Int16, data.animationId],
          [PacketRpcValueType.Int16, data.animationFlags]
        );
      } else {
        this.bs.writeValue([PacketRpcValueType.Bool, false]);
      }
    } else {
      this.bs.writeValue(
        [PacketRpcValueType.UInt16, data.lrKey],
        [PacketRpcValueType.UInt16, data.udKey],
        [PacketRpcValueType.UInt16, data.keys],
        [PacketRpcValueType.Float3, data.position],
        [PacketRpcValueType.Float4, data.quaternion],
        [PacketRpcValueType.UInt8, data.health],
        [PacketRpcValueType.UInt8, data.armour],
        [PacketRpcValueType.Bits, data.additionalKey, 2],
        [PacketRpcValueType.Bits, data.weaponId, 6],
        [PacketRpcValueType.UInt8, data.specialAction],
        [PacketRpcValueType.Float3, data.velocity],
        [PacketRpcValueType.Float3, data.surfingOffsets],
        [PacketRpcValueType.UInt16, data.surfingVehicleId],
        [PacketRpcValueType.Int16, data.animationId],
        [PacketRpcValueType.Int16, data.animationFlags]
      );
    }
  }
}
