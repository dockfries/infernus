import {
  DisablePlayerCheckpoint,
  GetPlayerCheckpoint,
  IsPlayerCheckpointActive,
  IsPlayerInCheckpoint,
  SetPlayerCheckpoint,
} from "core/wrapper/native";
import { Player } from "../player/entity";

export class Checkpoint {
  static set(player: Player, x: number, y: number, z: number, radius: number) {
    return Checkpoint.__inject__.SetPlayerCheckpoint(
      player.id,
      x,
      y,
      z,
      radius,
    );
  }

  static disable(player: Player) {
    return Checkpoint.__inject__.DisablePlayerCheckpoint(player.id);
  }

  static isPlayerIn(player: Player) {
    return Checkpoint.__inject__.IsPlayerInCheckpoint(player.id);
  }

  static isActive(player: Player) {
    return Checkpoint.__inject__.IsPlayerCheckpointActive(player.id);
  }

  static get(player: Player) {
    return Checkpoint.__inject__.GetPlayerCheckpoint(player.id);
  }

  static __inject__ = {
    DisablePlayerCheckpoint,
    GetPlayerCheckpoint,
    IsPlayerCheckpointActive,
    IsPlayerInCheckpoint,
    SetPlayerCheckpoint,
  };
}
