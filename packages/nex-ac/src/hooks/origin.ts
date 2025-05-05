import {
  defineHooks,
  Dialog,
  DynamicPickup,
  GameMode,
  Player,
  Streamer,
  Vehicle,
} from "@infernus/core";

export const [orig_playerMethods, setPlayerHook] = defineHooks(Player);
export const [orig_vehicleMethods, setVehicleHook] = defineHooks(Vehicle);
export const [orig_pickMethods, setDynamicPickupHook] =
  defineHooks(DynamicPickup);

export const orig_StreamerUpdate = Streamer.update;
export const orig_StreamerUpdateEx = Streamer.updateEx;

export const orig_AddStaticVehicle = Vehicle.__inject_AddStaticVehicle;
export const orig_AddStaticVehicleEx = Vehicle.__inject_AddStaticVehicleEx;
export const orig_CreateVehicle = Vehicle.__inject_CreateVehicle;
export const orig_DestroyVehicle = Vehicle.__inject_DestroyVehicle;

export const orig_ShowPlayerDialog = Dialog.__inject__ShowPlayerDialog;

export const orig_EnableStuntBonusForAll = GameMode.enableStuntBonusForAll;
export const orig_EnableVehicleFriendlyFire =
  GameMode.enableVehicleFriendlyFire;
export const orig_UsePlayerPedAnims = GameMode.usePlayerPedAnims;
export const orig_DisableInteriorEnterExits =
  GameMode.disableInteriorEnterExits;
export const orig_AddPlayerClass = GameMode.addPlayerClass;
export const orig_AddPlayerClassEx = GameMode.addPlayerClassEx;

export const orig_CreateDynamicPickup =
  DynamicPickup.__inject_CreateDynamicPickup;
export const orig_CreateDynamicPickupEx =
  DynamicPickup.__inject_CreateDynamicPickupEx;
export const orig_DestroyDynamicPickup =
  DynamicPickup.__inject_DestroyDynamicPickup;
