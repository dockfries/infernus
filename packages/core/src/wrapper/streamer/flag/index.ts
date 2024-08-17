import { GameMode } from "core/controllers/gamemode";

export const streamerFlag = {
  skip: false,
};

GameMode.onInit(({ next }) => {
  streamerFlag.skip = false;
  return next();
});

GameMode.onExit(({ next }) => {
  streamerFlag.skip = true;
  return next();
});
