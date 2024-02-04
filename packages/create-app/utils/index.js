import fetch from "node-fetch";
import ora from "ora";
import path from "path";
import httpsProxyAgent from "https-proxy-agent";
import fs from "fs-extra";
import decompress from "decompress";

const fetchAgent = process.env.https_proxy
  ? new httpsProxyAgent(process.env.https_proxy)
  : null;

async function downloadFile(url, filePath) {
  const response = await fetch(url, { agent: fetchAgent });
  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));
  return filePath;
}

export async function downloadGitRepo(
  username,
  repo,
  filePath,
  branch = "main"
) {
  const repoFileUrl = `https://github.com/${username}/${repo}/archive/refs/heads/${branch}.zip`;
  return await wrapLoading(
    downloadFile,
    `download repo: ${username}/${repo}`,
    repoFileUrl,
    path.resolve(filePath, `${repo}.zip`)
  );
}

export async function downloadGitRelease(isLinux, username, repo, filePath) {
  let res = await fetch(
    `https://api.github.com/repos/${username}/${repo}/releases/latest`,

    { agent: fetchAgent }
  );
  res = res.json();

  res = await res;

  if (!res || !res.assets) throw "Failed to get release information";

  const assets = res.assets
    .filter((asset) => !["dynssl", "debug"].includes(asset.name))
    .map((asset) => {
      return {
        name: asset.name,
        browser_download_url: asset.browser_download_url,
      };
    });

  const downloadAssetByEnv = assets.find((asset) => {
    return asset.name.endsWith(isLinux ? "tar.gz" : "zip");
  });

  return await wrapLoading(
    downloadFile,
    `download release: ${username}/${repo}`,
    downloadAssetByEnv.browser_download_url,
    path.resolve(filePath, downloadAssetByEnv.name)
  );
}

export async function installPlugin(relativeGenPath, isLinux, pluginInfo) {
  const pluginExt = isLinux ? ".so" : ".dll";

  const bridge = await downloadGitRelease(
    isLinux,
    pluginInfo.author,
    pluginInfo.repo,
    relativeGenPath
  );

  await wrapLoading(
    decompress,
    `decompress ${bridge}`,
    bridge,
    relativeGenPath,
    {
      strip: 1,
      filter: (file) => [pluginExt].includes(path.extname(file.path)),
    }
  );

  fs.rename(
    relativeGenPath + `/${pluginInfo.fileName}${pluginExt}`,
    relativeGenPath +
      `/${pluginInfo.isComponent ? "components" : "plugins"}/${
        pluginInfo.fileName
      }${pluginExt}`
  );
  fs.remove(bridge);
}

export async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start();
  try {
    const result = await fn(...args);
    spinner.succeed();
    return result;
  } catch (err) {
    const finalErr =
      message +
      (err ? JSON.stringify(err) : "unknown error, please check the network");
    spinner.fail(finalErr);
    throw finalErr;
  }
}
