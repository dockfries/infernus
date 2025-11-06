import {
  defineHooks,
  Dialog,
  DynamicPickup,
  GameMode,
  Pickup,
  Player,
  Streamer,
  Vehicle,
} from "@infernus/core";

export const [orig_playerMethods, setPlayerHook] = defineHooks(Player);
export const [orig_vehicleMethods, setVehicleHook] = defineHooks(Vehicle);

export const orig_StreamerUpdate = Streamer.update;
export const orig_StreamerUpdateEx = Streamer.updateEx;

export const orig_AddStaticVehicle = Vehicle.__inject__.addStatic;
export const orig_AddStaticVehicleEx = Vehicle.__inject__.addStaticEx;
export const orig_CreateVehicle = Vehicle.__inject__.create;
export const orig_DestroyVehicle = Vehicle.__inject__.destroy;

export const orig_ShowPlayerDialog = Dialog.__inject__.show;

export const orig_EnableStuntBonusForAll = GameMode.enableStuntBonusForAll;
export const orig_EnableVehicleFriendlyFire =
  GameMode.enableVehicleFriendlyFire;
export const orig_UsePlayerPedAnims = GameMode.usePlayerPedAnims;
export const orig_DisableInteriorEnterExits =
  GameMode.disableInteriorEnterExits;
export const orig_AddPlayerClass = GameMode.addPlayerClass;
export const orig_AddPlayerClassEx = GameMode.addPlayerClassEx;

export const orig_CreatePickup = Pickup.__inject__.create;
export const orig_DestroyPickup = Pickup.__inject__.destroy;
export const orig_GetPickupModel = Pickup.__inject__.getModel;
export const orig_GetPickupType = Pickup.__inject__.getType;
export const orig_SetPickupPos = Pickup.__inject__.setPos;
export const orig_SetPickupModel = Pickup.__inject__.setModel;
export const orig_SetPickupType = Pickup.__inject__.setType;

export const orig_CreateDynamicPickup = DynamicPickup.__inject__.create;
export const orig_CreateDynamicPickupEx = DynamicPickup.__inject__.createEx;
export const orig_DestroyDynamicPickup = DynamicPickup.__inject__.destroy;
