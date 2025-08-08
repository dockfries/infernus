import { DynamicObject, Player } from "@infernus/core";
import { createRequire } from "node:module";
import { INTERNAL_MAP } from "../constants";
import { objParser } from "./object";
import { IMapLoadOptions, RemoveBuildingArgs } from "../interfaces";
import { materialTextParser } from "./materialText";
import { materialParser } from "./material";
import { removeBuildingParser } from "./removeBuilding";
import { processLineByLine } from "../utils";
import { MapLoaderError } from "../utils/error";

export async function mapReader(options: IMapLoadOptions) {
  let currentLine = 0;
  let materialTarget: DynamicObject | null = null;

  const removedBuilding: RemoveBuildingArgs = [];
  const objects: DynamicObject[] = [];

  function parseLine(lineStr: string) {
    if (!lineStr.length) {
      return;
    }

    currentLine++;

    const line = lineStr.split(" ");
    const operator = line[0];
    if (operator === "rmv") {
      removedBuilding.push(removeBuildingParser(line));
    } else if (operator === "mat") {
      if (!materialTarget) {
        throw new MapLoaderError({
          msg: `parseLine: no object target, cannot material`,
        });
      }
      materialParser(materialTarget, line);
    } else if (operator === "txt") {
      if (!materialTarget) {
        throw new MapLoaderError({
          msg: `parseLine: no object target, cannot materialText`,
        });
      }
      materialTextParser(materialTarget, line, options);
    } else {
      materialTarget = objParser(line, options);
      objects.push(materialTarget);
    }
  }

  let rl: ReturnType<typeof processLineByLine> | null = null;

  try {
    const { source } = options;
    if (typeof source === "string") {
      rl = processLineByLine(source);
      for await (const lineStr of rl) {
        parseLine(lineStr.trim());
      }
    } else {
      let isDone = false;

      while (!isDone) {
        const lines = await source(() => {
          isDone = true;
        });

        if (!lines.length) {
          isDone = true;
          break;
        }

        for (const lineStr of lines as string[]) {
          parseLine(lineStr.trim());
        }
      }
    }

    let removedBuildingIdx = -1;
    if (removedBuilding.length) {
      removedBuildingIdx =
        INTERNAL_MAP.removedBuilding.push(removedBuilding) - 1;
    }

    Player.getInstances().forEach((p) => {
      removedBuilding.forEach((rmv) => {
        p.removeBuilding(...rmv);
      });

      if (samp.defined && samp.defined._colandreas_included) {
        try {
          const require =
            typeof global.require !== "undefined"
              ? global.require
              : createRequire(import.meta.url);
          const colandreas: typeof import("@infernus/colandreas") = require("@infernus/colandreas");
          removedBuilding.forEach((rmv) => {
            colandreas.removeBuilding(...rmv);
          });
        } catch {
          /* empty */
        }
      }
    });

    return {
      objects,
      removedBuilding,
      removedBuildingIdx,
    };
  } catch (err) {
    objects.forEach((obj) => {
      if (obj.isValid()) {
        obj.destroy();
      }
    });
    objects.length = 0;
    removedBuilding.length = 0;

    if (err instanceof MapLoaderError) {
      err.context.msg = `lineNo: ${currentLine} ${err.context.msg}`;
      throw new MapLoaderError(err.context);
    }

    throw err;
  } finally {
    if (rl) {
      rl.close();
    }
  }
}
