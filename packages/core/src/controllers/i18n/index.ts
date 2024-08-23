import type { TLocales } from "../../types";
import { encode, decode, encodingExists } from "iconv-lite";
import { logger } from "../../logger";
import { snakeCase, merge, omit, get, mapKeys } from "lodash-unified";

export class I18n {
  constructor(
    private defaultLocale: keyof TLocales,
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
    if (dotVal === undefined) {
      logger.warn(`[i18n]: cannot find ${locale}["${key}"]`);
      return "undefined";
    }
    if (typeof dotVal !== "string") return JSON.stringify(dotVal);
    let strDotVal = dotVal;
    if (replaceable && replaceable.length) {
      // %s Used to declare as a slot and for future replacement
      const placeholder = /%s/i;
      for (let i = 0; i < replaceable.length; i++) {
        const matches = strDotVal.match(placeholder);
        if (matches === null) break;
        strDotVal = strDotVal.replace(placeholder, replaceable[i]);
      }
    }
    return strDotVal;
  };

  // determine if the incoming character encoding type is valid
  static isValidate(charset: string): void {
    if (!encodingExists(charset)) {
      logger.fatal(`[i18n]: unknown charset ${charset}`);
      process.exit(1);
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
    const buffer =
      buf instanceof Buffer ? buf : Buffer.from(I18n.getValidStr(buf));
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
}
