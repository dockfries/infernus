import { LimitsEnum } from "@/enums";
import { logger } from "@/logger";
import {
  AddMenuItem,
  CreateMenu,
  DestroyMenu,
  DisableMenu,
  DisableMenuRow,
  ShowMenuForPlayer,
  HideMenuForPlayer,
  IsValidMenu,
  SetMenuColumnHeader,
  GetPlayerMenu,
} from "@/wrapper/functions";
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
    this._id = CreateMenu(
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
    if (this._id === -1 || !IsValidMenu(this.id))
      return logger.error("[BaseMenu]: Cannot destroy before create");
    DestroyMenu(this.id);
    menuBus.emit(menuHooks.destroyed, this);
    return this;
  }
  public addItem(column: number, title: string): void | this {
    if (this._id === -1 || !IsValidMenu(this.id))
      return logger.error("[BaseMenu]: Cannot addItem before create");
    if (this._itemCount === LimitsEnum.MAX_MENU_ROW)
      return logger.error(
        "[BaseMenu]: The maximum number of items allowed to be added has been reached 12"
      );
    if (column !== 0 && column !== 1)
      return logger.error("[BaseMenu]: Wrong number of columns");
    AddMenuItem(this.id, column, title);
    this._itemCount++;
    return this;
  }
  public setColumnHeader(column: number, header: string): void | this {
    if (this._id === -1 || !IsValidMenu(this.id))
      return logger.error("[BaseMenu]: Cannot  setColumnHeader before create");
    if (column !== 0 && column !== 1)
      return logger.error("[BaseMenu]: Wrong number of columns");
    SetMenuColumnHeader(this.id, column, header);
    return this;
  }
  public disable(): void | this {
    if (this._id === -1 || !IsValidMenu(this.id))
      return logger.error("[BaseMenu]: Cannot disable menu before create");
    DisableMenu(this.id);
    return this;
  }
  public disableRow(row: number) {
    if (this._id === -1 || !IsValidMenu(this.id))
      return logger.error("[BaseMenu]: Cannot disable row before create");
    if (row < 0 || row > this.itemCount - 1)
      return logger.error("[BaseMenu]: Wrong number of rows");
    DisableMenuRow(this.id, row);
  }
  public static isValid<M extends BaseMenu>(menu: M): boolean {
    return IsValidMenu(menu.id);
  }
  public isValid(): boolean {
    return IsValidMenu(this.id);
  }
  public showForPlayer<P extends BasePlayer>(player: P) {
    if (this._id === -1 || !IsValidMenu(this.id))
      return logger.error("[BaseMenu]: Cannot show menu before create");
    return ShowMenuForPlayer(this.id, player.id);
  }
  public hideForPlayer<P extends BasePlayer>(player: P) {
    if (this._id === -1 || !IsValidMenu(this.id))
      return logger.error("[BaseMenu]: Cannot hide menu before create");
    return HideMenuForPlayer(this.id, player.id);
  }
  public static getMenu<M extends BaseMenu, P extends BasePlayer>(
    player: P,
    menus: Array<M>
  ): M | undefined {
    return menus.find((m) => m.id === GetPlayerMenu(player.id));
  }
}
