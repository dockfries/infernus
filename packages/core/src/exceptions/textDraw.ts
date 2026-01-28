export class TextDrawException extends Error {
  constructor(message: string) {
    super(`[TextDraw]: ${message}`);
    this.name = "TextDrawException";
  }
}
