import pino from "pino";

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});

export const setLoggerLevel = (level: string): void => {
  logger.level = level;
};

process.on("uncaughtException", (err) => {
  logger.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  if (err instanceof Error) {
    logger.warn(err);
    return;
  }
  logger.warn(new Error(JSON.stringify(err)));
});
