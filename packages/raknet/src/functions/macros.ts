import { BS_ReadValue, BS_WriteValue } from "./natives";
import type { BitStream, Vector3, Vector4 } from "@/types";
import { PR_ValueType } from "@/enums";
import { BS_ConvertToByteString, BS_ReadStringX } from "@/utils";

export const BS_ReadInt8 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.INT8);

export const BS_ReadInt16 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.INT16);

export const BS_ReadInt32 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.INT32);

export const BS_ReadUint8 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.UINT8);

export const BS_ReadUint16 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.UINT16);

export const BS_ReadUint32 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.UINT32);

export const BS_ReadFloat = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.FLOAT);

export const BS_ReadBool = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.BOOL);

export const BS_ReadString = (bs: BitStream, size = 1024) =>
  BS_ReadStringX(bs, size);

export const BS_ReadCompressedInt8 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.CINT8);

export const BS_ReadCompressedInt16 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.CINT16);

export const BS_ReadCompressedInt32 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.CINT32);

export const BS_ReadCompressedUint8 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.CUINT8);

export const BS_ReadCompressedUint16 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.CUINT16);

export const BS_ReadCompressedUint32 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.CUINT32);

export const BS_ReadCompressedFloat = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.CFLOAT);

export const BS_ReadCompressedBool = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.CBOOL);

export const BS_ReadCompressedString = (bs: BitStream, size: number) => {
  return BS_ReadStringX(bs, size, true);
};

export const BS_ReadBits = (bs: BitStream, size: number) =>
  BS_ReadValue(bs, [PR_ValueType.BITS, size]);

export const BS_ReadFloat3 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.FLOAT3);

export const BS_ReadFloat4 = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.FLOAT4);

export const BS_ReadVector = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.VECTOR);

export const BS_ReadNormQuat = (bs: BitStream) =>
  BS_ReadValue(bs, PR_ValueType.NORM_QUAT);

export const BS_ReadString8 = (bs: BitStream) => BS_ReadStringX(bs, 8);

export const BS_ReadString32 = (bs: BitStream) => BS_ReadStringX(bs, 32);

export const BS_WriteInt8 = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.INT8, value]);

export const BS_WriteInt16 = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.INT16, value]);

export const BS_WriteInt32 = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.INT32, value]);

export const BS_WriteUint8 = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.UINT8, value]);

export const BS_WriteUint16 = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.UINT16, value]);

export const BS_WriteUint32 = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.UINT32, value]);

export const BS_WriteFloat = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.FLOAT, value]);

export const BS_WriteBool = (bs: BitStream, value: boolean) =>
  BS_WriteValue(bs, [PR_ValueType.BOOL, value]);

export const BS_WriteString = (
  bs: BitStream,
  value: string | number[],
  length = 1024
) =>
  BS_WriteValue(bs, [
    PR_ValueType.STRING,
    BS_ConvertToByteString(value, length),
  ]);

export const BS_WriteCompressedInt8 = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.CINT8, value]);

export const BS_WriteCompressedInt16 = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.CINT16, value]);

export const BS_WriteCompressedInt32 = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.CINT32, value]);

export const BS_WriteCompressedUint8 = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.CUINT8, value]);

export const BS_WriteCompressedUint16 = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.CUINT16, value]);

export const BS_WriteCompressedUint32 = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.CUINT32, value]);

export const BS_WriteCompressedFloat = (bs: BitStream, value: number) =>
  BS_WriteValue(bs, [PR_ValueType.CFLOAT, value]);

export const BS_WriteCompressedBool = (bs: BitStream, value: boolean) =>
  BS_WriteValue(bs, [PR_ValueType.CBOOL, value]);

export const BS_WriteCompressedString = (
  bs: BitStream,
  value: string,
  length = 1024
) =>
  BS_WriteValue(bs, [
    PR_ValueType.CSTRING,
    BS_ConvertToByteString(value, length),
  ]);

export const BS_WriteBits = (bs: BitStream, value: number, size: number) =>
  BS_WriteValue(bs, [PR_ValueType.BITS, value, size]);

export const BS_WriteFloat3 = (bs: BitStream, value: Vector3) =>
  BS_WriteValue(bs, [PR_ValueType.FLOAT3, value]);

export const BS_WriteFloat4 = (bs: BitStream, value: Vector4) =>
  BS_WriteValue(bs, [PR_ValueType.FLOAT4, value]);

export const BS_WriteVector = (bs: BitStream, value: Vector3) =>
  BS_WriteValue(bs, [PR_ValueType.VECTOR, value]);

export const BS_WriteNormQuat = (bs: BitStream, value: Vector4) =>
  BS_WriteValue(bs, [PR_ValueType.NORM_QUAT, value]);

export const BS_WriteString8 = (bs: BitStream, value: string | number[]) => {
  BS_WriteValue(bs, [PR_ValueType.STRING8, BS_ConvertToByteString(value, 8)]);
};

export const BS_WriteString32 = (bs: BitStream, value: string | number[]) => {
  BS_WriteValue(bs, [PR_ValueType.STRING32, BS_ConvertToByteString(value, 32)]);
};
