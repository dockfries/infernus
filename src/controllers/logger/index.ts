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
    if (!Logger.instance) Logger.instance = pino();
    return Logger.instance;
  }
}
