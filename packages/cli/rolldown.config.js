import fs from "node:fs";
import { defineConfig } from "rolldown";

const inputPath = "./src/main.ts";
const outputPath = "./dist";

const targetPkgJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const externalSet = new Set([/^node:/]);

Object.keys({
  ...(targetPkgJson.dependencies || {}),
  ...(targetPkgJson.peerDependencies || {}),
}).forEach((key) => externalSet.add(new RegExp(`^${key}(/.*)?$`)));

export default defineConfig({
  input: inputPath,
  external: [...externalSet],
  platform: "node",
  transform: {
    target: "node22",
  },
  output: {
    cleanDir: true,
    format: "es",
    minify: true,
    file: outputPath + "/bundle.js",
  },
});
