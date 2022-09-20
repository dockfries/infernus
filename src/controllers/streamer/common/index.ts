import { BasePlayer } from "@/controllers/player";
import * as ows from "omp-wrapper-streamer";

export abstract class Streamer {
  constructor() {
    ows.Streamer_OnItemStreamIn(this.onItemStreamIn);
    ows.Streamer_OnItemStreamOut(this.onItemStreamOut);
    ows.Streamer_OnPluginError(this.onPluginError);
  }
  public static getTickRate = ows.Streamer_GetTickRate;
  public static setTickRate = ows.Streamer_SetTickRate;
  public static getPlayerTickRate<P extends BasePlayer>(player: P): number {
    return ows.Streamer_GetPlayerTickRate(player.id);
  }
  public static setPlayerTickRate<P extends BasePlayer>(
    player: P,
    rate = 50
  ): number {
    return ows.Streamer_SetPlayerTickRate(player.id, rate);
  }
  public static toggleChunkStream = ows.Streamer_ToggleChunkStream;
  public static isToggleChunkStream = ows.Streamer_IsToggleChunkStream;
  public static getChunkTickRate<P extends BasePlayer>(
    type: ows.StreamerItemTypes,
    player: number | P = -1
  ): number {
    if (player instanceof BasePlayer) {
      return ows.Streamer_GetChunkTickRate(type, player.id);
    }
    return ows.Streamer_GetChunkTickRate(type, player);
  }
  public static setChunkTickRate<P extends BasePlayer>(
    type: ows.StreamerItemTypes,
    rate: number,
    player: number | P = -1
  ): number {
    if (player instanceof BasePlayer) {
      return ows.Streamer_SetChunkTickRate(type, rate, player.id);
    }
    return ows.Streamer_SetChunkTickRate(type, rate, player);
  }
  public static getChunkSize = ows.Streamer_GetChunkSize;
  public static setChunkSize = ows.Streamer_SetChunkSize;
  public static getMaxItems = ows.Streamer_GetMaxItems;
  public static setMaxItems = ows.Streamer_SetMaxItems;
  public static getVisibleItems<P extends BasePlayer>(
    type: ows.StreamerItemTypes,
    player: number | P = -1
  ): number {
    if (player instanceof BasePlayer) {
      return ows.Streamer_GetVisibleItems(type, player.id);
    }
    return ows.Streamer_GetVisibleItems(type, player);
  }
  public static setVisibleItems<P extends BasePlayer>(
    type: ows.StreamerItemTypes,
    items: number,
    player: number | P = -1
  ): number {
    if (player instanceof BasePlayer) {
      return ows.Streamer_SetVisibleItems(type, items, player.id);
    }
    return ows.Streamer_SetVisibleItems(type, items, player);
  }
  public static getRadiusMultiplier<P extends BasePlayer>(
    type: ows.StreamerItemTypes,
    player: number | P = -1
  ): number {
    if (player instanceof BasePlayer) {
      return ows.Streamer_GetRadiusMultiplier(type, player.id);
    }
    return ows.Streamer_GetRadiusMultiplier(type, player);
  }
  public static setRadiusMultiplier<P extends BasePlayer>(
    type: ows.StreamerItemTypes,
    multiplier: number,
    player: number | P = -1
  ): number {
    if (player instanceof BasePlayer) {
      return ows.Streamer_SetRadiusMultiplier(type, player.id);
    }
    return ows.Streamer_SetRadiusMultiplier(type, multiplier, player);
  }
  public static getTypePriority = ows.Streamer_GetTypePriority;
  public static setTypePriority = ows.Streamer_SetTypePriority;
  public static getCellDistance = ows.Streamer_GetCellDistance;
  public static setCellDistance = ows.Streamer_SetCellDistance;
  public static getCellSize = ows.Streamer_GetCellSize;
  public static setCellSize = ows.Streamer_SetCellSize;
  public static toggleItemStatic = ows.Streamer_ToggleItemStatic;
  public static isToggleItemStatic = ows.Streamer_IsToggleItemStatic;
  public static toggleItemInvAreas = ows.Streamer_ToggleItemInvAreas;
  public static isToggleItemInvAreas = ows.Streamer_IsToggleItemInvAreas;
  public static toggleItemCallbacks = ows.Streamer_ToggleItemCallbacks;
  public static isToggleItemCallbacks = ows.Streamer_IsToggleItemCallbacks;
  public static toggleErrorCallback = ows.Streamer_ToggleErrorCallback;
  public static isToggleErrorCallback = ows.Streamer_IsToggleErrorCallback;
  public static amxUnloadDestroyItems = ows.Streamer_AmxUnloadDestroyItems;
  public static processActiveItems = ows.Streamer_ProcessActiveItems;
  public static toggleIdleUpdate<P extends BasePlayer>(
    player: P,
    toggle: boolean
  ): number {
    return ows.Streamer_ToggleIdleUpdate(player.id, toggle);
  }
  public static isToggleIdleUpdate<P extends BasePlayer>(player: P): boolean {
    return ows.Streamer_IsToggleIdleUpdate(player.id);
  }
  public static toggleCameraUpdate<P extends BasePlayer>(
    player: P,
    toggle: boolean
  ): number {
    return ows.Streamer_ToggleCameraUpdate(player.id, toggle);
  }
  public static isToggleCameraUpdate<P extends BasePlayer>(player: P): boolean {
    return ows.Streamer_IsToggleCameraUpdate(player.id);
  }
  public static toggleItemUpdate<P extends BasePlayer>(
    player: P,
    type: ows.StreamerItemTypes,
    toggle: boolean
  ): number {
    return ows.Streamer_ToggleItemUpdate(player.id, type, toggle);
  }
  public static isToggleItemUpdate<P extends BasePlayer>(
    player: P,
    type: ows.StreamerItemTypes
  ): boolean {
    return ows.Streamer_IsToggleItemUpdate(player.id, type);
  }
  public static getLastUpdateTime(): number {
    return ows.Streamer_GetLastUpdateTime();
  }
  public static update<P extends BasePlayer>(
    player: P,
    type: ows.StreamerItemTypes | -1 = -1
  ): number {
    return ows.Streamer_Update(player.id, type);
  }
  public static updateEx<P extends BasePlayer>(
    player: P,
    x: number,
    y: number,
    z: number,
    worldid?: number,
    interiorid?: number,
    type?: ows.StreamerItemTypes | -1,
    compensatedtime?: number,
    freezeplayer?: boolean
  ): number {
    return ows.Streamer_UpdateEx(
      player.id,
      x,
      y,
      z,
      worldid,
      interiorid,
      type,
      compensatedtime,
      freezeplayer
    );
  }
  public static getDistanceToItem = ows.Streamer_GetDistanceToItem;
  public static toggleItem<P extends BasePlayer>(
    player: P,
    type: ows.StreamerItemTypes,
    id: number,
    toggle: boolean
  ): number {
    return ows.Streamer_ToggleItem(player.id, type, id, toggle);
  }
  public static isToggleItem<P extends BasePlayer>(
    player: P,
    type: ows.StreamerItemTypes,
    id: number
  ): boolean {
    return ows.Streamer_IsToggleItem(player.id, type, id);
  }
  public static toggleAllItems<P extends BasePlayer>(
    player: P,
    type: ows.StreamerItemTypes,
    toggle: boolean,
    exceptions: number[] = [-1]
  ): number {
    return ows.Streamer_ToggleAllItems(player.id, type, toggle, exceptions);
  }
  public static getItemInternalID<P extends BasePlayer>(
    player: P,
    type: ows.StreamerItemTypes,
    streamerid: number
  ): number {
    return ows.Streamer_GetItemInternalID(player.id, type, streamerid);
  }
  public static getItemStreamerID<P extends BasePlayer>(
    player: P,
    type: ows.StreamerItemTypes,
    internalid: number
  ): number {
    return ows.Streamer_GetItemStreamerID(player.id, type, internalid);
  }
  public static isItemVisible<P extends BasePlayer>(
    player: P,
    type: ows.StreamerItemTypes,
    id: number
  ): boolean {
    return ows.Streamer_IsItemVisible(player.id, type, id);
  }
  public static destroyAllVisibleItems<P extends BasePlayer>(
    player: P,
    type: ows.StreamerItemTypes,
    serverwide = 1
  ): number {
    return ows.Streamer_DestroyAllVisibleItems(player.id, type, serverwide);
  }
  public static countVisibleItems<P extends BasePlayer>(
    player: P,
    type: ows.StreamerItemTypes,
    serverwide = 1
  ): number {
    return ows.Streamer_CountVisibleItems(player.id, type, serverwide);
  }
  public static destroyAllItems = ows.Streamer_DestroyAllItems;
  public static countItems = ows.Streamer_CountItems;
  public static getNearbyItems = ows.Streamer_GetNearbyItems;
  public static getAllVisibleItems<P extends BasePlayer>(
    player: P,
    type: ows.StreamerItemTypes,
    items: number[]
  ): void {
    ows.Streamer_GetAllVisibleItems(player.id, type, items);
  }
  public static getItemPos = ows.Streamer_GetItemPos;
  public static setItemPos = ows.Streamer_SetItemPos;
  public static getItemOffset = ows.Streamer_GetItemOffset;
  public static setItemOffset = ows.Streamer_SetItemOffset;
  public static getFloatData = ows.Streamer_GetFloatData;
  public static setFloatData = ows.Streamer_SetFloatData;
  public static getIntData = ows.Streamer_GetIntData;
  public static setIntData = ows.Streamer_SetIntData;
  public static getArrayData = ows.Streamer_GetArrayData;
  public static setArrayData = ows.Streamer_SetArrayData;
  public static isInArrayData = ows.Streamer_IsInArrayData;
  public static appendArrayData = ows.Streamer_AppendArrayData;
  public static removeArrayData = ows.Streamer_RemoveArrayData;
  public static getArrayDataLength = ows.Streamer_GetArrayDataLength;
  public static getUpperBound = ows.Streamer_GetUpperBound;

  public abstract onItemStreamIn(
    type: ows.StreamerItemTypes,
    id: number,
    forplayerid: number
  ): number;
  public abstract onItemStreamOut(
    type: ows.StreamerItemTypes,
    id: number,
    forplayerid: number
  ): number;
  public abstract onPluginError(error: string): number;
}
