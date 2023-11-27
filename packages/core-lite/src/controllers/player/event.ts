import { Player } from ".";
import { defineEvent } from "../bus";

const players = new Map<number, Player>();

export const [OnPlayerConnect] = defineEvent({
  name: "OnPlayerConnect",
  enhance(next, playerId: number) {
    const player = players.get(playerId) || new Player(playerId);
    return { next, player };
  },
});

export const [OnPlayerDisconnect] = defineEvent({
  name: "OnPlayerDisconnect",
  enhance(next, playerId: number) {
    const player = players.get(playerId);
    return { next, player };
  },
});

const [OnPlayerPause, triggerOnPlayerPause] = defineEvent({
  name: "OnPlayerPause",
  isNative: false,
  enhance(next, player: Player) {
    return { next, player };
  },
});

OnPlayerPause(({ next, player }) => {
  console.log(player);
  return next();
});

// simulate trigger custom event middlewares
OnPlayerConnect(({ next, player }) => {
  // if custom event middlewares return false(number != 1) not execute this event middlewares
  // It is common in anti-cheating system.
  const res = triggerOnPlayerPause(player);
  if (!res) return;

  return next();
});

// after all onPlayerDisconnect middlewares executed
// forget player (if meet async middleware, it will immediate executed)
OnPlayerDisconnect(({ next, player }) => {
  const ret = next();
  if (player) players.delete(player.id);
  return ret;
});

export { OnPlayerPause };
