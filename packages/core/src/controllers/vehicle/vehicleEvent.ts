import type { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import {
  OnNPCEnterVehicle,
  OnNPCExitVehicle,
  OnPlayerEnterVehicle,
  OnPlayerExitVehicle,
  OnVehicleDamageStatusUpdate,
  OnVehicleDeath,
  OnVehicleMod,
  OnVehiclePaintjob,
  OnVehicleRespray,
  OnVehicleSirenStateChange,
  OnVehicleSpawn,
  OnVehicleStreamIn,
  OnVehicleStreamOut,
  OnTrailerUpdate,
  OnGameModeExit,
} from "@/wrapper/native/callbacks";
import type { Player } from "../player";
import type { Vehicle } from "./baseVehicle";
import { vehicleBus, vehicleHooks } from "./vehicleBus";

export class VehicleEvent<P extends Player, V extends Vehicle> {
  private readonly vehicles = new Map<number, V>();
  private readonly players;

  constructor(playersMap: Map<number, P>, destroyOnExit = true) {
    this.players = playersMap;
    // The class event is extended through the event bus
    vehicleBus.on(vehicleHooks.created, (veh: V) => {
      this.vehicles.set(veh.id, veh);
    });
    vehicleBus.on(vehicleHooks.destroyed, (veh: V) => {
      this.vehicles.delete(veh.id);
    });
    if (destroyOnExit) {
      OnGameModeExit(() => {
        this.vehicles.forEach((v) => v.destroy());
        this.vehicles.clear();
      });
    }
    OnVehicleDamageStatusUpdate((vehicleid, playerid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const pFn = promisifyCallback(
        this,
        "onDamageStatusUpdate",
        "OnVehicleDamageStatusUpdate"
      );
      return pFn(v, p);
    });
    OnVehicleDeath((vehicleid, killerid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const k = this.findPlayerById(killerid);
      if (!k) return 0;
      const pFn = promisifyCallback(this, "onDeath", "OnVehicleDeath");
      return pFn(v, k);
    });
    OnVehicleMod((playerid, vehicleid, componentid): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 1;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 1;
      const pFn = promisifyCallback(this, "onMod", "OnVehicleMod");
      return pFn(p, v, componentid);
    });
    OnVehiclePaintjob((playerid, vehicleid, paintjobid): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 1;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 1;
      const pFn = promisifyCallback(this, "onPaintjob", "OnVehiclePaintjob");
      return pFn(p, v, paintjobid);
    });
    OnVehicleRespray((playerid, vehicleid, colour1, colour2): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 1;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 1;
      const pFn = promisifyCallback(this, "onRespray", "OnVehicleRespray");
      return pFn(p, v, colour1, colour2);
    });
    OnVehicleSirenStateChange((playerid, vehicleid, newstate): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const pFn = promisifyCallback(
        this,
        "onSirenStateChange",
        "OnVehicleSirenStateChange"
      );
      return pFn(p, v, Boolean(newstate));
    });
    OnVehicleSpawn((vehicleid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 1;
      const pFn = promisifyCallback(this, "onSpawn", "OnVehicleSpawn");
      return pFn(v);
    });
    OnVehicleStreamIn((vehicleid, forplayerid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const p = this.findPlayerById(forplayerid);
      if (!p) return 0;
      const pFn = promisifyCallback(this, "onStreamIn", "OnVehicleStreamIn");
      return pFn(v, p);
    });
    OnVehicleStreamOut((vehicleid, forplayerid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const p = this.findPlayerById(forplayerid);
      if (!p) return 0;
      const pFn = promisifyCallback(this, "onStreamOut", "OnVehicleStreamOut");
      return pFn(v, p);
    });
    OnPlayerEnterVehicle((playerid, vehicleid, ispassenger): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const pFn = promisifyCallback(
        this,
        "onPlayerEnter",
        "OnPlayerEnterVehicle"
      );
      return pFn(p, v, Boolean(ispassenger));
    });
    OnPlayerExitVehicle((playerid, vehicleid): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const pFn = promisifyCallback(
        this,
        "onPlayerExit",
        "OnPlayerExitVehicle"
      );
      return pFn(p, v);
    });
    OnNPCEnterVehicle((vehicleid, seatid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const pFn = promisifyCallback(this, "onNpcEnter", "OnNPCEnterVehicle");
      return pFn(v, seatid);
    });
    OnNPCExitVehicle(promisifyCallback(this, "onNpcExit", "OnNPCExitVehicle"));
    OnTrailerUpdate((playerid, vehicleid): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const pFn = promisifyCallback(this, "onTrailerUpdate");
      return pFn(p, v);
    });
  }

  onDamageStatusUpdate?(vehicle: V, player: P): TCommonCallback;
  onDeath?(vehicle: V, killer: P): TCommonCallback;
  onMod?(player: P, vehicle: V, componentid: number): TCommonCallback;
  onPaintjob?(player: P, vehicle: V, paintjobid: number): TCommonCallback;
  onRespray?(
    player: P,
    vehicle: V,
    colour1: number,
    colour2: number
  ): TCommonCallback;
  onSirenStateChange?(
    player: P,
    vehicle: V,
    newstate: boolean
  ): TCommonCallback;
  onSpawn?(vehicle: V): TCommonCallback;
  onStreamIn?(vehicle: V, forplayer: P): TCommonCallback;
  onStreamOut?(vehicle: V, forplayer: P): TCommonCallback;
  onPlayerEnter?(player: P, vehicle: V, isPassenger: boolean): TCommonCallback;
  onPlayerExit?(player: P, vehicle: V): TCommonCallback;
  onNpcEnter?(vehicle: V, seatid: number): TCommonCallback;
  onNpcExit?(): TCommonCallback;
  onTrailerUpdate?(player: P, vehicle: V): TCommonCallback;

  findVehicleById(vehicleid: number) {
    return this.vehicles.get(vehicleid);
  }

  private findPlayerById(playerid: number) {
    return this.players.get(playerid);
  }

  getVehiclesArr(): Array<V> {
    return [...this.vehicles.values()];
  }

  getVehiclesMap(): Map<number, V> {
    return this.vehicles;
  }
}
