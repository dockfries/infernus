import type { BitStream } from "raknet/bitStream";
import { PacketRpcValueType } from "raknet/enums";
import iconv from "iconv-lite";

export const convertToByteString = (
  value: string | number[],
  length: number,
  charset = "utf-8"
) => {
  let finalValue: Buffer | [] = [];
  if (typeof value === "string") {
    finalValue = iconv.encode(value, charset);
  }
  return Array.from(finalValue).slice(0, length);
};

export const readStringX = (
  bs: BitStream,
  size: number,
  isCompressed = false,
  charset = "utf-8"
) => {
  const byteArr = bs.readValue([
    isCompressed ? PacketRpcValueType.CString : PacketRpcValueType.String,
    size,
  ]) as number[];
  const validByteArr = byteArr.slice(0, byteArr.indexOf(0));
  return iconv.decode(Buffer.from(validByteArr), charset);
};

export const patchRakNetNative = (...args: any[]) => {
  return samp.callPublic("RakNetNatives", `a`, args);
};
