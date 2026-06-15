export class OMPPException extends Error {
  constructor(message: string) {
    super(`[OpenMP-Plus]: ${message}`);
    this.name = "OMPPException";
  }
}
