import { Player } from "./entity";
import { PlayerStateEnum } from "../../enums";
import { defineEvent } from "../bus";
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
  if (!pauseChecker && Player.getInstances().length) {
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

onDisconnect(({ next }) => {
  if (pauseChecker && Player.getInstances().length <= 1) {
    clearInterval(pauseChecker);
    pauseChecker = null;
  }
  return next();
});

function fpsHeartbeat(player: Player) {
  if (!Player.isConnected(player.id)) return;

  const now = Date.now();

  if (now - player.lastUpdateFpsTick >= 1000) {
    const nowDrunkLevel = player.getDrunkLevel();

    if (nowDrunkLevel < 100) {
      player.setDrunkLevel(2000);
      player.lastDrunkLevel = 2000;
      player.lastFps = 0;
      return;
    }

    player.lastUpdateFpsTick = now;
    player.lastFps = player.lastDrunkLevel - nowDrunkLevel - 1;
    player.lastDrunkLevel = nowDrunkLevel;
  }
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
