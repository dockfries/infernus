export class HookException extends Error {
  constructor(message: string) {
    super(`[Hook]: ${message}`);
    this.name = "HookException";
  }
}
