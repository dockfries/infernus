import { BasePlayer } from "@/controllers/player";
import {
  StreamerItemTypes,
  Streamer_AmxUnloadDestroyItems,
  Streamer_AppendArrayData,
  Streamer_CountItems,
  Streamer_CountVisibleItems,
  Streamer_DestroyAllItems,
  Streamer_DestroyAllVisibleItems,
  Streamer_GetAllVisibleItems,
  Streamer_GetArrayData,
  Streamer_GetArrayDataLength,
  Streamer_GetCellDistance,
  Streamer_GetCellSize,
  Streamer_GetChunkSize,
  Streamer_GetChunkTickRate,
  Streamer_GetDistanceToItem,
  Streamer_GetFloatData,
  Streamer_GetIntData,
  Streamer_GetItemInternalID,
  Streamer_GetItemOffset,
  Streamer_GetItemPos,
  Streamer_GetItemStreamerID,
  Streamer_GetLastUpdateTime,
  Streamer_GetMaxItems,
  Streamer_GetNearbyItems,
  Streamer_GetPlayerTickRate,
  Streamer_GetRadiusMultiplier,
  Streamer_GetTickRate,
  Streamer_GetTypePriority,
  Streamer_GetUpperBound,
  Streamer_GetVisibleItems,
  Streamer_IsInArrayData,
  Streamer_IsItemVisible,
  Streamer_IsToggleCameraUpdate,
  Streamer_IsToggleChunkStream,
  Streamer_IsToggleErrorCallback,
  Streamer_IsToggleIdleUpdate,
  Streamer_IsToggleItem,
  Streamer_IsToggleItemCallbacks,
  Streamer_IsToggleItemInvAreas,
  Streamer_IsToggleItemStatic,
  Streamer_IsToggleItemUpdate,
  Streamer_OnItemStreamIn,
  Streamer_OnItemStreamOut,
  Streamer_OnPluginError,
  Streamer_ProcessActiveItems,
  Streamer_RemoveArrayData,
  Streamer_SetArrayData,
  Streamer_SetCellDistance,
  Streamer_SetCellSize,
  Streamer_SetChunkSize,
  Streamer_SetChunkTickRate,
  Streamer_SetFloatData,
  Streamer_SetIntData,
  Streamer_SetItemOffset,
  Streamer_SetItemPos,
  Streamer_SetMaxItems,
  Streamer_SetPlayerTickRate,
  Streamer_SetRadiusMultiplier,
  Streamer_SetTickRate,
  Streamer_SetTypePriority,
  Streamer_SetVisibleItems,
  Streamer_ToggleAllItems,
  Streamer_ToggleCameraUpdate,
  Streamer_ToggleChunkStream,
  Streamer_ToggleErrorCallback,
  Streamer_ToggleIdleUpdate,
  Streamer_ToggleItem,
  Streamer_ToggleItemCallbacks,
  Streamer_ToggleItemInvAreas,
  Streamer_ToggleItemStatic,
  Streamer_ToggleItemUpdate,
  Streamer_Update,
  Streamer_UpdateEx,
} from "omp-wrapper-streamer";

export abstract class Streamer {
  constructor() {
    Streamer_OnItemStreamIn(this.onItemStreamIn);
    Streamer_OnItemStreamOut(this.onItemStreamOut);
    Streamer_OnPluginError(this.onPluginError);
  }
  public static getTickRate = Streamer_GetTickRate;
  public static setTickRate = Streamer_SetTickRate;
  public static getPlayerTickRate<P extends BasePlayer>(player: P): number {
    return Streamer_GetPlayerTickRate(player.id);
  }
  public static setPlayerTickRate<P extends BasePlayer>(
    player: P,
    rate = 50
  ): number {
    return Streamer_SetPlayerTickRate(player.id, rate);
  }
  public static toggleChunkStream = Streamer_ToggleChunkStream;
  public static isToggleChunkStream = Streamer_IsToggleChunkStream;
  public static getChunkTickRate<P extends BasePlayer>(
    type: StreamerItemTypes,
    player: number | P = -1
  ): number {
    if (player instanceof BasePlayer) {
      return Streamer_GetChunkTickRate(type, player.id);
    }
    return Streamer_GetChunkTickRate(type, player);
  }
  public static setChunkTickRate<P extends BasePlayer>(
    type: StreamerItemTypes,
    rate: number,
    player: number | P = -1
  ): number {
    if (player instanceof BasePlayer) {
      return Streamer_SetChunkTickRate(type, rate, player.id);
    }
    return Streamer_SetChunkTickRate(type, rate, player);
  }
  public static getChunkSize = Streamer_GetChunkSize;
  public static setChunkSize = Streamer_SetChunkSize;
  public static getMaxItems = Streamer_GetMaxItems;
  public static setMaxItems = Streamer_SetMaxItems;
  public static getVisibleItems<P extends BasePlayer>(
    type: StreamerItemTypes,
    player: number | P = -1
  ): number {
    if (player instanceof BasePlayer) {
      return Streamer_GetVisibleItems(type, player.id);
    }
    return Streamer_GetVisibleItems(type, player);
  }
  public static setVisibleItems<P extends BasePlayer>(
    type: StreamerItemTypes,
    items: number,
    player: number | P = -1
  ): number {
    if (player instanceof BasePlayer) {
      return Streamer_SetVisibleItems(type, items, player.id);
    }
    return Streamer_SetVisibleItems(type, items, player);
  }
  public static getRadiusMultiplier<P extends BasePlayer>(
    type: StreamerItemTypes,
    player: number | P = -1
  ): number {
    if (player instanceof BasePlayer) {
      return Streamer_GetRadiusMultiplier(type, player.id);
    }
    return Streamer_GetRadiusMultiplier(type, player);
  }
  public static setRadiusMultiplier<P extends BasePlayer>(
    type: StreamerItemTypes,
    multiplier: number,
    player: number | P = -1
  ): number {
    if (player instanceof BasePlayer) {
      return Streamer_SetRadiusMultiplier(type, player.id);
    }
    return Streamer_SetRadiusMultiplier(type, multiplier, player);
  }
  public static getTypePriority = Streamer_GetTypePriority;
  public static setTypePriority = Streamer_SetTypePriority;
  public static getCellDistance = Streamer_GetCellDistance;
  public static setCellDistance = Streamer_SetCellDistance;
  public static getCellSize = Streamer_GetCellSize;
  public static setCellSize = Streamer_SetCellSize;
  public static toggleItemStatic = Streamer_ToggleItemStatic;
  public static isToggleItemStatic = Streamer_IsToggleItemStatic;
  public static toggleItemInvAreas = Streamer_ToggleItemInvAreas;
  public static isToggleItemInvAreas = Streamer_IsToggleItemInvAreas;
  public static toggleItemCallbacks = Streamer_ToggleItemCallbacks;
  public static isToggleItemCallbacks = Streamer_IsToggleItemCallbacks;
  public static toggleErrorCallback = Streamer_ToggleErrorCallback;
  public static isToggleErrorCallback = Streamer_IsToggleErrorCallback;
  public static amxUnloadDestroyItems = Streamer_AmxUnloadDestroyItems;
  public static processActiveItems = Streamer_ProcessActiveItems;
  public static toggleIdleUpdate<P extends BasePlayer>(
    player: P,
    toggle: boolean
  ): number {
    return Streamer_ToggleIdleUpdate(player.id, toggle);
  }
  public static isToggleIdleUpdate<P extends BasePlayer>(player: P): boolean {
    return Streamer_IsToggleIdleUpdate(player.id);
  }
  public static toggleCameraUpdate<P extends BasePlayer>(
    player: P,
    toggle: boolean
  ): number {
    return Streamer_ToggleCameraUpdate(player.id, toggle);
  }
  public static isToggleCameraUpdate<P extends BasePlayer>(player: P): boolean {
    return Streamer_IsToggleCameraUpdate(player.id);
  }
  public static toggleItemUpdate<P extends BasePlayer>(
    player: P,
    type: StreamerItemTypes,
    toggle: boolean
  ): number {
    return Streamer_ToggleItemUpdate(player.id, type, toggle);
  }
  public static isToggleItemUpdate<P extends BasePlayer>(
    player: P,
    type: StreamerItemTypes
  ): boolean {
    return Streamer_IsToggleItemUpdate(player.id, type);
  }
  public static getLastUpdateTime(): number {
    return Streamer_GetLastUpdateTime();
  }
  public static update<P extends BasePlayer>(
    player: P,
    type: StreamerItemTypes | -1 = -1
  ): number {
    return Streamer_Update(player.id, type);
  }
  public static updateEx<P extends BasePlayer>(
    player: P,
    x: number,
    y: number,
    z: number,
    worldid?: number,
    interiorid?: number,
    type?: StreamerItemTypes | -1,
    compensatedtime?: number,
    freezeplayer?: boolean
  ): number {
    return Streamer_UpdateEx(
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
  public static getDistanceToItem = Streamer_GetDistanceToItem;
  public static toggleItem<P extends BasePlayer>(
    player: P,
    type: StreamerItemTypes,
    id: number,
    toggle: boolean
  ): number {
    return Streamer_ToggleItem(player.id, type, id, toggle);
  }
  public static isToggleItem<P extends BasePlayer>(
    player: P,
    type: StreamerItemTypes,
    id: number
  ): boolean {
    return Streamer_IsToggleItem(player.id, type, id);
  }
  public static toggleAllItems<P extends BasePlayer>(
    player: P,
    type: StreamerItemTypes,
    toggle: boolean,
    exceptions: number[] = [-1]
  ): number {
    return Streamer_ToggleAllItems(player.id, type, toggle, exceptions);
  }
  public static getItemInternalID<P extends BasePlayer>(
    player: P,
    type: StreamerItemTypes,
    streamerid: number
  ): number {
    return Streamer_GetItemInternalID(player.id, type, streamerid);
  }
  public static getItemStreamerID<P extends BasePlayer>(
    player: P,
    type: StreamerItemTypes,
    internalid: number
  ): number {
    return Streamer_GetItemStreamerID(player.id, type, internalid);
  }
  public static isItemVisible<P extends BasePlayer>(
    player: P,
    type: StreamerItemTypes,
    id: number
  ): boolean {
    return Streamer_IsItemVisible(player.id, type, id);
  }
  public static destroyAllVisibleItems<P extends BasePlayer>(
    player: P,
    type: StreamerItemTypes,
    serverwide = 1
  ): number {
    return Streamer_DestroyAllVisibleItems(player.id, type, serverwide);
  }
  public static countVisibleItems<P extends BasePlayer>(
    player: P,
    type: StreamerItemTypes,
    serverwide = 1
  ): number {
    return Streamer_CountVisibleItems(player.id, type, serverwide);
  }
  public static destroyAllItems = Streamer_DestroyAllItems;
  public static countItems = Streamer_CountItems;
  public static getNearbyItems = Streamer_GetNearbyItems;
  public static getAllVisibleItems<P extends BasePlayer>(
    player: P,
    type: StreamerItemTypes,
    items: number[]
  ): void {
    Streamer_GetAllVisibleItems(player.id, type, items);
  }
  public static getItemPos = Streamer_GetItemPos;
  public static setItemPos = Streamer_SetItemPos;
  public static getItemOffset = Streamer_GetItemOffset;
  public static setItemOffset = Streamer_SetItemOffset;
  public static getFloatData = Streamer_GetFloatData;
  public static setFloatData = Streamer_SetFloatData;
  public static getIntData = Streamer_GetIntData;
  public static setIntData = Streamer_SetIntData;
  public static getArrayData = Streamer_GetArrayData;
  public static setArrayData = Streamer_SetArrayData;
  public static isInArrayData = Streamer_IsInArrayData;
  public static appendArrayData = Streamer_AppendArrayData;
  public static removeArrayData = Streamer_RemoveArrayData;
  public static getArrayDataLength = Streamer_GetArrayDataLength;
  public static getUpperBound = Streamer_GetUpperBound;

  protected abstract onItemStreamIn(
    type: StreamerItemTypes,
    id: number,
    forplayerid: number
  ): number;
  protected abstract onItemStreamOut(
    type: StreamerItemTypes,
    id: number,
    forplayerid: number
  ): number;
  protected abstract onPluginError(error: string): number;
}
