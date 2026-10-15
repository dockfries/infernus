import path from "node:path";
import chalk from "chalk";
import fs from "fs-extra";
import { getRepoRelease } from "./api";
import { GLOBAL_DEPS_PATH } from "./config";
import { parseTag, isSameReleaseTag } from "./release";
import { validRange } from "./semver";

/** what the cache can answer for one requested version */
export interface CachePlan {
  /** the requested version is already unpacked and can be reused */
  cachedTag: string | null;
  /** a cached build that must be replaced before downloading again */
  dropTag: string | null;
  /** the cache could not answer, so a release has to be fetched */
  needsDownload: boolean;
}

interface PlanCacheOptions {
  /** tags already unpacked, or null when the dependency was never installed */
  cachedVersions: string[] | null;
  requested: string;
  previousVersion?: string;
  isUpdate?: boolean;
}

/** Does the cache already answer this request? */
export function planCache(options: PlanCacheOptions): CachePlan {
  const { cachedVersions, requested, previousVersion, isUpdate } = options;

  const miss: CachePlan = { cachedTag: null, dropTag: null, needsDownload: true };

  const parsed = parseTag(requested);
  if (!parsed || !cachedVersions) return miss;

  const exact = cachedVersions.find((cached) => isSameReleaseTag(cached, parsed.tag)) ?? null;
  if (!exact) return miss;

  // The release is already installed when the lockfile pins it, so an update is
  // the user asking for it again: download it afresh. Any other cached release
  // satisfies the pin and is reused.
  const alreadyInstalled = isSameReleaseTag(previousVersion, exact);
  return alreadyInstalled && isUpdate
    ? { cachedTag: null, dropTag: exact, needsDownload: true }
    : { cachedTag: exact, dropTag: null, needsDownload: false };
}

/** a pinned request asks for one exact build rather than a range */
export function isPinnedRequest(requested: string) {
  return parseTag(requested) !== null;
}

export interface DependencyPlan {
  /** `owner/repo` */
  name: string;
  /** the version spec as requested */
  requested: string;
  /** the version the lockfile held before this run */
  previousVersion?: string;
  /** the cached tag answering this request, when there is one */
  cachedTag: string | null;
  /** the release to download, when the cache cannot answer */
  matchedRelease: any | null;
  /** the tag this install settles on */
  finalVersion: string;
  /** the dependency's directory for that version */
  versionPath: string;
  /** install into components/ rather than plugins/ */
  component: boolean;
  /** the cache decision this came from */
  cache: CachePlan;
}

export interface PlanDependencyOptions {
  /** install into components/ rather than plugins/ */
  component?: boolean;
  /** the version the lockfile held for this dependency */
  previousVersion?: string;
  isUpdate?: boolean;
  verbose?: boolean;
}

/**
 * Decide what one dependency needs, reading the cache and, when it cannot
 * answer, the repository.
 *
 * A range is resolved against the repository even when a cached build satisfies
 * it, because a newer matching release may exist; the cache is then reused for
 * the files themselves.
 *
 * Nothing is deleted or written here.
 *
 * @throws {Error} when no release satisfies the requested version
 */
export async function planDependency(
  dep: string,
  options: PlanDependencyOptions = {},
): Promise<DependencyPlan> {
  const [name, requested = "*"] = dep.split("@");

  if (!validRange(requested)) throw new Error(`invalid deps version: ${name}`);

  const dependencyPath = path.resolve(GLOBAL_DEPS_PATH, name);
  const cache = planCache({
    cachedVersions: (await fs.pathExists(dependencyPath)) ? await fs.readdir(dependencyPath) : null,
    requested,
    previousVersion: options.previousVersion,
    isUpdate: options.isUpdate,
  });

  let cachedTag = cache.cachedTag;
  let matchedRelease: any | null = null;

  if (!cachedTag) {
    const [owner, repo] = name.split("/");
    matchedRelease = await getRepoRelease(owner, repo, requested, options.verbose);
    if (!matchedRelease) throw new Error(`not found satisfactory deps: ${dep}`);

    // the repository resolved to a build the cache already holds, so only the
    // project files need refreshing
    const cachedFolder = path.resolve(dependencyPath, matchedRelease.tag_name);
    if (cache.needsDownload && !isPinned(requested) && (await fs.pathExists(cachedFolder))) {
      cachedTag = matchedRelease.tag_name;
    }
  }

  const finalVersion: string = cachedTag ?? matchedRelease?.tag_name;

  return {
    name,
    requested,
    previousVersion: options.previousVersion,
    cachedTag,
    matchedRelease,
    finalVersion,
    versionPath: path.resolve(dependencyPath, finalVersion),
    component: !!options.component,
    cache,
  };
}

/** a request that names one release, which the cache can answer without asking */
function isPinned(requested: string) {
  return parseTag(requested) !== null;
}

/** Report one cache decision, for --verbose. */
export function describeCache(plan: DependencyPlan) {
  const dependencyPath = path.resolve(GLOBAL_DEPS_PATH, plan.name);

  if (plan.cachedTag) {
    console.log(chalk.gray(`  cache hit: ${plan.cachedTag} -> ${dependencyPath}`));
  } else if (plan.cache.dropTag) {
    console.log(chalk.gray(`  cache: dropping ${plan.cache.dropTag} and downloading it again`));
  } else {
    console.log(chalk.gray(`  cache: no cached version satisfies "${plan.requested}"`));
  }
}
