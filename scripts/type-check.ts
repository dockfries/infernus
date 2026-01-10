import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export function typeCheck(packageName?: string) {
  const start = Date.now();

  console.log(
    packageName
      ? `Type-checking ${packageName}...`
      : "Type-checking all packages...",
  );

  const sharedDepPkgs = [
    "colandreas",
    "drift-detection",
    "filterscript",
    "nex-ac",
    "weapon-config",
  ];

  const configFile = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "tsconfig.json"), "utf8"),
  );

  if (packageName) {
    const includePkgs = new Set([`packages/${packageName}/src/**/*.ts`]);

    if (packageName === "core") {
      includePkgs.add("packages/streamer/src/**/*.ts");
    }

    if (sharedDepPkgs.includes(packageName)) {
      includePkgs.add("packages/shared/src/**/*.ts");
    }

    configFile.include = Array.from(includePkgs);
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile,
    ts.sys,
    process.cwd(),
  );

  const program = ts.createProgram(
    parsedConfig.fileNames,
    parsedConfig.options,
  );

  const diagnostics = ts.getPreEmitDiagnostics(program);

  const end = Date.now();
  const totalSec = ((end - start) / 1000).toFixed(2) + "s";

  if (diagnostics.length > 0) {
    diagnostics.slice(0, 10).forEach((diagnostic) => {
      if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(
          diagnostic.file,
          diagnostic.start!,
        );
        const message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          "\n",
        );
        console.log(
          `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`,
        );
      } else {
        console.log(
          ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
        );
      }
    });

    throw new Error(`Type-check failed in ${totalSec}`);
  }

  console.log(`Type-check Finished in ${totalSec}`);
}
