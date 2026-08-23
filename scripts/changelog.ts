import fs from "node:fs";
import path from "node:path";
import { execa } from "execa";

const changelogPath = path.resolve(process.cwd(), "CHANGELOG.md");

const mode = process.argv[2] ?? "release";

const unreleasedHeader = /^## \[?Unreleased\]?[^\n]*$/;

function stripUnreleased(content: string): string {
  const lines = content.split("\n");
  const start = lines.findIndex((line) => unreleasedHeader.test(line));

  if (start === -1) {
    return content;
  }

  let end = lines.findIndex((line, i) => i > start && /^## /.test(line));
  if (end === -1) {
    end = lines.length;
  }

  return [...lines.slice(0, start), ...lines.slice(end)]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+/, "");
}

async function run() {
  const exists = fs.existsSync(changelogPath);
  const content = exists ? fs.readFileSync(changelogPath, "utf8") : "";
  const cleaned = stripUnreleased(content);

  if (cleaned !== content) {
    fs.writeFileSync(changelogPath, cleaned);
  }

  const args = ["-p", "conventionalcommits", "-i", "CHANGELOG.md", "-s"];

  if (mode === "unreleased") {
    args.push("--output-unreleased");
  }

  await execa("conventional-changelog", args, {
    cwd: process.cwd(),
    preferLocal: true,
    stdio: "inherit",
    killDescendants: true,
  });
}

run();
