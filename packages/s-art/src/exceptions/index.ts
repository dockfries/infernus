export class SArtException extends Error {
  constructor(message: string) {
    super(`[s-art]: ${message}`);
    this.name = "SArtException";
  }
}
