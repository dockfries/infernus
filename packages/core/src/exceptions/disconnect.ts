export class DisconnectException extends Error {
  constructor(public playerId: number) {
    super(`Player ${playerId} disconnected`);
    this.name = "DisconnectException";
  }
}
