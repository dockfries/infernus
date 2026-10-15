import { chardet } from "jschardet";
import iconv from "iconv-lite";

export async function detectAndDecode(buffer: Buffer) {
  const ret = chardet.detect(buffer);
  const guessCharset = ret && ret.encoding ? ret.encoding.toLowerCase() : "utf-8";
  const decodedString = iconv.decode(buffer, guessCharset);
  return [decodedString, guessCharset];
}
