import type { BitStream } from "raknet/bitStream";

export type BitStreamRaw = number;
export type Vector3<T> = [T, T, T];
export type Vector4<T> = [T, T, T, T];
export type packetCallback = (
  playerId: number,
  packetId: number,
  bs: BitStream
) => boolean;
export type rpcCallback = (
  playerId: number,
  rpcId: number,
  bs: BitStream
) => boolean;
