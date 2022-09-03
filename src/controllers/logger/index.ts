import pino, { Logger as PinoLogger } from "pino";

process.on("uncaughtException", (err) => {
  Logger.getInstance().error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  Logger.getInstance().warn(err);
});

export default class Logger {
  private static instance: PinoLogger | null = null;
  private constructor() {}
  public static getInstance() {
    if (!Logger.instance)
      Logger.instance = pino({
        transport: {
          target: "pino-pretty",
          options: {
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      });
    return Logger.instance;
  }
}
