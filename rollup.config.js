import path from "node:path";
import { createRequire } from "node:module";
import esbuild from "rollup-plugin-esbuild";
import del from "rollup-plugin-delete";
import externals from "rollup-plugin-node-externals";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const packagesDir = path.resolve("./packages");
const packageDir = path.resolve(packagesDir, process.env.TARGET);

const inputPath = path.resolve(packageDir, `src/main.ts`);
const outputPath = path.resolve(packageDir, `dist`);

const externalPlugin = externals({
  packagePath: path.resolve(packageDir, "package.json"),
});

const require = createRequire(import.meta.url);
const { compilerOptions } = require("./tsconfig.json");

export default [
  // ts check
  {
    input: inputPath,
    output: { dir: outputPath },
    plugins: [
      externalPlugin,
      commonjs(),
      json(),
      nodeResolve(),
      typescript({
        noEmit: true,
        noEmitOnError: true,
        outDir: outputPath,
        include: [`${packageDir}/**/*`],
      }),
    ],
  },
  // esm/cjs
  {
    input: inputPath,
    output: [
      { file: path.resolve(outputPath + "/bundle.mjs"), format: "es" },
      { file: path.resolve(outputPath + "/bundle.js"), format: "cjs" },
    ],
    plugins: [
      del({ targets: path.resolve(outputPath + "/*") }),
      externalPlugin,
      commonjs(),
      json(),
      nodeResolve(),
      typescriptPaths({ preserveExtensions: true }),
      esbuild({ target: "node16.13", minify: true }),
    ],
  },
  // d.ts
  {
    input: inputPath,
    output: [{ file: path.resolve(outputPath + "/bundle.d.ts") }],
    plugins: [
      externalPlugin,
      dts({ compilerOptions: { paths: compilerOptions.paths } }),
    ],
  },
];
