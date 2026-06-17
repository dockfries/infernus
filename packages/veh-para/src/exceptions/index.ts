export class VehParaException extends Error {
  constructor(message: string) {
    super(`[veh-para]: ${message}`);
    this.name = "VehParaException";
  }
}
