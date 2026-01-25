import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";

const packagesDir = path.resolve("./packages");
const packageDir = path.resolve(packagesDir, process.env.TARGET);

const inputPath = path.resolve(packageDir, `src/main.ts`);
const outputPath = path.resolve(packageDir, `dist`);

const targetPkgJson = JSON.parse(
  fs.readFileSync(path.resolve(packageDir, "package.json"), "utf-8"),
);

const externalSet = new Set([/^node:/]);

Object.keys({
  ...(targetPkgJson.dependencies || {}),
  ...(targetPkgJson.peerDependencies || {}),
}).forEach((key) => externalSet.add(new RegExp(`^${key}(/.*)?$`)));

const commonConfig = {
  tsconfig: "./tsconfig.json",
  transform: {
    target: "node22",
  },
  platform: "node",
  external: [...externalSet],
  resolve: {
    alias: {
      raknet: path.resolve(process.cwd(), "packages/raknet/src/"),
      core: path.resolve(process.cwd(), "packages/core/src/"),
      filterscript: path.resolve(process.cwd(), "packages/filterscript/src/"),
      shared: path.resolve(process.cwd(), "packages/shared/src/"),
    },
  },
};

export default defineConfig([
  {
    ...commonConfig,
    input: inputPath,
    output: [
      {
        cleanDir: true,
        file: path.resolve(outputPath + "/bundle.mjs"),
        format: "es",
        minify: true,
      },
      {
        file: path.resolve(outputPath + "/bundle.js"),
        format: "cjs",
        minify: true,
      },
    ],
  },
  {
    ...commonConfig,
    input: {
      bundle: inputPath,
    },
    output: {
      format: "es",
      dir: outputPath,
    },
    plugins: [
      dts({
        emitDtsOnly: true,
        tsconfig: "./tsconfig.json",
        resolve: ["@infernus/streamer"],
      }),
    ],
  },
]);
