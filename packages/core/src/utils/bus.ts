import { CoreException } from "core/exceptions";

export type CallbackRet = boolean | number | void;

export type PromisifyCallbackRet = CallbackRet | Promise<CallbackRet>;

/** Info passed to the global event error handler. */
export interface EventErrorInfo {
  eventName: string;
  index: number;
}

export type EventErrorHandler = (err: unknown, info: EventErrorInfo) => void;

let eventErrorHandler: EventErrorHandler | null = null;

/**
 * Registers a global error handler for listener errors (both synchronous throws and
 * async rejections). Use it to feed your own logger. When no handler is registered,
 * errors fall back to `samp.logprint`.
 */
export function setEventErrorHandler(handler: EventErrorHandler | null) {
  eventErrorHandler = handler;
}

function handleListenerError(err: unknown, name: string, index: number) {
  if (eventErrorHandler) {
    try {
      eventErrorHandler(err, { eventName: name, index });
    } catch {
      // ignore
    }
    return;
  }
  const isError = err instanceof Error;
  const msg = `executing event [name:${name},index:${index}]`;
  samp.logprint(msg);
  if (isError) {
    samp.logprint(err.message);
  } else {
    samp.logprint(JSON.stringify(err));
  }
}

export interface defineEventOptions<T extends object> {
  name: string;
  defaultValue?: boolean;
  identifier?: string;
  isNative?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  beforeEach?: (...args: any[]) => Exclude<T, Array<any> | Function>;
  afterEach?: (arg: T) => void;
  throwOnError?: boolean;
}

export interface ExecMiddlewareOptions {
  args: any[];
  skipToNext?: (...args: any[]) => any;
}

export const eventBus = new Map<string, ((...args: any) => PromisifyCallbackRet)[]>();

const triggerBus = new Map<string, (...args: any[]) => number>();

function transformReturnValue(value: PromisifyCallbackRet, defaultValue: boolean) {
  if (typeof value === "boolean") return +value;
  if (typeof value === "number" && !isNaN(value)) return value;
  return +defaultValue;
}

function executeMiddlewares<T extends object>(
  options: defineEventOptions<T>,
  startIndex: number,
  ...args: any[]
) {
  const { defaultValue = true, name, beforeEach, afterEach, throwOnError = false } = options;

  const middlewares = eventBus.get(name);
  if (!middlewares || !middlewares.length) return +defaultValue;

  let enhanced: T;
  try {
    enhanced = beforeEach ? beforeEach(...args) : ({} as T);
  } catch (err) {
    // beforeEach failed to parse the event params; route the error and abort the event
    handleListenerError(err, name, -1);
    return +defaultValue;
  }

  const promises: Promise<CallbackRet>[] = [];

  let index = startIndex;

  const executeAfterEach = () => {
    if (afterEach) {
      if (!promises.length) afterEach(enhanced);
      else Promise.allSettled(promises).then(() => afterEach(enhanced));
    }
  };

  const next = (value?: Partial<T>) => {
    index++;
    if (index < middlewares.length) {
      try {
        if (value) Object.assign(enhanced, value);

        const params = { next, defaultValue, ...enhanced };

        const ret = middlewares[index](params);

        if (ret instanceof Promise) {
          const currIdx = index;
          ret.catch((err) => handleListenerError(err, name, currIdx));
          promises.push(ret);
          return defaultValue;
        }

        return ret;
      } catch (err) {
        const isError = err instanceof Error;
        const msg = `executing event [name:${name},index:${index}]`;
        if (throwOnError) {
          if (isError) {
            throw err;
          }
          throw new CoreException(msg + "\n" + JSON.stringify(err));
        }
        handleListenerError(err, name, index);
        executeAfterEach();
      }
      return defaultValue;
    }

    executeAfterEach();

    return defaultValue;
  };

  return transformReturnValue(next(), defaultValue);
}

/**
 * @throws {CoreException} When an event with the same `name` has already been defined.
 *
 * Listener errors: synchronous throws inside listeners are routed to the handler registered via
 * `setEventErrorHandler` (falling back to `samp.logprint`), or re-thrown when `throwOnError` is
 * set. Async listener rejections are routed the same way instead of becoming unhandled rejections.
 */
export function defineEvent<T extends object>(options: defineEventOptions<T>) {
  const { name, identifier, isNative = true } = options;

  const isDefined = eventBus.has(name);

  if (isDefined) {
    const msg = `event [name:${name}] error: already defined.`;
    throw new CoreException(msg);
  }

  function trigger(...argsOrOptions: any[]) {
    const isOptions =
      argsOrOptions.length === 1 &&
      typeof argsOrOptions[0] === "object" &&
      argsOrOptions[0].__trigger__;

    if (isOptions) {
      const execOptions = argsOrOptions[0] as ExecMiddlewareOptions;
      let execStart = -1;
      if (execOptions.skipToNext) {
        const middlewares = eventBus.get(name);
        if (middlewares && middlewares.length) {
          const funcIndex = middlewares.indexOf(execOptions.skipToNext);
          if (funcIndex > -1) {
            execStart = funcIndex;
          }
        }
      }
      return executeMiddlewares(options, execStart, ...execOptions.args);
    }
    return executeMiddlewares(options, -1, ...argsOrOptions);
  }

  function pusher(
    cb: (
      ret: T & {
        next: (value?: Partial<T>) => CallbackRet;
        defaultValue: defineEventOptions<T>["defaultValue"];
      },
    ) => PromisifyCallbackRet,
    unshift = false,
  ) {
    if (!eventBus.has(name)) {
      eventBus.set(name, []);
    }
    const middlewares = eventBus.get(name)!;
    const length = unshift ? middlewares.unshift(cb) : middlewares.push(cb);
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

  triggerBus.set(name, trigger);

  return h;
}

export function useTrigger(eventName: string) {
  return triggerBus.get(eventName);
}

export function withTriggerOptions(options: ExecMiddlewareOptions) {
  return Object.assign(options, {
    __trigger__: true,
  });
}
