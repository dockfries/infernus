import { PlayerStateEnum } from "core/enums";
import {
  OnPlayerConnect,
  OnPlayerDisconnect,
} from "core/wrapper/native/callbacks";
import { Player } from "./basePlayer";
import { playerBus, playerHooks } from "./playerBus";

let timer: null | NodeJS.Timeout = null;

let pausePlayers: Map<number, Player> | null = null;

playerBus.on(playerHooks.create, (players: Map<number, Player>) => {
  if (pausePlayers === null) pausePlayers = players;
});

OnPlayerConnect(() => {
  if (!timer && pausePlayers && Player.getPoolSize() > -1) {
    timer = setInterval(() => {
      for (const item of pausePlayers as Map<number, Player>) {
        const p = item[1];
        if (
          !p.isNpc() &&
          !p.isPaused &&
          p.getState() !== PlayerStateEnum.NONE &&
          Date.now() - p.lastUpdateTick > 1000
        ) {
          playerBus.emit(playerHooks.pause, p);
        }
      }
    }, 500);
  }
  return 1;
});

OnPlayerDisconnect(() => {
  if (timer && Player.getPoolSize() <= 0) clearInterval(timer);
  return 1;
});
