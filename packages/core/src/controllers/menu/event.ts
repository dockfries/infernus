import { Menu } from "./entity";
import { GameMode } from "../gamemode";
import { defineEvent } from "../bus";
import { Player } from "../player";
import { menuPool } from "core/utils/pools";

GameMode.onExit(({ next }) => {
  Menu.getInstances().forEach((g) => g.destroy());
  menuPool.clear();
  return next();
});

const [onPlayerExited] = defineEvent({
  name: "OnPlayerExitedMenu",
  beforeEach(pid: number) {
    return { player: Player.getInstance(pid)! };
  },
});

const [onPlayerSelectedRow] = defineEvent({
  name: "OnPlayerSelectedMenuRow",
  beforeEach(pid: number, row: number) {
    const player = Player.getInstance(pid)!;
    const menu = Menu.getInstanceByPlayer(player)!;
    return { player, menu, row };
  },
});

export const MenuEvent = Object.freeze({
  onPlayerExited,
  onPlayerSelectedRow,
});
