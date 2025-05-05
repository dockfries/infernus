import { InvalidEnum } from "core/enums";
import { Player } from "../player/entity";
import { TextDraw } from "./entity";
import { GameMode } from "../gamemode";
import { defineEvent } from "../bus";

GameMode.onExit(({ next }) => {
  TextDraw.getInstances(true).forEach((t) => t.destroy());
  TextDraw.getInstances(false).forEach((t) => t.destroy());
  return next();
});

const [onPlayerClickGlobal] = defineEvent({
  name: "OnPlayerClickTextDraw",
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
