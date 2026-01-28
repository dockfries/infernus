export class RakNetException extends Error {
  constructor(message: string) {
    super(`[RakNet]: ${message}`);
    this.name = "RakNetException";
  }
}
