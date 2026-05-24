# @infernus/raknet — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

TypeScript wrapper of [Pawn.RakNet](https://github.com/katursis/Pawn.RakNet). Requires `@infernus/core` as peer dependency. A [polyfill](https://github.com/dockfries/infernus-starter/blob/main/gamemodes/polyfill/raknet.inc) must be compiled into the gamemode.

## BitStream — Binary Data Buffer

```typescript
import { BitStream } from "@infernus/raknet";

const bs = new BitStream();           // empty
const bs = new BitStream(rawHandle);  // wrap existing
```

### Native Operations

```typescript
bs.sendPacket(player, priority, reliability, orderingChannel);
bs.sendRPC(player, rpcId, priority, reliability, orderingChannel);
bs.emulateIncomingPacket(player);
bs.emulateIncomingRPC(player, rpcId);
bs.newCopy();           bs.delete();
bs.reset();             bs.resetReadPointer();     bs.resetWritePointer();
bs.ignoreBits(n);       bs.setWriteOffset(n);      bs.getWriteOffset();
bs.setReadOffset(n);    bs.getReadOffset();
bs.getNumberOfBitsUsed();   bs.getNumberOfBytesUsed();
bs.getNumberOfUnreadBits(); bs.getNumberOfBitsAllocated();
```

### Streaming helpers

```typescript
bs.sendPacketToPlayerStream(players, player, priority, reliability, channel);
bs.sendRPCToPlayerStream(players, player, rpcId, priority, reliability, channel);
bs.sendPacketToVehicleStream(players, vehicle, excludedPlayer, priority, reliability, channel);
bs.sendRPCToVehicleStream(players, vehicle, rpcId, excludedPlayer, priority, reliability, channel);
```

### Read/Write Methods

| Read | Write | Type |
|------|-------|------|
| `readInt8()` | `writeInt8(v)` | Signed 8-bit |
| `readInt16()` | `writeInt16(v)` | Signed 16-bit |
| `readInt32()` | `writeInt32(v)` | Signed 32-bit |
| `readUint8()` | `writeUint8(v)` | Unsigned 8-bit |
| `readUint16()` | `writeUint16(v)` | Unsigned 16-bit |
| `readUint32()` | `writeUint32(v)` | Unsigned 32-bit |
| `readFloat()` | `writeFloat(v)` | 32-bit float |
| `readBool()` | `writeBool(v)` | Boolean |
| `readString(size?)` | `writeString(v, length?)` | UTF-8 string |
| `readCompressedInt8()` | `writeCompressedInt8(v)` | Compressed int8 |
| `readCompressedInt16()` | `writeCompressedInt16(v)` | Compressed int16 |
| `readCompressedInt32()` | `writeCompressedInt32(v)` | Compressed int32 |
| `readCompressedFloat()` | `writeCompressedFloat(v)` | Compressed float |
| `readCompressedBool()` | `writeCompressedBool(v)` | Compressed bool |
| `readCompressedString(s, c?)` | `writeCompressedString(v, l?)` | Compressed string |
| `readBits(size)` | `writeBits(v, size)` | Raw bits |
| `readFloat3()` | `writeFloat3(v)` | 3× float → `Vector3` |
| `readFloat4()` | `writeFloat4(v)` | 4× float → `Vector4` |
| `readVector()` | `writeVector(v)` | Compressed vector |
| `readNormQuat()` | `writeNormQuat(v)` | Normalized quat |
| `readString8(c?)` | `writeString8(v)` | 8-byte string |
| `readString32(c?)` | `writeString32(v)` | 32-byte string |
| `readValue(...types)` | `writeValue(...[type,val,len][])` | Multi-value |

### Static Utilities

```typescript
BitStream.packAspectRatio(v);        BitStream.unpackAspectRatio(v);
BitStream.packCameraZoom(v);         BitStream.unpackCameraZoom(v);
BitStream.packHealthArmour(hp,arm);  BitStream.unpackHealthArmour(val);  // → { health, armour }
```

### Complex Data

```typescript
bs.readWeaponsUpdate();     // → IWeaponsUpdate
bs.writeWeaponsUpdate(data);
bs.readStatsUpdate();       // → IStatsUpdate (money, drunkLevel)
bs.writeStatsUpdate(data);
bs.readRconCommand();       // → IRconCommand
bs.writeRconCommand(data);
```

## Callbacks — Packet/RPC Interception

```typescript
import {
    onIncomingPacket, onIncomingRPC, onOutgoingPacket, onOutgoingRPC,
    IPacket, IRPC, OPacket, ORPC, PacketIdList, RPCIdList
} from "@infernus/raknet";

// Intercept all
onIncomingPacket(({ playerId, packetId, bs, next }) => { return next(); });
onIncomingRPC(({ playerId, rpcId, bs, next }) => { return next(); });
onOutgoingPacket(({ playerId, packetId, bs, next }) => { return next(); });
onOutgoingRPC(({ playerId, rpcId, bs, next }) => { return next(); });

// Filter by specific ID (syntax sugar)
IPacket(PacketIdList.OnFootSync, ({ playerId, bs, next }) => {
    const sync = new OnFootSync(bs).readSync();
    return next();
});

IRPC(RPCIdList.SetPlayerHealth, ({ playerId, bs, next }) => {
    const health = bs.readFloat();
    return next();
});

// Aliases: IncomingPacket = IPacket, IncomingRPC = IRPC, etc.
```

---

## Sync Data Classes

Each extends `BitStream`, decorated with `@SyncId(packetId)`, implements `IPacketListSync`.

| Class | Packet ID | Interface |
|-------|-----------|-----------|
| `OnFootSync` | `OnFootSync` (207) | `IOnFootSync` |
| `InCarSync` | `DriverSync` (200) | `IInCarSync` |
| `TrailerSync` | `TrailerSync` (210) | `ITrailerSync` |
| `PassengerSync` | `PassengerSync` (211) | `IPassengerSync` |
| `UnoccupiedSync` | `UnoccupiedSync` (209) | `IUnoccupiedSync` |
| `SpectatingSync` | `SpectatingSync` (212) | `ISpectatingSync` |
| `AimSync` | `AimSync` (203) | `IAimSync` |
| `BulletSync` | `BulletSync` (206) | `IBulletSync` |
| `MarkersSync` | `MarkersSync` (208) | `IMarkersSync` |

```typescript
// Read
IPacket(PacketIdList.OnFootSync, ({ bs, next }) => {
    const data = new OnFootSync(bs).readSync(true);  // true = outgoing
    return next();
});

// Write + send
const bs = new BulletSync(new BitStream());
bs.writeSync(bulletData);
bs.sendPacket(playerId);
bs.delete();
```

---

## Enums

### PacketIdList (selected)

```typescript
enum PacketIdList {
    DriverSync = 200, RconCommand = 201, AimSync = 203,
    WeaponsUpdate = 204, StatsUpdate = 205, BulletSync = 206,
    OnFootSync = 207, MarkersSync = 208, UnoccupiedSync = 209,
    TrailerSync = 210, PassengerSync = 211, SpectatingSync = 212,
    InternalPing = 6, ConnectedPong = 9, RequestStaticData = 10,
    ConnectionRequest = 11, AuthKey = 12, RpcMapping = 17,
    NewIncomingConnection = 30, DisconnectionNotification = 32,
    ConnectionLost = 33, ConnectionRequestAccepted = 34,
    // ... see source for full list
}
```

### RPCIdList (selected)

```typescript
enum RPCIdList {
    SetPlayerHealth = 14, SetPlayerPos = 12, SetPlayerSkin = 153,
    SetCameraPos = 157, SetCameraLookAt = 158,
    GivePlayerWeapon = 22, ResetPlayerWeapons = 21,
    ShowDialog = 61, DialogResponse = 62,
    CreateObject = 44, DestroyObject = 47,
    CreatePickup = 95, DestroyPickup = 63,
    GiveDamage = 115, DeathBroadcast = 166,
    SendClientMessage = 93, ChatMessage = 101,
    ClientJoin = 25, ServerJoin = 137, ServerQuit = 138,
    InitGame = 139, GameModeRestart = 40,
    // ... 130+ IDs in source
}
```

### Other Enums

```typescript
enum PacketRpcValueType {
    Int8, Int16, Int32, UInt8, UInt16, UInt32, Float, Bool, String,
    CInt8, CInt16, CInt32, CUInt8, CUInt16, CUInt32, CFloat, CBool, CString,
    Bits, Float3, Float4, Vector, NormQuat, String8, String32, IgnoreBits
}
enum PacketRpcPriority { System, High, Medium, Low }
enum PacketRpcReliability { Unreliable = 6, UnreliableSequenced, Reliable, ReliableOrdered, ReliableSequenced }
enum RakNetNatives { SendPacket, SendRpc, EmulateIncomingPacket, New, NewCopy, Delete, ... }
```

## Constants

```typescript
PR_MAX_HANDLERS = 256;
PR_MAX_WEAPON_SLOTS = 13;
PR_BITS_TO_BYTES(bits);    // Math.ceil(bits / 8)
PR_BYTES_TO_BITS(bytes);   // bytes * 8
```

## Types

```typescript
type BitStreamRaw = number;           // Opaque native handle
type Vector3<T> = [T, T, T];
type Vector4<T> = [T, T, T, T];
```
