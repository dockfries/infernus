export class QueryException extends Error {
  constructor(message: string) {
    super(`[Query]: ${message}`);
    this.name = "QueryException";
  }
}
