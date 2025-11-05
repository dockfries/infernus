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

export const orig_AddStaticVehicle = Vehicle.__inject__.AddStaticVehicle;
export const orig_AddStaticVehicleEx = Vehicle.__inject__.AddStaticVehicleEx;
export const orig_CreateVehicle = Vehicle.__inject__.CreateVehicle;
export const orig_DestroyVehicle = Vehicle.__inject__.DestroyVehicle;

export const orig_ShowPlayerDialog = Dialog.__inject__.ShowPlayerDialog;

export const orig_EnableStuntBonusForAll = GameMode.enableStuntBonusForAll;
export const orig_EnableVehicleFriendlyFire =
  GameMode.enableVehicleFriendlyFire;
export const orig_UsePlayerPedAnims = GameMode.usePlayerPedAnims;
export const orig_DisableInteriorEnterExits =
  GameMode.disableInteriorEnterExits;
export const orig_AddPlayerClass = GameMode.addPlayerClass;
export const orig_AddPlayerClassEx = GameMode.addPlayerClassEx;

export const orig_CreatePickup = Pickup.__inject__.CreatePickup;
export const orig_DestroyPickup = Pickup.__inject__.DestroyPickup;
export const orig_GetPickupModel = Pickup.__inject__.GetPickupModel;
export const orig_GetPickupType = Pickup.__inject__.GetPickupType;
export const orig_SetPickupPos = Pickup.__inject__.SetPickupPos;
export const orig_SetPickupModel = Pickup.__inject__.SetPickupModel;
export const orig_SetPickupType = Pickup.__inject__.SetPickupType;

export const orig_CreateDynamicPickup =
  DynamicPickup.__inject__.CreateDynamicPickup;
export const orig_CreateDynamicPickupEx =
  DynamicPickup.__inject__.CreateDynamicPickupEx;
export const orig_DestroyDynamicPickup =
  DynamicPickup.__inject__.DestroyDynamicPickup;
