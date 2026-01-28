export class QRException extends Error {
  constructor(message: string) {
    super(`[QRCode]: ${message}`);
    this.name = "QRCodeException";
  }
}
