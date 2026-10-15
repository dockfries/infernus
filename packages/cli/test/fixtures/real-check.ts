import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runCli } from "./sandbox";

/** the user's original failing command, against the real GitHub API */
const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), "infernus-real-"));
fs.writeFileSync(
  path.resolve(projectDir, "infernus.json"),
  `${JSON.stringify({ dependencies: { "openmultiplayer/open.mp": "^1.5.8" } }, null, 2)}\n`,
);

const entry = path.resolve(import.meta.dirname, "..", "..", "dist", "bundle.js");

try {
  const versions = await runCli(projectDir, ["versions", "openmultiplayer/open.mp"], entry);
  console.log("=== infernus versions (real API) ===\n" + versions.output.trim());

  const dry = await runCli(
    projectDir,
    ["update", "openmultiplayer/open.mp@1.6.7", "--dry-run", "--verbose"],
    entry,
  );
  console.log("\n=== update @1.6.7 --dry-run (real API) ===\n" + dry.output.trim());
  console.log(
    `\nlockfile untouched: ${fs.readFileSync(path.resolve(projectDir, "infernus.json"), "utf8").includes("^1.5.8")}`,
  );
} finally {
  fs.rmSync(projectDir, { recursive: true, force: true });
}
