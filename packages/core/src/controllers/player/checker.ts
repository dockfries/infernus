import { Player } from "./entity";
import { PlayerStateEnum } from "../../enums";
import { defineEvent } from "../bus";
import { onConnect, onDisconnect, onUpdate } from "./event";

let pauseChecker: null | NodeJS.Timeout = null;
const androidTimer = new Map<Player, NodeJS.Timeout>();
const androidCheckCount = new Map<Player, number>();

function checkAndroid(player: Player) {
  if (player._isAndroid || !player.isConnected()) {
    if (androidTimer.has(player)) {
      clearInterval(androidTimer.get(player));
    }
    return;
  }

  let count = androidCheckCount.get(player) || 0;

  if (count >= 10) {
    player._isAndroid = true;
    clearInterval(androidTimer.get(player));
    triggerOnAndroidCheck(player, true);
    return;
  }

  player
    .sendClientCheck(0x48, 0, 0, 2)
    .then(({ actionId }) => {
      if (actionId === 0x48) {
        player._isAndroid = false;
        if (androidTimer.has(player)) {
          clearInterval(androidTimer.get(player));
        }
        triggerOnAndroidCheck(player, false);
      }
    })
    .catch(() => {});

  count++;
  androidCheckCount.set(player, count);
}

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

export const [onFpsUpdate, triggerOnFpsUpdate] = defineEvent({
  name: "OnPlayerFpsUpdate",
  isNative: false,
  beforeEach(player: Player, newFps: number, oldFps: number) {
    return { player, newFps, oldFps };
  },
});

export const [onAndroidCheck, triggerOnAndroidCheck] = defineEvent({
  name: "OnAndroidCheck",
  isNative: false,
  beforeEach(player: Player, result: boolean) {
    return { player, result };
  },
});

onConnect(({ player, next }) => {
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

  if (player.isNpc()) return next();
  checkAndroid(player);
  const timer = setInterval(() => checkAndroid(player), 1000);
  androidTimer.set(player, timer);
  return next();
});

onDisconnect(({ player, next }) => {
  if (pauseChecker && Player.getInstances().length <= 1) {
    clearInterval(pauseChecker);
    pauseChecker = null;
  }
  if (androidTimer.has(player)) {
    clearInterval(androidTimer.get(player));
    androidTimer.delete(player);
    androidCheckCount.delete(player);
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

    const oldFps = player.lastFps;
    const newFps = player.lastDrunkLevel - nowDrunkLevel - 1;

    player.lastFps = newFps;
    player.lastDrunkLevel = nowDrunkLevel;

    triggerOnFpsUpdate(player, newFps, oldFps);
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
        now - player.lastUpdateTick,
      );
    }
    player.lastUpdateTick = now;
    fpsHeartbeat(player);
  }

  return next();
});
