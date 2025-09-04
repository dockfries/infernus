import { PacketRpcValueType } from "./enums";
import {
  PacketRpcPriority,
  PacketRpcReliability,
  RakNetNatives,
} from "./enums";
import {
  readStringX,
  convertToByteString,
  patchRakNetNatives,
  patchRakNetRead,
  patchRakNetWrite,
} from "raknet/utils";
import type { BitStreamRaw, Vector3, Vector4 } from "./types";
import { PR_MAX_WEAPON_SLOTS } from "./defines";
import type { IRconCommand, IStatsUpdate, IWeaponsUpdate } from "./interfaces";
import type { Vehicle, Player } from "@infernus/core";
import { InvalidEnum } from "@infernus/core";

export class BitStream {
  public readonly id: BitStreamRaw;

  constructor(from?: BitStreamRaw | BitStream) {
    if (!from) this.id = patchRakNetNatives(RakNetNatives.New);
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
    orderingChannel = 0,
  ) {
    const id = typeof player === "number" ? player : player.id;
    patchRakNetNatives(
      RakNetNatives.SendPacket,
      this.id,
      id,
      priority,
      reliability,
      orderingChannel,
    );
  }

  sendRPC(
    player: number | Player,
    rpcId: number,
    priority = PacketRpcPriority.High,
    reliability = PacketRpcReliability.ReliableOrdered,
    orderingChannel = 0,
  ) {
    const id = typeof player === "number" ? player : player.id;
    patchRakNetNatives(
      RakNetNatives.SendRpc,
      this.id,
      id,
      rpcId,
      priority,
      reliability,
      orderingChannel,
    );
  }

  emulateIncomingPacket(player: number | Player) {
    const pid = typeof player === "number" ? player : player.id;
    patchRakNetNatives(RakNetNatives.EmulateIncomingPacket, this.id, pid);
  }

  emulateIncomingRPC(player: number | Player, rpcId: number) {
    const pid = typeof player === "number" ? player : player.id;
    patchRakNetNatives(RakNetNatives.EmulateIncomingRpc, this.id, pid, rpcId);
  }

  newCopy() {
    return new BitStream(patchRakNetNatives(RakNetNatives.NewCopy, this.id));
  }

  delete() {
    patchRakNetNatives(RakNetNatives.Delete, this.id);
    return this.id;
  }

  reset() {
    patchRakNetNatives(RakNetNatives.Reset, this.id);
  }

  resetReadPointer() {
    patchRakNetNatives(RakNetNatives.ResetReadPointer, this.id);
  }

  resetWritePointer() {
    patchRakNetNatives(RakNetNatives.ResetWritePointer, this.id);
  }

  ignoreBits(numberOfBits: number) {
    patchRakNetNatives(RakNetNatives.IgnoreBits, this.id, numberOfBits);
  }

  setWriteOffset(offset: number) {
    patchRakNetNatives(RakNetNatives.SetWriteOffset, this.id, offset);
  }

  getWriteOffset(): number {
    return patchRakNetNatives(RakNetNatives.GetWriteOffset, this.id);
  }

  setReadOffset(offset: number) {
    patchRakNetNatives(RakNetNatives.SetReadOffset, this.id, offset);
  }

  getReadOffset(): number {
    return patchRakNetNatives(RakNetNatives.GetReadOffset, this.id);
  }

  getNumberOfBitsUsed(): number {
    return patchRakNetNatives(RakNetNatives.GetNumberOfBitsUsed, this.id);
  }

  getNumberOfBytesUsed(): number {
    return patchRakNetNatives(RakNetNatives.GetNumberOfBytesUsed, this.id);
  }

  getNumberOfUnreadBits(): number {
    return patchRakNetNatives(RakNetNatives.GetNumberOfUnreadBits, this.id);
  }

  getNumberOfBitsAllocated(): number {
    return patchRakNetNatives(RakNetNatives.GetNumberOfBitsAllocated, this.id);
  }

  readValue(...types: (PacketRpcValueType | [PacketRpcValueType, number])[]) {
    const ret: (number | boolean | number[])[] = [];
    types.forEach((item) => {
      const isPlaceholder = Array.isArray(item);
      const type = isPlaceholder ? item[0] : item;
      const value = patchRakNetRead(this.id, type, isPlaceholder ? item[1] : 0);
      ret.push(value);
    });
    return ret.length === 1 ? ret[0] : ret;
  }

  writeValue(
    ...types: [PacketRpcValueType, number | number[] | boolean, number?][]
  ) {
    const ret: boolean[] = [];
    types.forEach((item) => {
      const [type, value, length = 0] = item;

      const isSuccess = patchRakNetWrite(this.id, type, value, length);
      ret.push(isSuccess);
    });
    return ret.length === 1 ? ret[0] : ret;
  }

  // macros

  readInt8() {
    return this.readValue(PacketRpcValueType.Int8) as number;
  }

  readInt16() {
    return this.readValue(PacketRpcValueType.Int16) as number;
  }

  readInt32() {
    return this.readValue(PacketRpcValueType.Int32) as number;
  }

  readUint8() {
    return this.readValue(PacketRpcValueType.UInt8) as number;
  }

  readUint16() {
    return this.readValue(PacketRpcValueType.UInt16) as number;
  }

  readUint32() {
    return this.readValue(PacketRpcValueType.UInt32) as number;
  }

  readFloat() {
    return this.readValue(PacketRpcValueType.Float) as number;
  }

  readBool() {
    return this.readValue(PacketRpcValueType.Bool) as boolean;
  }

  readString(size = 1024) {
    return readStringX(this, size, PacketRpcValueType.String);
  }

  readCompressedInt8() {
    return this.readValue(PacketRpcValueType.CInt8) as number;
  }

  readCompressedInt16() {
    return this.readValue(PacketRpcValueType.CInt16) as number;
  }

  readCompressedInt32() {
    return this.readValue(PacketRpcValueType.CInt32) as number;
  }

  readCompressedUint8() {
    return this.readValue(PacketRpcValueType.CUInt8) as number;
  }

  readCompressedUint16() {
    return this.readValue(PacketRpcValueType.CUInt16) as number;
  }

  readCompressedUint32() {
    return this.readValue(PacketRpcValueType.CUInt32) as number;
  }

  readCompressedFloat() {
    return this.readValue(PacketRpcValueType.CFloat) as number;
  }

  readCompressedBool() {
    return this.readValue(PacketRpcValueType.CBool) as boolean;
  }

  readCompressedString(size: number, charset?: string) {
    return readStringX(this, size, PacketRpcValueType.CString, charset);
  }

  readBits(size: number) {
    return this.readValue([PacketRpcValueType.Bits, size]) as number;
  }

  readFloat3() {
    return this.readValue(PacketRpcValueType.Float3) as Vector3<number>;
  }

  readFloat4() {
    return this.readValue(PacketRpcValueType.Float4) as Vector4<number>;
  }

  readVector() {
    return this.readValue(PacketRpcValueType.Vector) as Vector3<number>;
  }

  readNormQuat() {
    return this.readValue(PacketRpcValueType.NormQuat) as Vector4<number>;
  }

  readString8(charset?: string) {
    return readStringX(this, 8, PacketRpcValueType.String8, charset);
  }

  readString32(charset?: string) {
    return readStringX(this, 32, PacketRpcValueType.String32, charset);
  }

  writeInt8(value: number) {
    return this.writeValue([PacketRpcValueType.Int8, value]) as boolean;
  }

  writeInt16(value: number) {
    return this.writeValue([PacketRpcValueType.Int16, value]) as boolean;
  }

  writeInt32(value: number) {
    return this.writeValue([PacketRpcValueType.Int32, value]) as boolean;
  }

  writeUint8(value: number) {
    return this.writeValue([PacketRpcValueType.UInt8, value]) as boolean;
  }

  writeUint16(value: number) {
    return this.writeValue([PacketRpcValueType.UInt16, value]) as boolean;
  }

  writeUint32(value: number) {
    return this.writeValue([PacketRpcValueType.UInt32, value]) as boolean;
  }

  writeFloat(value: number) {
    return this.writeValue([PacketRpcValueType.Float, value]) as boolean;
  }

  writeBool(value: boolean) {
    return this.writeValue([PacketRpcValueType.Bool, value]) as boolean;
  }

  writeString(value: string | number[], length = 1024) {
    return this.writeValue([
      PacketRpcValueType.String,
      convertToByteString(value, length),
    ]) as boolean;
  }

  writeCompressedInt8(value: number) {
    return this.writeValue([PacketRpcValueType.CInt8, value]) as boolean;
  }

  writeCompressedInt16(value: number) {
    return this.writeValue([PacketRpcValueType.CInt16, value]) as boolean;
  }

  writeCompressedInt32(value: number) {
    return this.writeValue([PacketRpcValueType.CInt32, value]) as boolean;
  }

  writeCompressedUint8(value: number) {
    return this.writeValue([PacketRpcValueType.CUInt8, value]) as boolean;
  }

  writeCompressedUint16(value: number) {
    return this.writeValue([PacketRpcValueType.CUInt16, value]) as boolean;
  }

  writeCompressedUint32(value: number) {
    return this.writeValue([PacketRpcValueType.CUInt32, value]) as boolean;
  }

  writeCompressedFloat(value: number) {
    return this.writeValue([PacketRpcValueType.CFloat, value]) as boolean;
  }

  writeCompressedBool(value: boolean) {
    return this.writeValue([PacketRpcValueType.CBool, value]) as boolean;
  }

  writeCompressedString(value: string, length = 1024) {
    return this.writeValue([
      PacketRpcValueType.CString,
      convertToByteString(value, length),
    ]) as boolean;
  }

  writeBits(value: number, size: number) {
    return this.writeValue([PacketRpcValueType.Bits, value, size]) as boolean;
  }

  writeFloat3(value: Vector3<number>) {
    return this.writeValue([PacketRpcValueType.Float3, value]) as boolean;
  }

  writeFloat4(value: Vector4<number>) {
    return this.writeValue([PacketRpcValueType.Float4, value]) as boolean;
  }

  writeVector(value: Vector3<number>) {
    return this.writeValue([PacketRpcValueType.Vector, value]) as boolean;
  }

  writeNormQuat(value: Vector4<number>) {
    return this.writeValue([PacketRpcValueType.NormQuat, value]) as boolean;
  }

  writeString8(value: string | number[]) {
    return this.writeValue([
      PacketRpcValueType.String8,
      convertToByteString(value, 8),
    ]) as boolean;
  }

  writeString32(value: string | number[]) {
    return this.writeValue([
      PacketRpcValueType.String32,
      convertToByteString(value, 32),
    ]) as boolean;
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
    if (health === 0xf) {
      health = 100;
    } else {
      health *= 7;
    }

    armour = healthArmour & 0xf;
    if (armour === 0xf) {
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
      PacketRpcValueType.UInt16,
    ) as number[];

    while (numberOfSlots--) {
      const [slotId, weaponId, ammo] = this.readValue(
        PacketRpcValueType.UInt8,
        PacketRpcValueType.UInt8,
        PacketRpcValueType.UInt16,
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
      PacketRpcValueType.Int32,
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
      [PacketRpcValueType.UInt16, data.targetActorId],
    );

    for (let slotId = 0; slotId < PR_MAX_WEAPON_SLOTS; slotId++) {
      if (!data.slotUpdated[slotId]) {
        continue;
      }

      this.writeValue(
        [PacketRpcValueType.UInt8, slotId],
        [PacketRpcValueType.UInt8, data.slotWeaponId[slotId]],
        [PacketRpcValueType.UInt16, data.slotWeaponAmmo[slotId]],
      );
    }
  }

  writeStatsUpdate(data: IStatsUpdate) {
    this.writeValue(
      [PacketRpcValueType.Int32, data.money],
      [PacketRpcValueType.Int32, data.drunkLevel],
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
    orderingChannel = 0,
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
    orderingChannel = 0,
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
    orderingChannel = 0,
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
    orderingChannel = 0,
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
