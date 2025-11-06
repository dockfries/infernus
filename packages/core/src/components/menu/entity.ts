import * as w from "core/wrapper/native";

import type { Player } from "../player";
import { InvalidEnum, LimitsEnum } from "../../enums";
import { menuPool } from "core/utils/pools";
import { INTERNAL_FLAGS } from "core/utils/flags";
import { IMenu } from "core/interfaces";

export class Menu {
  private sourceInfo: IMenu | null = null;
  private _id: number = InvalidEnum.MENU;

  get id() {
    return this._id;
  }

  constructor(menuOrId: IMenu | number) {
    if (typeof menuOrId === "number") {
      this._id = menuOrId;
      const pickup = Menu.getInstance(this._id);
      if (pickup) return pickup;
      menuPool.set(this.id, this);
    } else {
      this.sourceInfo = menuOrId;
    }
  }

  create(): this {
    if (!this.sourceInfo) {
      throw new Error("[Menu]: Unable to create with only id");
    }
    if (this._id !== InvalidEnum.MENU) {
      throw new Error("[Menu]: Cannot be created twice");
    }
    const { title, columns, x, y, colWidth } = this.sourceInfo!;
    const [col1Width, col2Width] = colWidth;
    this._id = Menu.__inject__.create(
      title,
      columns,
      x,
      y,
      col1Width,
      col2Width,
    );
    if (
      this.id === InvalidEnum.MENU ||
      Menu.getInstances().length === LimitsEnum.MAX_MENUS
    ) {
      throw new Error("[Menu]: Unable to create menu");
    }
    menuPool.set(this._id, this);
    return this;
  }

  destroy(): this {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot destroy before create");
    if (!INTERNAL_FLAGS.skip) {
      Menu.__inject__.destroy(this.id);
    }
    menuPool.delete(this._id);
    this._id = InvalidEnum.MENU;
    return this;
  }

  addItem(column: number, title: string): this {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot addItem before create");
    if (column !== 0 && column !== 1)
      throw new Error("[Menu]: Wrong number of columns");
    Menu.__inject__.addItem(this.id, column, title);
    return this;
  }

  setColumnHeader(column: number, header: string): this {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot  setColumnHeader before create");
    if (column !== 0 && column !== 1)
      throw new Error("[Menu]: Wrong number of columns");
    Menu.__inject__.setColumnHeader(this.id, column, header);
    return this;
  }

  disable(): this {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot disable menu before create");
    Menu.__inject__.disable(this.id);
    return this;
  }

  disableRow(row: number) {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot disable row before create");
    return Menu.__inject__.disableRow(this.id, row);
  }

  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.MENU) return true;
    return Menu.isValid(this.id);
  }

  showForPlayer(player: Player): number {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot show menu before create");
    return Menu.__inject__.showForPlayer(this.id, player.id);
  }

  hideForPlayer(player: Player): number {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot hide menu before create");
    return Menu.__inject__.hideForPlayer(this.id, player.id);
  }

  isDisabled(): boolean {
    if (this._id === InvalidEnum.MENU) return false;
    return Menu.__inject__.isDisabled(this.id);
  }

  isRowDisabled(row: number): boolean {
    if (this._id === InvalidEnum.MENU) return false;
    return Menu.__inject__.isRowDisabled(this.id, row);
  }

  getItems(column: number): number {
    if (this._id === InvalidEnum.MENU) return 0;
    return Menu.__inject__.getItems(this.id, column);
  }

  getPos() {
    return Menu.__inject__.getPos(this.id);
  }

  getColumnWidth() {
    return Menu.__inject__.getColumnWidth(this.id);
  }

  getColumnHeader(column: number) {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot get column header before create");
    return Menu.__inject__.getColumnHeader(this.id, column);
  }

  getItem(column: number, item: number) {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot get item before create");
    if (item < 0 || item > this.getItems(column) - 1)
      throw new Error("[Menu]: invalid getItem range");
    return Menu.__inject__.getItem(this.id, column, item);
  }

  static isValid(menuId: number) {
    return Menu.__inject__.isValid(menuId);
  }

  static getInstance(id: number) {
    return menuPool.get(id);
  }

  static getInstances() {
    return [...menuPool.values()];
  }

  static getInstanceByPlayer(player: Player) {
    return this.getInstances().find(
      (item) => item.id === w.GetPlayerMenu(player.id),
    );
  }

  static __inject__ = {
    create: w.CreateMenu,
    destroy: w.DestroyMenu,
    addItem: w.AddMenuItem,
    setColumnHeader: w.SetMenuColumnHeader,
    disable: w.DisableMenu,
    disableRow: w.DisableMenuRow,
    isValid: w.IsValidMenu,
    showForPlayer: w.ShowMenuForPlayer,
    hideForPlayer: w.HideMenuForPlayer,
    isDisabled: w.IsMenuDisabled,
    isRowDisabled: w.IsMenuRowDisabled,
    getItems: w.GetMenuItems,
    getPos: w.GetMenuPos,
    getColumnWidth: w.GetMenuColumnWidth,
    getColumnHeader: w.GetMenuColumnHeader,
    getItem: w.GetMenuItem,
    getPlayerMenu: w.GetPlayerMenu,
  };
}
