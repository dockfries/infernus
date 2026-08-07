import { GameMode } from "@infernus/core";
import { MAPFIX_VERSION } from "../constants";
import { createMapFixObjects, destroyMapFixObjects } from "../natives";

GameMode.onInit(({ next }) => {
  const ret = next();
  try {
    createMapFixObjects();
    samp.logprint(`MapFix by Nexius v${MAPFIX_VERSION} loaded (include version).`);
  } catch {
    // ignore
  }
  return ret;
});

GameMode.onExit(({ next }) => {
  try {
    destroyMapFixObjects();
    samp.logprint(`MapFix by Nexius v${MAPFIX_VERSION} unloaded (include version).`);
  } catch {
    // ignore
  }
  return next();
});

export {};
