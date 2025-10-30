import { gangZonePool, playerGangZonePool } from "core/utils/pools";
import { defineEvent } from "../bus";
import { GameMode } from "../gamemode";
import { Player } from "../player";
import { GangZone } from "./entity";

GameMode.onExit(({ next }) => {
  GangZone.getInstances().forEach((g) => g.destroy());
  GangZone.getPlayersInstances()
    .map(([, g]) => g)
    .flat()
    .forEach((g) => g.destroy());
  gangZonePool.clear();
  playerGangZonePool.clear();
  return next();
});

const [onPlayerEnterGlobal] = defineEvent({
  name: "OnPlayerEnterGangZone",
  identifier: "ii",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid)!,
    };
  },
});

const [onPlayerLeaveGlobal] = defineEvent({
  name: "OnPlayerLeaveGangZone",
  identifier: "ii",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid)!,
    };
  },
});

const [onPlayerEnterPlayer] = defineEvent({
  name: "OnPlayerEnterPlayerGangZone",
  identifier: "ii",
  beforeEach(pid: number, gid: number) {
    const player = Player.getInstance(pid)!;
    return {
      player,
      gangZone: GangZone.getInstance(gid, player)!,
    };
  },
});

const [onPlayerLeavePlayer] = defineEvent({
  name: "OnPlayerLeavePlayerGangZone",
  identifier: "ii",
  beforeEach(pid: number, gid: number) {
    const player = Player.getInstance(pid)!;
    return {
      player,
      gangZone: GangZone.getInstance(gid, player)!,
    };
  },
});

const [onPlayerClickGlobal] = defineEvent({
  name: "OnPlayerClickGangZone",
  identifier: "ii",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid)!,
    };
  },
});

const [onPlayerClickPlayer] = defineEvent({
  name: "OnPlayerClickPlayerGangZone",
  identifier: "ii",
  beforeEach(pid: number, gid: number) {
    const player = Player.getInstance(pid)!;
    return {
      player,
      gangZone: GangZone.getInstance(gid, player)!,
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
