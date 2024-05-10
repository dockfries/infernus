import esbuild from "rollup-plugin-esbuild";
import del from "rollup-plugin-delete";
import externals from "rollup-plugin-node-externals";

const inputPath = "./index.js";
const outputPath = "./dist";
export default [
  {
    input: inputPath,
    output: { file: outputPath + "/index.js", format: "esm" },
    plugins: [
      del({ targets: outputPath + "/*" }),
      esbuild({ minify: true }),
      externals(),
    ],
  },
];
