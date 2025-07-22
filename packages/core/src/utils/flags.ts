import { GameMode } from "core/controllers/gamemode";

export const INTERNAL_FLAGS = {
  skip: false,
};

GameMode.onInit(({ next }) => {
  INTERNAL_FLAGS.skip = false;
  return next();
});

GameMode.onExit(({ next }) => {
  INTERNAL_FLAGS.skip = true;
  return next();
});
