import { StreamerException } from "./streamer";

export class DynamicActorException extends StreamerException {
  constructor(message: string) {
    super(`[DynamicActor]: ${message}`);
    this.name = "DynamicActor";
  }
}
