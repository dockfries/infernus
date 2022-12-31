import pino from "pino";

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

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
