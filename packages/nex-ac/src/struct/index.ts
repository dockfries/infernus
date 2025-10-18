import { VehicleParamsEnum } from "@infernus/core";
import { ac_ACAllow, ac_Mtfc, ac_NOPAllow } from "../constants";
import { SafetyMap } from "shared/utils/safetyMap";

export class ACInfoStruct {
  acPosX: number = 0.0;
  acPosY: number = 0.0;
  acPosZ: number = 0.0;
  acDropJpX: number = 0.0;
  acDropJpY: number = 0.0;
  acSpawnPosX: number = 0.0;
  acSpawnPosY: number = 0.0;
  acSpawnPosZ: number = 0.0;
  acPutPosX: number = 0.0;
  acPutPosY: number = 0.0;
  acPutPosZ: number = 0.0;
  acSetVehHealth: number = 0.0;
  acLastPosX: number = 0.0;
  acLastPosY: number = 0.0;
  acSetPosX: number = 0.0;
  acSetPosY: number = 0.0;
  acSetPosZ: number = 0.0;
  acCamMode: number = 0;
  acSpeed: number = 0;
  acHealth: number = 0;
  acArmour: number = 0;
  acMoney: number = 0;
  acShotWeapon: number = 0;
  acHoldWeapon: number = 0;
  acLastWeapon: number = 0;
  acEnterSeat: number = 0;
  acEnterVeh: number = 0;
  acKickVeh: number = 0;
  acVeh: number = 0;
  acSeat: number = 0;
  acLastModel: number = 0;
  acNextDialog: number = 0;
  acDialog: number = 0;
  acInt: number = 0;
  acAnim: number = 0;
  acSpecAct: number = 0;
  acNextSpecAct: number = 0;
  acLastSpecAct: number = 0;
  acLastPickup: number = 0;
  acReloadTick: number = 0;
  acShotTick: number = 0;
  acSpawnTick: number = 0;
  acTimerTick: number = 0;
  acSetPosTick: number = 0;
  acUpdateTick: number = 0;
  acEnterVehTick: number = 0;
  acSpawnWeapon1: number = 0;
  acSpawnWeapon2: number = 0;
  acSpawnWeapon3: number = 0;
  acSpawnAmmo1: number = 0;
  acSpawnAmmo2: number = 0;
  acSpawnAmmo3: number = 0;
  acSpawnRes: number = 0;
  acTimerID: NodeJS.Timeout | null = null;
  acKickTimerID: NodeJS.Timeout | null = null;
  acParachute: number = 0;
  acIntRet: number = 0;
  acKicked: number = 0;
  acIpInt: number = 0;
  acIp: string = "";
  acSet: number[] = []; // 12
  acGtc: number[] = []; // 20
  acWeapon: number[] = []; // 13
  acAmmo: number[] = []; // 13
  acSetWeapon: number[] = []; // 13
  acGiveAmmo: number[] = []; // 13
  acGtcSetWeapon: number[] = []; // 13
  acGtcGiveAmmo: number[] = []; // 13
  acNOPCount: number[] = []; // 12
  acCheatCount: number[] = []; // 22
  acCall: (typeof ac_Mtfc)[0] = [];
  acFloodCount: (typeof ac_Mtfc)[0] = []; // // typeof instead of sizeof
  acNOPAllow: typeof ac_NOPAllow = []; // typeof instead of sizeof
  acACAllow: typeof ac_ACAllow = []; // // typeof instead of sizeof
  acStuntBonus: boolean = false;
  acModShop: boolean = false;
  acUnFrozen: boolean = false;
  acOnline: boolean = false;
  acEnterRes: boolean = false;
  acDeathRes: boolean = false;
  acDmgRes: boolean = false;
  acVehDmgRes: boolean = false;
  acForceClass: boolean = false;
  acClassRes: boolean = false;
  acDead: boolean = false;
  acTpToZ: boolean = false;
  acIntEnterExits: boolean = false;
  acSpec: boolean = false;
}

export class ACVehInfoStruct {
  acVelX: number = 0;
  acVelY: number = 0;
  acVelZ: number = 0;
  acTrVelX: number = 0;
  acTrVelY: number = 0;
  acTrVelZ: number = 0;
  acPosX: number = 0;
  acPosY: number = 0;
  acPosZ: number = 0;
  acTrPosX: number = 0;
  acTrPosY: number = 0;
  acTrPosZ: number = 0;
  acSpawnPosX: number = 0;
  acSpawnPosY: number = 0;
  acSpawnPosZ: number = 0;
  acSpawnZAngle: number = 0;
  acPosDiff: number = 0;
  acTrPosDiff: number = 0;
  acZAngle: number = 0;
  acHealth: number = 0;
  acLastSpeed: number = 0;
  acSpeedDiff: number = 0;
  acTrSpeedDiff: number = 0;
  acDriver: number = 0;
  acPanels: number = 0;
  acDoors: number = 0;
  acLights: number = 0;
  acTires: number = 0;
  acInt: number = 0;
  acSpeed: number = 0;
  acTrSpeed: number = 0;
  acPaintJob: number = 0;
  acLocked: (boolean | VehicleParamsEnum)[] = [];
  acSpawned: boolean = false;
}

export const ACInfo = new SafetyMap<number, ACInfoStruct>(
  () => new ACInfoStruct(),
);
export const ACVehInfo = new SafetyMap<number, ACVehInfoStruct>(
  () => new ACVehInfoStruct(),
);
export const ac_ClassPos = new SafetyMap<number, [number, number, number]>(
  () => [0, 0, 0],
);
export const ac_ClassWeapon = new SafetyMap<number, [number, number, number]>(
  () => [0, 0, 0],
);
export const ac_ClassAmmo = new SafetyMap<number, [number, number, number]>(
  () => [0, 0, 0],
);

export const ac_ipTables = new Map<number, number>();
