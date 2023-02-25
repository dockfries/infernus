import { PlayerStateEnum } from "@/enums";
import {
  OnPlayerConnect,
  OnPlayerDisconnect,
} from "@/wrapper/native/callbacks";
import { BasePlayer } from "./basePlayer";
import { playerBus, playerHooks } from "./playerBus";

let timer: null | NodeJS.Timer = null;

let pausePlayers: Map<number, BasePlayer> | null = null;

playerBus.on(playerHooks.create, (players: Map<number, BasePlayer>) => {
  if (pausePlayers === null) pausePlayers = players;
});

OnPlayerConnect(() => {
  if (!timer && pausePlayers && BasePlayer.getPoolSize() > -1) {
    timer = setInterval(() => {
      for (const item of pausePlayers as Map<number, BasePlayer>) {
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
  if (timer && BasePlayer.getPoolSize() === -1) clearInterval(timer);
  return 1;
});
