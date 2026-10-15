import { randomBytes } from "node:crypto";

/** the characters an rcon password may use: the prompt validates `^\w+$` */
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** 248 = 4 * 62, so bytes at or above it would bias the modulo */
const UNBIASED_LIMIT = Math.floor(256 / ALPHABET.length) * ALPHABET.length;

/**
 * A random rcon password of exactly `length` characters.
 *
 * Drawn from `crypto` rather than `Math.random`, because this value protects the
 * server console and must not be predictable.
 */
export function generateRandomString(length: number) {
  let password = "";

  while (password.length < length) {
    for (const byte of randomBytes(length)) {
      if (byte >= UNBIASED_LIMIT) continue;

      password += ALPHABET[byte % ALPHABET.length];
      if (password.length === length) break;
    }
  }

  return password;
}
