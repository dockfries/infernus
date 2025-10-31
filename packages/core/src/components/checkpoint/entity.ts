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
    return SetPlayerCheckpoint(player.id, x, y, z, radius);
  }

  static disable(player: Player) {
    return DisablePlayerCheckpoint(player.id);
  }

  static isPlayerIn(player: Player) {
    return IsPlayerInCheckpoint(player.id);
  }

  static isActive(player: Player) {
    return IsPlayerCheckpointActive(player.id);
  }

  static get(player: Player) {
    return GetPlayerCheckpoint(player.id);
  }
}
