import { Player } from "./entity";
import { PlayerStateEnum } from "../../enums";
import { defineEvent } from "../bus";
import { Dialog } from "./dialog";
import { onConnect, onDisconnect, onUpdate } from "./event";

let pauseChecker: null | NodeJS.Timeout = null;

export const [onPause, triggerOnPause] = defineEvent({
  name: "OnPlayerPause",
  isNative: false,
  beforeEach(player: Player, pausedAt: number) {
    return { player, pausedAt };
  },
});

export const [onResume, triggerOnResume] = defineEvent({
  name: "OnPlayerResume",
  isNative: false,
  beforeEach(player: Player, pausedAt: number, now: number, diff: number) {
    return { player, pausedAt, now, diff };
  },
});

onConnect(({ next }) => {
  if (!pauseChecker && Player.getPoolSize() > -1) {
    pauseChecker = setInterval(() => {
      const activePlayers = Player.getInstances().filter((p) => {
        const activeState = p.getState() !== PlayerStateEnum.NONE;
        return !p.isPaused && !p.isNpc() && activeState;
      });

      activePlayers.forEach((p) => {
        if (Date.now() - p.lastUpdateTick > 1000) {
          p.isPaused = true;
          triggerOnPause(p, p.lastUpdateTick);
        }
      });
    }, 500);
  }
  return next();
});

onDisconnect(({ player, next }) => {
  if (pauseChecker && Player.getPoolSize() <= 0) {
    clearInterval(pauseChecker);
    pauseChecker = null;
  }
  Dialog.close(player);
  return next();
});

function fpsHeartbeat(player: Player) {
  if (!Player.isConnected(player.id)) return;

  const nowDrunkLevel = player.getDrunkLevel();

  if (nowDrunkLevel < 100) {
    player.setDrunkLevel(2000);
    player.lastDrunkLevel = 2000;
    player.lastFps = 0;
    return;
  }

  player.lastFps = player.lastDrunkLevel - nowDrunkLevel - 1;
  player.lastDrunkLevel = nowDrunkLevel;
}

onUpdate(({ player, next }) => {
  if (!player.isNpc()) {
    const now = Date.now();
    if (player.isPaused) {
      player.isPaused = false;
      triggerOnResume(
        player,
        player.lastUpdateTick,
        now,
        now - player.lastUpdateTick
      );
    }
    player.lastUpdateTick = now;
    fpsHeartbeat(player);
  }

  return next();
});
