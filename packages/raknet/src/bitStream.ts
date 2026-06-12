import { PacketRpcValueType } from "./enums";
import { PacketRpcPriority, PacketRpcReliability } from "./enums";
import type { BitStreamRaw, Vector3, Vector4, ReadValueResult, WriteTuple } from "./types";
import { VALUE_KIND, TYPE_TO_KIND, BOOL_TYPES } from "./types";
import { PR_MAX_WEAPON_SLOTS } from "./defines";
import type { IRconCommand, IStatsUpdate, IWeaponsUpdate } from "./interfaces";
import type { Vehicle, Player } from "@infernus/core";
import { InvalidEnum } from "@infernus/core";
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
  readValue(type: PacketRpcValueType.String8): [string, number];
  readValue(type: PacketRpcValueType.String32): [string, number];
  readValue<T extends Array<readonly [PacketRpcValueType] | readonly [PacketRpcValueType, number]>>(
    ...items: T
  ): [...ReadValueResult<T>, number];
  readValue(...args: any[]) {
    if (args.length > 0 && Array.isArray(args[0])) {
      return this.readMany(args as any);
    }
    const [type, size] = args;
    const kind = TYPE_TO_KIND[type]!;
    const info = VALUE_KIND[kind] as any;
    const callArgs: any[] = [this.id, type];

    if (info.n != null) {
      callArgs.push(info.n);
    } else if (info.sr) {
      if (size == null) throw new RakNetException("Bits requires size");
      callArgs.push(size);
    } else if (info.ds != null) {
      callArgs.push(size ?? info.ds);
    }

    const format = `ir[${info.r}]`;
    const [value, ret] = samp.callNative("BS_ReadValue", format, ...callArgs);
    return [BOOL_TYPES.has(type) ? !!value : value, ret as number];
  }

  writeValue(type: PacketRpcValueType.Int8, value: number): number;
  writeValue(type: PacketRpcValueType.Int16, value: number): number;
  writeValue(type: PacketRpcValueType.Int32, value: number): number;
  writeValue(type: PacketRpcValueType.UInt8, value: number): number;
  writeValue(type: PacketRpcValueType.UInt16, value: number): number;
  writeValue(type: PacketRpcValueType.UInt32, value: number): number;
  writeValue(type: PacketRpcValueType.Float, value: number): number;
  writeValue(type: PacketRpcValueType.Bool, value: boolean): number;
  writeValue(type: PacketRpcValueType.String, value: string, length?: number): number;
  writeValue(type: PacketRpcValueType.CInt8, value: number): number;
  writeValue(type: PacketRpcValueType.CInt16, value: number): number;
  writeValue(type: PacketRpcValueType.CInt32, value: number): number;
  writeValue(type: PacketRpcValueType.CUInt8, value: number): number;
  writeValue(type: PacketRpcValueType.CUInt16, value: number): number;
  writeValue(type: PacketRpcValueType.CUInt32, value: number): number;
  writeValue(type: PacketRpcValueType.CFloat, value: number): number;
  writeValue(type: PacketRpcValueType.CBool, value: boolean): number;
  writeValue(type: PacketRpcValueType.CString, value: string, length?: number): number;
  writeValue(type: PacketRpcValueType.Bits, value: number, size: number): number;
  writeValue(type: PacketRpcValueType.Float3, value: Vector3<number>): number;
  writeValue(type: PacketRpcValueType.Float4, value: Vector4<number>): number;
  writeValue(type: PacketRpcValueType.Vector, value: Vector3<number>): number;
  writeValue(type: PacketRpcValueType.NormQuat, value: Vector4<number>): number;
  writeValue(type: PacketRpcValueType.String8, value: string): number;
  writeValue(type: PacketRpcValueType.String32, value: string): number;
  writeValue(...tuples: WriteTuple[]): number;
  writeValue(...args: any[]): number {
    if (args.length > 0 && Array.isArray(args[0])) {
      return this.writeMany(args as any);
    }
    const [type, value, s] = args;
    const kind = TYPE_TO_KIND[type]!;
    const info = VALUE_KIND[kind] as any;
    let v = value;
    let size: number | undefined = s;

    if (info.n != null) {
      const max = info.n as number;
      if (typeof v === "string") {
        if (v.length >= max) {
          v = v.slice(0, max - 1);
        }
        v += "\0";
        size = v.length;
      } else {
        size = max;
      }
    } else if (info.sr) {
      if (size == null) throw new RakNetException("Bits requires size");
    } else if (info.ds != null) {
      const max = size ?? (info.ds as number);
      if (typeof v === "string") {
        if (v.length >= max) {
          v = v.slice(0, max - 1);
        }
        v += "\0";
        size = v.length;
      } else {
        size = max;
      }
    }

    const fmt = `ir[${info.w}]`;
    return samp.callNative(
      "BS_WriteValue",
      fmt,
      this.id,
      type,
      v,
      ...(info.w.length > 2 ? [size] : []),
    ) as number;
  }

  private readMany(
    items: Array<readonly [PacketRpcValueType] | readonly [PacketRpcValueType, number]>,
  ) {
    const RETRY_LIMIT = 28;
    const allValues: any[] = [];
    let lastRet = 0;
    let i = 0;

    while (i < items.length) {
      const inf = VALUE_KIND[TYPE_TO_KIND[items[i][0]]!] as any;
      const inner: string[] = [];
      const args: any[] = [this.id];
      let slots = 1;
      const boolOffsets: number[] = [];
      const base = i;
      const batchKind = inf.r;

      for (; i < items.length; i++) {
        const t = items[i][0];
        const userSize = items[i][1];
        const ii = VALUE_KIND[TYPE_TO_KIND[t]!] as any;
        if (ii.r !== batchKind) break;
        if (slots + ii.r.length > RETRY_LIMIT) break;

        if (BOOL_TYPES.has(t)) boolOffsets.push(i - base);
        inner.push(ii.r);
        args.push(t);

        if (ii.n != null) {
          args.push(ii.n);
        } else if (ii.sr) {
          if (userSize == null) throw new RakNetException("Bits requires size");
          args.push(userSize);
        } else if (ii.ds != null) {
          args.push(userSize ?? ii.ds);
        }

        slots += ii.r.length;
      }

      const format = `ir[${inner.join("")}]`;
      const result = samp.callNative("BS_ReadValue", format, ...args) as any[];
      const ret = result.pop()!;
      lastRet = ret;
      for (const pos of boolOffsets) result[pos] = !!result[pos];
      allValues.push(...result);
    }

    return [...allValues, lastRet];
  }

  private writeMany(
    items: Array<readonly [PacketRpcValueType, any] | readonly [PacketRpcValueType, any, number]>,
  ): number {
    const RETRY_LIMIT = 28;
    let result = 0;
    let i = 0;

    while (i < items.length) {
      const inner: string[] = [];
      const args: any[] = [this.id];
      let slots = 1;

      for (; i < items.length; i++) {
        const item = items[i];
        const [t, value, userSize] = item;
        const kind = TYPE_TO_KIND[t]!;
        const info = VALUE_KIND[kind] as any;
        let v = value;
        let size: number | undefined = userSize;

        if (info.n != null) {
          const max = info.n as number;
          if (typeof v === "string") {
            if (v.length >= max) {
              v = v.slice(0, max - 1);
            }
            v += "\0";
            size = v.length;
          } else {
            size = max;
          }
        } else if (info.sr) {
          if (size == null) throw new RakNetException("Bits requires size");
        } else if (info.ds != null) {
          const max = size ?? (info.ds as number);
          if (typeof v === "string") {
            if (v.length >= max) {
              v = v.slice(0, max - 1);
            }
            v += "\0";
            size = v.length;
          } else {
            size = max;
          }
        }

        const need = info.w.length;
        if (slots + need > RETRY_LIMIT) break;

        inner.push(info.w);
        args.push(t, v);
        if (info.w.length > 2) args.push(size);
        slots += need;
      }

      const format = `ir[${inner.join("")}]`;
      result = samp.callNative("BS_WriteValue", format, ...args) as number;
    }

    return result;
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
  readString(size = 1024) {
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
  readCompressedString(size: number) {
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
  readString8() {
    return this.readValue(PacketRpcValueType.String8);
  }
  readString32() {
    return this.readValue(PacketRpcValueType.String32);
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
  writeString(value: string, length = 1024) {
    return this.writeValue(PacketRpcValueType.String, value, length);
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
  writeCompressedString(value: string, length = 1024) {
    return this.writeValue(PacketRpcValueType.CString, value, length);
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
  writeString8(value: string) {
    return this.writeValue(PacketRpcValueType.String8, value);
  }
  writeString32(value: string) {
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
