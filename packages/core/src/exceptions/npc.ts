export class NpcException extends Error {
  constructor(message: string) {
    super(`[Npc]: ${message}`);
    this.name = "NpcException";
  }
}
