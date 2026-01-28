export class VehicleException extends Error {
  constructor(message: string) {
    super(`[Vehicle]: ${message}`);
    this.name = "VehicleException";
  }
}
