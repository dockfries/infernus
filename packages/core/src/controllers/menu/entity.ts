import * as w from "core/wrapper/native";

import type { Player } from "../player";
import { LimitsEnum } from "../../enums";
import { logger } from "../../logger";

export class Menu {
  private static readonly menus = new Map<number, Menu>();

  private _itemCount = 0;
  get itemCount() {
    return this._itemCount;
  }

  private _id = -1;
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
      logger.error(
        "[Menu]: The menu column number interval is between 1 and 2",
      );
      return;
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
  create(): void | this {
    if (this._id !== -1) return logger.error("[Menu]: Cannot be created twice");
    if (Menu.getInstances().length === LimitsEnum.MAX_MENUS) {
      return logger.error(
        "[Menu]: The maximum number of menus allowed to be created has been reached 128",
      );
    }
    this._id = w.CreateMenu(
      this.title,
      this.columns,
      this.x,
      this.y,
      this.col1width,
      this.col2width,
    );
    Menu.menus.set(this._id, this);
    return this;
  }
  destroy(): void | this {
    if (this._id === -1)
      return logger.error("[Menu]: Cannot destroy before create");
    w.DestroyMenu(this.id);
    Menu.menus.delete(this._id);
    this._id = -1;
    return this;
  }
  addItem(column: number, title: string): void | this {
    if (this._id === -1)
      return logger.error("[Menu]: Cannot addItem before create");
    if (this._itemCount === LimitsEnum.MAX_MENU_ROW)
      return logger.error(
        "[Menu]: The maximum number of items allowed to be added has been reached 12",
      );
    if (column !== 0 && column !== 1)
      return logger.error("[Menu]: Wrong number of columns");
    w.AddMenuItem(this.id, column, title);
    this._itemCount++;
    return this;
  }
  setColumnHeader(column: number, header: string): void | this {
    if (this._id === -1)
      return logger.error("[Menu]: Cannot  setColumnHeader before create");
    if (column !== 0 && column !== 1)
      return logger.error("[Menu]: Wrong number of columns");
    w.SetMenuColumnHeader(this.id, column, header);
    return this;
  }
  disable(): void | this {
    if (this._id === -1)
      return logger.error("[Menu]: Cannot disable menu before create");
    w.DisableMenu(this.id);
    return this;
  }
  disableRow(row: number) {
    if (this._id === -1)
      return logger.error("[Menu]: Cannot disable row before create");
    if (row < 0 || row > this.itemCount - 1)
      return logger.error("[Menu]: Wrong number of rows");
    w.DisableMenuRow(this.id, row);
  }
  isValid(): boolean {
    return w.IsValidMenu(this.id);
  }
  showForPlayer(player: Player): void | number {
    if (this._id === -1)
      return logger.error("[Menu]: Cannot show menu before create");
    return w.ShowMenuForPlayer(this.id, player.id);
  }
  hideForPlayer(player: Player): void | number {
    if (this._id === -1)
      return logger.error("[Menu]: Cannot hide menu before create");
    return w.HideMenuForPlayer(this.id, player.id);
  }
  isDisabled(): boolean {
    if (this._id === -1) return false;
    return w.IsMenuDisabled(this.id);
  }
  isRowDisabled(row: number): boolean {
    if (this._id === -1) return false;
    if (row < 0 || row > this._itemCount) return false;
    return w.IsMenuRowDisabled(this.id, row);
  }
  getItems(column: number): number {
    if (this._id === -1) return 0;
    return w.GetMenuItems(this.id, column);
  }
  getPos() {
    if (this._id === -1) return { fX: this.x, fY: this.y };
    return w.GetMenuPos(this.id);
  }
  getColumnWidth() {
    if (this.id === -1)
      return { fColumn1: this.col1width, fColumn2: this.col2width };
    return w.GetMenuColumnWidth(this.id);
  }
  getColumnHeader(column: number): void | string {
    if (this._id === -1)
      return logger.error("[Menu]: Cannot get column header before create");
    return w.GetMenuColumnHeader(this.id, column);
  }
  getItem(column: number, item: number): void | string {
    if (this._id === -1)
      return logger.error("[Menu]: Cannot get item before create");
    if (item < 0 || item > this.getItems(column) - 1) return undefined;
    return w.GetMenuItem(this.id, column, item);
  }

  static getInstance(id: number) {
    return this.menus.get(id);
  }
  static getInstances() {
    return [...this.menus.values()];
  }
  static getInstanceByPlayer(player: Player) {
    return this.getInstances().find(
      (item) => item.id === w.GetPlayerMenu(player.id),
    );
  }
}
