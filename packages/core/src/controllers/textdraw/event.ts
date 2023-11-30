/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { InvalidEnum } from "core/enums";
import { Player } from "../player/entity";
import { TextDraw } from "./entity";
import { GameMode } from "../gamemode";
import { defineEvent } from "../bus";

GameMode.onExit(({ next }) => {
  TextDraw.getInstances().forEach((t) => t.destroy());
  return next();
});

const [onPlayerClickGlobal] = defineEvent({
  name: "OnPlayerClickTextDraw",
  beforeEach(pid: number, tid: number) {
    return {
      player: Player.getInstance(pid)!,
      textDraw:
        tid === InvalidEnum.TEXT_DRAW
          ? tid
          : TextDraw.getInstance({ id: tid, global: true })!,
    };
  },
});
const [onPlayerClickPlayer] = defineEvent({
  name: "OnPlayerClickPlayerTextDraw",
  beforeEach(pid: number, tid: number) {
    return {
      player: Player.getInstance(pid)!,
      textDraw:
        tid === InvalidEnum.TEXT_DRAW
          ? tid
          : TextDraw.getInstance({ id: tid, global: false })!,
    };
  },
});

export const TextDrawEvent = { onPlayerClickGlobal, onPlayerClickPlayer };
