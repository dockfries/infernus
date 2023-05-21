import { PR_ValueType } from "./enums";
import {
  PR_PacketPriority,
  PR_PacketReliability,
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
import type { Player, Vehicle } from "@infernus/core";
import { InvalidEnum } from "@infernus/core";

export class BitStream {
  private id: BitStreamRaw;

  constructor(from_id?: BitStreamRaw) {
    this.id = from_id || patchRakNetNative(RakNetNatives.NEW);
  }

  // natives

  sendPacket(
    playerId: number,
    priority = PR_PacketPriority.HIGH,
    reliability = PR_PacketReliability.RELIABLE_ORDERED,
    orderingChannel = 0
  ) {
    patchRakNetNative(
      RakNetNatives.SEND_PACKET,
      this.id,
      playerId,
      priority,
      reliability,
      orderingChannel
    );
  }

  sendRPC(
    playerId: number,
    rpcId: number,
    priority = PR_PacketPriority.HIGH,
    reliability = PR_PacketReliability.RELIABLE_ORDERED,
    orderingChannel = 0
  ) {
    patchRakNetNative(
      RakNetNatives.SEND_RPC,
      this.id,
      playerId,
      rpcId,
      priority,
      reliability,
      orderingChannel
    );
  }

  emulateIncomingPacket(playerId: number) {
    patchRakNetNative(RakNetNatives.EMULATE_INCOMING_PACKET, this.id, playerId);
  }

  emulateIncomingRPC(playerId: number, rpcId: number) {
    patchRakNetNative(
      RakNetNatives.EMULATE_INCOMING_RPC,
      this.id,
      playerId,
      rpcId
    );
  }

  newCopy() {
    return new BitStream(patchRakNetNative(RakNetNatives.NEW_COPY, this.id));
  }

  delete() {
    patchRakNetNative(RakNetNatives.DELETE, this.id);
    return this.id;
  }

  reset() {
    patchRakNetNative(RakNetNatives.RESET, this.id);
  }

  resetReadPointer() {
    patchRakNetNative(RakNetNatives.RESET_READ_POINTER, this.id);
  }

  resetWritePointer() {
    patchRakNetNative(RakNetNatives.RESET_WRITE_POINTER, this.id);
  }

  ignoreBits(number_of_bits: number) {
    patchRakNetNative(RakNetNatives.IGNORE_BITS, this.id, number_of_bits);
  }

  setWriteOffset(offset: number) {
    patchRakNetNative(RakNetNatives.SET_WRITE_OFFSET, this.id, offset);
  }

  getWriteOffset(): number {
    return patchRakNetNative(RakNetNatives.GET_WRITE_OFFSET, this.id);
  }

  setReadOffset(offset: number) {
    patchRakNetNative(RakNetNatives.SET_READ_OFFSET, this.id, offset);
  }

  getReadOffset(): number {
    return patchRakNetNative(RakNetNatives.GET_READ_OFFSET, this.id);
  }

  getNumberOfBitsUsed(): number {
    return patchRakNetNative(RakNetNatives.GET_NUMBER_OF_BITS_USED, this.id);
  }

  getNumberOfBytesUsed(): number {
    return patchRakNetNative(RakNetNatives.GET_NUMBER_OF_BYTES_USED, this.id);
  }

  getNumberOfUnreadBits(): number {
    return patchRakNetNative(RakNetNatives.GET_NUMBER_OF_UNREAD_BITS, this.id);
  }

  getNumberOfBitsAllocated(): number {
    return patchRakNetNative(
      RakNetNatives.GET_NUMBER_OF_BITS_ALLOCATED,
      this.id
    );
  }

  readValue(
    ...types: (PR_ValueType | [PR_ValueType, number])[]
  ): number | number[] | (number | number[])[] {
    const ret: any[] = [];
    types.forEach((item) => {
      const isPlaceholder = Array.isArray(item);
      const type = isPlaceholder ? item[0] : item;
      ret.push(
        patchRakNetNative(
          RakNetNatives.READ_VALUE,
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
          PR_ValueType,
          number | number[] | boolean | (number | number[] | boolean)[]
        ]
      | [
          PR_ValueType,
          number | number[] | boolean | (number | number[] | boolean)[],
          number
        ]
    )[]
  ) {
    types.forEach((item) => {
      patchRakNetNative(
        RakNetNatives.WRITE_VALUE,
        this.id,
        item[0],
        item[1],
        item[2] || 0
      );
    });
  }

  // macros

  readInt8() {
    return this.readValue(this.id, PR_ValueType.INT8);
  }

  readInt16() {
    return this.readValue(this.id, PR_ValueType.INT16);
  }

  readInt32() {
    return this.readValue(this.id, PR_ValueType.INT32);
  }

  readUint8() {
    return this.readValue(this.id, PR_ValueType.UINT8);
  }

  readUint16() {
    return this.readValue(this.id, PR_ValueType.UINT16);
  }

  readUint32() {
    return this.readValue(this.id, PR_ValueType.UINT32);
  }

  readFloat() {
    return this.readValue(this.id, PR_ValueType.FLOAT);
  }

  readBool() {
    return this.readValue(this.id, PR_ValueType.BOOL);
  }

  readString(size = 1024) {
    return readStringX(this, size);
  }

  readCompressedInt8() {
    return this.readValue(this.id, PR_ValueType.CINT8);
  }

  readCompressedInt16() {
    return this.readValue(this.id, PR_ValueType.CINT16);
  }

  readCompressedInt32() {
    return this.readValue(this.id, PR_ValueType.CINT32);
  }

  readCompressedUint8() {
    return this.readValue(this.id, PR_ValueType.CUINT8);
  }

  readCompressedUint16() {
    return this.readValue(this.id, PR_ValueType.CUINT16);
  }

  readCompressedUint32() {
    return this.readValue(this.id, PR_ValueType.CUINT32);
  }

  readCompressedFloat() {
    return this.readValue(this.id, PR_ValueType.CFLOAT);
  }

  readCompressedBool() {
    return this.readValue(this.id, PR_ValueType.CBOOL);
  }

  readCompressedString(size: number) {
    return readStringX(this, size, true);
  }

  readBits(size: number) {
    return this.readValue(this.id, [PR_ValueType.BITS, size]);
  }

  readFloat3() {
    return this.readValue(this.id, PR_ValueType.FLOAT3);
  }

  readFloat4() {
    return this.readValue(this.id, PR_ValueType.FLOAT4);
  }

  readVector() {
    return this.readValue(this.id, PR_ValueType.VECTOR);
  }

  readNormQuat() {
    return this.readValue(this.id, PR_ValueType.NORM_QUAT);
  }

  readString8() {
    return readStringX(this, 8);
  }

  readString32() {
    return readStringX(this, 32);
  }

  writeInt8(value: number) {
    this.writeValue([PR_ValueType.INT8, value]);
  }

  writeInt16(value: number) {
    this.writeValue([PR_ValueType.INT16, value]);
  }

  writeInt32(value: number) {
    this.writeValue([PR_ValueType.INT32, value]);
  }

  writeUint8(value: number) {
    this.writeValue([PR_ValueType.UINT8, value]);
  }

  writeUint16(value: number) {
    this.writeValue([PR_ValueType.UINT16, value]);
  }

  writeUint32(value: number) {
    this.writeValue([PR_ValueType.UINT32, value]);
  }

  writeFloat(value: number) {
    this.writeValue([PR_ValueType.FLOAT, value]);
  }

  writeBool(value: boolean) {
    this.writeValue([PR_ValueType.BOOL, value]);
  }

  writeString(value: string | number[], length = 1024) {
    this.writeValue([PR_ValueType.STRING, convertToByteString(value, length)]);
  }

  writeCompressedInt8(value: number) {
    this.writeValue([PR_ValueType.CINT8, value]);
  }

  writeCompressedInt16(value: number) {
    this.writeValue([PR_ValueType.CINT16, value]);
  }

  writeCompressedInt32(value: number) {
    this.writeValue([PR_ValueType.CINT32, value]);
  }

  writeCompressedUint8(value: number) {
    this.writeValue([PR_ValueType.CUINT8, value]);
  }

  writeCompressedUint16(value: number) {
    this.writeValue([PR_ValueType.CUINT16, value]);
  }

  writeCompressedUint32(value: number) {
    this.writeValue([PR_ValueType.CUINT32, value]);
  }

  writeCompressedFloat(value: number) {
    this.writeValue([PR_ValueType.CFLOAT, value]);
  }

  writeCompressedBool(value: boolean) {
    this.writeValue([PR_ValueType.CBOOL, value]);
  }

  writeCompressedString(value: string, length = 1024) {
    this.writeValue([PR_ValueType.CSTRING, convertToByteString(value, length)]);
  }

  writeBits(value: number, size: number) {
    this.writeValue([PR_ValueType.BITS, value, size]);
  }

  writeFloat3(value: Vector3<number>) {
    this.writeValue([PR_ValueType.FLOAT3, value]);
  }

  writeFloat4(value: Vector4<number>) {
    this.writeValue([PR_ValueType.FLOAT4, value]);
  }

  writeVector(value: Vector3<number>) {
    this.writeValue([PR_ValueType.VECTOR, value]);
  }

  writeNormQuat(value: Vector4<number>) {
    this.writeValue([PR_ValueType.NORM_QUAT, value]);
  }

  writeString8(value: string | number[]) {
    this.writeValue([PR_ValueType.STRING8, convertToByteString(value, 8)]);
  }

  writeString32(value: string | number[]) {
    this.writeValue([PR_ValueType.STRING32, convertToByteString(value, 32)]);
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
      PR_ValueType.UINT16,
      PR_ValueType.UINT16
    ) as number[];

    while (numberOfSlots--) {
      const [slotId, weaponId, ammo] = this.readValue(
        PR_ValueType.UINT8,
        PR_ValueType.UINT8,
        PR_ValueType.UINT16
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
      PR_ValueType.INT32,
      PR_ValueType.INT32
    ) as number[];
    return data as IStatsUpdate;
  }

  readRconCommand() {
    const data: Partial<IRconCommand> = {};
    [data.command] = this.readValue(PR_ValueType.STRING32) as any;
    return data as IRconCommand;
  }

  writeWeaponsUpdate(data: IWeaponsUpdate) {
    this.writeValue(
      [PR_ValueType.UINT16, data.targetId],
      [PR_ValueType.UINT16, data.targetActorId]
    );

    for (let slotId = 0; slotId < PR_MAX_WEAPON_SLOTS; slotId++) {
      if (!data.slotUpdated[slotId]) {
        continue;
      }

      this.writeValue(
        [PR_ValueType.UINT8, slotId],
        [PR_ValueType.UINT8, data.slotWeaponId[slotId]],
        [PR_ValueType.UINT16, data.slotWeaponAmmo[slotId]]
      );
    }
  }

  writeStatsUpdate(data: IStatsUpdate) {
    this.writeValue(
      [PR_ValueType.INT32, data.money],
      [PR_ValueType.INT32, data.drunkLevel]
    );
  }

  writeRconCommand(data: IRconCommand) {
    this.writeValue([PR_ValueType.STRING32, data.command]);
  }

  sendPacketToPlayerStream(
    players: Player[],
    player: Player,
    priority = PR_PacketPriority.HIGH,
    reliability = PR_PacketReliability.RELIABLE_ORDERED,
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
    priority = PR_PacketPriority.HIGH,
    reliability = PR_PacketReliability.RELIABLE_ORDERED,
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
    priority = PR_PacketPriority.HIGH,
    reliability = PR_PacketReliability.RELIABLE_ORDERED,
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
    priority = PR_PacketPriority.HIGH,
    reliability = PR_PacketReliability.RELIABLE_ORDERED,
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
