import { PacketRpcValueType } from "./enums";
import { PacketRpcPriority, PacketRpcReliability } from "./enums";
import type { BitStreamRaw, Vector3, Vector4, ReadValueResult, WriteTuple } from "./types";
import { VALUE_KIND, TYPE_TO_KIND, BOOL_TYPES } from "./types";
import { PR_MAX_WEAPON_SLOTS } from "./defines";
import type { IRconCommand, IStatsUpdate, IWeaponsUpdate } from "./interfaces";
import type { Vehicle, Player } from "@infernus/core";
import { InvalidEnum, I18n } from "@infernus/core";
import { RakNetException } from "./exceptions";

export class BitStream {
  public readonly id: BitStreamRaw;

  constructor(from?: BitStreamRaw | BitStream) {
    if (!from) this.id = samp.callNative("BS_New", "") as BitStreamRaw;
    else if (from instanceof BitStream) {
      this.id = from.id;
    } else {
      this.id = from;
    }
  }

  sendPacket(
    player: number | Player,
    priority = PacketRpcPriority.High,
    reliability = PacketRpcReliability.ReliableOrdered,
    orderingChannel = 0,
  ) {
    const id = typeof player === "number" ? player : player.id;
    return samp.callNative(
      "PR_SendPacket",
      "iiiii",
      this.id,
      id,
      priority,
      reliability,
      orderingChannel,
    ) as number;
  }

  sendRPC(
    player: number | Player,
    rpcId: number,
    priority = PacketRpcPriority.High,
    reliability = PacketRpcReliability.ReliableOrdered,
    orderingChannel = 0,
  ) {
    const id = typeof player === "number" ? player : player.id;
    return samp.callNative(
      "PR_SendRPC",
      "iiiiii",
      this.id,
      id,
      rpcId,
      priority,
      reliability,
      orderingChannel,
    ) as number;
  }

  emulateIncomingPacket(player: number | Player) {
    const pid = typeof player === "number" ? player : player.id;
    return samp.callNative("BS_EmulateIncomingPacket", "ii", this.id, pid) as number;
  }

  emulateIncomingRPC(player: number | Player, rpcId: number) {
    const pid = typeof player === "number" ? player : player.id;
    return samp.callNative("BS_EmulateIncomingRPC", "iii", this.id, pid, rpcId) as number;
  }

  newCopy() {
    const newId = samp.callNative("BS_NewCopy", "i", this.id) as BitStreamRaw;
    return this.isIncoming() ? new IncomingBitStream(newId) : new BitStream(newId);
  }

  delete() {
    return samp.callNative("BS_Delete", "i", this.id) as number;
  }

  reset() {
    return samp.callNative("BS_Reset", "i", this.id) as number;
  }

  resetReadPointer() {
    return samp.callNative("BS_ResetReadPointer", "i", this.id) as number;
  }

  resetWritePointer() {
    return samp.callNative("BS_ResetWritePointer", "i", this.id) as number;
  }

  ignoreBits(numberOfBits: number) {
    return samp.callNative("BS_IgnoreBits", "ii", this.id, numberOfBits) as number;
  }

  setWriteOffset(offset: number) {
    return samp.callNative("BS_SetWriteOffset", "ii", this.id, offset) as number;
  }

  getWriteOffset() {
    const [offset, ret]: [number, number] = samp.callNative("BS_GetWriteOffset", "iI", this.id);
    return { offset, ret };
  }

  setReadOffset(offset: number) {
    return samp.callNative("BS_SetReadOffset", "ii", this.id, offset) as number;
  }

  getReadOffset() {
    const [offset, ret]: [number, number] = samp.callNative("BS_GetReadOffset", "iI", this.id);
    return { offset, ret };
  }

  getNumberOfBitsUsed() {
    const [bits, ret]: [number, number] = samp.callNative("BS_GetNumberOfBitsUsed", "iI", this.id);
    return { bits, ret };
  }

  getNumberOfBytesUsed() {
    const [bytes, ret]: [number, number] = samp.callNative(
      "BS_GetNumberOfBytesUsed",
      "iI",
      this.id,
    );
    return { bytes, ret };
  }

  getNumberOfUnreadBits() {
    const [bits, ret]: [number, number] = samp.callNative(
      "BS_GetNumberOfUnreadBits",
      "iI",
      this.id,
    );
    return { bits, ret };
  }

  getNumberOfBitsAllocated() {
    const [bits, ret]: [number, number] = samp.callNative(
      "BS_GetNumberOfBitsAllocated",
      "iI",
      this.id,
    );
    return { bits, ret };
  }

  readValue(type: PacketRpcValueType.Int8): [number, number];
  readValue(type: PacketRpcValueType.Int16): [number, number];
  readValue(type: PacketRpcValueType.Int32): [number, number];
  readValue(type: PacketRpcValueType.UInt8): [number, number];
  readValue(type: PacketRpcValueType.UInt16): [number, number];
  readValue(type: PacketRpcValueType.UInt32): [number, number];
  readValue(type: PacketRpcValueType.Float): [number, number];
  readValue(type: PacketRpcValueType.Bool): [boolean, number];
  readValue(type: PacketRpcValueType.String, length?: number): [string, number];
  readValue(type: PacketRpcValueType.CInt8): [number, number];
  readValue(type: PacketRpcValueType.CInt16): [number, number];
  readValue(type: PacketRpcValueType.CInt32): [number, number];
  readValue(type: PacketRpcValueType.CUInt8): [number, number];
  readValue(type: PacketRpcValueType.CUInt16): [number, number];
  readValue(type: PacketRpcValueType.CUInt32): [number, number];
  readValue(type: PacketRpcValueType.CFloat): [number, number];
  readValue(type: PacketRpcValueType.CBool): [boolean, number];
  readValue(type: PacketRpcValueType.CString, length?: number): [string, number];
  readValue(type: PacketRpcValueType.Bits, size: number): [number, number];
  readValue(type: PacketRpcValueType.Float3): [Vector3<number>, number];
  readValue(type: PacketRpcValueType.Float4): [Vector4<number>, number];
  readValue(type: PacketRpcValueType.Vector): [Vector3<number>, number];
  readValue(type: PacketRpcValueType.NormQuat): [Vector4<number>, number];
  readValue(type: PacketRpcValueType.String8, length?: number): [string, number];
  readValue(type: PacketRpcValueType.String32, length?: number): [string, number];
  readValue<T extends Array<readonly [PacketRpcValueType] | readonly [PacketRpcValueType, number]>>(
    ...items: T
  ): [...ReadValueResult<T>, number];
  readValue(...args: any[]) {
    const isBatch = Array.isArray(args[0]);
    const normalized: Array<readonly [PacketRpcValueType] | readonly [PacketRpcValueType, number]> =
      isBatch ? args : args[1] !== undefined ? [[args[0], args[1]]] : [[args[0]]];
    const result = this.readMany(normalized);
    return isBatch ? result : [result[0], result[result.length - 1]];
  }

  writeValue(type: PacketRpcValueType.Int8, value: number): number;
  writeValue(type: PacketRpcValueType.Int16, value: number): number;
  writeValue(type: PacketRpcValueType.Int32, value: number): number;
  writeValue(type: PacketRpcValueType.UInt8, value: number): number;
  writeValue(type: PacketRpcValueType.UInt16, value: number): number;
  writeValue(type: PacketRpcValueType.UInt32, value: number): number;
  writeValue(type: PacketRpcValueType.Float, value: number): number;
  writeValue(type: PacketRpcValueType.Bool, value: boolean): number;
  writeValue(type: PacketRpcValueType.String, value: string): number;
  writeValue(type: PacketRpcValueType.CInt8, value: number): number;
  writeValue(type: PacketRpcValueType.CInt16, value: number): number;
  writeValue(type: PacketRpcValueType.CInt32, value: number): number;
  writeValue(type: PacketRpcValueType.CUInt8, value: number): number;
  writeValue(type: PacketRpcValueType.CUInt16, value: number): number;
  writeValue(type: PacketRpcValueType.CUInt32, value: number): number;
  writeValue(type: PacketRpcValueType.CFloat, value: number): number;
  writeValue(type: PacketRpcValueType.CBool, value: boolean): number;
  writeValue(type: PacketRpcValueType.CString, value: string): number;
  writeValue(type: PacketRpcValueType.Bits, value: number, size: number): number;
  writeValue(type: PacketRpcValueType.Float3, value: Vector3<number>): number;
  writeValue(type: PacketRpcValueType.Float4, value: Vector4<number>): number;
  writeValue(type: PacketRpcValueType.Vector, value: Vector3<number>): number;
  writeValue(type: PacketRpcValueType.NormQuat, value: Vector4<number>): number;
  writeValue(type: PacketRpcValueType.String8, value: string): number;
  writeValue(type: PacketRpcValueType.String32, value: string): number;
  writeValue(...tuples: WriteTuple[]): number;
  writeValue(...args: any[]): number {
    const isBatch = Array.isArray(args[0]);
    const normalized: WriteTuple[] = isBatch ? args : [args as any];
    return this.writeMany(normalized);
  }

  private readMany(
    items: Array<readonly [PacketRpcValueType] | readonly [PacketRpcValueType, number]>,
  ) {
    const BATCH_LIMIT = 28;
    const outputs: any[] = [];
    let lastReturn = 0;
    let index = 0;

    while (index < items.length) {
      const firstInfo = VALUE_KIND[TYPE_TO_KIND[items[index][0]]!] as any;
      const batchReadFormat = firstInfo.r;

      const formatParts: string[] = [];
      const nativeArgs: any[] = [this.id];
      let formatCharCount = 1;
      const batchBoolPositions: number[] = [];
      const batchStart = index;
      let prStringOverread = 0;

      for (; index < items.length; index++) {
        const [type, userSize] = items[index];
        const info = VALUE_KIND[TYPE_TO_KIND[type]!] as any;
        const readFormat = info.r;
        const fixedCount = info.n as number | undefined;
        const isSizeRequired = info.sr as boolean | undefined;

        if (readFormat !== batchReadFormat) break;
        if (formatCharCount + readFormat.length > BATCH_LIMIT) break;

        if (BOOL_TYPES.has(type)) {
          batchBoolPositions.push(index - batchStart);
        }

        formatParts.push(readFormat);
        nativeArgs.push(type);

        const needsSize = readFormat.length > 2;
        if (needsSize) {
          if (fixedCount != null) {
            nativeArgs.push((userSize ?? fixedCount) + 1);
          } else if (isSizeRequired) {
            if (userSize == null) throw new RakNetException("Bits requires size");
            nativeArgs.push(userSize);
          } else {
            if (type === PacketRpcValueType.String) {
              if (userSize == null) throw new RakNetException("String requires size");
              nativeArgs.push(userSize + 1);
              prStringOverread += 8;
            } else {
              const s = userSize ?? (type === PacketRpcValueType.String8 ? 256 : 4096);
              nativeArgs.push(s + 1);
            }
          }
        }

        formatCharCount += readFormat.length;
      }

      const format = `ir[${formatParts.join("")}]`;
      const result = samp.callNative("BS_ReadValue", format, ...nativeArgs) as any[];
      const ret = result.pop()!;
      lastReturn = ret;
      for (const pos of batchBoolPositions) result[pos] = !!result[pos];
      outputs.push(...result);

      if (prStringOverread > 0) {
        this.setReadOffset(this.getReadOffset().offset - prStringOverread);
      }
    }

    return [...outputs, lastReturn];
  }

  private writeMany(items: WriteTuple[]): number {
    const BATCH_LIMIT = 28;
    let result = 0;
    let index = 0;

    while (index < items.length) {
      const formatParts: string[] = [];
      const nativeArgs: any[] = [this.id];
      let formatCharCount = 1;

      for (; index < items.length; index++) {
        const item = items[index];
        const [type, value, userSize] = item;
        const info = VALUE_KIND[TYPE_TO_KIND[type]!] as any;
        const writeFormat = info.w;
        const fixedCount = info.n as number | undefined;
        const isSizeRequired = info.sr as boolean | undefined;

        const formatLen = writeFormat.length;
        if (formatCharCount + formatLen > BATCH_LIMIT) break;

        let size: number | undefined = userSize;
        if (fixedCount != null) {
          size = fixedCount;
        } else if (isSizeRequired) {
          if (size == null) throw new RakNetException("Bits requires size");
        }

        formatParts.push(writeFormat);
        nativeArgs.push(type, value);
        if (formatLen > 2) nativeArgs.push(size);
        formatCharCount += formatLen;
      }

      const format = `ir[${formatParts.join("")}]`;
      result = samp.callNative("BS_WriteValue", format, ...nativeArgs) as number;
    }

    return result;
  }

  private static isNotUtf8(charset?: string): charset is string {
    return charset != null && charset.toLowerCase() !== "utf8";
  }

  private readRawBytes(type: PacketRpcValueType, size: number): [number[], number] {
    const result = samp.callNative("BS_ReadValue", "ir[iAi]", this.id, type, size);
    return [result[0] as number[], result[1] as number];
  }

  private writeRawBytes(type: PacketRpcValueType, data: number[]): number {
    return samp.callNative("BS_WriteValue", "ir[ia]", this.id, type, data);
  }

  readInt8() {
    return this.readValue(PacketRpcValueType.Int8);
  }
  readInt16() {
    return this.readValue(PacketRpcValueType.Int16);
  }
  readInt32() {
    return this.readValue(PacketRpcValueType.Int32);
  }
  readUint8() {
    return this.readValue(PacketRpcValueType.UInt8);
  }
  readUint16() {
    return this.readValue(PacketRpcValueType.UInt16);
  }
  readUint32() {
    return this.readValue(PacketRpcValueType.UInt32);
  }
  readFloat() {
    return this.readValue(PacketRpcValueType.Float);
  }
  readBool() {
    return this.readValue(PacketRpcValueType.Bool);
  }
  readString(size: number, charset?: string) {
    if (BitStream.isNotUtf8(charset)) {
      const items: [PacketRpcValueType.UInt8][] = [];
      for (let i = 0; i < size; i++) items.push([PacketRpcValueType.UInt8]);
      const result = this.readValue(...(items as any)) as number[];
      const ret = result[result.length - 1];
      return [I18n.decodeFromBuf(result.slice(0, -1), charset), ret];
    }

    return this.readValue(PacketRpcValueType.String, size);
  }
  readCompressedInt8() {
    return this.readValue(PacketRpcValueType.CInt8);
  }
  readCompressedInt16() {
    return this.readValue(PacketRpcValueType.CInt16);
  }
  readCompressedInt32() {
    return this.readValue(PacketRpcValueType.CInt32);
  }
  readCompressedUint8() {
    return this.readValue(PacketRpcValueType.CUInt8);
  }
  readCompressedUint16() {
    return this.readValue(PacketRpcValueType.CUInt16);
  }
  readCompressedUint32() {
    return this.readValue(PacketRpcValueType.CUInt32);
  }
  readCompressedFloat() {
    return this.readValue(PacketRpcValueType.CFloat);
  }
  readCompressedBool() {
    return this.readValue(PacketRpcValueType.CBool);
  }
  readCompressedString(size: number, charset?: string) {
    if (BitStream.isNotUtf8(charset)) {
      const [bytes, ret] = this.readRawBytes(PacketRpcValueType.CString, size);
      return [I18n.decodeFromBuf(bytes, charset), ret] as [string, number];
    }
    return this.readValue(PacketRpcValueType.CString, size);
  }
  readBits(size: number) {
    return this.readValue(PacketRpcValueType.Bits, size);
  }
  readFloat3() {
    return this.readValue(PacketRpcValueType.Float3);
  }
  readFloat4() {
    return this.readValue(PacketRpcValueType.Float4);
  }
  readVector() {
    return this.readValue(PacketRpcValueType.Vector);
  }
  readNormQuat() {
    return this.readValue(PacketRpcValueType.NormQuat);
  }
  readString8(size?: number, charset?: string) {
    if (BitStream.isNotUtf8(charset)) {
      const s = size ?? 256;
      const [bytes, ret] = this.readRawBytes(PacketRpcValueType.String8, s);
      return [I18n.decodeFromBuf(bytes, charset), ret] as [string, number];
    }
    return this.readValue(PacketRpcValueType.String8, size ?? 256);
  }
  readString32(size?: number, charset?: string) {
    if (BitStream.isNotUtf8(charset)) {
      const s = size ?? 4096;
      const [bytes, ret] = this.readRawBytes(PacketRpcValueType.String32, s);
      return [I18n.decodeFromBuf(bytes, charset), ret] as [string, number];
    }
    return this.readValue(PacketRpcValueType.String32, size ?? 4096);
  }

  writeInt8(value: number) {
    return this.writeValue(PacketRpcValueType.Int8, value);
  }
  writeInt16(value: number) {
    return this.writeValue(PacketRpcValueType.Int16, value);
  }
  writeInt32(value: number) {
    return this.writeValue(PacketRpcValueType.Int32, value);
  }
  writeUint8(value: number) {
    return this.writeValue(PacketRpcValueType.UInt8, value);
  }
  writeUint16(value: number) {
    return this.writeValue(PacketRpcValueType.UInt16, value);
  }
  writeUint32(value: number) {
    return this.writeValue(PacketRpcValueType.UInt32, value);
  }
  writeFloat(value: number) {
    return this.writeValue(PacketRpcValueType.Float, value);
  }
  writeBool(value: boolean) {
    return this.writeValue(PacketRpcValueType.Bool, value);
  }
  writeString(value: string, charset?: string) {
    if (BitStream.isNotUtf8(charset)) {
      return this.writeRawBytes(PacketRpcValueType.String, I18n.encodeToBuf(value, charset));
    }
    return this.writeValue(PacketRpcValueType.String, value);
  }
  writeCompressedInt8(value: number) {
    return this.writeValue(PacketRpcValueType.CInt8, value);
  }
  writeCompressedInt16(value: number) {
    return this.writeValue(PacketRpcValueType.CInt16, value);
  }
  writeCompressedInt32(value: number) {
    return this.writeValue(PacketRpcValueType.CInt32, value);
  }
  writeCompressedUint8(value: number) {
    return this.writeValue(PacketRpcValueType.CUInt8, value);
  }
  writeCompressedUint16(value: number) {
    return this.writeValue(PacketRpcValueType.CUInt16, value);
  }
  writeCompressedUint32(value: number) {
    return this.writeValue(PacketRpcValueType.CUInt32, value);
  }
  writeCompressedFloat(value: number) {
    return this.writeValue(PacketRpcValueType.CFloat, value);
  }
  writeCompressedBool(value: boolean) {
    return this.writeValue(PacketRpcValueType.CBool, value);
  }
  writeCompressedString(value: string, charset?: string) {
    if (BitStream.isNotUtf8(charset)) {
      return this.writeRawBytes(PacketRpcValueType.CString, I18n.encodeToBuf(value, charset));
    }
    return this.writeValue(PacketRpcValueType.CString, value);
  }
  writeBits(value: number, size: number) {
    return this.writeValue(PacketRpcValueType.Bits, value, size);
  }
  writeFloat3(value: Vector3<number>) {
    return this.writeValue(PacketRpcValueType.Float3, value);
  }
  writeFloat4(value: Vector4<number>) {
    return this.writeValue(PacketRpcValueType.Float4, value);
  }
  writeVector(value: Vector3<number>) {
    return this.writeValue(PacketRpcValueType.Vector, value);
  }
  writeNormQuat(value: Vector4<number>) {
    return this.writeValue(PacketRpcValueType.NormQuat, value);
  }
  writeString8(value: string, charset?: string) {
    if (BitStream.isNotUtf8(charset)) {
      return this.writeRawBytes(PacketRpcValueType.String8, I18n.encodeToBuf(value, charset));
    }
    return this.writeValue(PacketRpcValueType.String8, value);
  }
  writeString32(value: string, charset?: string) {
    if (BitStream.isNotUtf8(charset)) {
      return this.writeRawBytes(PacketRpcValueType.String32, I18n.encodeToBuf(value, charset));
    }
    return this.writeValue(PacketRpcValueType.String32, value);
  }

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
      healthArmour = 0xf0;
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

  readWeaponsUpdate() {
    const data: Partial<IWeaponsUpdate> = {
      slotWeaponId: [],
      slotWeaponAmmo: [],
      slotUpdated: [],
    };

    const [targetId, targetActorId] = this.readValue(
      [PacketRpcValueType.UInt16],
      [PacketRpcValueType.UInt16],
    );

    data.targetId = targetId;
    data.targetActorId = targetActorId;

    const bytes = this.getNumberOfBytesUsed().bytes;
    const slots = bytes > 5 ? (bytes - 5) / 4 : 0;

    for (let i = 0; i < slots; i++) {
      const [slotId, weaponId, ammo] = this.readValue(
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.UInt8],
        [PacketRpcValueType.UInt16],
      );

      if (slotId < PR_MAX_WEAPON_SLOTS) {
        data.slotWeaponId![slotId] = weaponId;
        data.slotWeaponAmmo![slotId] = ammo;
        data.slotUpdated![slotId] = true;
      }
    }

    return data as IWeaponsUpdate;
  }

  readStatsUpdate() {
    const data: Partial<IStatsUpdate> = {};

    const [money, drunkLevel] = this.readValue(
      [PacketRpcValueType.Int32],
      [PacketRpcValueType.Int32],
    );

    data.money = money;
    data.drunkLevel = drunkLevel;

    return data as IStatsUpdate;
  }

  readRconCommand() {
    const [command] = this.readValue(PacketRpcValueType.String32);
    return { command } as IRconCommand;
  }

  writeWeaponsUpdate(data: IWeaponsUpdate) {
    this.writeValue(
      [PacketRpcValueType.UInt16, data.targetId],
      [PacketRpcValueType.UInt16, data.targetActorId],
    );

    for (let i = 0; i < PR_MAX_WEAPON_SLOTS; i++) {
      if (!data.slotUpdated?.[i]) continue;

      this.writeValue(
        [PacketRpcValueType.UInt8, i],
        [PacketRpcValueType.UInt8, data.slotWeaponId[i]],
        [PacketRpcValueType.UInt16, data.slotWeaponAmmo[i]],
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
      if (!p.isStreamedIn(player)) return;
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
      if (excludedPlayer !== InvalidEnum.PLAYER_ID) {
        if (p === excludedPlayer || !vehicle.isStreamedIn(p)) return;
      }
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
      if (excludedPlayer !== InvalidEnum.PLAYER_ID) {
        if (p === excludedPlayer || !vehicle.isStreamedIn(p)) return;
      }
      this.sendRPC(p.id, rpcId, priority, reliability, orderingChannel);
    });
  }

  isIncoming() {
    return this instanceof IncomingBitStream;
  }
}

export class IncomingBitStream extends BitStream {}
