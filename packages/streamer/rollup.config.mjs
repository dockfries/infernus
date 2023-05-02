import esbuild from "rollup-plugin-esbuild";
import del from "rollup-plugin-delete";
import externals from "rollup-plugin-node-externals";
import dts from "rollup-plugin-dts";
import { typescriptPaths } from "rollup-plugin-typescript-paths";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { compilerOptions } = require("./tsconfig.json");

const inputPath = "./src/main.ts";
const outputPath = "./dist";
export default [
  {
    input: inputPath,
    output: [
      { file: outputPath + "/bundle.js", format: "cjs" },
      { file: outputPath + "/bundle.mjs", format: "es" },
    ],
    plugins: [
      del({ targets: outputPath + "/*" }),
      typescriptPaths({ preserveExtensions: true }),
      esbuild({ minify: true }),
      externals(),
    ],
  },
  {
    input: inputPath,
    output: [{ file: outputPath + "/bundle.d.ts" }],
    plugins: [dts({ compilerOptions: { paths: compilerOptions.paths } })],
  },
];
