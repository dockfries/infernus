import { StreamerException } from "./streamer";

export class DynamicCheckPointException extends StreamerException {
  constructor(message: string) {
    super(`[DynamicCheckPoint]: ${message}`);
    this.name = "DynamicCheckPoint";
  }
}
