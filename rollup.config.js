import path from "node:path";
import { createRequire } from "node:module";
import esbuild from "rollup-plugin-esbuild";
import del from "rollup-plugin-delete";
import externals from "rollup-plugin-node-externals";
import dts from "rollup-plugin-dts";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const require = createRequire(import.meta.url);
const { compilerOptions } = require("./tsconfig.json");

const packagesDir = path.resolve("./packages");
const packageDir = path.resolve(packagesDir, process.env.TARGET);

const inputPath = path.resolve(packageDir, `src/main.ts`);
const outputPath = path.resolve(packageDir, `dist`);

const externalPlugin = externals({
  packagePath: path.resolve(packageDir, "package.json"),
});

export default [
  {
    input: inputPath,
    output: [
      { file: outputPath + "/bundle.mjs", format: "es" },
      { file: outputPath + "/bundle.js", format: "cjs" },
    ],
    plugins: [
      externalPlugin,
      commonjs(),
      json(),
      nodeResolve(),
      typescriptPaths({ preserveExtensions: true }),
      del({ targets: outputPath + "/*" }),
      esbuild({ target: "node16.13", minify: true }),
    ],
  },
  {
    input: inputPath,
    output: [{ file: outputPath + "/bundle.d.ts" }],
    plugins: [
      externalPlugin,
      dts({ compilerOptions: { paths: compilerOptions.paths } }),
    ],
  },
];
