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
    return Checkpoint.__inject__.set(player.id, x, y, z, radius);
  }

  static disable(player: Player) {
    return Checkpoint.__inject__.disable(player.id);
  }

  static isPlayerIn(player: Player) {
    return Checkpoint.__inject__.isPlayerIn(player.id);
  }

  static isActive(player: Player) {
    return Checkpoint.__inject__.isActive(player.id);
  }

  static get(player: Player) {
    return Checkpoint.__inject__.get(player.id);
  }

  static __inject__ = {
    disable: DisablePlayerCheckpoint,
    get: GetPlayerCheckpoint,
    isActive: IsPlayerCheckpointActive,
    isPlayerIn: IsPlayerInCheckpoint,
    set: SetPlayerCheckpoint,
  };
}
