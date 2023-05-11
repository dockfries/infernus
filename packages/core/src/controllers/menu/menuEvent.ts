import { InvalidEnum } from "@/enums";
import type { TCommonCallback } from "@/types";
import { defineAsyncCallback } from "@/utils/helperUtils";
import {
  OnGameModeExit,
  OnPlayerExitedMenu,
  OnPlayerSelectedMenuRow,
} from "@/wrapper/native/callbacks";
import { GetPlayerMenu } from "@/wrapper/native/functions";
import type { Player } from "../player";
import type { Menu } from "./baseMenu";
import { menuBus, menuHooks } from "./menuBus";

export class MenuEvent<P extends Player, M extends Menu> {
  private readonly menus = new Map<number, M>();
  private readonly players;

  constructor(playersMap: Map<number, P>, destroyOnExit = true) {
    this.players = playersMap;
    menuBus.on(menuHooks.created, (menu: M) => {
      this.menus.set(menu.id, menu);
    });
    menuBus.on(menuHooks.destroyed, (menu: M) => {
      this.menus.delete(menu.id);
    });
    if (destroyOnExit) {
      OnGameModeExit(() => {
        this.menus.forEach((m) => m.destroy());
        this.menus.clear();
      });
    }
    OnPlayerExitedMenu((playerid: number): number => {
      const menu = this.findMenuById(GetPlayerMenu(playerid));
      if (!menu) return 0;
      const player = this.findPlayerById(playerid);
      if (!player) return 0;
      const pFn = defineAsyncCallback(this, "onPlayerExited");
      return pFn(player, menu);
    });
    OnPlayerSelectedMenuRow((playerid: number, row: number): number => {
      const menu = this.findMenuById(GetPlayerMenu(playerid));
      if (!menu) return 0;
      const player = this.findPlayerById(playerid);
      if (!player) return 0;
      const pFn = defineAsyncCallback(this, "onPlayerSelectedRow");
      return pFn(player, menu, row);
    });
  }
  onPlayerExited?(player: P, menu: M): TCommonCallback;
  onPlayerSelectedRow?(player: P, menu: M, row: number): TCommonCallback;

  private findPlayerById(playerid: number) {
    return this.players.get(playerid);
  }

  findMenuById(menuId: number) {
    if (menuId === InvalidEnum.MENU) return undefined;
    return this.menus.get(menuId);
  }

  getMenusArr(): Array<M> {
    return [...this.menus.values()];
  }

  getMenusMap(): Map<number, M> {
    return this.menus;
  }
}
