export class DialogException extends Error {
  constructor(message: string) {
    super(`[Dialog]: ${message}`);
    this.name = "DialogException";
  }
}
