export type CallbackRet = boolean | number | void;

export type PromisifyCallbackRet = CallbackRet | Promise<CallbackRet>;

export type Options<T> = {
  name: string;
  defaultValue?: boolean;
  identifier?: string;
  isNative?: boolean;
  beforeEach?: (...args: any[]) => T;
  afterEach?: (arg: T) => void;
};

export const eventBus = new Map<
  string,
  ((...args: any) => PromisifyCallbackRet)[]
>();

export function emptyMiddlewares(name: string) {
  eventBus.set(name, []);
}

function transformReturnValue(
  value: PromisifyCallbackRet,
  defaultValue: boolean
) {
  if (typeof value === "boolean") return +value;
  if (typeof value === "number" && !isNaN(value)) return value;
  return +defaultValue;
}

function executeMiddlewares<T>(options: Options<T>, ...args: any[]) {
  const { defaultValue = true, name, beforeEach, afterEach } = options;

  const middlewares = eventBus.get(name);
  if (!middlewares || !middlewares.length) return +defaultValue;

  const enhanced = beforeEach ? beforeEach(...args) : ({} as T);

  const promises: Promise<CallbackRet>[] = [];

  let index = -1;

  const next = () => {
    index++;
    if (index < middlewares.length) {
      try {
        const ret = middlewares[index]({ next, ...enhanced });

        if (ret instanceof Promise) {
          promises.push(ret);
        }

        return ret;
      } catch (err) {
        const error = JSON.stringify(err);
        const msg = `executing event [name:${name},index:${index}] error: ${error}.`;
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
    console.log(msg);
    throw new Error(msg);
  }

  emptyMiddlewares(name);

  function trigger(...args: any[]) {
    if (isNative) {
      const msg = `simulate execute native event [name:${name}] is not recommended.`;
      console.log(msg);
    }
    return executeMiddlewares(options, ...args);
  }

  function run(
    cb: (ret: T & { next: () => CallbackRet }) => PromisifyCallbackRet
  ) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const middlewares = eventBus.get(name)!;

    const length = middlewares.push(cb);
    const idx = length - 1;

    const off = () => {
      const currentMiddlewares = eventBus.get(name) || [];

      if (currentMiddlewares.length && currentMiddlewares[idx] === cb) {
        currentMiddlewares.splice(idx, 1);
      }
    };

    return off;
  }

  const h = [run, trigger] as [typeof run, typeof trigger];

  if (isNative) {
    identifier && samp.registerEvent(name, identifier);
    samp.on(name, trigger);
  }

  return h;
}
