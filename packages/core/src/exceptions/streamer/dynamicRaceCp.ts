import { StreamerException } from "./streamer";

export class DynamicRaceCpException extends StreamerException {
  constructor(message: string) {
    super(`[DynamicRaceCp]: ${message}`);
    this.name = "DynamicRaceCp";
  }
}
