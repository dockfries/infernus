import fs from "node:fs";
import path from "node:path";
import { pkgDir, rootPkgJsonPath } from "./share.js";

function syncCoreVersionToRoot() {
  const bumpedVersion = JSON.parse(
    fs.readFileSync(path.resolve(pkgDir, "core", "package.json"), "utf-8"),
  ).version;

  const rootPkgJson = JSON.parse(fs.readFileSync(rootPkgJsonPath, "utf-8"));

  rootPkgJson.version = bumpedVersion;
  fs.writeFileSync(
    rootPkgJsonPath,
    JSON.stringify(rootPkgJson, null, 2),
    "utf-8",
  );
}

syncCoreVersionToRoot();
