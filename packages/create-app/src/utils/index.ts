import axios from "axios";
import path from "path";
import HttpsProxyAgent from "https-proxy-agent";
import fs from "fs-extra";
import cliProgress from "cli-progress";
import chalk from "chalk";
import type { OctokitOptions } from "@octokit/core";
import { Octokit } from "@octokit/core";
import os from "node:os";
import { readGlobalConfig } from "./config";

let delayTry = 500;

export const isWindows = os.platform() === "win32";

export const cwd = process.cwd();

export const ompRepository = "openmultiplayer/open.mp";

export const httpsAgent = process.env.https_proxy
  ? HttpsProxyAgent(process.env.https_proxy)
  : null;

const request = axios.create({ httpsAgent });

let octokitInstance: null | Octokit = null;

async function getGithubToken() {
  if (process.env.gh_token) return process.env.gh_token;

  const global = await readGlobalConfig();
  if (global && global.gh_token) {
    return global.gh_token;
  }

  return null;
}
export async function getOctoKit() {
  if (octokitInstance) return octokitInstance;

  const auth = await getGithubToken();

  if (auth) {
    console.log(
      "github token found, will improve API rate limit to some extent",
    );
  } else {
    console.log("github token not found, API rate limit may be encountered");
  }

  const options: OctokitOptions = {
    request: {
      agent: httpsAgent,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  };
  if (auth) options.auth = auth;
  octokitInstance = new Octokit(options);
  return octokitInstance;
}

export async function downloadFile(url: string, filePath: string) {
  const bar = new cliProgress.SingleBar({
    format: "[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} Chunks",
  });

  if (fs.existsSync(filePath + ".tmp")) {
    await fs.remove(filePath + ".tmp");
  }

  let response;
  try {
    response = await request({
      url,
      method: "GET",
      headers: {
        "Accept-Encoding": "identity",
      },
      responseType: "stream",
      onDownloadProgress(progressEvent) {
        if (bar.getTotal()) {
          bar.update(progressEvent.loaded);
        }
      },
    });
  } catch (err: any) {
    if (err.status === 404) throw err;

    return new Promise<string>((resolve) => {
      delayTry = delayTry * 2;

      console.log(chalk.yellow.bold(err));
      console.log("\n");

      console.log(
        chalk.yellow.bold(
          `\ndownloadFile failed, try ${delayTry / 1000} seconds later again`,
        ),
      );
      console.log(
        chalk.yellow.bold(`press ctrl/command + c to stop the process`),
      );

      setTimeout(() => {
        downloadFile(url, filePath).then(resolve);
      }, delayTry);
    });
  }

  bar.start(response.headers["content-length"], 0);

  return new Promise<string>((resolve, reject) => {
    const ws = fs.createWriteStream(filePath + ".tmp");
    response.data.pipe(ws);

    ws.on("finish", async () => {
      delayTry = 500;

      bar.stop();
      await fs.rename(filePath + ".tmp", filePath);
      resolve(filePath);
    });

    ws.on("error", (err) => {
      reject(err);
    });
  });
}

export async function downloadGitRepo(
  owner: string,
  repo: string,
  filePath: string,
  branch = "main",
) {
  const repoFileUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`;
  console.log(`download repo: ${owner}/${repo}`);
  return await downloadFile(repoFileUrl, path.resolve(filePath, `${repo}.zip`));
}
