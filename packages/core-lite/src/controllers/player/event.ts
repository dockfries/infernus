import { Player } from ".";
import { defineEvent } from "../bus";

const players = new Map<number, Player>();

export const getPlayerInstances = () => [...players.values()];

export const [onPlayerConnect] = defineEvent({
  name: "OnPlayerConnect",
  beforeEach(id: number) {
    const player = new Player(id);
    players.set(id, player);
    return { player };
  },
});

export const [onPlayerDisconnect] = defineEvent({
  name: "OnPlayerDisconnect",
  beforeEach(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const player = players.get(id)!;
    return { player };
  },
  afterEach({ player }) {
    players.delete(player.id);
  },
});

export const [onPlayerPause, triggerOnPlayerPause] = defineEvent({
  name: "OnPlayerPause",
  isNative: false,
  beforeEach(player: Player) {
    return { player };
  },
});

// onPlayerPause(({ next, player }) => {
//   console.log(player);
//   return next();
// });

// // simulate trigger custom event middlewares
// onPlayerConnect(({ next, player }) => {
//   // if custom event middlewares return false(number != 1) not execute this event middlewares
//   // It is common in anti-cheat system.
//   const res = triggerOnPlayerPause(player);
//   if (!res) return;

//   return next();
// });
