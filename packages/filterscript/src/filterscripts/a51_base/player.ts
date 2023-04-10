import { Player, PlayerEvent } from "@infernus/core";

export const playerEvent = new PlayerEvent((id) => new Player(id));
