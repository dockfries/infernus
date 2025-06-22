import path from "node:path";
import { select } from "@inquirer/prompts";
import decompress from "decompress";
import fs from "fs-extra";
import fg from "fast-glob";
import { downloadFile } from "./api";
import { GLOBAL_DEPS_PATH } from "./config";
import { ompRepository, isWindows } from "../constants";

export async function addOpenMp(versionOrRelease: any, isRemote: boolean) {
  let globalOmpPath: string;

  if (isRemote) {
    const release = versionOrRelease;
    const version = release.tag_name;
    globalOmpPath = path.resolve(GLOBAL_DEPS_PATH, ompRepository, version);

    await fs.ensureDir(globalOmpPath);

    const assetsByEnv = release.assets.filter((asset: any) => {
      return asset.name.endsWith(isWindows ? "zip" : "tar.gz");
    });

    const choices = assetsByEnv.map((asset: any, idx: number) => {
      return {
        name: asset.name,
        short: asset.version || "default",
        value: idx,
      };
    });

    const selectedAssetIdx =
      assetsByEnv.length > 1
        ? ((await select({
            message: "Please select one open.mp asset",
            choices,
            default: 0,
          })) as number)
        : 0;

    const assetByEnv = assetsByEnv[selectedAssetIdx];

    const downloadOmpPath = globalOmpPath + "." + path.extname(assetByEnv.name);

    console.log(`download dep: ${ompRepository} ${version}`);
    const ompTmpPath = await downloadFile(
      assetByEnv.browser_download_url,
      downloadOmpPath,
    );
    await decompress(ompTmpPath, globalOmpPath, { strip: 1 });
    await fs.remove(ompTmpPath);
  } else {
    const version = versionOrRelease;
    globalOmpPath = path.resolve(GLOBAL_DEPS_PATH, ompRepository, version);
  }
  await fs.copy(globalOmpPath, process.cwd(), { overwrite: false });
}

export async function removeOpenMp(globalPath: string) {
  if (!globalPath.includes(GLOBAL_DEPS_PATH)) {
    throw new Error(
      "Due to security policy, your path may be redirected to a non-cached path!",
    );
  }
  const files = await fg("**", {
    cwd: globalPath,
    ignore: ["config.json", "bans.json", "gamemodes/**"],
  });
  return Promise.all(
    files.map((file) => {
      return fs.remove(path.resolve(process.cwd(), file));
    }),
  );
}
