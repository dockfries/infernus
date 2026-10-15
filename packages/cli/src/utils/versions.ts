import chalk from "chalk";
import semver from "semver";
import { listRepoReleases } from "./api";
import { readLocalConfig, readLockFile, INF_CONFIG_NAME } from "./config";
import { ompRepository } from "../constants";
import type { ListVersionsOptions, LocalConfig, LockFileContent } from "../types";
import { isRangeSpec, parseTag, type ParsedTag } from "./release";
import { validRange } from "./semver";

/** one dependency whose releases could not be read, reported instead of thrown */
interface UnavailableDependency {
  name: string;
  reason: string;
}

/** one dependency, its declared spec and the releases the repository offers */
interface VersionReport {
  name: string;
  spec: string;
  installed: string | null;
  /** every release tag, newest first, in the order GitHub returns them */
  tags: string[];
  /** the tags whose version satisfies what the manifest declares */
  compatible: Set<string>;
  /** the tags that carry no readable version at all */
  unreadable: Set<string>;
}

async function collect(
  name: string,
  spec: string,
  installed: string | null,
  verbose = false,
): Promise<VersionReport> {
  const parts = name.split("@")[0].split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(`invalid dependency name: ${name}, expected owner/repo`);
  }
  const [owner, repo] = parts;

  const releases = await listRepoReleases(owner, repo, verbose);
  const parsed = releases
    .map((release) => ({ tag: String(release.tag_name), version: parseTag(release.tag_name) }))
    .filter((entry) => entry.version !== null);

  const acceptable = isRangeSpec(spec)
    ? (entry: ParsedTag) => semver.satisfies(entry.version, spec)
    : (entry: ParsedTag) => entry.tag === spec;

  return {
    name,
    spec,
    installed,
    tags: releases.map((release) => String(release.tag_name)),
    compatible: new Set(parsed.filter((entry) => acceptable(entry.version!)).map((e) => e.tag)),
    unreadable: new Set(
      releases.map((release) => String(release.tag_name)).filter((tag) => parseTag(tag) === null),
    ),
  };
}

/**
 * List the releases a dependency can be installed from.
 *
 * The read only companion of `add` and `update`: it answers "which versions
 * exist, which of them does this manifest accept, and which one is installed"
 * without downloading or writing anything.
 *
 * With `--json` every informational line — the token reminder, the per-page
 * logs, the rate limit notices — goes to stderr, so stdout carries the document
 * alone and can be piped into something. Failures still throw; the command turns
 * them into a document.
 */
export async function listVersions(args: ListVersionsOptions) {
  const config: LocalConfig | null = await readLocalConfig();
  const configured = config?.dependencies ?? {};
  const lockFile: LockFileContent | null = await readLockFile();

  const names = args.dependencies?.length ? args.dependencies : Object.keys(configured);
  if (!names.length) {
    throw new Error(
      `no dependencies to inspect: pass one like \`infernus versions ${ompRepository}\` or add some to ${INF_CONFIG_NAME}`,
    );
  }

  // `console.log` is the only channel the helpers below use, so sending it to
  // stderr for the duration keeps the document on stdout without threading a
  // quiet flag through every call.
  const stdoutLog = console.log;
  if (args.json)
    console.log = ((...parts: unknown[]) => console.error(...parts)) as typeof console.log;

  try {
    const reports: VersionReport[] = [];
    const unavailable: UnavailableDependency[] = [];

    for (const name of names) {
      const spec = configured[name] ?? "*";
      if (!validRange(spec)) {
        throw new Error(`invalid deps version in ${INF_CONFIG_NAME}: ${name}@${spec}`);
      }

      try {
        reports.push(
          await collect(name, spec, lockFile?.dependencies?.[name]?.version ?? null, args.verbose),
        );
      } catch (error: any) {
        // one unreachable repository must not hide the versions of the others
        unavailable.push({ name, reason: error?.message ?? String(error) });
      }
    }

    if (!reports.length && unavailable.length) {
      throw new Error(unavailable.map((item) => `${item.name}: ${item.reason}`).join("\n"));
    }

    return await report(reports, unavailable, args);
  } finally {
    console.log = stdoutLog;
  }
}

async function report(
  reports: VersionReport[],
  unavailable: UnavailableDependency[],
  args: ListVersionsOptions,
) {
  const limit = args.all ? Infinity : (args.limit ?? 10);

  if (args.json) {
    // written straight to stdout: `console.log` is redirected to stderr here so
    // the informational lines cannot mix into the document
    process.stdout.write(
      `${JSON.stringify(
        {
          dependencies: reports.map((report) => ({
            name: report.name,
            spec: report.spec,
            installed: report.installed,
            versions: report.tags.slice(0, limit),
            compatible: [...report.compatible].slice(0, limit),
          })),
          unavailable,
        },
        null,
        2,
      )}\n`,
    );
    return reports;
  }

  for (const report of reports) {
    console.log(chalk.bold(`\n${report.name}`));
    console.log(
      chalk.gray(`  manifest: ${report.spec}   installed: ${report.installed ?? "not installed"}`),
    );

    if (!report.tags.length) {
      console.log(chalk.yellow("  no release tag could be read for this repository"));
      continue;
    }

    const shown = report.tags.slice(0, limit);
    for (const tag of shown) {
      const flags = [];
      if (report.unreadable.has(tag)) flags.push(chalk.gray("unreadable tag"));
      else if (report.compatible.has(tag)) flags.push(chalk.green("satisfies the manifest"));
      if (tag === report.installed) flags.push(chalk.cyan("installed"));

      console.log(`  ${tag}${flags.length ? `  ${flags.join(", ")}` : ""}`);
    }

    const hidden = report.tags.length - shown.length;
    if (hidden > 0) {
      console.log(chalk.gray(`  ... and ${hidden} older, pass --all to see them`));
    }

    if (!report.compatible.size) {
      console.log(
        chalk.yellow(
          `  no release satisfies "${report.spec}"; run \`infernus update ${report.name}@*\` to jump to the newest`,
        ),
      );
    }
  }

  for (const item of unavailable) {
    console.log(chalk.red(`\n${item.name}\n  could not be read: ${item.reason}`));
  }

  return reports;
}
