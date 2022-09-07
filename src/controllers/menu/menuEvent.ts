import { InvalidEnum } from "@/enums";
import {
  OnPlayerExitedMenu,
  OnPlayerSelectedMenuRow,
} from "@/wrapper/callbacks";
import { GetPlayerMenu } from "@/wrapper/functions";
import { BasePlayer, BasePlayerEvent } from "../player";
import { BaseMenu } from "./baseMenu";
import { menuBus, menuHooks } from "./menuBus";

export abstract class BaseMenuEvent<
  P extends BasePlayer,
  E extends BasePlayerEvent<P>,
  M extends BaseMenu
> {
  private event: E;
  public readonly menus: Array<M> = [];

  constructor(event: E) {
    this.event = event;
    menuBus.on(menuHooks.created, (menu: M) => {
      this.menus.push(menu);
    });
    menuBus.on(menuHooks.destroyed, (menu: M) => {
      const vIdx = this.menus.findIndex((m) => m === menu);
      if (vIdx === -1) return;
      this.menus.splice(vIdx, 1);
    });
    OnPlayerExitedMenu((playerid: number) => {
      const menu = this.findMenuById(GetPlayerMenu(playerid));
      if (!menu) return;
      const player = this.event.findPlayerById(playerid);
      if (!player) return;
      this.onPlayerExited(player, menu);
    });
    OnPlayerSelectedMenuRow((playerid: number, row: number) => {
      const menu = this.findMenuById(GetPlayerMenu(playerid));
      if (!menu) return;
      const player = this.event.findPlayerById(playerid);
      if (!player) return;
      this.onPlayerSelectedRow(player, menu, row);
    });
  }
  protected abstract onPlayerExited(player: P, menu: M): void;
  protected abstract onPlayerSelectedRow(player: P, menu: M, row: number): void;
  public findMenuById(menuId: number) {
    if (menuId === InvalidEnum.MENU) return undefined;
    return this.menus.find((menu) => menu.id === menuId);
  }
}
