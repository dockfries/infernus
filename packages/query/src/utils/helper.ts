import jschardet from "jschardet";
import iconv from "iconv-lite";

// limited accuracy
// because the node ecosystem does not have a very accurate library
export function detectAndDecode(buffer: Buffer) {
  const chardetResult = jschardet.detect(buffer);
  const chardetEncoding = chardetResult
    ? chardetResult.encoding.toLowerCase()
    : "utf-8";

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
