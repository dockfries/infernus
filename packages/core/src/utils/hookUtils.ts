import { THookedMethods, TMethodKeys } from "core/types";

export function defineHooks<T extends new (...args: any[]) => any>(target: T) {
  const prototype = target.prototype;
  const methodKeys = Object.getOwnPropertyNames(prototype).filter(
    (k) => typeof prototype[k] === "function" && k !== "constructor",
  ) as TMethodKeys<InstanceType<T>>[];

  const methods = methodKeys.reduce(
    (acc, key) => {
      acc[key] = prototype[key];
      return acc;
    },
    {} as Pick<InstanceType<T>, TMethodKeys<InstanceType<T>>>,
  );

  const methodCache = new WeakMap<InstanceType<T>, THookedMethods<T>>();

  function useMethods(instance: InstanceType<T>) {
    if (!methodCache.has(instance)) {
      const boundMethods = Object.fromEntries(
        methodKeys.map((key) => [key, methods[key].bind(instance)]),
      ) as THookedMethods<T>;
      methodCache.set(instance, boundMethods);
    }
    return methodCache.get(instance)!;
  }

  function setHook<K extends TMethodKeys<InstanceType<T>>>(
    method: K,
    interceptor: (
      this: InstanceType<T>,
      ...args: Parameters<InstanceType<T>[K]>
    ) => ReturnType<InstanceType<T>[K]>,
  ) {
    const original = Reflect.get(prototype, method);
    if (typeof original !== "function")
      throw new Error(`Invalid method: ${String(method)}`);
    Reflect.set(prototype, method, interceptor);
    return interceptor;
  }

  return [useMethods, setHook] as const;
}
