import * as w from "core/wrapper/native";

import type { Player } from "../player";
import { InvalidEnum, LimitsEnum } from "../../enums";
import { menuPool } from "core/utils/pools";
import { INTERNAL_FLAGS } from "core/utils/flags";

export class Menu {
  private _itemCount = 0;
  get itemCount() {
    return this._itemCount;
  }

  private _id: number = InvalidEnum.MENU;
  get id() {
    return this._id;
  }

  private _title: string;
  get title(): string {
    return this._title;
  }
  set title(value: string) {
    this._title = value;
  }

  private _columns = 1;
  get columns(): number {
    return this._columns;
  }
  set columns(value: number) {
    if (value !== 1 && value !== 2) {
      throw new Error(
        "[Menu]: The menu column number interval is between 1 and 2",
      );
    }
    this._columns = value;
  }

  private _x: number;
  get x(): number {
    return this._x;
  }
  set x(value: number) {
    this._x = value;
  }

  private _y: number;
  get y(): number {
    return this._y;
  }
  set y(value: number) {
    this._y = value;
  }

  private _col1width: number;
  get col1width(): number {
    return this._col1width;
  }
  set col1width(value: number) {
    this._col1width = value;
  }

  private _col2width: number;
  get col2width(): number {
    return this._col2width;
  }
  set col2width(value: number) {
    this._col2width = value;
  }

  constructor(
    title: string,
    columns: number,
    x: number,
    y: number,
    col1width: number,
    col2width: number,
  ) {
    this._title = title;
    this.columns = columns;
    this._x = x;
    this._y = y;
    this._col1width = col1width;
    this._col2width = col2width;
  }
  create(): this {
    if (this._id !== InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot be created twice");
    this._id = Menu.__inject__CreateMenu(
      this.title,
      this.columns,
      this.x,
      this.y,
      this.col1width,
      this.col2width,
    );
    if (
      this.id === InvalidEnum.MENU ||
      Menu.getInstances().length === LimitsEnum.MAX_MENUS
    ) {
      throw new Error(
        "[Menu]: The maximum number of menus allowed to be created has been reached 128",
      );
    }
    menuPool.set(this._id, this);
    return this;
  }
  destroy(): this {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot destroy before create");
    if (!INTERNAL_FLAGS.skip) {
      Menu.__inject__DestroyMenu(this.id);
    }
    menuPool.delete(this._id);
    this._id = InvalidEnum.MENU;
    return this;
  }
  addItem(column: number, title: string): this {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot addItem before create");
    if (this._itemCount === LimitsEnum.MAX_MENU_ROW)
      throw new Error(
        "[Menu]: The maximum number of items allowed to be added has been reached 12",
      );
    if (column !== 0 && column !== 1)
      throw new Error("[Menu]: Wrong number of columns");
    Menu.__inject__AddMenuItem(this.id, column, title);
    this._itemCount++;
    return this;
  }
  setColumnHeader(column: number, header: string): this {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot  setColumnHeader before create");
    if (column !== 0 && column !== 1)
      throw new Error("[Menu]: Wrong number of columns");
    Menu.__inject__SetMenuColumnHeader(this.id, column, header);
    return this;
  }
  disable(): this {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot disable menu before create");
    Menu.__inject__DisableMenu(this.id);
    return this;
  }
  disableRow(row: number) {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot disable row before create");
    if (row < 0 || row > this.itemCount - 1)
      throw new Error("[Menu]: Wrong number of rows");
    Menu.__inject__DisableMenuRow(this.id, row);
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.MENU) return true;
    return Menu.isValid(this.id);
  }
  showForPlayer(player: Player): number {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot show menu before create");
    return Menu.__inject__ShowMenuForPlayer(this.id, player.id);
  }
  hideForPlayer(player: Player): number {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot hide menu before create");
    return Menu.__inject__HideMenuForPlayer(this.id, player.id);
  }
  isDisabled(): boolean {
    if (this._id === InvalidEnum.MENU) return false;
    return Menu.__inject__IsMenuDisabled(this.id);
  }
  isRowDisabled(row: number): boolean {
    if (this._id === InvalidEnum.MENU) return false;
    if (row < 0 || row > this._itemCount) return false;
    return Menu.__inject__IsMenuRowDisabled(this.id, row);
  }
  getItems(column: number): number {
    if (this._id === InvalidEnum.MENU) return 0;
    return Menu.__inject__GetMenuItems(this.id, column);
  }
  getPos() {
    if (this._id === InvalidEnum.MENU) return { fX: this.x, fY: this.y };
    return Menu.__inject__GetMenuPos(this.id);
  }
  getColumnWidth() {
    if (this.id === InvalidEnum.MENU)
      return { fColumn1: this.col1width, fColumn2: this.col2width };
    return Menu.__inject__GetMenuColumnWidth(this.id);
  }
  getColumnHeader(column: number) {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot get column header before create");
    return Menu.__inject__GetMenuColumnHeader(this.id, column);
  }
  getItem(column: number, item: number) {
    if (this._id === InvalidEnum.MENU)
      throw new Error("[Menu]: Cannot get item before create");
    if (item < 0 || item > this.getItems(column) - 1)
      throw new Error("[Menu]: invalid getItem range");
    return Menu.__inject__GetMenuItem(this.id, column, item);
  }
  static isValid(menuId: number) {
    return Menu.__inject__IsValidMenu(menuId);
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

  static __inject__CreateMenu = w.CreateMenu;
  static __inject__DestroyMenu = w.DestroyMenu;
  static __inject__AddMenuItem = w.AddMenuItem;
  static __inject__SetMenuColumnHeader = w.SetMenuColumnHeader;
  static __inject__DisableMenu = w.DisableMenu;
  static __inject__DisableMenuRow = w.DisableMenuRow;
  static __inject__IsValidMenu = w.IsValidMenu;
  static __inject__ShowMenuForPlayer = w.ShowMenuForPlayer;
  static __inject__HideMenuForPlayer = w.HideMenuForPlayer;
  static __inject__IsMenuDisabled = w.IsMenuDisabled;
  static __inject__IsMenuRowDisabled = w.IsMenuRowDisabled;
  static __inject__GetMenuItems = w.GetMenuItems;
  static __inject__GetMenuPos = w.GetMenuPos;
  static __inject__GetMenuColumnWidth = w.GetMenuColumnWidth;
  static __inject__GetMenuColumnHeader = w.GetMenuColumnHeader;
  static __inject__GetMenuItem = w.GetMenuItem;
  static __inject__GetPlayerMenu = w.GetPlayerMenu;
}
