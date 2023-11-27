export type CallbackRet = boolean | number | void;

export type PromisifyCallbackRet = CallbackRet | Promise<CallbackRet>;

export type nextMiddleware = () => CallbackRet;

export const eventBus = new Map<string, Array<(...args: any) => any>>();

export function promisifyCallback(
  value: PromisifyCallbackRet,
  defaultRetVal: boolean
) {
  if (value instanceof Promise) {
    return +defaultRetVal;
  }
  const ret = +value;
  return isNaN(ret) ? +defaultRetVal : ret;
}

export function defineEvent<T extends object>(
  eventName: string,
  enhanceParamsFn: (
    next: nextMiddleware,
    ...args: any
  ) => { next: nextMiddleware } & T,
  defaultRetVal = true,
  registerEvent = false,
  registerEventIdentifier = ""
) {
  const hasListener = eventBus.has(eventName);

  if (!hasListener) {
    registerEvent && samp.registerEvent(eventName, registerEventIdentifier);

    samp.on(eventName, (...args) => {
      let index = -1;

      const next = () => {
        const middlewares = eventBus.get(eventName);
        if (!middlewares || !middlewares.length) return defaultRetVal;

        index++;
        if (index < middlewares.length) {
          return middlewares[index](enhanceParamsFn(next, ...args));
        }
        return defaultRetVal;
      };

      return promisifyCallback(next(), defaultRetVal);
    });
  }

  return (
    cb: (ret: ReturnType<typeof enhanceParamsFn>) => PromisifyCallbackRet
  ) => {
    const middlewares = eventBus.get(eventName) || [];

    const length = middlewares.push(cb);
    const idx = length - 1;

    eventBus.set(eventName, middlewares);

    const off = () => {
      const currentMiddlewares = eventBus.get(eventName) || [];

      if (currentMiddlewares.length && currentMiddlewares[idx] === cb) {
        currentMiddlewares.splice(idx, 1);
        eventBus.set(eventName, currentMiddlewares);
      }
    };

    return off;
  };
}
