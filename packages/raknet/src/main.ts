import { GameMode, IFilterScript } from "@infernus/core";
import { PR_Init } from "./functions/natives";

export default {
  name: "raknet",
  load() {
    new GameMode().onInit = PR_Init;
  },
  unload() {
    /* empty */
  },
} as IFilterScript;
