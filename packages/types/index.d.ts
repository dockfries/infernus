declare global {
  interface SampNodeApi {
    on(eventName: string, func: (...args: Array<any>) => void): void;
    addListener: SampNodeApi["on"];
    addEventListener: SampNodeApi["on"];
    removeListener(eventName: string): void;
    removeEventListener(
      eventName: string,
      func: (...args: Array<any>) => void,
    ): void;
    removeEventListener(
      eventName: string,
      funcs: Array<(...args: Array<any>) => void>,
    ): void;
    registerEvent(eventName: string, paramTypes: string): boolean;
    callNative(
      nativeName: string,
      paramTypes: string,
      ...args: Array<any>
    ): any;
    callNativeFloat: SampNodeApi["callNative"];
    callPublic(
      publicName: string,
      paramTypes: string,
      ...args: Array<any>
    ): any;
    callPublicFloat: SampNodeApi["callPublic"];
    logprint(str: string): void;
    [k: string | symbol]: any;
  }
  var samp: SampNodeApi;
}

export {};
