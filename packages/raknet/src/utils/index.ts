import { PR_ValueType } from "@/enums";
import { BS_ReadValue } from "@/functions/natives";
import { BitStream } from "@/types";

export const BS_ConvertToByteString = (
  value: string | number[],
  length: number
) => {
  let finalValue: string | number[] = value;
  if (typeof finalValue === "string") {
    const encoder = new TextEncoder();
    finalValue = Array.from(encoder.encode(finalValue));
  }
  return finalValue.slice(0, length);
};

export const BS_ReadStringX = (bs: BitStream, size: number) => {
  const byteArr = BS_ReadValue(bs, [PR_ValueType.STRING, size]) as number[];
  return byteArr.slice(0, byteArr.indexOf(0));
};
