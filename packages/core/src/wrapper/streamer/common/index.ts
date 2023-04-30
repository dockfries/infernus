import { Player } from "@/controllers/player";
import type { StreamerItemTypes } from "@infernus/streamer";
import {
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
} from "@infernus/streamer";

export class Streamer {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  static getTickRate = Streamer_GetTickRate;
  static setTickRate = Streamer_SetTickRate;
  static getPlayerTickRate<P extends Player>(player: P): number {
    return Streamer_GetPlayerTickRate(player.id);
  }
  static setPlayerTickRate<P extends Player>(player: P, rate = 50): number {
    return Streamer_SetPlayerTickRate(player.id, rate);
  }
  static toggleChunkStream = Streamer_ToggleChunkStream;
  static isToggleChunkStream = Streamer_IsToggleChunkStream;
  static getChunkTickRate<P extends Player>(
    type: StreamerItemTypes,
    player: number | P = -1
  ): number {
    if (player instanceof Player) {
      return Streamer_GetChunkTickRate(type, player.id);
    }
    return Streamer_GetChunkTickRate(type, player);
  }
  static setChunkTickRate<P extends Player>(
    type: StreamerItemTypes,
    rate: number,
    player: number | P = -1
  ): number {
    if (player instanceof Player) {
      return Streamer_SetChunkTickRate(type, rate, player.id);
    }
    return Streamer_SetChunkTickRate(type, rate, player);
  }
  static getChunkSize = Streamer_GetChunkSize;
  static setChunkSize = Streamer_SetChunkSize;
  static getMaxItems = Streamer_GetMaxItems;
  static setMaxItems = Streamer_SetMaxItems;
  static getVisibleItems<P extends Player>(
    type: StreamerItemTypes,
    player: number | P = -1
  ): number {
    if (player instanceof Player) {
      return Streamer_GetVisibleItems(type, player.id);
    }
    return Streamer_GetVisibleItems(type, player);
  }
  static setVisibleItems<P extends Player>(
    type: StreamerItemTypes,
    items: number,
    player: number | P = -1
  ): number {
    if (player instanceof Player) {
      return Streamer_SetVisibleItems(type, items, player.id);
    }
    return Streamer_SetVisibleItems(type, items, player);
  }
  static getRadiusMultiplier<P extends Player>(
    type: StreamerItemTypes,
    player: number | P = -1
  ): number {
    if (player instanceof Player) {
      return Streamer_GetRadiusMultiplier(type, player.id);
    }
    return Streamer_GetRadiusMultiplier(type, player);
  }
  static setRadiusMultiplier<P extends Player>(
    type: StreamerItemTypes,
    multiplier: number,
    player: number | P = -1
  ): number {
    if (player instanceof Player) {
      return Streamer_SetRadiusMultiplier(type, player.id);
    }
    return Streamer_SetRadiusMultiplier(type, multiplier, player);
  }
  static getTypePriority = Streamer_GetTypePriority;
  static setTypePriority = Streamer_SetTypePriority;
  static getCellDistance = Streamer_GetCellDistance;
  static setCellDistance = Streamer_SetCellDistance;
  static getCellSize = Streamer_GetCellSize;
  static setCellSize = Streamer_SetCellSize;
  static toggleItemStatic = Streamer_ToggleItemStatic;
  static isToggleItemStatic = Streamer_IsToggleItemStatic;
  static toggleItemInvAreas = Streamer_ToggleItemInvAreas;
  static isToggleItemInvAreas = Streamer_IsToggleItemInvAreas;
  static toggleItemCallbacks = Streamer_ToggleItemCallbacks;
  static isToggleItemCallbacks = Streamer_IsToggleItemCallbacks;
  static toggleErrorCallback = Streamer_ToggleErrorCallback;
  static isToggleErrorCallback = Streamer_IsToggleErrorCallback;
  static amxUnloadDestroyItems = Streamer_AmxUnloadDestroyItems;
  static processActiveItems = Streamer_ProcessActiveItems;
  static toggleIdleUpdate<P extends Player>(
    player: P,
    toggle: boolean
  ): number {
    return Streamer_ToggleIdleUpdate(player.id, toggle);
  }
  static isToggleIdleUpdate<P extends Player>(player: P): boolean {
    return Streamer_IsToggleIdleUpdate(player.id);
  }
  static toggleCameraUpdate<P extends Player>(
    player: P,
    toggle: boolean
  ): number {
    return Streamer_ToggleCameraUpdate(player.id, toggle);
  }
  static isToggleCameraUpdate<P extends Player>(player: P): boolean {
    return Streamer_IsToggleCameraUpdate(player.id);
  }
  static toggleItemUpdate<P extends Player>(
    player: P,
    type: StreamerItemTypes,
    toggle: boolean
  ): number {
    return Streamer_ToggleItemUpdate(player.id, type, toggle);
  }
  static isToggleItemUpdate<P extends Player>(
    player: P,
    type: StreamerItemTypes
  ): boolean {
    return Streamer_IsToggleItemUpdate(player.id, type);
  }
  static getLastUpdateTime(): number {
    return Streamer_GetLastUpdateTime();
  }
  static update<P extends Player>(
    player: P,
    type: StreamerItemTypes | -1 = -1
  ): number {
    return Streamer_Update(player.id, type);
  }
  static updateEx<P extends Player>(
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
  static getDistanceToItem = Streamer_GetDistanceToItem;
  static toggleItem<P extends Player>(
    player: P,
    type: StreamerItemTypes,
    id: number,
    toggle: boolean
  ): number {
    return Streamer_ToggleItem(player.id, type, id, toggle);
  }
  static isToggleItem<P extends Player>(
    player: P,
    type: StreamerItemTypes,
    id: number
  ): boolean {
    return Streamer_IsToggleItem(player.id, type, id);
  }
  static toggleAllItems<P extends Player>(
    player: P,
    type: StreamerItemTypes,
    toggle: boolean,
    exceptions: number[] = [-1]
  ): number {
    return Streamer_ToggleAllItems(player.id, type, toggle, exceptions);
  }
  static getItemInternalID<P extends Player>(
    player: P,
    type: StreamerItemTypes,
    streamerid: number
  ): number {
    return Streamer_GetItemInternalID(player.id, type, streamerid);
  }
  static getItemStreamerID<P extends Player>(
    player: P,
    type: StreamerItemTypes,
    internalid: number
  ): number {
    return Streamer_GetItemStreamerID(player.id, type, internalid);
  }
  static isItemVisible<P extends Player>(
    player: P,
    type: StreamerItemTypes,
    id: number
  ): boolean {
    return Streamer_IsItemVisible(player.id, type, id);
  }
  static destroyAllVisibleItems<P extends Player>(
    player: P,
    type: StreamerItemTypes,
    serverwide = 1
  ): number {
    return Streamer_DestroyAllVisibleItems(player.id, type, serverwide);
  }
  static countVisibleItems<P extends Player>(
    player: P,
    type: StreamerItemTypes,
    serverwide = 1
  ): number {
    return Streamer_CountVisibleItems(player.id, type, serverwide);
  }
  static destroyAllItems = Streamer_DestroyAllItems;
  static countItems = Streamer_CountItems;
  static getNearbyItems = Streamer_GetNearbyItems;
  static getAllVisibleItems<P extends Player>(
    player: P,
    type: StreamerItemTypes,
    items: number[]
  ): void {
    Streamer_GetAllVisibleItems(player.id, type, items);
  }
  static getItemPos = Streamer_GetItemPos;
  static setItemPos = Streamer_SetItemPos;
  static getItemOffset = Streamer_GetItemOffset;
  static setItemOffset = Streamer_SetItemOffset;
  static getFloatData = Streamer_GetFloatData;
  static setFloatData = Streamer_SetFloatData;
  static getIntData = Streamer_GetIntData;
  static setIntData = Streamer_SetIntData;
  static getArrayData = Streamer_GetArrayData;
  static setArrayData = Streamer_SetArrayData;
  static isInArrayData = Streamer_IsInArrayData;
  static appendArrayData = Streamer_AppendArrayData;
  static removeArrayData = Streamer_RemoveArrayData;
  static getArrayDataLength = Streamer_GetArrayDataLength;
  static getUpperBound = Streamer_GetUpperBound;
  static onItemStreamIn = Streamer_OnItemStreamIn;
  static onItemStreamOut = Streamer_OnItemStreamOut;
  static onPluginError = Streamer_OnPluginError;
}
