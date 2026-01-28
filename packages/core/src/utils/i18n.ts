import util from "node:util";
import iconv from "iconv-lite";
import { snakeCase, merge, omit, mapKeys } from "es-toolkit";
import { get } from "es-toolkit/compat";
import { TLocales } from "core/types";
import { I18nException } from "core/exceptions";

const { encode, decode, encodingExists } = iconv;

function isBuffer(value: any): value is Buffer {
  return value instanceof Buffer;
}

export class I18n {
  constructor(
    public defaultLocale: keyof TLocales,
    private locales: TLocales,
  ) {
    this.defaultLocale = snakeCase(defaultLocale);
    this.locales = I18n.snakeLocaleKeys(locales);
  }

  addLocales = (locales: TLocales): void => {
    merge(this.locales, I18n.snakeLocaleKeys(locales));
  };

  removeLocales = (...props: any[]): void => {
    this.locales = omit(this.locales, props);
  };

  $t = (
    key: string,
    replaceable?: any[] | undefined | null,
    locale: keyof TLocales = this.defaultLocale,
  ): string => {
    const incomingLocale = this.locales[snakeCase(locale)];
    const defaultLocale = get(this.locales[this.defaultLocale], key);
    // "server.welcome" => zh_cn["server"]["welcome"];
    const dotVal = get(incomingLocale, key, defaultLocale);
    if (typeof dotVal === "undefined") {
      throw new I18nException(`[i18n]: cannot find ${locale}["${key}"]`);
    }
    if (typeof dotVal !== "string") return JSON.stringify(dotVal);
    let strDotVal = dotVal;
    if (replaceable && replaceable.length) {
      strDotVal = util.format(strDotVal, ...replaceable);
    }
    return strDotVal;
  };

  // determine if the incoming character encoding type is valid
  static isValidate(charset: string): void {
    if (!encodingExists(charset)) {
      throw new I18nException(`[i18n]: unknown charset ${charset}`);
    }
  }

  // convert utf8 strings to different encoded byte stream arrays
  // used to solve the internationalization language display display messy problem
  // https://github.com/AmyrAhmady/samp-node/issues/2
  static encodeToBuf(content: string, charset: string): number[] {
    I18n.isValidate(charset);
    return [...encode(content, charset), 0];
  }

  // convert byte stream arrays of different encodings to utf8 strings
  static decodeFromBuf(buf: Buffer | number[], charset = "utf8"): string {
    I18n.isValidate(charset);
    const buffer = isBuffer(buf) ? buf : Buffer.from(I18n.getValidStr(buf));
    return decode(buffer, charset);
  }

  // Truncate the string to the EOS tag to get the actual valid data
  static getValidStr(byteArr: number[]) {
    const end = byteArr.indexOf(0);
    if (end === -1) return byteArr;
    return byteArr.slice(0, byteArr.indexOf(0));
  }

  static snakeLocaleKeys(locales: TLocales) {
    return mapKeys(locales, (_: any, key: any) => snakeCase(key));
  }

  static convertSpecialChar(input: string): string {
    const charMap: Record<string, string> = {
      à: "\x97",
      á: "\x98",
      â: "\x99",
      ä: "\x9A",
      À: "\x80",
      Á: "\x81",
      Â: "\x82",
      Ä: "\x83",
      è: "\x9D",
      é: "\x9E",
      ê: "\x9F",
      ë: "\xA0",
      È: "\x86",
      É: "\x87",
      Ê: "\x88",
      Ë: "\x89",
      ì: "\xA1",
      í: "\xA2",
      î: "\xA3",
      ï: "\xA4",
      Ì: "\x8A",
      Í: "\x8B",
      Î: "\x8C",
      Ï: "\x8D",
      ò: "\xA5",
      ó: "\xA6",
      ô: "\xA7",
      ö: "\xA8",
      Ò: "\x8E",
      Ó: "\x8F",
      Ô: "\x90",
      Ö: "\x91",
      ù: "\xA9",
      ú: "\xAA",
      û: "\xAB",
      ü: "\xAC",
      Ù: "\x92",
      Ú: "\x93",
      Û: "\x94",
      Ü: "\x95",
      ñ: "\xAE",
      Ñ: "\xAD",
      "¡": "@",
      "¿": "\xAF",
      "`": "\xB1",
      // "&": "&",
    };
    return input
      .split("")
      .map((char) => (char in charMap ? charMap[char] : char))
      .join("");
  }
}
