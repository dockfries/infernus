export class SampVoiceException extends Error {
  constructor(message: string) {
    super(`[SampVoice]: ${message}`);
    this.name = "SampVoiceException";
  }
}
