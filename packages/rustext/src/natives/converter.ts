import { gCharMap } from "../constants";
import { ConverterTypes } from "../enums";

export class Converter {
  static process(bytes: readonly number[], type: ConverterTypes): number[] {
    const codes = [...bytes];

    for (let i = 0; i < codes.length; i++) {
      const code = gCharMap[codes[i]]?.[type] ?? 0;
      if (code !== 0) {
        codes[i] = code;
      }
    }

    return codes;
  }
}
