import { StreamerException } from "./streamer";

export class DynamicPickupException extends StreamerException {
  constructor(message: string) {
    super(`[DynamicPickup]: ${message}`);
    this.name = "DynamicPickup";
  }
}
