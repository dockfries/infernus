import path from "node:path";
import fs from "fs-extra";
import { getOctoKit } from "./api";
import { PawnJson } from "../types";
import { depsPath } from "./config";

export async function getPawnJson(owner: string, repo: string, ref: string) {
  const localPawnJsonPath = path.resolve(
    depsPath,
    owner,
    repo,
    ref,
    "pawn.json",
  );

  try {
    return (await fs.readJson(localPawnJsonPath)) as PawnJson;
  } catch {
    /* empty */
  }

  const octokit = await getOctoKit();

  const getContentRoute = "GET /repos/{owner}/{repo}/contents/{path}";

  const options = {
    owner,
    repo,
    path: "pawn.json",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };

  let response: any;
  try {
    response = await octokit.request(getContentRoute, { ...options, ref });
  } catch (err: any) {
    if (err.status === 404) {
      response = await octokit.request(getContentRoute, options);
    }
  }

  if (response.status !== 200 && response.status !== 302)
    throw `Failed to get ${owner}/${repo} ${ref} pawn.json`;

  const pawnJsonStr = Buffer.from(response.data.content, "base64").toString();
  const pawnJson: PawnJson = JSON.parse(pawnJsonStr);
  return pawnJson;
}

export async function getIncludePath() {
  const cwd = process.cwd();

  const include = path.resolve(cwd, "include");
  const qawno = path.resolve(cwd, "qawno/include");
  const pawno = path.resolve(cwd, "pawno/include");

  const hasQawno = fs.existsSync(qawno);
  if (hasQawno) return qawno;

  const hasPawno = fs.existsSync(pawno);
  if (hasPawno) return pawno;

  return include;
}

export function getPlugOrCompPath(isComponent: boolean) {
  return path.resolve(process.cwd(), isComponent ? "components" : "plugins");
}
