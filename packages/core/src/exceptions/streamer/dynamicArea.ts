import { StreamerException } from "./streamer";

export class DynamicAreaException extends StreamerException {
  constructor(message: string) {
    super(`[DynamicArea]: ${message}`);
    this.name = "DynamicArea";
  }
}
