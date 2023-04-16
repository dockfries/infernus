export type BitStream = number;
export type Vector3 = [number, number, number];
export type Vector4 = [number, number, number, number];
export type packetCallback = (
  playerId: number,
  packetId: number,
  bs: number
) => boolean;
export type rpcCallback = (
  playerId: number,
  rpcId: number,
  bs: number
) => boolean;
