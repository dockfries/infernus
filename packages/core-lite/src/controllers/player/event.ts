import { Player } from ".";
import { defineEvent } from "../bus";

export const OnPlayerConnect = defineEvent(
  "OnPlayerConnect",
  (next, playerId: number) => {
    const player = new Player(playerId);
    return { next, player };
  }
);

OnPlayerConnect(({ next, player }) => {
  console.log(player);
  return next();
});
