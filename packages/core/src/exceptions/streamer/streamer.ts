export class StreamerException extends Error {
  constructor(message: string) {
    super(`[StreamerException]: ${message}`);
    this.name = "StreamerException";
  }
}
