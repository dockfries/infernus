import { InvalidEnum } from "core/enums";
import { Player } from "../player/entity";
import { TextDraw } from "./entity";
import { GameMode } from "../gamemode";
import { defineEvent } from "../bus";
import { globalTextDrawPool, playerTextDrawPool } from "core/utils/pools";

GameMode.onExit(({ next }) => {
  TextDraw.getInstances(true).forEach((t) => t.destroy());
  TextDraw.getInstances(false).forEach((t) => t.destroy());
  globalTextDrawPool.clear();
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
        tid === InvalidEnum.TEXT_DRAW ? tid : TextDraw.getInstance(tid, true)!,
    };
  },
});
const [onPlayerClickPlayer] = defineEvent({
  name: "OnPlayerClickPlayerTextDraw",
  identifier: "ii",
  defaultValue: false,
  beforeEach(pid: number, tid: number) {
    return {
      player: Player.getInstance(pid)!,
      textDraw:
        tid === InvalidEnum.TEXT_DRAW ? tid : TextDraw.getInstance(tid, false)!,
    };
  },
});

export const TextDrawEvent = Object.freeze({
  onPlayerClickGlobal,
  onPlayerClickPlayer,
});
