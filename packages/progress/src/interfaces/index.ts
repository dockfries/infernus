import { Player } from "@infernus/core";
import { ProgressBarDirectionEnum } from "../enums";

export interface IProgressBar {
  player: Player;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: number | string;
  max?: number;
  direction?: ProgressBarDirectionEnum;
  min?: number;
  value?: number;
  paddingX?: number;
  paddingY?: number;
  show?: boolean;
}
