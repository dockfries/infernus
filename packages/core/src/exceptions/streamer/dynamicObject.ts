import { StreamerException } from "./streamer";

export class DynamicObjectException extends StreamerException {
  constructor(message: string) {
    super(`[DynamicObject]: ${message}`);
    this.name = "DynamicObject";
  }
}
