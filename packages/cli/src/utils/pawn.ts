import path from "node:path";
import fs from "fs-extra";
import { githubGet } from "./api";
import { PawnJson } from "../types";
import { GLOBAL_DEPS_PATH } from "./config";

const PAWN_JSON_ROUTE = "GET /repos/{owner}/{repo}/contents/{path}";

/**
 * Read the `pawn.json` of a release, from the unpacked cache when it is there.
 *
 * A release without the file at that ref is read from the default branch
 * instead, which is how repositories that keep `pawn.json` outside their tags
 * are still installable.
 */
export async function getPawnJson(owner: string, repo: string, ref: string) {
  const localPawnJsonPath = path.resolve(GLOBAL_DEPS_PATH, owner, repo, ref, "pawn.json");

  try {
    return (await fs.readJson(localPawnJsonPath)) as PawnJson;
  } catch {
    /* not cached, read it from the repository */
  }

  const options = { owner, repo, path: "pawn.json" };

  let response;
  try {
    response = await githubGet(PAWN_JSON_ROUTE, { ...options, ref });
  } catch (error: any) {
    if (error?.status !== 404) throw error;
    response = await githubGet(PAWN_JSON_ROUTE, options);
  }

  return JSON.parse(Buffer.from(response.data.content, "base64").toString()) as PawnJson;
}

export async function getIncludePath() {
  const cwd = process.cwd();

  const qawno = path.resolve(cwd, "qawno/include");
  const pawno = path.resolve(cwd, "pawno/include");

  if (fs.existsSync(qawno)) return qawno;
  if (fs.existsSync(pawno)) return pawno;

  return path.resolve(cwd, "include");
}

export function getPlugOrCompPath(isComponent: boolean) {
  return path.resolve(process.cwd(), isComponent ? "components" : "plugins");
}
