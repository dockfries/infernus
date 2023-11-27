export type CallbackRet = boolean | number | void;

export type PromisifyCallbackRet = CallbackRet | Promise<CallbackRet>;

export type nextMiddleware = () => CallbackRet;

export type defineEventOptions<T> = {
  name: string;
  enhance: (
    next: nextMiddleware,
    ...args: any[]
  ) => { next: nextMiddleware } & T;
  defaultValue?: boolean;
  identifier?: string;
  isNative?: boolean;
};

const eventBus = new Map<string, Array<(...args: any) => any>>();

function transformReturnValue(
  value: PromisifyCallbackRet,
  defaultValue: boolean
) {
  if (typeof value === "boolean") return +value;
  if (typeof value === "number" && !isNaN(value)) return value;
  return +defaultValue;
}

function executeMiddlewares<T>(options: defineEventOptions<T>, ...args: any[]) {
  const { defaultValue = true, name, enhance } = options;
  let index = -1;

  try {
    const next = () => {
      const middlewares = eventBus.get(name);
      if (!middlewares || !middlewares.length) return defaultValue;

      index++;
      if (index < middlewares.length) {
        return middlewares[index](enhance(next, args));
      }
      return defaultValue;
    };

    return transformReturnValue(next(), defaultValue);
  } catch (err) {
    const error = JSON.stringify(err);
    const msg = `executing event [name:${name},index:${index}] error: ${error}.`;
    console.log(msg);
  }
  return transformReturnValue(defaultValue, defaultValue);
}

export function defineEvent<T extends object>(options: defineEventOptions<T>) {
  const { name, enhance, identifier, isNative = true } = options;

  function trigger(...args: any[]) {
    if (isNative) {
      const msg = `simulate event [name:${name}] is native (not recommended), unless you know what you're doing.`;
      console.log(msg);
    }
    return executeMiddlewares(options, ...args);
  }

  function run(cb: (ret: ReturnType<typeof enhance>) => PromisifyCallbackRet) {
    const middlewares = eventBus.get(name) || [];

    const length = middlewares.push(cb);
    const idx = length - 1;

    eventBus.set(name, middlewares);

    const off = () => {
      const currentMiddlewares = eventBus.get(name) || [];

      if (currentMiddlewares.length && currentMiddlewares[idx] === cb) {
        currentMiddlewares.splice(idx, 1);
        eventBus.set(name, currentMiddlewares);
      }
    };

    return off;
  }

  const h = [run, trigger] as [typeof run, typeof trigger];

  const isDefined = eventBus.has(name);

  if (isDefined) {
    const msg = `define event [name:${name}] error: already defined.`;
    console.log(msg);
    throw new Error(msg);
  }

  if (isNative) {
    identifier && samp.registerEvent(name, identifier);
    samp.on(name, trigger);
  }

  return h;
}
