export class RecException extends Error {
  constructor(message: string) {
    super(`[Rec]: ${message}`);
    this.name = "RecException";
  }
}
