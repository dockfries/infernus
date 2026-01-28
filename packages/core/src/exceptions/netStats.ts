export class NetStatsException extends Error {
  constructor(message: string) {
    super(`[NetStats]: ${message}`);
    this.name = "NetStatsException";
  }
}
