import "./player";
import "./vehicle";
import "./checkpoint";
import "./pickup";
import { GameMode } from "@infernus/core";
import { scriptExit, scriptInit } from "../functions/internal/init";

GameMode.onInit(({ next }) => {
  scriptInit();
  return next();
});

GameMode.onExit(({ next }) => {
  scriptExit();
  return next();
});
