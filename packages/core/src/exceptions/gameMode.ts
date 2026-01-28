export class GameModeException extends Error {
  constructor(message: string) {
    super(`[GameMode]: ${message}`);
    this.name = "GameModeException";
  }
}
