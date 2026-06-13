import { PacketRpcValueType } from "../enums";

export type BitStreamRaw = number;
export type Vector3<T> = [T, T, T];
export type Vector4<T> = [T, T, T, T];

const R = PacketRpcValueType;

export const VALUE_KIND = {
  INT: { r: "iI", w: "ii" },
  FLOAT: { r: "iF", w: "if" },
  STRING: { r: "iSi", w: "is" },
  CSTRING: { r: "iSi", w: "is" },
  BITS: { r: "iIi", w: "iii", sr: true },
  VEC3: { r: "iVi", w: "iv", n: 3 },
  VEC4: { r: "iVi", w: "iv", n: 4 },
  STR8: { r: "iSi", w: "is" },
  STR32: { r: "iSi", w: "is" },
} as const;

export type ValueKind = keyof typeof VALUE_KIND;

export const TYPE_TO_KIND: Record<number, ValueKind> = {
  [R.Int8]: "INT",
  [R.Int16]: "INT",
  [R.Int32]: "INT",
  [R.UInt8]: "INT",
  [R.UInt16]: "INT",
  [R.UInt32]: "INT",
  [R.Bool]: "INT",
  [R.Float]: "FLOAT",
  [R.String]: "STRING",
  [R.CInt8]: "INT",
  [R.CInt16]: "INT",
  [R.CInt32]: "INT",
  [R.CUInt8]: "INT",
  [R.CUInt16]: "INT",
  [R.CUInt32]: "INT",
  [R.CFloat]: "FLOAT",
  [R.CBool]: "INT",
  [R.CString]: "CSTRING",
  [R.Bits]: "BITS",
  [R.Float3]: "VEC3",
  [R.Float4]: "VEC4",
  [R.Vector]: "VEC3",
  [R.NormQuat]: "VEC4",
  [R.String8]: "STR8",
  [R.String32]: "STR32",
};

export const BOOL_TYPES = new Set([R.Bool, R.CBool]);

export type WriteTuple =
  | readonly [type: PacketRpcValueType.Int8, value: number]
  | readonly [type: PacketRpcValueType.Int16, value: number]
  | readonly [type: PacketRpcValueType.Int32, value: number]
  | readonly [type: PacketRpcValueType.UInt8, value: number]
  | readonly [type: PacketRpcValueType.UInt16, value: number]
  | readonly [type: PacketRpcValueType.UInt32, value: number]
  | readonly [type: PacketRpcValueType.Float, value: number]
  | readonly [type: PacketRpcValueType.Bool, value: number | boolean]
  | readonly [type: PacketRpcValueType.String, value: string]
  | readonly [type: PacketRpcValueType.String, value: string, size: number]
  | readonly [type: PacketRpcValueType.CInt8, value: number]
  | readonly [type: PacketRpcValueType.CInt16, value: number]
  | readonly [type: PacketRpcValueType.CInt32, value: number]
  | readonly [type: PacketRpcValueType.CUInt8, value: number]
  | readonly [type: PacketRpcValueType.CUInt16, value: number]
  | readonly [type: PacketRpcValueType.CUInt32, value: number]
  | readonly [type: PacketRpcValueType.CFloat, value: number]
  | readonly [type: PacketRpcValueType.CBool, value: number | boolean]
  | readonly [type: PacketRpcValueType.CString, value: string]
  | readonly [type: PacketRpcValueType.CString, value: string, size: number]
  | readonly [type: PacketRpcValueType.Bits, value: number]
  | readonly [type: PacketRpcValueType.Bits, value: number, size: number]
  | readonly [type: PacketRpcValueType.Float3, value: Vector3<number>]
  | readonly [type: PacketRpcValueType.Float4, value: Vector4<number>]
  | readonly [type: PacketRpcValueType.Vector, value: Vector3<number>]
  | readonly [type: PacketRpcValueType.NormQuat, value: Vector4<number>]
  | readonly [type: PacketRpcValueType.String8, value: string]
  | readonly [type: PacketRpcValueType.String32, value: string];

type ValueTypeForRead<T extends PacketRpcValueType> = T extends
  | PacketRpcValueType.Bool
  | PacketRpcValueType.CBool
  ? boolean
  : T extends PacketRpcValueType.Float3 | PacketRpcValueType.Vector
    ? Vector3<number>
    : T extends PacketRpcValueType.Float4 | PacketRpcValueType.NormQuat
      ? Vector4<number>
      : T extends
            | PacketRpcValueType.String
            | PacketRpcValueType.CString
            | PacketRpcValueType.String8
            | PacketRpcValueType.String32
        ? string
        : number;

export type ReadValueResult<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends readonly [infer Type, ...any[]]
    ? Type extends PacketRpcValueType
      ? [ValueTypeForRead<Type>, ...ReadValueResult<Rest>]
      : never
    : never
  : [];
