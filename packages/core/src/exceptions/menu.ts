export class MenuException extends Error {
  constructor(message: string) {
    super(`[Menu]: ${message}`);
    this.name = "MenuException";
  }
}
