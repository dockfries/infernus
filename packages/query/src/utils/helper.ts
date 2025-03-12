import jschardet from "jschardet";
import { detect } from "@dockfries/chardetng";
import iconv from "iconv-lite";

export function detectAndDecode(buffer: Buffer) {
  let chardetEncoding: string;
  if (samp) {
    const chardetResult = jschardet.detect(buffer);
    chardetEncoding = chardetResult
      ? chardetResult.encoding.toLowerCase()
      : "utf-8";
  } else {
    chardetEncoding = detect(buffer) || "utf-8";
  }

  let guessCharset;
  if (chardetEncoding === "ascii") {
    guessCharset = "utf-8";
  } else if (["gbk", "gb2312"].includes(chardetEncoding)) {
    guessCharset = "gb18030";
  } else if (chardetEncoding === "windows-1251") {
    guessCharset = "windows-1251";
  } else {
    guessCharset = chardetEncoding || "utf-8";
  }

  const decodedString = iconv.decode(buffer, guessCharset);
  return [decodedString, guessCharset];
}
