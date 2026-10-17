/**
 * Exercise the built CLI end to end against a local GitHub stand in.
 *
 * Run it from the repository root after building the cli package:
 *   npx tsx packages/cli/test/fixtures/playground.ts
 */
import { createSandbox, NEW_TAG, OLD_TAG, OTHER_TAG, runCli, startReleaseServer } from "./sandbox";

async function main() {
  const server = await startReleaseServer();
  const sandbox = createSandbox({
    cachedTags: [OLD_TAG, OTHER_TAG],
    installedTag: OLD_TAG,
    // files this project owns, which an upgrade must never replace
    projectOverrides: { "gamemodes/my.pwn": "my gamemode" },
  });

  const env = { INFERNUS_GITHUB_API: server.baseUrl };
  let failures = 0;

  const step = async (title: string, args: string[]) => {
    console.log(`\n### ${title}\n$ infernus ${args.join(" ")}`);
    const result = await runCli(sandbox.projectDir, args, sandbox.entry, env);
    console.log(result.output.trim());
    console.log(`(exit ${result.code})`);
    return result;
  };

  const check = (label: string, actual: unknown, expected: unknown) => {
    const ok = actual === expected;
    if (!ok) failures += 1;
    console.log(
      `${ok ? "OK  " : "FAIL"} ${label}: ${JSON.stringify(actual)}${ok ? "" : ` (expected ${JSON.stringify(expected)})`}`,
    );
  };

  const lockedTag = () =>
    sandbox.readJson("infernus-lock.json").dependencies["openmultiplayer/open.mp"].version;

  try {
    console.log(`project: ${sandbox.projectDir}`);
    console.log(`api:     ${server.baseUrl}`);
    console.log(`cache:   ${sandbox.cachedTagDirs().join(", ")}`);

    await step("versions", ["versions"]);
    await step("dry run", ["update", "openmultiplayer/open.mp@^1.6.7", "--dry-run", "--verbose"]);
    check(
      "the dry run left the lockfile alone",
      sandbox.readJson("infernus-lock.json").dependencies["openmultiplayer/open.mp"].version,
      OLD_TAG,
    );

    // npm's rule, and the reason the lockfile exists: an install keeps what the
    // lockfile pins, even though ^1.5.8 would resolve to a newer release
    const installed = await step("install, which must keep the locked release", [
      "install",
      "--verbose",
    ]);
    check(
      "install kept the locked release",
      sandbox.readJson("infernus-lock.json").dependencies["openmultiplayer/open.mp"].version,
      OLD_TAG,
    );
    check("install says the lockfile answered", installed.output.includes("lockfile:"), true);

    const frozen = await step("frozen install", ["install", "--frozen", "--verbose"]);
    check("the frozen install kept the lockfile", lockedTag(), OLD_TAG);
    check(
      "a settled project reports that it has nothing to do",
      frozen.output.includes("nothing to do"),
      true,
    );

    // npm's other half: an update moves the declared ranges. `^1.5.8` accepts
    // 1.6.7, so this is what carries the project forward
    await step("update every declared dependency", ["update", "--verbose"]);
    check("the bare update moved the lockfile", lockedTag(), NEW_TAG);
    check(
      "the bare update installed the new server",
      sandbox.read("omp-server.exe"),
      `server ${NEW_TAG}`,
    );
    check(
      "the bare update kept the declaration",
      sandbox.readJson("infernus.json").dependencies["openmultiplayer/open.mp"],
      "^1.5.8",
    );

    await step("update from the release server", [
      "update",
      "openmultiplayer/open.mp@^1.6.7",
      "--verbose",
    ]);
    check(
      "the explicit update declared the range",
      sandbox.readJson("infernus.json").dependencies["openmultiplayer/open.mp"],
      "^1.6.7",
    );

    console.log("\n### resulting project");
    check("the server was upgraded", sandbox.read("omp-server.exe"), `server ${NEW_TAG}`);
    check("the library was upgraded", sandbox.read("libnode.dll"), `lib ${NEW_TAG}`);
    check("the project gamemode survived", sandbox.read("gamemodes/my.pwn"), "my gamemode");
    check(
      "the project settings in config.json survived",
      sandbox.readJson("config.json").name,
      "my server",
    );
    check("the configured player limit survived", sandbox.readJson("config.json").max_players, 50);
    check(
      "the lockfile records the new release",
      sandbox.readJson("infernus-lock.json").dependencies["openmultiplayer/open.mp"].version,
      NEW_TAG,
    );
    check(
      "the manifest points at the shipped schema",
      sandbox.readJson("infernus.json").$schema,
      "https://raw.githubusercontent.com/dockfries/infernus/main/packages/cli/schemas/infernus.schema.json",
    );
    check(
      "the lockfile points at the shipped schema",
      sandbox.readJson("infernus-lock.json").$schema,
      "https://raw.githubusercontent.com/dockfries/infernus/main/packages/cli/schemas/infernus.schema.json",
    );

    await step("update again, expecting the cache to answer", [
      "update",
      "openmultiplayer/open.mp@^1.6.7",
      "--verbose",
    ]);

    // the upgraded project is now what `--frozen` has to reproduce
    await step("frozen install after the update", ["install", "--frozen", "--verbose"]);
    check("the frozen install kept the upgraded lockfile", lockedTag(), NEW_TAG);
    check(
      "the frozen install kept the upgraded server",
      sandbox.read("omp-server.exe"),
      `server ${NEW_TAG}`,
    );
  } finally {
    sandbox.cleanup();
    await server.close();
  }

  console.log(failures ? `\n${failures} check(s) failed` : "\nall checks passed");
  process.exit(failures ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
