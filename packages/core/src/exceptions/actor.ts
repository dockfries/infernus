export class ActorException extends Error {
  constructor(message: string) {
    super(`[Actor]: ${message}`);
    this.name = "ActorException";
  }
}
