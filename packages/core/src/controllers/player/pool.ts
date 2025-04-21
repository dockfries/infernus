import type { Player } from "./entity";

export interface IInnerPlayerProps {
  isAndroid: boolean;
}

export const innerPlayerProps = Symbol();
export const playerPool = new Map<number, Player>();
