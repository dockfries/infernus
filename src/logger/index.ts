import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});

console.log = logger.info;
console.warn = logger.warn;
console.error = logger.error;
console.debug = logger.debug;
console.trace = logger.trace;

process.on("uncaughtException", (err) => {
  logger.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.warn(err);
});

export default logger;
