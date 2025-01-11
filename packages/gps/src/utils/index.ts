import { GpsError } from "../enums";

export class GpsException extends Error {
  constructor(public code: GpsError) {
    super("GpsException");
  }
}
