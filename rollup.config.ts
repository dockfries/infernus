import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";
import externals from "rollup-plugin-node-externals";
import dts from "rollup-plugin-dts";

import { compilerOptions } from "./tsconfig.json";

const inputPath = "./src/main.ts";
const outputPath = "./dist";
export default [
  {
    input: inputPath,
    output: { file: outputPath + "/bundle.js", format: "cjs" },
    plugins: [
      del({ targets: outputPath + "/*" }),
      typescript(),
      externals(),
      terser(),
    ],
  },
  {
    input: inputPath,
    output: [{ file: outputPath + "/bundle.d.ts", format: "cjs" }],
    plugins: [dts({ compilerOptions: { paths: compilerOptions.paths } })],
  },
];
