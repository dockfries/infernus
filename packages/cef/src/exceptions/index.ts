export class CefException extends Error {
  constructor(message: string) {
    super(`[omp-cef]: ${message}`);
    this.name = "CefException";
  }
}
