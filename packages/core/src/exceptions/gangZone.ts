export class GangZoneException extends Error {
  constructor(message: string) {
    super(`[GangZone]: ${message}`);
    this.name = "GangZoneException";
  }
}
