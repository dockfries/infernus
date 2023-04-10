import { PR_PacketPriority, PR_PacketReliability, PR_ValueType } from "@/enums";
import { BitStream } from "@/types";

export const PR_Init = () => {
  samp.callNative("PR_Init", "");
};

export const PR_SendPacket = (
  bs: BitStream,
  playerId: number,
  priority = PR_PacketPriority.HIGH,
  reliability = PR_PacketReliability.RELIABLE_ORDERED,
  orderingChannel = 0
) => {
  samp.callNative(
    "PR_SendPacket",
    "iiiii",
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
  samp.callNative(
    "PR_SendRPC",
    "iiiiii",
    bs,
    playerId,
    rpcId,
    priority,
    reliability,
    orderingChannel
  );
};

export const PR_EmulateIncomingPacket = (bs: BitStream, playerId: number) => {
  samp.callNative("PR_EmulateIncomingPacket", "ii", bs, playerId);
};

export const PR_EmulateIncomingRPC = (
  bs: BitStream,
  playerId: number,
  rpcId: number
) => {
  samp.callNative("PR_EmulateIncomingRPC", "iii", bs, playerId, rpcId);
};

export const BS_New = (): BitStream => {
  return samp.callNative("BS_New", "");
};

export const BS_NewCopy = (bs: BitStream): BitStream => {
  return samp.callNative("BS_NewCopy", "i", bs);
};

export const BS_Delete = (bs: BitStream): BitStream => {
  return samp.callNative("BS_Delete", "i", bs);
};

export const BS_Reset = (bs: BitStream) => {
  samp.callNative("BS_Reset", "i", bs);
};

export const BS_ResetReadPointer = (bs: BitStream) => {
  samp.callNative("BS_ResetReadPointer", "i", bs);
};

export const BS_ResetWritePointer = (bs: BitStream) => {
  samp.callNative("BS_ResetWritePointer", "i", bs);
};

export const BS_IgnoreBits = (bs: BitStream, number_of_bits: number) => {
  samp.callNative("BS_IgnoreBits", "ii", bs, number_of_bits);
};

export const BS_SetWriteOffset = (bs: BitStream, offset: number) => {
  samp.callNative("BS_SetWriteOffset", "ii", bs, offset);
};

export const BS_GetWriteOffset = (bs: BitStream): number => {
  return samp.callNative("BS_GetWriteOffset", "iI", bs);
};

export const BS_SetReadOffset = (bs: BitStream, offset: number) => {
  samp.callNative("BS_SetReadOffset", "ii", bs, offset);
};

export const BS_GetReadOffset = (bs: BitStream): number => {
  return samp.callNative("BS_GetReadOffset", "iI", bs);
};

export const BS_GetNumberOfBitsUsed = (bs: BitStream): number => {
  return samp.callNative("BS_GetNumberOfBitsUsed", "iI", bs);
};

export const BS_GetNumberOfBytesUsed = (bs: BitStream): number => {
  return samp.callNative("BS_GetNumberOfBytesUsed", "iI", bs);
};

export const BS_GetNumberOfUnreadBits = (bs: BitStream): number => {
  return samp.callNative("BS_GetNumberOfUnreadBits", "iI", bs);
};

export const BS_GetNumberOfBitsAllocated = (bs: BitStream): number => {
  return samp.callNative("BS_GetNumberOfBitsAllocated", "iI", bs);
};

const isArrValueType = (type: PR_ValueType) => {
  return [
    PR_ValueType.STRING,
    PR_ValueType.CSTRING,
    PR_ValueType.STRING8,
    PR_ValueType.STRING32,
    PR_ValueType.FLOAT3,
    PR_ValueType.FLOAT4,
    PR_ValueType.VECTOR,
    PR_ValueType.NORM_QUAT,
  ].includes(type);
};

export function BS_ReadValue(
  bs: BitStream,
  ...types: (PR_ValueType | [PR_ValueType, number])[]
): number | number[] | (number | number[])[] {
  let paramTypes = "";
  types.forEach((item) => {
    const isReplaceItem = Array.isArray(item);
    const type = isReplaceItem ? item[0] : item;
    paramTypes += "i";
    paramTypes += isArrValueType(type) ? "A" : "F";
    isReplaceItem && (paramTypes += "i");
  });
  return samp.callNative("BS_ReadValue", `i${paramTypes}`, bs, ...types);
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
  let paramTypes = "";
  types.forEach((item) => {
    paramTypes += "i";
    paramTypes += isArrValueType(item[0]) ? "a" : "f";
    if (item.length === 3) paramTypes += "i";
  });
  samp.callNative(
    "BS_WriteValue",
    `i${paramTypes}`,
    bs,
    ...types.flat(Infinity)
  );
};
