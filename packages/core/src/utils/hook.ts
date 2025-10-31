import { THookedMethods, TMethodKeys } from "core/types";

export function defineHooks<T extends new (...args: any[]) => any>(target: T) {
  const hooked = new Set();

  const prototype = target.prototype;

  const methodKeys = Object.getOwnPropertyNames(prototype).filter(
    (k) => typeof prototype[k] === "function" && k !== "constructor",
  ) as TMethodKeys<InstanceType<T>>[];

  const before = methodKeys.reduce((acc, key) => {
    acc[key] = prototype[key];
    return acc;
  }, {} as THookedMethods<T>);

  function setHook<K extends TMethodKeys<InstanceType<T>>>(
    methodName: K,
    interceptor: (
      this: InstanceType<T>,
      ...args: Parameters<InstanceType<T>[K]>
    ) => ReturnType<InstanceType<T>[K]>,
  ) {
    if (hooked.has(methodName)) {
      throw new Error(
        `Method '${String(methodName)}' of class '${target.name}' ` +
          `has already been hooked. Each method can only be hooked once per defineHooks call. `,
      );
    }

    const original = Reflect.get(prototype, methodName);
    if (typeof original !== "function")
      throw new Error(`Invalid method: ${String(methodName)}`);

    Reflect.set(prototype, methodName, interceptor);
    hooked.add(methodName);

    return interceptor;
  }

  return [before, setHook] as const;
}
