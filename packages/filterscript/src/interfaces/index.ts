import type { GateStatusEnum } from "@/filterscripts/a51_base/enums/gate";
import type {
  DynamicObject,
  Player,
  TCommonCallback,
  TLocales,
} from "@infernus/core";

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
  onCommandReceived?: (id: Player, command: string) => TCommonCallback;
  beforeMoveGate?: (player: Player) => boolean;
  onGateMoving?: (
    player: Player,
    direction: keyof IGateList,
    status: GateStatusEnum
  ) => boolean;
  onGateOpen?: (player: Player, direction: keyof IGateList) => boolean;
  onGateClose?: (player: Player, direction: keyof IGateList) => boolean;
  onTeleport?: (player: Player) => unknown;
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
