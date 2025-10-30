import { defineEvent } from "../bus";
import { Player } from "../player";

const [onPlayerEnter] = defineEvent({
  name: "OnPlayerEnterCheckpoint",
  identifier: "i",
  beforeEach(playerId: number) {
    return {
      player: Player.getInstance(playerId)!,
    };
  },
});

const [onPlayerLeave] = defineEvent({
  name: "OnPlayerLeaveCheckpoint",
  identifier: "i",
  beforeEach(playerId: number) {
    return {
      player: Player.getInstance(playerId)!,
    };
  },
});

export const CheckPointEvent = Object.freeze({
  onPlayerEnter,
  onPlayerLeave,
});
