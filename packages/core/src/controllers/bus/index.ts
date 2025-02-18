export type CallbackRet = boolean | number | void;

export type PromisifyCallbackRet = CallbackRet | Promise<CallbackRet>;

export type Options<T extends object> = {
  name: string;
  defaultValue?: boolean;
  identifier?: string;
  isNative?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  beforeEach?: (...args: any[]) => Exclude<T, Array<any> | Function>;
  afterEach?: (arg: T) => void;
  throwOnError?: boolean;
};

export const eventBus = new Map<
  string,
  ((...args: any) => PromisifyCallbackRet)[]
>();

function transformReturnValue(
  value: PromisifyCallbackRet,
  defaultValue: boolean,
) {
  if (typeof value === "boolean") return +value;
  if (typeof value === "number" && !isNaN(value)) return value;
  return +defaultValue;
}

function executeMiddlewares<T extends object>(
  options: Options<T>,
  ...args: any[]
) {
  const {
    defaultValue = true,
    name,
    beforeEach,
    afterEach,
    throwOnError = false,
  } = options;

  const middlewares = eventBus.get(name);
  if (!middlewares || !middlewares.length) return +defaultValue;

  const enhanced = beforeEach ? beforeEach(...args) : ({} as T);

  const promises: Promise<CallbackRet>[] = [];

  let index = -1;

  const next = () => {
    index++;
    if (index < middlewares.length) {
      try {
        const ret = middlewares[index]({ next, defaultValue, ...enhanced });

        if (ret instanceof Promise) {
          promises.push(ret);
        }

        return ret;
      } catch (err) {
        const msg = `executing event [name:${name},index:${index}] error:\n${err}`;
        if (throwOnError) {
          throw { error: err, message: msg };
        }
        console.log(msg);
      }
      return defaultValue;
    }

    if (afterEach) {
      if (!promises.length) afterEach(enhanced);
      else Promise.allSettled(promises).then(() => afterEach(enhanced));
    }

    return defaultValue;
  };

  return transformReturnValue(next(), defaultValue);
}

export function defineEvent<T extends object>(options: Options<T>) {
  const { name, identifier, isNative = true } = options;

  const isDefined = eventBus.has(name);

  if (isDefined) {
    const msg = `event [name:${name}] error: already defined.`;
    throw new Error(msg);
  }

  function trigger(...args: any[]) {
    return executeMiddlewares(options, ...args);
  }

  function pusher(
    cb: (
      ret: T & {
        next: () => CallbackRet;
        defaultValue: Options<T>["defaultValue"];
      },
    ) => PromisifyCallbackRet,
  ) {
    if (!eventBus.has(name)) {
      eventBus.set(name, []);
    }
    const middlewares = eventBus.get(name)!;
    const length = middlewares.push(cb);
    const pushedPos = length - 1;

    const off = () => {
      const currentMiddlewares = eventBus.get(name);
      if (!currentMiddlewares) return;

      const currentMaxPos = currentMiddlewares.length - 1;

      const endIdx = currentMaxPos < pushedPos ? currentMaxPos : pushedPos;

      for (let i = endIdx; i >= 0; i--) {
        if (currentMiddlewares[i] === cb) {
          currentMiddlewares.splice(i, 1);
          break;
        }
      }

      if (currentMiddlewares.length === 0) {
        eventBus.delete(name);
      }

      return currentMiddlewares.length;
    };

    return off;
  }

  const h = [pusher, trigger] as const;

  if (isNative) {
    if (typeof identifier !== "undefined") {
      samp.registerEvent(name, identifier);
    }
    samp.on(name, trigger);
  }

  return h;
}
