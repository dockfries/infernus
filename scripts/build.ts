import { select } from "@inquirer/prompts";
import { pkgNames, build } from "./share";

async function selectBuild() {
  const pkgName = process.argv[2];
  if (pkgName) {
    build(pkgName);
    return;
  }
  const pkg = await select<string>({
    message: "Which package do you want to build?",
    choices: pkgNames,
  });
  build(pkg);
}

selectBuild();
