import { THookFuncNames, THookInterceptor } from "core/types";

export function hook<
  T extends new (...args: any[]) => any,
  K extends THookFuncNames<InstanceType<T>>,
>(target: T, methodName: K, interceptor: THookInterceptor<T, K>): void {
  const prototype = target.prototype;
  const originalMethod = Reflect.get(prototype, methodName);

  if (typeof originalMethod !== "function") {
    throw new Error(`Cannot hook non-function property: ${String(methodName)}`);
  }

  let callStacks = 0;

  const success = Reflect.set(
    prototype,
    methodName,
    function (
      this: InstanceType<T>,
      ...args: Parameters<typeof originalMethod>
    ) {
      try {
        callStacks++;
        if (callStacks > 1) {
          return originalMethod.apply(this, args);
        }
        return interceptor.call(this, originalMethod.bind(this), ...args);
      } finally {
        callStacks--;
      }
    },
  );

  if (!success) {
    throw new Error(`Failed to hook property: ${String(methodName)}`);
  }
}
