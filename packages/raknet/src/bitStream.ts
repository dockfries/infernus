import { PacketRpcValueType } from "./enums";
import {
  PacketRpcPriority,
  PacketRpcReliability,
  RakNetNatives,
} from "./enums";
import {
  readStringX,
  convertToByteString,
  patchRakNetNative,
} from "raknet/utils";
import type { BitStreamRaw, Vector3, Vector4 } from "./types";
import { PR_MAX_WEAPON_SLOTS } from "./defines";
import type { IRconCommand, IStatsUpdate, IWeaponsUpdate } from "./interfaces";
import type { Vehicle, Player } from "@infernus/core";
import { InvalidEnum } from "@infernus/core";

export class BitStream {
  public readonly id: BitStreamRaw;

  constructor(from?: BitStreamRaw | BitStream) {
    if (!from) this.id = patchRakNetNative(RakNetNatives.New);
    else if (from instanceof BitStream) {
      this.id = from.id;
    } else {
      this.id = from;
    }
  }

  // natives

  sendPacket(
    player: number | Player,
    priority = PacketRpcPriority.High,
    reliability = PacketRpcReliability.ReliableOrdered,
    orderingChannel = 0
  ) {
    const id = typeof player === "number" ? player : player.id;
    patchRakNetNative(
      RakNetNatives.SendPacket,
      this.id,
      id,
      priority,
      reliability,
      orderingChannel
    );
  }

  sendRPC(
    player: number | Player,
    rpcId: number,
    priority = PacketRpcPriority.High,
    reliability = PacketRpcReliability.ReliableOrdered,
    orderingChannel = 0
  ) {
    const id = typeof player === "number" ? player : player.id;
    patchRakNetNative(
      RakNetNatives.SendRpc,
      this.id,
      id,
      rpcId,
      priority,
      reliability,
      orderingChannel
    );
  }

  emulateIncomingPacket(player: number | Player) {
    const id = typeof player === "number" ? player : player.id;
    patchRakNetNative(RakNetNatives.EmulateIncomingPacket, this.id, id);
  }

  emulateIncomingRPC(player: number | Player, rpcId: number) {
    const id = typeof player === "number" ? player : player.id;
    patchRakNetNative(RakNetNatives.EmulateIncomingRpc, this.id, id, rpcId);
  }

  newCopy() {
    return new BitStream(patchRakNetNative(RakNetNatives.NewCopy, this.id));
  }

  delete() {
    patchRakNetNative(RakNetNatives.Delete, this.id);
    return this.id;
  }

  reset() {
    patchRakNetNative(RakNetNatives.Reset, this.id);
  }

  resetReadPointer() {
    patchRakNetNative(RakNetNatives.ResetReadPointer, this.id);
  }

  resetWritePointer() {
    patchRakNetNative(RakNetNatives.ResetWritePointer, this.id);
  }

  ignoreBits(number_of_bits: number) {
    patchRakNetNative(RakNetNatives.IgnoreBits, this.id, number_of_bits);
  }

  setWriteOffset(offset: number) {
    patchRakNetNative(RakNetNatives.SetWriteOffset, this.id, offset);
  }

  getWriteOffset(): number {
    return patchRakNetNative(RakNetNatives.GetWriteOffset, this.id);
  }

  setReadOffset(offset: number) {
    patchRakNetNative(RakNetNatives.SetReadOffset, this.id, offset);
  }

  getReadOffset(): number {
    return patchRakNetNative(RakNetNatives.GetReadOffset, this.id);
  }

  getNumberOfBitsUsed(): number {
    return patchRakNetNative(RakNetNatives.GetNumberOfBitsUsed, this.id);
  }

  getNumberOfBytesUsed(): number {
    return patchRakNetNative(RakNetNatives.GetNumberOfBytesUsed, this.id);
  }

  getNumberOfUnreadBits(): number {
    return patchRakNetNative(RakNetNatives.GetNumberOfUnreadBits, this.id);
  }

  getNumberOfBitsAllocated(): number {
    return patchRakNetNative(RakNetNatives.GetNumberOfBitsAllocated, this.id);
  }

  readValue(
    ...types: (PacketRpcValueType | [PacketRpcValueType, number])[]
  ): number | number[] | (number | number[])[] {
    const ret: any[] = [];
    types.forEach((item) => {
      const isPlaceholder = Array.isArray(item);
      const type = isPlaceholder ? item[0] : item;
      ret.push(
        patchRakNetNative(
          RakNetNatives.ReadValue,
          this.id,
          type,
          isPlaceholder ? item[1] : 0
        )
      );
    });
    if (ret.length === 1) return ret[0];
    return ret;
  }

  writeValue(
    ...types: (
      | [
          PacketRpcValueType,
          number | number[] | boolean | (number | number[] | boolean)[]
        ]
      | [
          PacketRpcValueType,
          number | number[] | boolean | (number | number[] | boolean)[],
          number
        ]
    )[]
  ) {
    types.forEach((item) => {
      patchRakNetNative(
        RakNetNatives.WriteValue,
        this.id,
        item[0],
        item[1],
        item[2] || 0
      );
    });
  }

  // macros

  readInt8() {
    return this.readValue(this.id, PacketRpcValueType.Int8);
  }

  readInt16() {
    return this.readValue(this.id, PacketRpcValueType.Int16);
  }

  readInt32() {
    return this.readValue(this.id, PacketRpcValueType.Int32);
  }

  readUint8() {
    return this.readValue(this.id, PacketRpcValueType.UInt8);
  }

  readUint16() {
    return this.readValue(this.id, PacketRpcValueType.UInt16);
  }

  readUint32() {
    return this.readValue(this.id, PacketRpcValueType.UInt32);
  }

  readFloat() {
    return this.readValue(this.id, PacketRpcValueType.Float);
  }

  readBool() {
    return this.readValue(this.id, PacketRpcValueType.Bool);
  }

  readString(size = 1024) {
    return readStringX(this, size);
  }

  readCompressedInt8() {
    return this.readValue(this.id, PacketRpcValueType.CInt8);
  }

  readCompressedInt16() {
    return this.readValue(this.id, PacketRpcValueType.CInt16);
  }

  readCompressedInt32() {
    return this.readValue(this.id, PacketRpcValueType.CInt32);
  }

  readCompressedUint8() {
    return this.readValue(this.id, PacketRpcValueType.CUInt8);
  }

  readCompressedUint16() {
    return this.readValue(this.id, PacketRpcValueType.CUInt16);
  }

  readCompressedUint32() {
    return this.readValue(this.id, PacketRpcValueType.CUInt32);
  }

  readCompressedFloat() {
    return this.readValue(this.id, PacketRpcValueType.CFloat);
  }

  readCompressedBool() {
    return this.readValue(this.id, PacketRpcValueType.CBool);
  }

  readCompressedString(size: number) {
    return readStringX(this, size, true);
  }

  readBits(size: number) {
    return this.readValue(this.id, [PacketRpcValueType.Bits, size]);
  }

  readFloat3() {
    return this.readValue(this.id, PacketRpcValueType.Float3);
  }

  readFloat4() {
    return this.readValue(this.id, PacketRpcValueType.Float4);
  }

  readVector() {
    return this.readValue(this.id, PacketRpcValueType.Vector);
  }

  readNormQuat() {
    return this.readValue(this.id, PacketRpcValueType.NormQuat);
  }

  readString8() {
    return readStringX(this, 8);
  }

  readString32() {
    return readStringX(this, 32);
  }

  writeInt8(value: number) {
    this.writeValue([PacketRpcValueType.Int8, value]);
  }

  writeInt16(value: number) {
    this.writeValue([PacketRpcValueType.Int16, value]);
  }

  writeInt32(value: number) {
    this.writeValue([PacketRpcValueType.Int32, value]);
  }

  writeUint8(value: number) {
    this.writeValue([PacketRpcValueType.UInt8, value]);
  }

  writeUint16(value: number) {
    this.writeValue([PacketRpcValueType.UInt16, value]);
  }

  writeUint32(value: number) {
    this.writeValue([PacketRpcValueType.UInt32, value]);
  }

  writeFloat(value: number) {
    this.writeValue([PacketRpcValueType.Float, value]);
  }

  writeBool(value: boolean) {
    this.writeValue([PacketRpcValueType.Bool, value]);
  }

  writeString(value: string | number[], length = 1024) {
    this.writeValue([
      PacketRpcValueType.String,
      convertToByteString(value, length),
    ]);
  }

  writeCompressedInt8(value: number) {
    this.writeValue([PacketRpcValueType.CInt8, value]);
  }

  writeCompressedInt16(value: number) {
    this.writeValue([PacketRpcValueType.CInt16, value]);
  }

  writeCompressedInt32(value: number) {
    this.writeValue([PacketRpcValueType.CInt32, value]);
  }

  writeCompressedUint8(value: number) {
    this.writeValue([PacketRpcValueType.CUInt8, value]);
  }

  writeCompressedUint16(value: number) {
    this.writeValue([PacketRpcValueType.CUInt16, value]);
  }

  writeCompressedUint32(value: number) {
    this.writeValue([PacketRpcValueType.CUInt32, value]);
  }

  writeCompressedFloat(value: number) {
    this.writeValue([PacketRpcValueType.CFloat, value]);
  }

  writeCompressedBool(value: boolean) {
    this.writeValue([PacketRpcValueType.CBool, value]);
  }

  writeCompressedString(value: string, length = 1024) {
    this.writeValue([
      PacketRpcValueType.CString,
      convertToByteString(value, length),
    ]);
  }

  writeBits(value: number, size: number) {
    this.writeValue([PacketRpcValueType.Bits, value, size]);
  }

  writeFloat3(value: Vector3<number>) {
    this.writeValue([PacketRpcValueType.Float3, value]);
  }

  writeFloat4(value: Vector4<number>) {
    this.writeValue([PacketRpcValueType.Float4, value]);
  }

  writeVector(value: Vector3<number>) {
    this.writeValue([PacketRpcValueType.Vector, value]);
  }

  writeNormQuat(value: Vector4<number>) {
    this.writeValue([PacketRpcValueType.NormQuat, value]);
  }

  writeString8(value: string | number[]) {
    this.writeValue([
      PacketRpcValueType.String8,
      convertToByteString(value, 8),
    ]);
  }

  writeString32(value: string | number[]) {
    this.writeValue([
      PacketRpcValueType.String32,
      convertToByteString(value, 32),
    ]);
  }

  // static stocks

  static packAspectRatio(value: number) {
    return Math.round((value - 1.0) * 255.0);
  }

  static unpackAspectRatio(value: number): number {
    return value / 255.0 + 1.0;
  }

  static packCameraZoom(value: number) {
    return Math.round(((value - 35.0) / 35.0) * 63.0);
  }

  static unpackCameraZoom(value: number) {
    return (value / 63.0) * 35.0 + 35.0;
  }

  static packHealthArmour(health: number, armour: number) {
    let healthArmour;
    if (health > 0 && health < 100) {
      healthArmour = (health / 7) << 4;
    } else if (health >= 100) {
      healthArmour = 0xf0; // 0xF << 4
    } else {
      healthArmour = 0;
    }

    if (armour > 0 && armour < 100) {
      healthArmour |= armour / 7;
    } else if (armour >= 100) {
      healthArmour |= 0xf;
    }
    return healthArmour;
  }

  static unpackHealthArmour(healthArmour: number) {
    let health, armour;

    health = healthArmour >> 4;
    if (health == 0xf) {
      health = 100;
    } else {
      health *= 7;
    }

    armour = healthArmour & 0xf;
    if (armour == 0xf) {
      armour = 100;
    } else {
      armour *= 7;
    }
    return { health, armour };
  }

  // misc stocks

  readWeaponsUpdate() {
    const data: Partial<IWeaponsUpdate> = {};

    data.slotWeaponId = [];
    data.slotWeaponAmmo = [];
    data.slotUpdated = [];

    let numberOfSlots = 0;

    const numberOfBytes = this.getNumberOfBytesUsed();

    if (numberOfBytes > 5) {
      numberOfSlots = (numberOfBytes - 5) / 4;
    }

    [data.targetId, data.targetActorId] = this.readValue(
      PacketRpcValueType.UInt16,
      PacketRpcValueType.UInt16
    ) as number[];

    while (numberOfSlots--) {
      const [slotId, weaponId, ammo] = this.readValue(
        PacketRpcValueType.UInt8,
        PacketRpcValueType.UInt8,
        PacketRpcValueType.UInt16
      ) as number[];

      if (slotId < PR_MAX_WEAPON_SLOTS) {
        data.slotWeaponId[slotId] = weaponId;
        data.slotWeaponAmmo[slotId] = ammo;
        data.slotUpdated[slotId] = true;
      }
    }
    return data as IWeaponsUpdate;
  }

  readStatsUpdate() {
    const data: Partial<IStatsUpdate> = {};
    [data.money, data.drunkLevel] = this.readValue(
      PacketRpcValueType.Int32,
      PacketRpcValueType.Int32
    ) as number[];
    return data as IStatsUpdate;
  }

  readRconCommand() {
    const data: Partial<IRconCommand> = {};
    [data.command] = this.readValue(PacketRpcValueType.String32) as any;
    return data as IRconCommand;
  }

  writeWeaponsUpdate(data: IWeaponsUpdate) {
    this.writeValue(
      [PacketRpcValueType.UInt16, data.targetId],
      [PacketRpcValueType.UInt16, data.targetActorId]
    );

    for (let slotId = 0; slotId < PR_MAX_WEAPON_SLOTS; slotId++) {
      if (!data.slotUpdated[slotId]) {
        continue;
      }

      this.writeValue(
        [PacketRpcValueType.UInt8, slotId],
        [PacketRpcValueType.UInt8, data.slotWeaponId[slotId]],
        [PacketRpcValueType.UInt16, data.slotWeaponAmmo[slotId]]
      );
    }
  }

  writeStatsUpdate(data: IStatsUpdate) {
    this.writeValue(
      [PacketRpcValueType.Int32, data.money],
      [PacketRpcValueType.Int32, data.drunkLevel]
    );
  }

  writeRconCommand(data: IRconCommand) {
    this.writeValue([PacketRpcValueType.String32, data.command]);
  }

  sendPacketToPlayerStream(
    players: Player[],
    player: Player,
    priority = PacketRpcPriority.High,
    reliability = PacketRpcReliability.ReliableOrdered,
    orderingChannel = 0
  ) {
    players.forEach((p) => {
      if (!p.isStreamedIn(player)) return;
      this.sendPacket(p.id, priority, reliability, orderingChannel);
    });
  }

  sendRPCToPlayerStream(
    players: Player[],
    player: Player,
    rpcId: number,
    priority = PacketRpcPriority.High,
    reliability = PacketRpcReliability.ReliableOrdered,
    orderingChannel = 0
  ) {
    players.forEach((p) => {
      if (!p.isStreamedIn(player)) {
        return;
      }
      this.sendRPC(p.id, rpcId, priority, reliability, orderingChannel);
    });
  }

  sendPacketToVehicleStream(
    players: Player[],
    vehicle: Vehicle,
    excludedPlayer: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID,
    priority = PacketRpcPriority.High,
    reliability = PacketRpcReliability.ReliableOrdered,
    orderingChannel = 0
  ) {
    players.forEach((p) => {
      if (
        excludedPlayer !== InvalidEnum.PLAYER_ID &&
        (p === excludedPlayer || vehicle.isStreamedIn(p))
      )
        return;
      this.sendPacket(p.id, priority, reliability, orderingChannel);
    });
  }

  sendRPCToVehicleStream(
    players: Player[],
    vehicle: Vehicle,
    rpcId: number,
    excludedPlayer: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID,
    priority = PacketRpcPriority.High,
    reliability = PacketRpcReliability.ReliableOrdered,
    orderingChannel = 0
  ) {
    players.forEach((p) => {
      if (
        excludedPlayer !== InvalidEnum.PLAYER_ID &&
        (p === excludedPlayer || vehicle.isStreamedIn(p))
      )
        return;
      this.sendRPC(p.id, rpcId, priority, reliability, orderingChannel);
    });
  }
}
