import { LimitsEnum } from "@/enums";
import { logger } from "@/logger";
import * as fns from "@/wrapper/functions";
import * as ow from "omp-wrapper";
import { BasePlayer } from "../player";
import { menuBus, menuHooks } from "./menuBus";

export class BaseMenu {
  private static menuCount = 0;
  private _id = -1;
  private _itemCount = 0;
  public get itemCount() {
    return this._itemCount;
  }
  public get id() {
    return this._id;
  }
  private _title: string;
  public get title(): string {
    return this._title;
  }
  public set title(value: string) {
    this._title = value;
  }
  private _columns = 1;
  public get columns(): number {
    return this._columns;
  }
  public set columns(value: number) {
    if (value !== 1 && value !== 2) {
      logger.error(
        "[BaseMenu]: The menu column number interval is between 1 and 2"
      );
      return;
    }
    this._columns = value;
  }
  private _x: number;
  public get x(): number {
    return this._x;
  }
  public set x(value: number) {
    this._x = value;
  }
  private _y: number;
  public get y(): number {
    return this._y;
  }
  public set y(value: number) {
    this._y = value;
  }
  private _col1width: number;
  public get col1width(): number {
    return this._col1width;
  }
  public set col1width(value: number) {
    this._col1width = value;
  }
  private _col2width: number;
  public get col2width(): number {
    return this._col2width;
  }
  public set col2width(value: number) {
    this._col2width = value;
  }

  public constructor(
    title: string,
    columns: number,
    x: number,
    y: number,
    col1width: number,
    col2width: number
  ) {
    this._title = title;
    this.columns = columns;
    this._x = x;
    this._y = y;
    this._col1width = col1width;
    this._col2width = col2width;
  }
  public create(): void | this {
    if (this._id !== -1)
      return logger.error("[BaseMenu]: Cannot be created twice");
    if (BaseMenu.menuCount === LimitsEnum.MAX_MENUS) {
      return logger.error(
        "[BaseMenu]: The maximum number of menus allowed to be created has been reached 128"
      );
    }
    this._id = fns.CreateMenu(
      this.title,
      this.columns,
      this.x,
      this.y,
      this.col1width,
      this.col2width
    );
    menuBus.emit(menuHooks.created, this);
    BaseMenu.menuCount++;
    return this;
  }
  public destroy(): void | this {
    if (this._id === -1)
      return logger.error("[BaseMenu]: Cannot destroy before create");
    fns.DestroyMenu(this.id);
    menuBus.emit(menuHooks.destroyed, this);
    return this;
  }
  public addItem(column: number, title: string): void | this {
    if (this._id === -1)
      return logger.error("[BaseMenu]: Cannot addItem before create");
    if (this._itemCount === LimitsEnum.MAX_MENU_ROW)
      return logger.error(
        "[BaseMenu]: The maximum number of items allowed to be added has been reached 12"
      );
    if (column !== 0 && column !== 1)
      return logger.error("[BaseMenu]: Wrong number of columns");
    fns.AddMenuItem(this.id, column, title);
    this._itemCount++;
    return this;
  }
  public setColumnHeader(column: number, header: string): void | this {
    if (this._id === -1)
      return logger.error("[BaseMenu]: Cannot  setColumnHeader before create");
    if (column !== 0 && column !== 1)
      return logger.error("[BaseMenu]: Wrong number of columns");
    fns.SetMenuColumnHeader(this.id, column, header);
    return this;
  }
  public disable(): void | this {
    if (this._id === -1)
      return logger.error("[BaseMenu]: Cannot disable menu before create");
    fns.DisableMenu(this.id);
    return this;
  }
  public disableRow(row: number) {
    if (this._id === -1)
      return logger.error("[BaseMenu]: Cannot disable row before create");
    if (row < 0 || row > this.itemCount - 1)
      return logger.error("[BaseMenu]: Wrong number of rows");
    fns.DisableMenuRow(this.id, row);
  }
  public isValid(): boolean {
    return fns.IsValidMenu(this.id);
  }
  public showForPlayer<P extends BasePlayer>(player: P): void | number {
    if (this._id === -1)
      return logger.error("[BaseMenu]: Cannot show menu before create");
    return fns.ShowMenuForPlayer(this.id, player.id);
  }
  public hideForPlayer<P extends BasePlayer>(player: P): void | number {
    if (this._id === -1)
      return logger.error("[BaseMenu]: Cannot hide menu before create");
    return fns.HideMenuForPlayer(this.id, player.id);
  }
  public static getMenu<M extends BaseMenu, P extends BasePlayer>(
    player: P,
    menus: Array<M>
  ): M | undefined {
    return menus.find((m) => m.id === fns.GetPlayerMenu(player.id));
  }
  public isDisabled(): boolean {
    if (this._id === -1) return false;
    return ow.IsMenuDisabled(this.id);
  }
  public isRowDisabled(row: number): boolean {
    if (this._id === -1) return false;
    if (row < 0 || row > this._itemCount) return false;
    return ow.IsMenuRowDisabled(this.id, row);
  }
  public getItems(column: number): number {
    if (this._id === -1) return 0;
    return ow.GetMenuItems(this.id, column);
  }
  public getPos() {
    if (this._id === -1) return { fX: this.x, fY: this.y };
    return ow.GetMenuPos(this.id);
  }
  public getColumnWidth() {
    if (this.id === -1)
      return { fColumn1: this.col1width, fColumn2: this.col2width };
    return ow.GetMenuColumnWidth(this.id);
  }
  public getColumnHeader(column: number): void | string {
    if (this._id === -1)
      return logger.error("[BaseMenu]: Cannot get column header before create");
    return ow.GetMenuColumnHeader(this.id, column);
  }
  public getItem(column: number, item: number): void | string {
    if (this._id === -1)
      return logger.error("[BaseMenu]: Cannot get item before create");
    if (item < 0 || item > this.getItems(column) - 1) return undefined;
    return ow.GetMenuItem(this.id, column, item);
  }
}
