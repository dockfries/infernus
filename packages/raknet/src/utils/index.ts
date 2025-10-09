import { I18n } from "@infernus/core";
import { PacketRpcValueType } from "raknet/enums";
import type { BitStream } from "raknet/bitStream";
import type { BitStreamRaw } from "raknet/types";

export const convertToByteString = (
  value: string | number[],
  length: number,
  charset = "utf8",
) => {
  const finalValue =
    typeof value === "string" ? I18n.encodeToBuf(value, charset) : value;
  return finalValue.slice(0, length);
};

export const readStringX = (
  bs: BitStream,
  size: number,
  type:
    | PacketRpcValueType.String
    | PacketRpcValueType.String8
    | PacketRpcValueType.String32
    | PacketRpcValueType.CString,
  charset?: string,
) => {
  const byteArr = bs.readValue([type, size]) as number[];
  const validByteArr = I18n.getValidStr(byteArr);
  return I18n.decodeFromBuf(validByteArr, charset);
};

export const patchRakNetNatives = (...args: (number | string | boolean)[]) => {
  return samp.callPublic("RakNetNatives", `a`, args);
};

export const patchRakNetRead = (
  bs: BitStreamRaw,
  type: PacketRpcValueType,
  length = 0,
) => {
  switch (type) {
    case PacketRpcValueType.Bool:
    case PacketRpcValueType.CBool: {
      return Boolean(samp.callPublic("RakNetReadInt", "i", bs));
    }

    case PacketRpcValueType.Float: {
      return samp.callPublicFloat("RakNetReadFloat", "i", bs) as number;
    }
    case PacketRpcValueType.CFloat: {
      return samp.callPublicFloat(
        "RakNetReadCompressedFloat",
        "i",
        bs,
      ) as number;
    }

    case PacketRpcValueType.Bits: {
      return samp.callPublic("RakNetReadBits", "ii", bs, length) as number;
    }

    case PacketRpcValueType.Float3: {
      samp.callPublic("RakNetReadFloat3", "i", bs);
      const arr: number[] = [];
      for (let i = 0; i < 3; i++) {
        arr[i] = samp.callPublicFloat("RakNetReadFloat3Array", "i", i);
      }
      return arr;
    }
    case PacketRpcValueType.Float4: {
      samp.callPublic("RakNetReadFloat4", "i", bs);
      const arr: number[] = [];
      for (let i = 0; i < 4; i++) {
        arr[i] = samp.callPublicFloat("RakNetReadFloat4Array", "i", i);
      }
      return arr;
    }
    case PacketRpcValueType.Vector: {
      samp.callPublic("RakNetReadVector", "i", bs);
      const arr: number[] = [];
      for (let i = 0; i < 3; i++) {
        arr[i] = samp.callPublicFloat("RakNetReadFloat3Array", "i", i);
      }
      return arr;
    }
    case PacketRpcValueType.NormQuat: {
      samp.callPublic("RakNetReadNormQuat", "i", bs);
      const arr: number[] = [];
      for (let i = 0; i < 4; i++) {
        arr[i] = samp.callPublicFloat("RakNetReadFloat4Array", "i", i);
      }
      return arr;
    }
    case PacketRpcValueType.String8: {
      samp.callPublic("RakNetReadString8", "i", bs);
      const arr: number[] = [];
      for (let i = 0; i < 8; i++) {
        arr[i] = samp.callPublic("RakNetReadString8Array", "i", i);
      }
      return arr;
    }
    case PacketRpcValueType.String32: {
      samp.callPublic("RakNetReadString32", "i", bs);
      const arr: number[] = [];
      for (let i = 0; i < 32; i++) {
        arr[i] = samp.callPublic("RakNetReadString32Array", "i", i);
      }
      return arr;
    }
    case PacketRpcValueType.String: {
      samp.callPublic("RakNetReadString", "ii", bs, length);
      const arr: number[] = [];
      for (let i = 0; i < length; i++) {
        arr[i] = samp.callPublic("RakNetReadStringArray", "i", i);
      }
      return arr;
    }
    case PacketRpcValueType.CString: {
      samp.callPublic("RakNetReadCompressedString", "ii", bs, length);
      const arr: number[] = [];
      for (let i = 0; i < length; i++) {
        arr[i] = samp.callPublic("RakNetReadStringArray", "i", i);
      }
      return arr;
    }
    default: {
      return samp.callPublic("RakNetReadInt", "ii", bs, type) as number;
    }
  }
};

export const patchRakNetWrite = (
  bs: BitStreamRaw,
  type: PacketRpcValueType,
  value: number | boolean | number[],
  length = 0,
) => {
  switch (type) {
    case PacketRpcValueType.Bool:
    case PacketRpcValueType.CBool: {
      if (Array.isArray(value)) return false;
      return Boolean(samp.callPublic("RakNetWriteInt", "ii", bs, +value));
    }

    case PacketRpcValueType.Float: {
      if (typeof value !== "number") return false;
      return Boolean(samp.callPublicFloat("RakNetWriteFloat", "if", bs, value));
    }
    case PacketRpcValueType.CFloat: {
      if (typeof value !== "number") return false;
      return Boolean(
        samp.callPublicFloat("RakNetWriteCompressedFloat", "if", bs, value),
      );
    }

    case PacketRpcValueType.Bits: {
      if (typeof value !== "number") return false;
      return Boolean(
        samp.callPublic("RakNetWriteBits", "iii", bs, value, length),
      );
    }

    case PacketRpcValueType.Float3: {
      if (!Array.isArray(value) || value.length !== 3) return false;
      return Boolean(
        samp.callPublicFloat("RakNetWriteFloat3", "iv", bs, value),
      );
    }
    case PacketRpcValueType.Float4: {
      if (!Array.isArray(value) || value.length !== 4) return false;
      return Boolean(
        samp.callPublicFloat("RakNetWriteFloat4", "iv", bs, value),
      );
    }
    case PacketRpcValueType.Vector: {
      if (!Array.isArray(value) || value.length !== 3) return false;
      return Boolean(
        samp.callPublicFloat("RakNetWriteVector", "iv", bs, value),
      );
    }
    case PacketRpcValueType.NormQuat: {
      if (!Array.isArray(value) || value.length !== 4) return false;
      return Boolean(
        samp.callPublicFloat("RakNetWriteNormQuat", "iv", bs, value),
      );
    }
    case PacketRpcValueType.String8: {
      if (!Array.isArray(value)) return false;
      return Boolean(
        samp.callPublicFloat("RakNetWriteString8", "ia", bs, value),
      );
    }
    case PacketRpcValueType.String32: {
      if (!Array.isArray(value)) return false;
      return Boolean(
        samp.callPublicFloat("RakNetWriteString32", "ia", bs, value),
      );
    }
    case PacketRpcValueType.String: {
      if (!Array.isArray(value)) return false;
      return Boolean(
        samp.callPublicFloat(
          "RakNetWriteString",
          "iai",
          bs,
          value,
          length || value.length,
        ),
      );
    }
    case PacketRpcValueType.CString: {
      if (!Array.isArray(value)) return false;
      return Boolean(
        samp.callPublicFloat(
          "RakNetWriteCompressedString",
          "iai",
          bs,
          value,
          length || value.length,
        ),
      );
    }
    default: {
      if (typeof value !== "number") return false;
      return Boolean(samp.callPublic("RakNetWriteInt", "iii", bs, type, value));
    }
  }
};
