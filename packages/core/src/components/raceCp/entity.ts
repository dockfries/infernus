import {
  DisablePlayerRaceCheckpoint,
  GetPlayerRaceCheckpoint,
  IsPlayerRaceCheckpointActive,
  IsPlayerInRaceCheckpoint,
  SetPlayerRaceCheckpoint,
} from "core/wrapper/native";
import { Player } from "../player/entity";

export class RaceCheckpoint {
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
    return RaceCheckpoint.__inject__.set(
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
    return RaceCheckpoint.__inject__.disable(player.id);
  }

  static isPlayerIn(player: Player) {
    return RaceCheckpoint.__inject__.isPlayerIn(player.id);
  }

  static isActive(player: Player) {
    return RaceCheckpoint.__inject__.isActive(player.id);
  }

  static get(player: Player) {
    return RaceCheckpoint.__inject__.get(player.id);
  }

  static __inject__ = {
    disable: DisablePlayerRaceCheckpoint,
    get: GetPlayerRaceCheckpoint,
    isActive: IsPlayerRaceCheckpointActive,
    isPlayerIn: IsPlayerInRaceCheckpoint,
    set: SetPlayerRaceCheckpoint,
  };
}
