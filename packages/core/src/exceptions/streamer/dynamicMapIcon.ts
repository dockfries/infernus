import { StreamerException } from "./streamer";

export class DynamicMapIconException extends StreamerException {
  constructor(message: string) {
    super(`[DynamicMapIcon]: ${message}`);
    this.name = "DynamicMapIcon";
  }
}
