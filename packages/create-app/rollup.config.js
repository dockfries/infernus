import esbuild from "rollup-plugin-esbuild";
import del from "rollup-plugin-delete";
import externals from "rollup-plugin-node-externals";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import json from "@rollup/plugin-json";

const inputPath = "./src/main.ts";
const outputPath = "./dist";

export default [
  {
    input: inputPath,
    output: { file: outputPath + "/bundle.js" },
    plugins: [
      del({ targets: outputPath + "/*" }),
      esbuild({ target: "node16.13", minify: true }),
      typescriptPaths({ preserveExtensions: true }),
      externals(),
      json(),
    ],
  },
];
