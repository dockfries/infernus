import { ILocales } from "@/types";
import { encode, decode, encodingExists } from "iconv-lite";
import logger from "@/logger";
import { merge } from "lodash";

export class I18n {
  private locales: ILocales;
  private language: keyof ILocales;

  constructor(defaultLocale: keyof ILocales, locales: ILocales) {
    this.language = defaultLocale;
    this.locales = locales;
  }

  public addLocales(locales: ILocales): void {
    merge(this.locales, locales);
  }

  public $t(
    key: string,
    replaceable?: any[] | undefined | null,
    lang: keyof ILocales = this.language
  ): string {
    const { value } = this.locales[lang];
    let text = I18n.dotValue(value, key);
    if (text === undefined) return "undefined";
    if (replaceable && replaceable.length) {
      // %s Used to declare as a slot and for future replacement
      const placeholder = /%s/i;
      for (let i = 0; i < replaceable.length; i++) {
        const matches = text.match(placeholder);
        if (matches === null) break;
        text = text.replace(placeholder, replaceable[i]);
      }
    }
    return text;
  }

  // "server.welcome" => zh_cn["server"]["welcome"];
  private static dotValue(whichLangJson: any, property: string): string {
    const keyArr: string[] = property.split(".");
    return keyArr.reduce((obj: any, key: string) => {
      if (!Object.prototype.hasOwnProperty.call(obj, key))
        return logger.fatal(new Error(`[i18n]: cannot find ${property}`));
      return obj[key];
    }, whichLangJson) as string;
  }

  // determine if the incoming character encoding type is valid
  public static isValidate(charset: string): void {
    if (!encodingExists(charset))
      return logger.fatal(new Error(`[i18n]: unknown charset ${charset}`));
  }

  // convert utf8 strings to different encoded byte stream arrays
  // used to solve the internationalization language display display messy problem
  // https://github.com/AmyrAhmady/samp-node/issues/2
  public static encodeToBuf(content: string, charset: string): number[] {
    I18n.isValidate(charset);
    return [...encode(content, charset), 0];
  }

  // convert byte stream arrays of different encodings to utf8 strings
  public static decodeFromBuf(buf: Buffer | number[], charset: string): string {
    I18n.isValidate(charset);
    const buffer = buf instanceof Buffer ? buf : Buffer.from(buf);
    return decode(buffer, charset);
  }

  // Truncate the string to the EOS tag to get the actual valid data
  public static getValidStr(byteArr: number[]) {
    return byteArr.slice(0, byteArr.indexOf(0));
  }
}
