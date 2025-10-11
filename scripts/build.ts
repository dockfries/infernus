import { select } from "@inquirer/prompts";
import { pkgNames, build } from "./share";

async function selectBuild() {
  const pkg = await select<string>({
    message: "Which package do you want to build?",
    choices: pkgNames,
  });
  build(pkg);
}

selectBuild();
