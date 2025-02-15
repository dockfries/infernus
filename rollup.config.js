import path from "node:path";
import { createRequire } from "node:module";
import esbuild from "rollup-plugin-esbuild";
import del from "rollup-plugin-delete";
import externals from "rollup-plugin-node-externals";
import dts from "rollup-plugin-dts";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import json from "@rollup/plugin-json";

const require = createRequire(import.meta.url);
const { compilerOptions } = require("./tsconfig.json");

const packagesDir = path.resolve("./packages");
const packageDir = path.resolve(packagesDir, process.env.TARGET);

const inputPath = path.resolve(packageDir, `src/main.ts`);
const outputPath = path.resolve(packageDir, `dist`);

export default [
  {
    input: inputPath,
    output: [
      { file: outputPath + "/bundle.js", format: "cjs" },
      { file: outputPath + "/bundle.mjs", format: "es" },
    ],
    plugins: [
      del({ targets: outputPath + "/*" }),
      esbuild({ target: "node16.13", minify: true }),
      typescriptPaths({ preserveExtensions: true }),
      externals({
        include: ["reflect-metadata"],
      }),
      json(),
    ],
  },
  {
    input: inputPath,
    output: [{ file: outputPath + "/bundle.d.ts" }],
    plugins: [
      dts({ compilerOptions: { paths: compilerOptions.paths } }),
      externals(),
    ],
  },
];
