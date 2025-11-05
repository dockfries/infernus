import { Player } from "core/components/player";
import type { StreamerItemTypes } from "@infernus/streamer";
import * as s from "@infernus/streamer";
import { onPluginError } from "../callbacks";

export class Streamer {
  private constructor() {
    throw new Error("This is a static class and cannot be instantiated.");
  }
  static getTickRate = s.Streamer_GetTickRate;
  static setTickRate = s.Streamer_SetTickRate;
  static getPlayerTickRate(player: Player): number {
    return s.Streamer_GetPlayerTickRate(player.id);
  }
  static setPlayerTickRate(player: Player, rate = 50): number {
    return s.Streamer_SetPlayerTickRate(player.id, rate);
  }
  static toggleChunkStream = s.Streamer_ToggleChunkStream;
  static isToggleChunkStream = s.Streamer_IsToggleChunkStream;
  static getChunkTickRate(
    type: StreamerItemTypes,
    player: number | Player = -1,
  ): number {
    if (player instanceof Player) {
      return s.Streamer_GetChunkTickRate(type, player.id);
    }
    return s.Streamer_GetChunkTickRate(type, player);
  }
  static setChunkTickRate(
    type: StreamerItemTypes,
    rate: number,
    player: number | Player = -1,
  ): number {
    if (player instanceof Player) {
      return s.Streamer_SetChunkTickRate(type, rate, player.id);
    }
    return s.Streamer_SetChunkTickRate(type, rate, player);
  }
  static getChunkSize = s.Streamer_GetChunkSize;
  static setChunkSize = s.Streamer_SetChunkSize;
  static getMaxItems = s.Streamer_GetMaxItems;
  static setMaxItems = s.Streamer_SetMaxItems;
  static getVisibleItems(
    type: StreamerItemTypes,
    player: number | Player = -1,
  ): number {
    if (player instanceof Player) {
      return s.Streamer_GetVisibleItems(type, player.id);
    }
    return s.Streamer_GetVisibleItems(type, player);
  }
  static setVisibleItems(
    type: StreamerItemTypes,
    items: number,
    player: number | Player = -1,
  ): number {
    if (player instanceof Player) {
      return s.Streamer_SetVisibleItems(type, items, player.id);
    }
    return s.Streamer_SetVisibleItems(type, items, player);
  }
  static getRadiusMultiplier(
    type: StreamerItemTypes,
    player: number | Player = -1,
  ) {
    if (player instanceof Player) {
      return s.Streamer_GetRadiusMultiplier(type, player.id);
    }
    return s.Streamer_GetRadiusMultiplier(type, player);
  }
  static setRadiusMultiplier(
    type: StreamerItemTypes,
    multiplier: number,
    player: number | Player = -1,
  ): number {
    if (player instanceof Player) {
      return s.Streamer_SetRadiusMultiplier(type, multiplier, player.id);
    }
    return s.Streamer_SetRadiusMultiplier(type, multiplier, player);
  }
  static getTypePriority = s.Streamer_GetTypePriority;
  static setTypePriority = s.Streamer_SetTypePriority;
  static getCellDistance = s.Streamer_GetCellDistance;
  static setCellDistance = s.Streamer_SetCellDistance;
  static getCellSize = s.Streamer_GetCellSize;
  static setCellSize = s.Streamer_SetCellSize;
  static toggleItemStatic = s.Streamer_ToggleItemStatic;
  static isToggleItemStatic = s.Streamer_IsToggleItemStatic;
  static toggleItemInvAreas = s.Streamer_ToggleItemInvAreas;
  static isToggleItemInvAreas = s.Streamer_IsToggleItemInvAreas;
  static toggleItemCallbacks = s.Streamer_ToggleItemCallbacks;
  static isToggleItemCallbacks = s.Streamer_IsToggleItemCallbacks;
  static toggleErrorCallback = s.Streamer_ToggleErrorCallback;
  static isToggleErrorCallback = s.Streamer_IsToggleErrorCallback;
  static amxUnloadDestroyItems = s.Streamer_AmxUnloadDestroyItems;
  static processActiveItems = s.Streamer_ProcessActiveItems;
  static toggleIdleUpdate(player: Player, toggle: boolean): number {
    return s.Streamer_ToggleIdleUpdate(player.id, toggle);
  }
  static isToggleIdleUpdate(player: Player): boolean {
    return s.Streamer_IsToggleIdleUpdate(player.id);
  }
  static toggleCameraUpdate(player: Player, toggle: boolean): number {
    return s.Streamer_ToggleCameraUpdate(player.id, toggle);
  }
  static isToggleCameraUpdate(player: Player): boolean {
    return s.Streamer_IsToggleCameraUpdate(player.id);
  }
  static toggleItemUpdate(
    player: Player,
    type: StreamerItemTypes,
    toggle: boolean,
  ): number {
    return s.Streamer_ToggleItemUpdate(player.id, type, toggle);
  }
  static isToggleItemUpdate(player: Player, type: StreamerItemTypes): boolean {
    return s.Streamer_IsToggleItemUpdate(player.id, type);
  }
  static getLastUpdateTime() {
    return s.Streamer_GetLastUpdateTime();
  }
  static update(player: Player, type: StreamerItemTypes | -1 = -1): number {
    return s.Streamer_Update(player.id, type);
  }
  static updateEx(
    player: Player,
    x: number,
    y: number,
    z: number,
    worldId?: number,
    interiorId?: number,
    type?: StreamerItemTypes | -1,
    compensatedTime?: number,
    freezePlayer?: boolean,
  ): number {
    return s.Streamer_UpdateEx(
      player.id,
      x,
      y,
      z,
      worldId,
      interiorId,
      type,
      compensatedTime,
      freezePlayer,
    );
  }
  static getDistanceToItem = s.Streamer_GetDistanceToItem;
  static toggleItem(
    player: Player,
    type: StreamerItemTypes,
    id: number,
    toggle: boolean,
  ): number {
    return s.Streamer_ToggleItem(player.id, type, id, toggle);
  }
  static isToggleItem(
    player: Player,
    type: StreamerItemTypes,
    id: number,
  ): boolean {
    return s.Streamer_IsToggleItem(player.id, type, id);
  }
  static toggleAllItems(
    player: Player,
    type: StreamerItemTypes,
    toggle: boolean,
    exceptions: number[] = [-1],
  ): number {
    return s.Streamer_ToggleAllItems(player.id, type, toggle, exceptions);
  }
  static getItemInternalID(
    player: Player,
    type: StreamerItemTypes,
    streamerId: number,
  ): number {
    return s.Streamer_GetItemInternalID(player.id, type, streamerId);
  }
  static getItemStreamerID(
    player: Player,
    type: StreamerItemTypes,
    internalId: number,
  ): number {
    return s.Streamer_GetItemStreamerID(player.id, type, internalId);
  }
  static isItemVisible(
    player: Player,
    type: StreamerItemTypes,
    id: number,
  ): boolean {
    return s.Streamer_IsItemVisible(player.id, type, id);
  }
  static destroyAllVisibleItems(
    player: Player,
    type: StreamerItemTypes,
    serverWide = 1,
  ): number {
    return s.Streamer_DestroyAllVisibleItems(player.id, type, serverWide);
  }
  static countVisibleItems(
    player: Player,
    type: StreamerItemTypes,
    serverWide = 1,
  ): number {
    return s.Streamer_CountVisibleItems(player.id, type, serverWide);
  }
  static destroyAllItems = s.Streamer_DestroyAllItems;
  static countItems = s.Streamer_CountItems;
  static getNearbyItems = s.Streamer_GetNearbyItems;
  static getAllVisibleItems(
    player: Player,
    type: StreamerItemTypes,
    maxItems?: number,
  ) {
    return s.Streamer_GetAllVisibleItems(player.id, type, maxItems);
  }
  static getItemPos = s.Streamer_GetItemPos;
  static setItemPos = s.Streamer_SetItemPos;
  static getItemOffset = s.Streamer_GetItemOffset;
  static setItemOffset = s.Streamer_SetItemOffset;
  static getFloatData = s.Streamer_GetFloatData;
  static setFloatData = s.Streamer_SetFloatData;
  static getIntData = s.Streamer_GetIntData;
  static setIntData = s.Streamer_SetIntData;
  static getArrayData = s.Streamer_GetArrayData;
  static setArrayData = s.Streamer_SetArrayData;
  static isInArrayData = s.Streamer_IsInArrayData;
  static appendArrayData = s.Streamer_AppendArrayData;
  static removeArrayData = s.Streamer_RemoveArrayData;
  static getArrayDataLength = s.Streamer_GetArrayDataLength;
  static getUpperBound = s.Streamer_GetUpperBound;
  static onPluginError = onPluginError;
}
