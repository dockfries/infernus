import type {
  DynamicObject,
  IFilterScript,
  Player,
  TCommonCallback,
} from "@infernus/core";
import type { GateStatusEnum } from "../enums/gate";
import type { ICommonOptions } from "filterscript/interfaces";

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

export interface IA51BaseFSOptions extends ICommonOptions {
  command?: string | Array<string>;
  onCommandReceived?: (id: Player, command: string) => TCommonCallback;
  beforeMoveGate?: (player: Player) => boolean;
  onGateMoving?: (
    player: Player,
    direction: keyof IGateList,
    status: GateStatusEnum,
  ) => boolean;
  onGateOpen?: (player: Player, direction: keyof IGateList) => boolean;
  onGateClose?: (player: Player, direction: keyof IGateList) => boolean;
  onTeleport?: (player: Player) => unknown;
}

export interface IA51BaseFS extends IFilterScript {
  load(options?: IA51BaseFSOptions): ReturnType<IFilterScript["load"]>;
}
