export class I18nException extends Error {
  constructor(message: string) {
    super(`[I18n]: ${message}`);
    this.name = "I18nException";
  }
}
