import path from "node:path";
// @ts-expect-error no types package
import decompress from "@xhmikosr/decompress";
import fs from "fs-extra";
import { downloadGitRepo } from "./api";

/** where the scaffolded project comes from */
export const STARTER_OWNER = "dockfries";
export const STARTER_REPO = "infernus-starter";

/** a starter checkout always has these at its root */
export const STARTER_REQUIRED_FILES = ["package.json", "infernus.json"];

/**
 * Unpack the starter archive into the new project directory.
 *
 * GitHub wraps a checkout in a single top level directory, but assuming that with
 * `strip: 1` means a change upstream would silently produce an empty project, so
 * both layouts are tried and the result is checked for the files a starter must
 * have. Nothing is moved into the project until one layout is known to be
 * complete, so a failed download cannot leave half a project behind.
 */
export async function extractStarter(archivePath: string, targetPath: string) {
  const candidates: { dir: string; options: { strip?: number } }[] = [
    { dir: path.resolve(targetPath, ".starter-stripped"), options: { strip: 1 } },
    { dir: path.resolve(targetPath, ".starter-plain"), options: {} },
  ];

  for (const candidate of candidates) {
    await fs.remove(candidate.dir);
    await fs.ensureDir(candidate.dir);
    await decompress(archivePath, candidate.dir, candidate.options);

    const complete = (
      await Promise.all(
        STARTER_REQUIRED_FILES.map((file) => fs.pathExists(path.resolve(candidate.dir, file))),
      )
    ).every(Boolean);

    if (complete) {
      for (const entry of await fs.readdir(candidate.dir)) {
        await fs.move(path.resolve(candidate.dir, entry), path.resolve(targetPath, entry), {
          overwrite: true,
        });
      }
      await Promise.all(candidates.map((other) => fs.remove(other.dir)));
      return;
    }

    await fs.remove(candidate.dir);
  }

  throw new Error(
    `the downloaded starter does not contain ${STARTER_REQUIRED_FILES.join(" and ")}, ` +
      `so the project was not created; please report this at https://github.com/dockfries/infernus/issues`,
  );
}

/** Download the starter for this flavour and unpack it into a new project. */
export async function fetchStarter(targetPath: string, isRakNet: boolean) {
  const archivePath = await downloadGitRepo(
    STARTER_OWNER,
    STARTER_REPO,
    targetPath,
    isRakNet ? "raknet" : "main",
  );

  await extractStarter(archivePath, targetPath);
  await fs.remove(archivePath);
  await fs.remove(path.resolve(targetPath, ".git"));

  return targetPath;
}
