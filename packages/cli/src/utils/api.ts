import path from "node:path";
import axios, { type AxiosResponse } from "axios";
import fs from "fs-extra";
import cliProgress from "cli-progress";
import chalk from "chalk";
import type { OctokitOptions } from "@octokit/core";
import { Octokit } from "@octokit/core";
import { readGlobalConfig } from "./config";
import { proxyAgent } from "../constants";
import { matchByRange, parseTag } from "./release";

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
/**
 * An endpoint override for the GitHub API.
 *
 * The resolution rules deserve tests against known releases, and the public API
 * only grants 60 requests an hour without a token, so the suite points this at a
 * local server that serves fixtures.
 */
function getApiBaseUrl() {
  const override = process.env.INFERNUS_GITHUB_API;
  return override ? override.replace(/\/$/, "") : "https://api.github.com";
}

async function getOctokit() {
  if (octokitInstance) return octokitInstance;

  const auth = await getGithubToken();

  if (!auth && !process.env.INFERNUS_GITHUB_API) {
    console.log(
      "github_token(optional, usually not needed): API rate limits may apply without it.",
    );
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

export async function downloadFile(url: string, filePath: string, retryCount = 0) {
  const bar = new cliProgress.SingleBar({
    format: "[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} Chunks",
  });

  if (fs.existsSync(filePath + ".tmp")) {
    await fs.remove(filePath + ".tmp");
  }

  let response: AxiosResponse;
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
      throw new Error(`Download failed after ${MAX_RETRY_ATTEMPTS} attempts: ${err.message}`, {
        cause: err,
      });
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
      console.log(chalk.yellow.bold(`press ctrl/command + c to stop the process`));

      setTimeout(() => {
        downloadFile(url, filePath, retryCount + 1).then(resolve);
      }, delayTry);
    });
  }

  const contentLen = (response.headers["content-length"] as number) || 0;
  bar.start(contentLen, 0);

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

/**
 * One GET against a GitHub REST route.
 *
 * With an endpoint override in place the request goes out over plain HTTP, so a
 * local fixture server can answer it; the real API keeps using Octokit, which
 * brings authentication, retries, pagination headers and the proxy agent.
 */
export async function githubGet<T = any>(
  route: string,
  options: Record<string, any> = {},
): Promise<{ data: T; headers: Record<string, any> }> {
  if (!process.env.INFERNUS_GITHUB_API) {
    const response = await (await getOctokit()).request(route, options);
    return { data: response.data as T, headers: response.headers as Record<string, any> };
  }

  const [method, routePath] = route.split(" ");
  if (method !== "GET") throw new Error(`the test endpoint only supports GET, got ${method}`);

  const search = new URLSearchParams(
    Object.entries(options)
      .filter(([key]) => !["owner", "repo"].includes(key))
      .map(([key, value]) => [key, String(value)]),
  ).toString();

  const path = routePath
    .replace("{owner}", String(options.owner ?? ""))
    .replace("{repo}", String(options.repo ?? ""))
    .replace("{path}", String(options.path ?? ""));
  const url = `${getApiBaseUrl()}${path}${search ? `?${search}` : ""}`;

  const response = await axios.get(url, {
    httpsAgent: proxyAgent,
    headers: {
      Accept: "application/vnd.github+json",
      ...(process.env.gh_token ? { Authorization: `Bearer ${process.env.gh_token}` } : {}),
    },
    validateStatus: () => true,
  });

  if (response.status >= 400) {
    const err = new Error(
      response.status === 404 ? "Not Found" : `GitHub answered ${response.status}`,
    ) as Error & { status?: number; request?: any; response?: any };
    err.name = "HttpError";
    err.status = response.status;
    err.request = { method: "GET", url };
    err.response = { headers: response.headers };
    throw err;
  }

  return { data: response.data as T, headers: response.headers as Record<string, any> };
}

interface RateLimitInfo {
  limit?: string;
  remaining?: string;
  reset?: string;
}

function pickRateLimit(headers: Record<string, any> = {}): RateLimitInfo {
  return {
    limit: headers["x-ratelimit-limit"],
    remaining: headers["x-ratelimit-remaining"],
    reset: headers["x-ratelimit-reset"],
  };
}

function describeApiError(err: any) {
  const status = err?.status ? `HTTP ${err.status}` : "no HTTP status";
  const request = err?.request
    ? `${(err.request.method || "").toUpperCase()} ${err.request.url || ""}`.trim()
    : "unknown request";
  const rateLimit = err?.response?.headers
    ? formatRateLimit(pickRateLimit(err.response.headers))
    : "";
  return [
    `${err?.name || "Error"}: ${status} - ${err?.message || String(err)}`,
    `     request: ${request}`,
    `     hint:    ${explainGithubError(err?.status)}${rateLimit}`,
  ].join("\n");
}

function explainGithubError(status?: number): string {
  switch (status) {
    case 401:
      return "bad credentials, check the gh_token in `infernus config` or the gh_token env";
    case 403:
      return "forbidden, usually API rate limit (a gh_token raises it) or blocked by a proxy";
    case 404:
      return "not found by GitHub: wrong owner/repo, or the release tag/ref does not exist";
    case 429:
      return "too many requests, wait for the rate limit window to reset";
    default:
      return "network or proxy problem, not a GitHub answer";
  }
}

function formatRateLimit(info: RateLimitInfo) {
  if (!info.limit && !info.remaining) return "";
  const reset = info.reset
    ? ` reset(in ${Math.max(0, Math.round(Number(info.reset) - Date.now() / 1000))}s)`
    : "";
  return ` | rate limit: ${info.remaining ?? "?"}/${info.limit ?? "?"}${reset}`;
}

function logRateLimit(info: RateLimitInfo) {
  if (!info.limit && !info.remaining) return;
  console.log(
    chalk.gray(
      `  api rate limit: ${info.remaining ?? "?"}/${info.limit ?? "?"}${formatRateLimit(info)}`,
    ),
  );
  if (info.remaining === "0") {
    console.log(
      chalk.yellow(
        `  warn: the github api rate limit is exhausted, set a token by gh_token env or \`infernus config gh_token <token>\` to raise it`,
      ),
    );
  }
}

function createNotFoundError(owner: string, repo: string, ref: string, cause: any) {
  const detail = explainGithubError(cause?.status);
  const err = new Error(`release lookup failed: ${owner}/${repo} "${ref}": ${detail}`, {
    cause,
  }) as Error & { status?: number; response?: any };
  err.name = "ReleaseNotFoundError";
  err.status = cause?.status;
  err.response = cause?.response;
  return err;
}

/** the newest releases first, the order GitHub returns them in */
export async function listRepoReleases(owner: string, repo: string, verbose = false) {
  const releases: any[] = [];
  const perPage = 100;
  let page = 1;

  while (true) {
    let payload: any[];
    let headers: Record<string, any>;

    try {
      const response = await githubGet<any[]>("GET /repos/{owner}/{repo}/releases", {
        owner,
        repo,
        per_page: perPage,
        page,
      });
      payload = parsePaginatedData(response.data);
      headers = response.headers;
    } catch (err: any) {
      console.error(chalk.red(`  request failed:\n     ${describeApiError(err)}`));
      throw createNotFoundError(owner, repo, "*", err);
    }

    if (!Array.isArray(payload) || !payload.length) break;

    releases.push(...payload);

    if (verbose) {
      const tags = payload.map((release) => release.tag_name);
      console.log(
        chalk.gray(
          `  GET /repos/${owner}/${repo}/releases?page=${page} -> ${payload.length} releases: ${tags
            .slice(0, 8)
            .join(", ")}${tags.length > 8 ? ", ..." : ""}`,
        ),
      );
      logRateLimit(pickRateLimit(headers));
    }

    if (payload.length < perPage) break;
    page += 1;

    // the suite serves small fixture pages; the real API never reaches this
    if (page > 50) break;
  }

  return releases;
}

/**
 * Pick the release a dependency spec asks for, without touching the network.
 *
 * Kept free of IO so the resolution rules can be tested against fixtures; the
 * caller supplies the releases.
 */
export function resolveRelease(
  spec: string,
  releases: any[],
  options: { verbose?: boolean; label?: string } = {},
) {
  const label = options.label ?? "release";
  const log = (message: string) => {
    if (options.verbose) console.log(chalk.gray(`  ${message}`));
  };

  const parsedTags = releases
    .map((release) => ({ release, parsed: parseTag(release.tag_name) }))
    .filter((entry) => entry.parsed !== null);

  const exactTag = parseTag(spec);
  if (exactTag) {
    const exact = parsedTags.find((entry) => entry.parsed!.tag === exactTag.tag);
    if (exact) {
      log(`exact tag "${exactTag.tag}" -> ${exact.release.tag_name}`);
      return exact.release;
    }

    log(`no release tagged "${exactTag.tag}"`);

    if (exactTag.build === null) {
      // A repository may tag its releases with a build suffix, so `1.6.7` can
      // still be answered by `v1.6.7.3218`.
      const fallback = matchByRange(
        parsedTags.map((entry) => entry.parsed!),
        exactTag.version.version,
      );
      if (fallback) {
        console.log(
          chalk.yellow(
            `  warn: ${label} has no release tagged "${exactTag.tag}", using ${fallback.tag}, the closest match`,
          ),
        );
        return parsedTags.find((entry) => entry.parsed!.tag === fallback.tag)!.release;
      }
    }

    return null;
  }

  const matched = matchByRange(
    parsedTags.map((entry) => entry.parsed!),
    spec,
  );

  if (!matched) {
    log(`no release satisfies "${spec}"`);
    return null;
  }

  log(`"${spec}" -> ${matched.tag}`);
  return parsedTags.find((entry) => entry.parsed!.tag === matched.tag)!.release;
}

/**
 * Resolve a dependency spec to a GitHub release.
 *
 * `fetcher` exists so tests can drive the resolution from fixtures.
 */
export async function getRepoRelease(
  owner: string,
  repo: string,
  version: string,
  verbose = false,
  fetcher: (owner: string, repo: string, verbose: boolean) => Promise<any[]> = listRepoReleases,
) {
  const releases = await fetcher(owner, repo, verbose);
  const release = resolveRelease(version, releases, {
    verbose,
    label: `${owner}/${repo}`,
  });

  if (release && verbose) {
    const parsed = parseTag(release.tag_name);
    if (parsed?.build !== null && parsed?.build !== undefined) {
      console.log(
        chalk.gray(`  tip: pin it as ${owner}/${repo}@${release.tag_name} to skip the lookup`),
      );
    }
  }

  return release;
}
