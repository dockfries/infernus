import { StreamerException } from "./streamer";

export class DynamicTextLabelException extends StreamerException {
  constructor(message: string) {
    super(`[Dynamic3dTextLabel]: ${message}`);
    this.name = "DynamicTextLabel";
  }
}
