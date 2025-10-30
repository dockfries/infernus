import {
  DisablePlayerRaceCheckpoint,
  GetPlayerRaceCheckpoint,
  IsPlayerRaceCheckpointActive,
  IsPlayerInRaceCheckpoint,
  SetPlayerRaceCheckpoint,
} from "core/wrapper/native";
import { Player } from "../player/entity";

export default class RaceCheckpoint {
  static set(
    player: Player,
    type: number,
    x: number,
    y: number,
    z: number,
    nextX: number,
    nextY: number,
    nextZ: number,
    radius: number,
  ) {
    return SetPlayerRaceCheckpoint(
      player.id,
      type,
      x,
      y,
      z,
      nextX,
      nextY,
      nextZ,
      radius,
    );
  }

  static disable(player: Player) {
    return DisablePlayerRaceCheckpoint(player.id);
  }

  static isPlayerIn(player: Player) {
    return IsPlayerInRaceCheckpoint(player.id);
  }

  static isActive(player: Player) {
    return IsPlayerRaceCheckpointActive(player.id);
  }

  static get(player: Player) {
    return GetPlayerRaceCheckpoint(player.id);
  }
}
