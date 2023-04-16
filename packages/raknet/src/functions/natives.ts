import {
  PR_PacketPriority,
  PR_PacketReliability,
  PR_ValueType,
  RakNetNatives,
} from "@/enums";
import { BitStream } from "@/types";
import { patchRakNetNative } from "./patch";

export const PR_SendPacket = (
  bs: BitStream,
  playerId: number,
  priority = PR_PacketPriority.HIGH,
  reliability = PR_PacketReliability.RELIABLE_ORDERED,
  orderingChannel = 0
) => {
  patchRakNetNative(
    RakNetNatives.SEND_PACKET,
    bs,
    playerId,
    priority,
    reliability,
    orderingChannel
  );
};

export const PR_SendRPC = (
  bs: BitStream,
  playerId: number,
  rpcId: number,
  priority = PR_PacketPriority.HIGH,
  reliability = PR_PacketReliability.RELIABLE_ORDERED,
  orderingChannel = 0
) => {
  patchRakNetNative(
    RakNetNatives.SEND_RPC,
    bs,
    playerId,
    rpcId,
    priority,
    reliability,
    orderingChannel
  );
};

export const PR_EmulateIncomingPacket = (bs: BitStream, playerId: number) => {
  patchRakNetNative(RakNetNatives.EMULATE_INCOMING_PACKET, bs, playerId);
};

export const PR_EmulateIncomingRPC = (
  bs: BitStream,
  playerId: number,
  rpcId: number
) => {
  patchRakNetNative(RakNetNatives.EMULATE_INCOMING_RPC, bs, playerId, rpcId);
};

export const BS_New = (): BitStream => {
  return patchRakNetNative(RakNetNatives.NEW);
};

export const BS_NewCopy = (bs: BitStream): BitStream => {
  return patchRakNetNative(RakNetNatives.NEW_COPY, bs);
};

export const BS_Delete = (bs: BitStream): BitStream => {
  patchRakNetNative(RakNetNatives.DELETE, bs);
  return bs;
};

export const BS_Reset = (bs: BitStream) => {
  patchRakNetNative(RakNetNatives.RESET, bs);
};

export const BS_ResetReadPointer = (bs: BitStream) => {
  patchRakNetNative(RakNetNatives.RESET_READ_POINTER, bs);
};

export const BS_ResetWritePointer = (bs: BitStream) => {
  patchRakNetNative(RakNetNatives.RESET_WRITE_POINTER, bs);
};

export const BS_IgnoreBits = (bs: BitStream, number_of_bits: number) => {
  patchRakNetNative(RakNetNatives.IGNORE_BITS, bs, number_of_bits);
};

export const BS_SetWriteOffset = (bs: BitStream, offset: number) => {
  patchRakNetNative(RakNetNatives.SET_WRITE_OFFSET, bs, offset);
};

export const BS_GetWriteOffset = (bs: BitStream): number => {
  return patchRakNetNative(RakNetNatives.GET_WRITE_OFFSET, bs);
};

export const BS_SetReadOffset = (bs: BitStream, offset: number) => {
  patchRakNetNative(RakNetNatives.SET_READ_OFFSET, bs, offset);
};

export const BS_GetReadOffset = (bs: BitStream): number => {
  return patchRakNetNative(RakNetNatives.GET_READ_OFFSET, bs);
};

export const BS_GetNumberOfBitsUsed = (bs: BitStream): number => {
  return patchRakNetNative(RakNetNatives.GET_NUMBER_OF_BITS_USED, bs);
};

export const BS_GetNumberOfBytesUsed = (bs: BitStream): number => {
  return patchRakNetNative(RakNetNatives.GET_NUMBER_OF_BYTES_USED, bs);
};

export const BS_GetNumberOfUnreadBits = (bs: BitStream): number => {
  return patchRakNetNative(RakNetNatives.GET_NUMBER_OF_UNREAD_BITS, bs);
};

export const BS_GetNumberOfBitsAllocated = (bs: BitStream): number => {
  return patchRakNetNative(RakNetNatives.GET_NUMBER_OF_BITS_ALLOCATED, bs);
};

export function BS_ReadValue(
  bs: BitStream,
  ...types: (PR_ValueType | [PR_ValueType, number])[]
): number | number[] | (number | number[])[] {
  const ret: any[] = [];
  types.forEach((item) => {
    const isPlaceholder = Array.isArray(item);
    const type = isPlaceholder ? item[0] : item;
    ret.push(
      patchRakNetNative(
        RakNetNatives.READ_VALUE,
        bs,
        type,
        isPlaceholder ? item[1] : 0
      )
    );
  });
  if (ret.length === 1) return ret[0];
  return ret;
}

export const BS_WriteValue = (
  bs: BitStream,
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
) => {
  types.forEach((item) => {
    patchRakNetNative(
      RakNetNatives.WRITE_VALUE,
      bs,
      item[0],
      item[1],
      item[2] || 0
    );
  });
};
