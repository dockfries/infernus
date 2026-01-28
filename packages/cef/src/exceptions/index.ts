export class CefException extends Error {
  constructor(message: string) {
    super(`[samp-cef]: ${message}`);
    this.name = "CefException";
  }
}
