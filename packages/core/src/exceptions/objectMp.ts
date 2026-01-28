export class ObjectMpException extends Error {
  constructor(message: string) {
    super(`[ObjectMp]: ${message}`);
    this.name = "ObjectMpException";
  }
}
