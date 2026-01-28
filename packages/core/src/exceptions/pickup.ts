export class PickupException extends Error {
  constructor(message: string) {
    super(`[Pickup]: ${message}`);
    this.name = "PickupException";
  }
}
