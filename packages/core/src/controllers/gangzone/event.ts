import { globalGangZonePool, playerGangZonePool } from "core/utils/pools";
import { defineEvent } from "../bus";
import { GameMode } from "../gamemode";
import { Player } from "../player";
import { GangZone } from "./entity";

GameMode.onExit(({ next }) => {
  GangZone.getInstances(true).forEach((g) => g.destroy());
  GangZone.getInstances(false).forEach((g) => g.destroy());
  globalGangZonePool.clear();
  playerGangZonePool.clear();
  return next();
});

const [onPlayerEnterGlobal] = defineEvent({
  name: "OnPlayerEnterGangZone",
  identifier: "ii",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid, true)!,
    };
  },
});

const [onPlayerLeaveGlobal] = defineEvent({
  name: "OnPlayerLeaveGangZone",
  identifier: "ii",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid, true)!,
    };
  },
});

const [onPlayerEnterPlayer] = defineEvent({
  name: "OnPlayerEnterPlayerGangZone",
  identifier: "ii",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid, false)!,
    };
  },
});

const [onPlayerLeavePlayer] = defineEvent({
  name: "OnPlayerLeavePlayerGangZone",
  identifier: "ii",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid, false)!,
    };
  },
});

const [onPlayerClickGlobal] = defineEvent({
  name: "OnPlayerClickGangZone",
  identifier: "ii",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid, true)!,
    };
  },
});

const [onPlayerClickPlayer] = defineEvent({
  name: "OnPlayerClickPlayerGangZone",
  identifier: "ii",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid, false)!,
    };
  },
});

export const GangZoneEvent = Object.freeze({
  onPlayerEnterGlobal,
  onPlayerLeaveGlobal,
  onPlayerEnterPlayer,
  onPlayerLeavePlayer,
  onPlayerClickGlobal,
  onPlayerClickPlayer,
});
