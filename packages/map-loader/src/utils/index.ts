import fs from "node:fs";
import path from "node:path";
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
      id = randId;
    }
  }
  return id;
}

export function replaceTexture(
  modelId: number | string,
  textureLib: string,
  textureName: string,
) {
  if (
    modelId === "16644" &&
    textureLib === "a51_detailstuff" &&
    textureName === "roucghstonebrtb"
  ) {
    return {
      modelId: 18888,
      textureLib: "forcefields",
      textureName: "white",
    };
  }
  return {
    modelId: +modelId,
    textureLib,
    textureName,
  };
}

export function formatHex(num: number, digits = 2) {
  return "0x" + (num >>> 0).toString(16).padStart(digits, "0");
}

export function paramsSplit(str: string) {
  return str
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map((param) => param.trim().replace(/^"|"$/g, ""));
}

export function isSamePath(path1: string, path2: string) {
  const absolutePath1 = path.resolve(path1);
  const absolutePath2 = path.resolve(path2);

  return process.platform === "win32"
    ? absolutePath1.toLowerCase() === absolutePath2.toLowerCase()
    : absolutePath1 === absolutePath2;
}
