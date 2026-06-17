import { DynamicObject, KeysEnum } from "@infernus/core";

export const POSITION_FLAG_AIR = 4;
export const POSITION_FLAG_GROUND = 8;

export const vehicleConfigParachute = new Set<number>();
export const vehicleParachuteObject = new Map<number, (DynamicObject | undefined)[]>();
export const playerUsingVehPara = new Set<number>();

export const vehParaConfig = {
  key: KeysEnum.CROUCH,
};
