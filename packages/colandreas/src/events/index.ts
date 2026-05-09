import { GameMode } from "@infernus/core";
import { CA_Object } from "../obj";

GameMode.onExit(({ next }) => {
  CA_Object.destroyAll();
  return next();
});
