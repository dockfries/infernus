import { defineHooks, Player, Vehicle } from "@infernus/core";

export const [orig_pMethods, setPlayerHook] = defineHooks(Player);

export const badGetPlayerDistanceFromPoint = orig_pMethods.getDistanceFromPoint;
export const badIsPlayerInRangeOfPoint = orig_pMethods.isInRangeOfPoint;

export const [orig_vMethods, setVehicleHook] = defineHooks(Vehicle);

export const badGetVehicleDistanceFromPoint =
  orig_vMethods.getDistanceFromPoint;
