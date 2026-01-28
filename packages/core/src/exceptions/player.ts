export class PlayerException extends Error {
  constructor(message: string) {
    super(`[Player]: ${message}`);
    this.name = "PlayerException";
  }
}
