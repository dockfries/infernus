import { Player } from "../player/entity";
import { Vehicle } from "./entity";
import { GameMode } from "../gamemode";
import { defineEvent } from "../bus";
import { vehiclePool } from "core/utils/pools";

GameMode.onExit(({ next }) => {
  Vehicle.getInstances().forEach((v) => v.destroy());
  vehiclePool.clear();
  return next();
});

const [onDamageStatusUpdate] = defineEvent({
  name: "OnVehicleDamageStatusUpdate",
  defaultValue: false,
  beforeEach(vid: number, pid: number) {
    return {
      vehicle: Vehicle.getInstance(vid)!,
      player: Player.getInstance(pid)!,
    };
  },
});

const [onDeath] = defineEvent({
  name: "OnVehicleDeath",
  beforeEach(vid: number, pid: number) {
    return {
      vehicle: Vehicle.getInstance(vid)!,
      killer: Player.getInstance(pid)!,
    };
  },
});

const [onMod] = defineEvent({
  name: "OnVehicleMod",
  beforeEach(pid: number, vid: number, componentId: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
      componentId,
    };
  },
});

const [onPaintjob] = defineEvent({
  name: "OnVehiclePaintjob",
  beforeEach(pid: number, vid: number, paintjobId: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
      paintjobId,
    };
  },
});

const [onRespray] = defineEvent({
  name: "OnVehicleRespray",
  beforeEach(pid: number, vid: number, color1: number, color2: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
      color: [color1, color2],
    };
  },
});

const [onSirenStateChange] = defineEvent({
  name: "OnVehicleSirenStateChange",
  defaultValue: false,
  beforeEach(pid: number, vid: number, state: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
      state: !!state,
    };
  },
});

const [onSpawn] = defineEvent({
  name: "OnVehicleSpawn",
  beforeEach(vid: number) {
    return { vehicle: Vehicle.getInstance(vid)! };
  },
});

const [onStreamIn] = defineEvent({
  name: "OnVehicleStreamIn",
  beforeEach(vid: number, forPlayer: number) {
    return {
      vehicle: Vehicle.getInstance(vid)!,
      forPlayer: Player.getInstance(forPlayer)!,
    };
  },
});

const [onStreamOut] = defineEvent({
  name: "OnVehicleStreamOut",
  beforeEach(vid: number, forPlayer: number) {
    return {
      vehicle: Vehicle.getInstance(vid)!,
      forPlayer: Player.getInstance(forPlayer)!,
    };
  },
});

const [onPlayerEnter] = defineEvent({
  name: "OnPlayerEnterVehicle",
  beforeEach(pid: number, vid: number, isPassenger: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
      isPassenger: !!isPassenger,
    };
  },
});

const [onPlayerExit] = defineEvent({
  name: "OnPlayerExitVehicle",
  beforeEach(pid: number, vid: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
    };
  },
});

const [onTrailerUpdate] = defineEvent({
  name: "OnTrailerUpdate",
  beforeEach(pid: number, vid: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
    };
  },
});

const [onUnoccupiedUpdate] = defineEvent({
  name: "OnUnoccupiedVehicleUpdate",
  beforeEach(
    vid: number,
    pid: number,
    passengerSeat: number,
    newX: number,
    newY: number,
    newZ: number,
    velX: number,
    velY: number,
    velZ: number,
  ) {
    return {
      vehicle: Vehicle.getInstance(vid)!,
      player: Player.getInstance(pid)!,
      passengerSeat,
      newX,
      newY,
      newZ,
      velX,
      velY,
      velZ,
    };
  },
});

export const VehicleEvent = Object.freeze({
  onDamageStatusUpdate,
  onDeath,
  onMod,
  onPaintjob,
  onRespray,
  onSirenStateChange,
  onSpawn,
  onStreamIn,
  onStreamOut,
  onPlayerEnter,
  onPlayerExit,
  onTrailerUpdate,
  onUnoccupiedUpdate,
});
