export class ProgressBarException extends Error {
  constructor(message: string) {
    super(`[ProgressBar]: ${message}`);
    this.name = "ProgressBarException";
  }
}
