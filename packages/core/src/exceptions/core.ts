export class CoreException extends Error {
  constructor(message: string) {
    super(`[Core]: ${message}`);
    this.name = "CoreException";
  }
}
