import { GateStatusEnum } from "@/filterscripts/a51_base/enums/gate";
import { A51Player } from "@/filterscripts/a51_base/player";
import { DynamicObject, TCommonCallback, TLocales } from "omp-node-lib";

export interface IPosition {
  x: number;
  y: number;
  z: number;
}

export interface IMovePosition extends IPosition {
  speed: number;
  rx: number;
  ry: number;
  rz: number;
}

export interface ICommonOptions {
  locales?: TLocales;
  defaultLocale?: string;
  debug?: boolean;
}

export interface IA51Options extends ICommonOptions {
  command?: string | Array<string>;
  onCommandReceived?: (id: A51Player, command: string) => TCommonCallback;
  beforeMoveGate?: (player: A51Player) => boolean;
  onGateMoving?: (
    player: A51Player,
    direction: keyof IGateList,
    status: GateStatusEnum
  ) => boolean;
  onGateOpen?: (player: A51Player, direction: keyof IGateList) => boolean;
  onGateClose?: (player: A51Player, direction: keyof IGateList) => boolean;
  onTeleport?: (player: A51Player) => unknown;
}

export interface IGateInfo {
  status: GateStatusEnum;
  labelPos: IPosition;
  openPos: IMovePosition;
  closePos: IMovePosition;
  instance: DynamicObject | null;
}

export interface IGateList {
  east: IGateInfo;
  north: IGateInfo;
}

export interface IAdminSpecOptions extends ICommonOptions {
  command?: string | Array<string>;
}
