import { InvalidEnum } from "core/enums";
import { Player } from "../player/entity";
import { TextDraw } from "./entity";
import { GameMode } from "../gamemode";
import { defineEvent } from "../bus";
import { textDrawPool, playerTextDrawPool } from "core/utils/pools";

GameMode.onExit(({ next }) => {
  TextDraw.getInstances().forEach((t) => t.destroy());
  TextDraw.getPlayersInstances()
    .map(([, t]) => t)
    .flat()
    .forEach((t) => t.destroy());
  textDrawPool.clear();
  playerTextDrawPool.clear();
  return next();
});

const [onPlayerClickGlobal] = defineEvent({
  name: "OnPlayerClickTextDraw",
  identifier: "ii",
  defaultValue: false,
  beforeEach(pid: number, tid: number) {
    return {
      player: Player.getInstance(pid)!,
      textDraw:
        tid === InvalidEnum.TEXT_DRAW ? tid : TextDraw.getInstance(tid)!,
    };
  },
});
const [onPlayerClickPlayer] = defineEvent({
  name: "OnPlayerClickPlayerTextDraw",
  identifier: "ii",
  defaultValue: false,
  beforeEach(pid: number, tid: number) {
    const player = Player.getInstance(pid)!;
    return {
      player,
      textDraw:
        tid === InvalidEnum.TEXT_DRAW
          ? tid
          : TextDraw.getInstance(tid, player)!,
    };
  },
});

export const TextDrawEvent = Object.freeze({
  onPlayerClickGlobal,
  onPlayerClickPlayer,
});
