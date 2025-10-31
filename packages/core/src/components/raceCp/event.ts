import { defineEvent } from "../../utils/bus";
import { Player } from "../player";

const [onPlayerEnter] = defineEvent({
  name: "OnPlayerEnterRaceCheckpoint",
  identifier: "i",
  beforeEach(playerId: number) {
    return {
      player: Player.getInstance(playerId)!,
    };
  },
});

const [onPlayerLeave] = defineEvent({
  name: "OnPlayerLeaveRaceCheckpoint",
  identifier: "i",
  beforeEach(playerId: number) {
    return {
      player: Player.getInstance(playerId)!,
    };
  },
});

export const RaceCpEvent = Object.freeze({
  onPlayerEnter,
  onPlayerLeave,
});
