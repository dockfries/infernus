export class MapAndreasException extends Error {
  constructor(message: string) {
    super(`[MapAndreas]: ${message}`);
    this.name = "MapAndreasException";
  }
}
