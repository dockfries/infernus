export class ClientCheckException extends Error {
  constructor(message: string) {
    super(`[ClientCheck]: ${message}`);
    this.name = "ClientCheckException";
  }
}
