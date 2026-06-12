import { BitStream } from "raknet/bitStream";
import { SyncId, SyncReader, SyncWriter } from "raknet/decorators";
import { PacketIdList, PacketRpcValueType } from "raknet/enums";
import { RakNetException } from "raknet/exceptions";
import type { IOnFootSync, IPacketListSync } from "raknet/interfaces";

@SyncId(PacketIdList.OnFootSync)
export class OnFootSync extends BitStream implements IPacketListSync {
  constructor(private bs: BitStream) {
    super(bs);
  }

  @SyncReader
  readSync(outgoing = false) {
    const _outgoing = outgoing || !this.bs.isIncoming();

    const data: Partial<IOnFootSync> = {
      lrKey: 0,
      udKey: 0,
      surfingVehicleId: 0,
      animationId: 0,
      animationFlags: 0,
    };

    if (_outgoing) {
      [data.playerId] = this.bs.readValue(PacketRpcValueType.UInt16);

      const [hasLeftRight] = this.bs.readValue(PacketRpcValueType.Bool);

      if (hasLeftRight) {
        [data.lrKey] = this.bs.readValue(PacketRpcValueType.UInt16);
      }

      const [hasUpDown] = this.bs.readValue(PacketRpcValueType.Bool);

      if (hasUpDown) {
        [data.udKey] = this.bs.readValue(PacketRpcValueType.UInt16);
      }

      let healthArmour: number, hasSurfInfo: boolean;

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
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.Float3],
        [PacketRpcValueType.NormQuat],
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.Vector],
        [PacketRpcValueType.Bool],
      );

      const { health, armour } = BitStream.unpackHealthArmour(healthArmour);
      data.health = health;
      data.armour = armour;

      if (hasSurfInfo) {
        [data.surfingVehicleId, data.surfingOffsets] = this.bs.readValue(
          [PacketRpcValueType.UInt16],
          [PacketRpcValueType.Float3],
        );
      }

      const [hasAnimation] = this.bs.readValue(PacketRpcValueType.Bool);

      if (hasAnimation) {
        [data.animationId, data.animationFlags] = this.bs.readValue(
          [PacketRpcValueType.Int16],
          [PacketRpcValueType.Int16],
        );
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
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.Float3],
        [PacketRpcValueType.Float4],
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.Bits, 2],
        [PacketRpcValueType.Bits, 6],
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.Float3],
        [PacketRpcValueType.Float3],
        [PacketRpcValueType.UInt16],
        [PacketRpcValueType.Int16],
        [PacketRpcValueType.Int16],
      );
    }
    return data as IOnFootSync | null;
  }

  @SyncWriter
  writeSync(data: IOnFootSync, outgoing = false) {
    const _outgoing = outgoing || !this.bs.isIncoming();

    if (_outgoing) {
      if (typeof data.playerId === "undefined") {
        throw new RakNetException("playerId is required for outgoing OnFootSync");
      }
      this.bs.writeValue([PacketRpcValueType.UInt16, data.playerId]);

      if (data.lrKey) {
        this.bs.writeValue(
          [PacketRpcValueType.Bool, true],
          [PacketRpcValueType.UInt16, data.lrKey],
        );
      } else {
        this.bs.writeValue([PacketRpcValueType.Bool, false]);
      }

      if (data.udKey) {
        this.bs.writeValue(
          [PacketRpcValueType.Bool, true],
          [PacketRpcValueType.UInt16, data.udKey],
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
        [PacketRpcValueType.Vector, data.velocity],
      );

      if (data.surfingVehicleId) {
        this.bs.writeValue(
          [PacketRpcValueType.Bool, true],
          [PacketRpcValueType.UInt16, data.surfingVehicleId],
          [PacketRpcValueType.Float3, data.surfingOffsets],
        );
      } else {
        this.bs.writeValue([PacketRpcValueType.Bool, false]);
      }

      if (data.animationId || data.animationFlags) {
        this.bs.writeValue(
          [PacketRpcValueType.Bool, true],
          [PacketRpcValueType.Int16, data.animationId],
          [PacketRpcValueType.Int16, data.animationFlags],
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
        [PacketRpcValueType.Int16, data.animationFlags],
      );
    }
  }
}
