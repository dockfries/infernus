/**
 * Type definitions for samp-node
 * Definitions by: pkfln <https://github.com/pkfln>
 * Modify and simplify by: YuCarl77 <https://github.com/yucarl77>
 */

/**
 * Why did I remove a lot of overloaded writing?
 * Because with the wrapper, developers no longer need to pay attention to the parameter prompt for registering samp native events, but only need to register their own events, so it doesn't make sense.
 */

declare class samp {
  static addEventListener(
    eventName: string,
    func: (...args: Array<any>) => void
  ): void;

  static removeEventListener(eventName: string): void;

  static removeEventListener(
    eventName: string,
    func: (...args: Array<any>) => void
  ): void;

  static removeEventListener(
    eventName: string,
    funcs: Array<(...args: Array<any>) => void>
  ): void;

  static registerEvent(eventName: string, paramTypes: string): boolean;

  static fire(eventName: string, ...args: Array<any>): void;

  static callNative(
    nativeName: string,
    paramTypes: string,
    ...args: Array<any>
  ): any;

  static callNativeFloat(
    nativeName: string,
    paramTypes: string,
    ...args: Array<any>
  ): any;

  static callPublic(
    publicName: string,
    paramTypes: string,
    ...args: Array<any>
  ): any;

  static callPublicFloat(
    publicName: string,
    paramTypes: string,
    ...args: Array<any>
  ): any;
}
