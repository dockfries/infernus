import { GameMode } from "@infernus/core";
import { SArt } from "../art";
import { artPool } from "../pool";

GameMode.onExit(({ next }) => {
  SArt.getInstances().forEach((art) => art.destroy());
  artPool.clear();
  return next();
});

export {};
