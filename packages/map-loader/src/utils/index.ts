import fs from "node:fs";
import readline from "node:readline";
import { INTERNAL_MAP } from "../constants";

export function processLineByLine(filePath: string) {
  const fileStream = fs.createReadStream(filePath);

  return readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
}

export function uniqId() {
  let id = -1;
  while (id === -1) {
    const randId = Math.floor(Math.random() * 0xffffff);
    if (!INTERNAL_MAP.loadedMaps.has(randId)) {
      id = Math.floor(Math.random() * 0xffffff);
    }
  }
  return id;
}
