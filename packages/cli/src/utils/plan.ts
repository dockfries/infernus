import path from "node:path";
import chalk from "chalk";
import fs from "fs-extra";
import { getRepoRelease } from "./api";
import { GLOBAL_DEPS_PATH } from "./config";
import { parseTag, isSameReleaseTag, satisfiesSpec } from "./release";
import { validRange } from "./semver";

/**
 * How far a run is allowed to move a dependency.
 *
 * `install` is npm's `npm install`: the lockfile answers for every dependency it
 * still satisfies, and only what is missing or out of sync is resolved. `update`
 * is `npm update`: every range is resolved again and the lockfile follows.
 * `frozen` is `npm ci`: nothing is resolved, and a lockfile that no longer
 * matches the manifest is refused instead of repaired.
 */
export type ResolveMode = "install" | "update" | "frozen";

/** the shape a dependency name has to have: `owner/repo` */
const DEPENDENCY_NAME = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/;

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

export interface DependencyPlan {
  /** `owner/repo` */
  name: string;
  /** the version spec as requested */
  requested: string;
  /** the version the lockfile held before this run */
  previousVersion?: string;
  /** the lockfile answered this request instead of the repository */
  fromLock: boolean;
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
  /** how far this run may move the dependency; an install by default */
  mode?: ResolveMode;
  /**
   * The version the lockfile pins, when this dependency came from the manifest.
   *
   * A dependency named on the command line leaves this undefined: like
   * `npm install pkg@^2`, it is an explicit request to resolve, not an install
   * of what the project already recorded.
   */
  lockedVersion?: string;
  verbose?: boolean;
}

/**
 * Decide what one dependency needs, reading the cache and, when it cannot
 * answer, the repository.
 *
 * A range is resolved against the repository even when a cached build satisfies
 * it, because a newer matching release may exist — unless the lockfile pins a
 * release the manifest still accepts, which is npm's rule and the reason a
 * settled project installs offline.
 *
 * Nothing is deleted or written here.
 *
 * @throws {Error} when no release satisfies the requested version, or when a
 * frozen install finds a dependency the lockfile does not cover
 */
export async function planDependency(
  dep: string,
  options: PlanDependencyOptions = {},
): Promise<DependencyPlan> {
  const [name, requested = "*", ...extra] = dep.split("@");

  if (!DEPENDENCY_NAME.test(name)) {
    throw new Error(`invalid dependency name: ${JSON.stringify(name)}, expected owner/repo`);
  }
  if (extra.length) {
    throw new Error(`invalid dependency spec: ${JSON.stringify(dep)}, expected owner/repo@version`);
  }
  if (!validRange(requested)) throw new Error(`invalid deps version: ${name}`);

  const mode = options.mode ?? "install";
  const locked = options.lockedVersion ?? null;
  const lockedSatisfies = locked ? satisfiesSpec(locked, requested) : false;

  // `npm ci`: the lockfile is the install plan, so a manifest asking for
  // something the lock does not record is reported rather than quietly resolved
  if (mode === "frozen" && !lockedSatisfies) {
    throw new Error(
      `lockfile out of sync: ${name}@${requested} is locked to ${locked ?? "nothing"}; ` +
        `run \`infernus install\` to resolve it against the repository`,
    );
  }

  // The locked release is requested as the exact tag it is, which `planCache`
  // answers from the unpacked cache without a lookup: that is what makes a
  // settled install offline instead of one API call per range.
  const fromLock = mode !== "update" && lockedSatisfies;
  const wanted = fromLock ? locked! : requested;

  const dependencyPath = path.resolve(GLOBAL_DEPS_PATH, name);
  const cache = planCache({
    cachedVersions: (await fs.pathExists(dependencyPath)) ? await fs.readdir(dependencyPath) : null,
    requested: wanted,
    previousVersion: options.previousVersion,
    isUpdate: mode === "update",
  });

  let cachedTag = cache.cachedTag;
  let matchedRelease: any | null = null;

  if (!cachedTag) {
    const [owner, repo] = name.split("/");
    matchedRelease = await getRepoRelease(owner, repo, wanted, options.verbose);

    if (!matchedRelease) {
      throw new Error(
        fromLock
          ? `not found satisfactory deps: ${name}@${locked} (pinned by the lockfile); ` +
              `run \`infernus update ${name}@${requested}\` to move it`
          : `not found satisfactory deps: ${dep}`,
      );
    }

    // The repository resolved to a build the cache already holds, so only the
    // project files need refreshing rather than the archive being fetched and
    // unpacked again.
    //
    // This is the only reuse path a range has, since a range cannot name a
    // cached tag itself. `planCache` has already settled the cases where reuse
    // would be wrong: an exact pin is answered from the cache without reaching
    // here, and an update of the installed version reports a drop.
    const cachedFolder = path.resolve(dependencyPath, matchedRelease.tag_name);

    if (cache.needsDownload && (await fs.pathExists(cachedFolder))) {
      cachedTag = matchedRelease.tag_name;
    }
  }

  const finalVersion: string = cachedTag ?? matchedRelease?.tag_name;

  return {
    name,
    requested,
    previousVersion: options.previousVersion,
    fromLock,
    cachedTag,
    matchedRelease,
    finalVersion,
    versionPath: path.resolve(dependencyPath, finalVersion),
    component: !!options.component,
    cache,
  };
}

/** Report one cache decision, for --verbose. */
export function describeCache(plan: DependencyPlan) {
  const dependencyPath = path.resolve(GLOBAL_DEPS_PATH, plan.name);

  if (plan.fromLock) {
    console.log(
      chalk.gray(
        `  lockfile: ${plan.finalVersion} satisfies "${plan.requested}", the repository is not asked`,
      ),
    );
  }

  if (plan.cachedTag) {
    console.log(chalk.gray(`  cache hit: ${plan.cachedTag} -> ${dependencyPath}`));
  } else if (plan.cache.dropTag) {
    console.log(chalk.gray(`  cache: dropping ${plan.cache.dropTag} and downloading it again`));
  } else {
    console.log(chalk.gray(`  cache: no cached version satisfies "${plan.requested}"`));
  }
}
