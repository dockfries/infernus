export class TextLabelException extends Error {
  constructor(message: string) {
    super(`[TextLabel]: ${message}`);
    this.name = "TextLabelException";
  }
}
