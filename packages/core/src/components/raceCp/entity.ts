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
    return RaceCheckpoint.__inject__.SetPlayerRaceCheckpoint(
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
    return RaceCheckpoint.__inject__.DisablePlayerRaceCheckpoint(player.id);
  }

  static isPlayerIn(player: Player) {
    return RaceCheckpoint.__inject__.IsPlayerInRaceCheckpoint(player.id);
  }

  static isActive(player: Player) {
    return RaceCheckpoint.__inject__.IsPlayerRaceCheckpointActive(player.id);
  }

  static get(player: Player) {
    return RaceCheckpoint.__inject__.GetPlayerRaceCheckpoint(player.id);
  }

  static __inject__ = {
    DisablePlayerRaceCheckpoint,
    GetPlayerRaceCheckpoint,
    IsPlayerRaceCheckpointActive,
    IsPlayerInRaceCheckpoint,
    SetPlayerRaceCheckpoint,
  };
}
