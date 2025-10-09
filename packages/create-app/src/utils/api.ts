import path from "node:path";
import axios from "axios";
import fs from "fs-extra";
import cliProgress from "cli-progress";
import chalk from "chalk";
import type { OctokitOptions } from "@octokit/core";
import { Octokit } from "@octokit/core";
import { readGlobalConfig } from "./config";
import { proxyAgent } from "../constants";
import { minSatisfying } from "./semver";

let delayTry = 500;
const MAX_RETRY_ATTEMPTS = 5;

const request = axios.create({ httpsAgent: proxyAgent });

let octokitInstance: null | Octokit = null;

async function getGithubToken() {
  if (process.env.gh_token) return process.env.gh_token;

  const global = await readGlobalConfig();
  if (global && global.gh_token) {
    return global.gh_token;
  }

  return null;
}
export async function getOctokit() {
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
      agent: proxyAgent,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  };
  if (auth) options.auth = auth;
  octokitInstance = new Octokit(options);
  return octokitInstance;
}

export async function downloadFile(
  url: string,
  filePath: string,
  retryCount = 0,
) {
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

    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      throw new Error(
        `Download failed after ${MAX_RETRY_ATTEMPTS} attempts: ${err.message}`,
      );
    }

    return new Promise<string>((resolve) => {
      delayTry = delayTry * 2;

      console.log(chalk.yellow.bold(err));
      console.log("\n");

      console.log(
        chalk.yellow.bold(
          `\ndownloadFile failed, try ${delayTry / 1000} seconds later again (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`,
        ),
      );
      console.log(
        chalk.yellow.bold(`press ctrl/command + c to stop the process`),
      );

      setTimeout(() => {
        downloadFile(url, filePath, retryCount + 1).then(resolve);
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
  console.log(`download repo: ${owner}/${repo}/${branch}`);
  return await downloadFile(repoFileUrl, path.resolve(filePath, `${repo}.zip`));
}

function parsePaginatedData(data: any) {
  if (Array.isArray(data)) return data;
  if (!data) return [];
  delete data.incomplete_results;
  delete data.repository_selection;
  delete data.total_count;
  const namespaceKey = Object.keys(data)[0];
  data = data[namespaceKey];
  return data;
}

export async function getPaginatedData(url: string) {
  const octokit = await getOctokit();
  const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
  const response = await octokit.request(`GET ${url}`, {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  response.data = parsePaginatedData(response.data);
  const linkHeader = response.headers.link;
  let hasNext = false;
  if (linkHeader) {
    hasNext = linkHeader.includes(`rel="next"`);
    if (hasNext) url = linkHeader.match(nextPattern)![0];
  }
  return { response, url, hasNext };
}

export function getTimeDiff(start: number, end: number) {
  const timeDiff = end - start;
  const seconds = (timeDiff / 1000).toFixed(1);
  return seconds;
}

export async function getRepoRelease(
  owner: string,
  repo: string,
  version: string,
) {
  const octokit = await getOctokit();

  let matchedRelease = null;

  const getReleaseRoute = "GET /repos/{owner}/{repo}/releases/tags/{tag}";
  const isFixedVersion = /^\d+\.\d+\.\d+(-[a-z]?)?$/.test(version);
  const isStartsWithV = version.startsWith("v");

  if (isFixedVersion) {
    try {
      matchedRelease = (
        await octokit.request(getReleaseRoute, {
          owner,
          repo,
          tag: isStartsWithV ? version : `v${version}`,
        })
      ).data;
    } catch (err: any) {
      if (err.status === 404 && !isStartsWithV) {
        matchedRelease = (
          await octokit.request(getReleaseRoute, {
            owner,
            repo,
            tag: version,
          })
        ).data;
      }
    }
  } else {
    let hasNext = true;

    let releaseUrl = `/repos/${owner}/${repo}/releases`;

    while (!matchedRelease && hasNext) {
      const rawResponse = await getPaginatedData(releaseUrl);
      const releases = rawResponse.response.data;

      releaseUrl = rawResponse.url;
      hasNext = rawResponse.hasNext;

      const versions = releases.map((release: any) => release.tag_name);

      if (!versions.length) {
        hasNext = false;
        break;
      }

      if (!version || version === "*") {
        matchedRelease = releases[0];
        break;
      } else {
        const matchedVersion = minSatisfying(versions, version);
        if (matchedVersion) {
          const idx = versions.indexOf(matchedVersion);
          matchedRelease = releases[idx];
        }
      }
    }
  }

  return matchedRelease;
}
