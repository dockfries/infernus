import { PR_ValueType } from "@/enums";
import { BS_ReadValue } from "@/functions/natives";
import type { BitStream } from "@/types";
import iconv from "iconv-lite";

export const BS_ConvertToByteString = (
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

export const BS_ReadStringX = (
  bs: BitStream,
  size: number,
  isCompressed = false,
  charset = "utf-8"
) => {
  const byteArr = BS_ReadValue(bs, [
    isCompressed ? PR_ValueType.CSTRING : PR_ValueType.STRING,
    size,
  ]) as number[];
  const validByteArr = byteArr.slice(0, byteArr.indexOf(0));
  return iconv.decode(Buffer.from(validByteArr), charset);
};
