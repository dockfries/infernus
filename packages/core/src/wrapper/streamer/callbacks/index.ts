import { defineEvent } from "core/utils/bus";
import type { StreamerItemTypes } from "@infernus/streamer";
import { Player } from "core/components/player/entity";

export const [onItemStreamIn] = defineEvent({
  name: "Streamer_OnItemStreamIn",
  identifier: "iii",
  beforeEach(type: StreamerItemTypes, id: number, pid: number) {
    return {
      type,
      id,
      forPlayer: Player.getInstance(pid)!,
    };
  },
});

export const [onItemStreamOut] = defineEvent({
  name: "Streamer_OnItemStreamOut",
  identifier: "iii",
  beforeEach(type: StreamerItemTypes, id: number, pid: number) {
    return {
      type,
      id,
      forPlayer: Player.getInstance(pid)!,
    };
  },
});

export const [onPluginError] = defineEvent({
  name: "Streamer_OnPluginError",
  identifier: "s",
  beforeEach(error: string) {
    return { error };
  },
});
